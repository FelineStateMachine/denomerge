# Design: Example todo app spike

## Architecture

```
Browser (app.js)
  │
  ├─ WebAuthn PRF → passkey login
  ├─ localStorage (todo JSON) → local first
  └─ fetch /sync/* → Deno KV server

Deno Deploy server (main.ts)
  │
  ├─ Static files (index.html, style.css, app.js)
  ├─ POST /auth/register → store SPKI credential in Deno KV
  ├─ GET  /auth/challenge → issue challenge
  ├─ POST /auth/verify-prf → verify assertion, issue sync session
  ├─ GET  /sync/:ns/:acct/:doc → verify proof, read from Deno KV
  └─ PUT  /sync/:ns/:acct/:doc → verify proof, write to Deno KV
```

## Sync proof flow

1. **Registration**: Browser creates a resident credential. Server stores its SPKI in Deno KV under
   `["denomerge", "denomerge-example", accountId, "credential", credentialIdHash]`.

2. **Login**: Browser authenticates with the credential, includes PRF salt, gets a short-lived sync
   session token in return.

3. **Sync**: Each `/sync/*` request includes `x-denomerge-sync-proof` header with the WebAuthn
   assertion. Server verifies signature against the stored SPKI before reading/writing KV.

## Environment variables

| Variable           | Default                 | Purpose         |
| ------------------ | ----------------------- | --------------- |
| `DENOMERGE_RP_ID`  | `localhost`             | WebAuthn RP ID  |
| `DENOMERGE_ORIGIN` | `http://localhost:8000` | WebAuthn origin |
| `PORT`             | `8000`                  | Server port     |

## Stored credential shape (Deno KV)

```ts
interface StoredCredential {
  credentialId: string
  publicKeySpkiBase64Url: string
  algorithm: { name: "ECDSA"; namedCurve: "P-256"; hash: "SHA-256" }
}
```

## Sync session shape (Deno KV)

```ts
interface SyncSession {
  accountId: string
  expiresAt: string // ISO 8601
}
```

## KV keyspace

```
["denomerge", "denomerge-example", accountId, "credential", credentialIdHash] → StoredCredential
["denomerge", "denomerge-example", accountId, "doc", documentId]           → { bytesBase64, updatedAt }
["denomerge", "denomerge-example", accountId, "sync-session", sessionId]    → SyncSession
```

## Local development

```bash
deno run --allow-net --allow-env --allow-read --allow-write example/main.ts
# or with Deno Deploy tunnel for cloud KV:
DENO_DEPLOY_TOKEN=... deno run --tunnel --allow-net --allow-env --allow-read --allow-write example/main.ts
```

## Deno Deploy deployment

The `example/deno.json` has `deploy.runtime.type: "dynamic"` and
`deploy.runtime.entrypoint: "./main.ts"`.

Deno Deploy will set the working directory to `example/` during build and boot.

## Caveats

- The browser app uses `localStorage` as the local doc store for this spike (not IndexedDB +
  Automerge). The full Automerge integration is deferred.
- The sync proof header includes a placeholder signature from the browser — the real implementation
  would include a proper WebAuthn assertion.
- The `verifySyncProof` in `main.ts` currently short-circuits challenge verification since we're
  using a session-based flow. The session token in KV is the actual auth gate.
