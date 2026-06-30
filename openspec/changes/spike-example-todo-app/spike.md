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
- `POST /auth/verify-prf` without active challenge → 400 `{ "error": "challenge expired or missing" }`
- All `deno.json` deps resolve correctly (npm packages downloaded on first run).
- `example/deno.json` now includes all library JSR + npm dependencies.

### Pending (needs Dami's Deno Deploy token)

- **Tunnel test**: `DENO_DEPLOY_TOKEN=*** deno run --tunnel --unstable-kv --allow-net --allow-env --allow-read --allow-write example/main.ts`
- **Deploy test**: trigger a new deploy from Deno Deploy dashboard (picks up new commits).
- **End-to-end**: real browser → register passkey → add todos → sync to cloud KV → reload.

## Exit criteria status

- [x] Server starts and serves static files locally.
- [x] Auth endpoints (`/auth/challenge`, `/auth/register`, `/auth/verify-prf`) respond correctly.
- [x] Sync endpoint (`/sync/namespace/account/doc`) returns 401 without proof.
- [ ] Tunnel access: `DENO_DEPLOY_TOKEN=*** deno run --tunnel example/main.ts`.
- [ ] App deployed to Deno Deploy via dashboard.
- [ ] End-to-end: passkey login → add todos → sync → reload and see todos.