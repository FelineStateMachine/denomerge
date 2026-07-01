import * as esbuild from "npm:esbuild"
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader"
import { resolve } from "jsr:@std/path"

// Merge the root library's import map with the example's so that
// @automerge/automerge (owned by denomerge) resolves when the bundler
// follows imports into ../src/.
const rootConfig = JSON.parse(await Deno.readTextFile(resolve(import.meta.dirname!, "../deno.json")))
const exampleConfig = JSON.parse(await Deno.readTextFile(resolve(import.meta.dirname!, "deno.json")))
// Resolve relative import values against the deno.json they came from,
// so the merged map works regardless of where it's written.
const exampleBase = `file://${import.meta.dirname!}/`
const rootBase = `file://${resolve(import.meta.dirname!, "..")}/`
function absolutize(imports: Record<string, string>, base: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(imports).map(([k, v]) => [
      k,
      v.startsWith("npm:") || v.startsWith("jsr:") || v.startsWith("http") || v.startsWith("file:")
        ? v
        : new URL(v, base).href,
    ]),
  )
}
const mergedImports = {
  ...absolutize(rootConfig.imports ?? {}, rootBase),
  ...absolutize(exampleConfig.imports ?? {}, exampleBase),
}


await Deno.mkdir(resolve(import.meta.dirname!, "dist"), { recursive: true })
const importMapPath = resolve(import.meta.dirname!, "dist/.build-importmap.json")
await Deno.writeTextFile(importMapPath, JSON.stringify({ imports: mergedImports }))

// esbuild platform:"browser" picks @automerge/automerge's "bundler" WASM entrypoint,
// which requires native WASM ES module bundling (webpack/Vite only — not esbuild).
// This plugin intercepts those imports before deno-resolver and redirects to the
// base64 entrypoint (WASM inlined as a string) and the slim entrypoint.
const automergeEntryDir = resolve(
  import.meta.dirname!,
  "node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/entrypoints",
)
const automergeWasmPlugin: esbuild.Plugin = {
  name: "automerge-base64-wasm",
  setup(build) {
    build.onResolve({ filter: /^@automerge\/automerge$/ }, () => ({
      path: resolve(automergeEntryDir, "fullfat_base64.js"),
    }))
    build.onResolve({ filter: /^@automerge\/automerge\/slim$/ }, () => ({
      path: resolve(automergeEntryDir, "slim.js"),
    }))
  },
}

const result = await esbuild.build({
  plugins: [automergeWasmPlugin, ...denoPlugins({ importMapURL: new URL(`file://${importMapPath}`).href })],
  entryPoints: ["./app.ts"],
  bundle: true,
  outdir: "./dist",
  entryNames: "[name].bundle",
  assetNames: "[name]",
  publicPath: "/",
  format: "esm",
  platform: "browser",
  target: "es2022",
  conditions: ["browser"],
  loader: { ".wasm": "empty" },
  logLevel: "info",
})

if (result.errors.length) {
  console.error("Build failed:", result.errors)
  Deno.exit(1)
}

console.log("Build complete →", result.outputFiles?.map((f) => f.path).join(", ") ?? "dist/")

await esbuild.stop()
