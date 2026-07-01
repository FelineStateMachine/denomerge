# test-todo — denomerge example

A full-stack todo app that demonstrates the core denomerge pattern:

- **Local-first** — an Automerge document lives in IndexedDB and is always editable, even offline.
- **Passkey login** — WebAuthn with the PRF extension authenticates users with no passwords or tokens.
- **KV sync** — when authenticated, the document syncs to a Deno KV-backed endpoint on the server.

Live: `test-todo.felinestatemachine.deno.net`

---

## What denomerge handles

You bring the UI and application logic. denomerge provides everything else:

| What you need | denomerge export |
|---|---|
| Automerge repo backed by IndexedDB | `createBrowserAutomergeRepo(name)` |
| Sync endpoint for Deno Deploy | `createKvSyncHandler({ kv, verifyProof })` |
| Typed KV keys (credentials, sessions, docs) | `denomergeKvKeys({ namespace, accountId })` |
| WebAuthn registration ceremony (browser) | `performPrfRegistration(opts)` |
| WebAuthn authentication ceremony (browser) | `performPrfAuthentication(opts)` |
| Per-request WebAuthn signature verifier | `createWebAuthnSyncProofVerifier(opts)` |
| Structured JSON logging | `createLogger(name, { level })` |
| Base64url encode/decode | `encodeBase64Url` / `decodeBase64Url` |
| Automerge document API | `Doc`, `DocHandle`, `load`, `save`, `merge`, `clone`, `getChanges` (re-exported) |

You do not add `@automerge/automerge` or `@automerge/automerge-repo` to your `deno.json` — denomerge re-exports them.

---

## How the app works

### Registration (once per device)

1. Browser calls `performPrfRegistration(...)` — this triggers a system passkey prompt.
2. The browser creates a discoverable resident-key credential with the PRF extension enabled.
3. The server stores the credential's SPKI public key in Deno KV, scoped to the user's account.

### Login

1. Browser fetches a one-time challenge from the server.
2. Browser calls `performPrfAuthentication(...)` — another passkey prompt; the authenticator signs the challenge and returns a PRF output byte string.
3. Server verifies the WebAuthn assertion signature against the stored public key, then issues a short-lived session token in KV.
4. Browser stores the session token and pulls the latest document from the sync endpoint.

### Sync

Every mutation (add, toggle, delete) immediately applies locally and then pushes the serialised Automerge document to `/sync/:namespace/:accountId/:documentId`. The server's `createKvSyncHandler` reads the `x-denomerge-sync-proof` header, calls your `verifyProof` function, and stores or returns document bytes.

Pull on login merges the server document with the local document using Automerge's CRDT semantics — concurrent edits from multiple devices converge without conflicts.

```
Browser                         Server (Deno Deploy)
───────────────────────────     ─────────────────────────
Automerge doc (IndexedDB)       Deno KV
       │                              │
       │  PUT /sync/...  ──────────►  │  store doc bytes
       │  GET /sync/...  ◄──────────  │  retrieve doc bytes
       │
       └─ x-denomerge-sync-proof: { sessionId, expiresAt }
```

---

## Running locally

**Prerequisites:** Deno 2.x, Chrome 118+ / Safari 17+ / Firefox 122+ (WebAuthn PRF support required)

```bash
# from the example/ directory

# build the browser bundle once
deno task build

# start the server
deno task start
# → http://localhost:8000

# or watch the server for changes (re-run build manually after editing app.ts)
deno task dev
```

The server infers the WebAuthn origin and RP ID from the request URL when the env vars below are absent. `localhost` works without any config.

---

## Deploying to Deno Deploy

The `deno.json` in this directory targets Deno Deploy:

```json
"deploy": {
  "org": "your-org",
  "app": "your-app-name",
  "runtime": { "type": "dynamic", "entrypoint": "./main.ts" }
}
```

Build first, then deploy:

```bash
deno task build
deployctl deploy
```

Set these environment variables in your Deploy project settings:

| Variable | Example | Purpose |
|---|---|---|
| `DENOMERGE_ORIGIN` | `https://your-app.deno.dev` | Expected WebAuthn origin |
| `DENOMERGE_RP_ID` | `your-app.deno.dev` | WebAuthn relying-party ID |

---

## File map

| File | Role |
|---|---|
| `app.ts` | Browser app — Automerge doc management, WebAuthn ceremonies, UI |
| `main.ts` | Deno Deploy server — auth routes (`/auth/*`) + sync endpoint (`/sync/*`) |
| `build.ts` | esbuild bundler — bundles `app.ts` → `dist/app.bundle.js` |
| `index.html` | Single-page shell |
| `style.css` | Minimal styles |
| `dist/` | Built browser bundle (committed so Deno Deploy can serve it without a build step) |

---

## Architecture notes

### Document model

`createBrowserAutomergeRepo("test-todo-repo")` returns an Automerge `Repo` backed by IndexedDB. The repo manages document identity via a URL (`automerge:…`), stored in `localStorage`. On first load it creates a fresh document. On subsequent loads it rehydrates from IndexedDB. If the stored URL is stale (e.g., after clearing the database), it falls back to a new document.

### Sync auth

The example uses session-based sync proof: login issues a 5-minute session token stored in KV, and sync requests carry it as `x-denomerge-sync-proof: { sessionId, expiresAt }`. `createKvSyncHandler` checks expiry and calls `verifyProof`, which looks the token up in KV.

An alternative pattern — sign every sync request with a WebAuthn assertion — avoids the session entirely. Use `createWebAuthnSyncProofVerifier` as the `verifyProof` function to get per-request cryptographic proof of device possession.

### Bundle

Automerge ships WASM that's incompatible with esbuild's default platform handling. `build.ts` intercepts the `@automerge/automerge` import and redirects to `fullfat_base64.js`, which inlines the WASM as a base64 string. This makes the bundle self-contained (~4 MB) and works with any bundler without native WebAssembly ES module support.

---

## Known gaps

**Sync is document-level.**
The entire Automerge document is serialised and stored on every mutation. A better protocol syncs Automerge change sets, not snapshots — the server would store individual changes and clients would request only the changes they haven't seen.

**No true cross-device sync.**
`accountId` is a random UUID stored in `localStorage`, scoped to this device. A second device registers a new credential under a different `accountId`, so its documents are independent. Solving this requires associating a credential with a stable user identity on the server — a reverse index from `credentialId → accountId` — and discoverable credential lookup (omitting `allowCredentials` so the browser surfaces all passkeys for this RP).

> The login flow already omits `allowCredentials` when `credentialId` is not in `localStorage` (e.g., after clearing storage while the passkey remains in the OS keychain), so credential discovery works within a single account.
