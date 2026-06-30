# Change: Spike example todo app

## Summary

Build an `example/` subfolder deployable to Deno Deploy. It serves as a concrete POC for the full
denomerge tech stack: passkey PRF login, IndexedDB document storage, and Deno KV sync. The example
will be a simple todo list with real end-to-end sync using the WebAuthn proof protocol defined in
earlier spikes.

## Why

All previous spikes are code-only libraries with tests. A deployable example:

1. Proves the stack works in a real deployed environment.
2. Lets Dami interact with the system end-to-end (create the app, test locally via tunnel, verify
   deployed sync).
3. Surfaces gaps in the library API that unit tests miss (e.g., server-side credential storage,
   credential retrieval path for verifier, the full WebAuthn ceremony in a real browser).
4. Provides a reference for future library users.

## Scope

- `example/` directory with its own `deno.json` configured for Deno Deploy (dynamic runtime).
- `example/main.ts`: Deno.serve-based server that:
  - Serves static HTML/CSS/JS.
  - Exposes `/sync/:namespace/:accountId/:docId` for KV sync (using denomerge's
    `createKvSyncHandler`).
  - Exposes `/auth/register` and `/auth/challenge` and `/auth/verify-prf` endpoints.
  - Uses Deno KV for credential storage and document sync.
  - Verifies WebAuthn sync proofs using stored SPKI credentials.
- `example/app.js`: Browser-side todo app that:
  - Registers or authenticates with a resident passkey using PRF.
  - Stores todos as a JSON blob in localStorage (simplified IndexedDB stand-in for this spike).
  - Syncs the blob to Deno KV via the server's `/sync/*` endpoint.
- `example/index.html` + `example/style.css`: Minimal UI following the gitdot.io aesthetic.
- The spike exits when the app is deployed and sync is confirmed working locally and in production.

## Non-goals

- Full Automerge integration in the browser (requires bundler; deferred to later spike).
- Production-grade credential storage security (this is a POC).
- Multiple documents or accounts (single-account single-document POC only).

## Risks

- Deno Deploy's `DENO_DEPLOY_TOKEN` and KV access need proper project configuration.
- Browser WebAuthn PRF support varies; the app should degrade gracefully on unsupported browsers.
- The `deno.json` import strategy for the library may need adjustment if `../src` doesn't resolve
  correctly in the Deno Deploy build environment.
