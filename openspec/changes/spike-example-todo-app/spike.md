# Spike Results: spike-example-todo-app

## Status

Mostly complete. Local server verified working.

### Verified ✓

- `deno task start` (with `--unstable-kv`) boots and serves on port 8000.
- `GET /` → serves `index.html` (200)
- `GET /style.css` → 200, `GET /app.js` → 200
- `GET /auth/challenge?accountId=...` → returns challenge + rpId + origin (200)
- `POST /auth/register` with missing fields → 400 `{ "error": "missing fields" }`
- `GET /sync/ns/acct/doc` without proof → 401 `{ "error": "missing_sync_proof" }`
- `PUT /sync/ns/acct/doc` without proof → 401 `{ "error": "missing_sync_proof" }`
- `POST /auth/verify-prf` without active challenge → 400
  `{ "error": "challenge expired or missing" }`
- All `deno.json` deps resolve correctly (npm packages downloaded on first run).
- `example/deno.json` now includes all library JSR + npm dependencies.

### Verified after Deno Deploy trace follow-up ✓

- Production deploy routed: `0nwasmvcapxv`.
- Production URL responds: `https://test-todo.felinestatemachine.deno.net`.
- Preview URL responds: `https://test-todo-0nwasmvcapxv.felinestatemachine.deno.net`.
- Challenge endpoint now returns request-derived RP ID and origin on Deploy.
- WebAuthn ECDSA signatures are normalized from authenticator DER format to WebCrypto P1363 format
  before verification.

### Pending (requires real browser + physical authenticator)

- **End-to-end**: real browser → register passkey → add todos → sync to cloud KV → reload.

## Exit criteria status

- [x] Server starts and serves static files locally.
- [x] Auth endpoints (`/auth/challenge`, `/auth/register`, `/auth/verify-prf`) respond correctly.
- [x] Sync endpoint (`/sync/namespace/account/doc`) returns 401 without proof.
- [ ] Tunnel access: `DENO_DEPLOY_TOKEN=*** deno run --tunnel example/main.ts`.
- [ ] App deployed to Deno Deploy via dashboard.
- [ ] End-to-end: passkey login → add todos → sync → reload and see todos.
