# Tasks

- [ ] Verify `deno run example/main.ts` starts and serves static files locally.
- [ ] Test `/auth/challenge` endpoint responds with challenge + config.
- [ ] Test `/auth/register` endpoint stores credential in Deno KV.
- [ ] Test `/auth/verify-prf` endpoint verifies assertion and issues session.
- [ ] Test `/sync/namespace/account/doc` GET/PUT with valid proof header.
- [ ] Run `deno task check` on root project.
- [ ] Run `openspec validate --all --strict --json`.
- [ ] Fix any import resolution issues in `example/deno.json`.
- [ ] Commit and push all new files.
- [ ] Create Deno Deploy app pointing to `example/` directory.
- [ ] Test tunnel: `DENO_DEPLOY_TOKEN=*** deno run --tunnel example/main.ts`.
- [ ] Confirm end-to-end: register passkey → add todos → sync → reload.
