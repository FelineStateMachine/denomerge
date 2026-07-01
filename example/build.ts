import * as esbuild from "npm:esbuild"
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader"
import { resolve } from "jsr:@std/path"

// Merge root (library) and example import maps so the bundler sees both
// @automerge/automerge (owned by denomerge) and @felinestatemachine/denomerge.
// Relative values are absolutized against their source deno.json location so
// they remain correct after the merged map is written to dist/.
const rootConfig = JSON.parse(await Deno.readTextFile(resolve(import.meta.dirname!, "../deno.json")))
const exampleConfig = JSON.parse(await Deno.readTextFile(resolve(import.meta.dirname!, "deno.json")))

function absolutize(imports: Record<string, string>, base: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(imports).map(([k, v]) => [
      k,
      /^(npm:|jsr:|https?:|file:)/.test(v) ? v : new URL(v, base).href,
    ]),
  )
}

const rootBase = `file://${resolve(import.meta.dirname!, "..")}/`
const exampleBase = `file://${import.meta.dirname!}/`
const mergedImports = {
  ...absolutize(rootConfig.imports ?? {}, rootBase),
  ...absolutize(exampleConfig.imports ?? {}, exampleBase),
}

await Deno.mkdir(resolve(import.meta.dirname!, "dist"), { recursive: true })
const importMapPath = resolve(import.meta.dirname!, "dist/.build-importmap.json")
await Deno.writeTextFile(importMapPath, JSON.stringify({ imports: mergedImports }))

// esbuild platform:"browser" selects @automerge/automerge's "bundler" WASM
// entrypoint which requires native WebAssembly ES module bundler support
// (webpack/Vite). Intercept before deno-resolver and redirect to the base64
// entrypoint that inlines WASM as a string — works with any bundler.
const automergeEntryDir = resolve(
  import.meta.dirname!,
  "node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/entrypoints",
)
const automergePlugin: esbuild.Plugin = {
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
  plugins: [automergePlugin, ...denoPlugins({ importMapURL: new URL(`file://${importMapPath}`).href })],
  entryPoints: ["./app.ts"],
  bundle: true,
  outdir: "./dist",
  entryNames: "[name].bundle",
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

await esbuild.stop()
