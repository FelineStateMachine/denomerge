# Spike Results: spike-example-todo-app

## Status

In progress. Files created:

- `example/deno.json` — Deno Deploy config (dynamic runtime, entrypoint `main.ts`)
- `example/main.ts` — server with KV sync handler + auth endpoints
- `example/app.js` — browser todo app with WebAuthn PRF + fetch sync
- `example/index.html` — HTML shell
- `example/style.css` — gitdot.io-inspired monochrome UI

## Exit criteria

- [ ] `deno task check` passes (format, lint, test)
- [ ] `openspec validate --all --strict --json` passes
- [ ] Server starts and serves static files locally
- [ ] Auth endpoints (`/auth/challenge`, `/auth/register`, `/auth/verify-prf`) respond correctly
- [ ] Sync endpoint (`/sync/namespace/account/doc`) stores and retrieves documents
- [ ] App is deployable to Deno Deploy via `deno deploy create --app-directory example`
- [ ] Tunnel access works: `DENO_DEPLOY_TOKEN=*** deno run --tunnel example/main.ts`
- [ ] End-to-end: passkey login → add todos → sync to cloud KV → reload and see todos

## Notes

- Browser app uses `localStorage` as the doc store for this spike. Full IndexedDB + Automerge
  integration is deferred to a later spike.
- Sync proof verification uses stored SPKI credentials in Deno KV. The challenge verification is
  bypassed in favor of session-based auth for this POC.
- Import path `../src/index.ts` in `example/deno.json` assumes the build process can resolve
  sibling-directory imports. This may need adjustment for Deno Deploy's build environment.
