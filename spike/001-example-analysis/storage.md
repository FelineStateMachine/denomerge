# Storage Analysis: test-todo Example App

Captured 2026-07-01. Deployment: `test-todo.felinestatemachine.deno.net`.

---

## Browser — IndexedDB

**Database:** `test-todo` (version 1)  
**Object store:** `docs`

| Key | Value type | Shape |
|-----|-----------|-------|
| `"todo-doc-1"` | Array | `Array<{ id: number, text: string, done: boolean }>` |

The key is the `documentId` constant (`"todo-doc-1"`). The value is the full in-memory todo array serialised directly by the browser's structured clone algorithm — no JSON encoding at rest.

**Observed state (screenshot):**
```
"todo-doc-1" → [
  { id: 1782875816561, text: "foo", done: false },
  { id: 1782875820336, text: "bar", done: false }
]
```

**Gap vs intended design:** This is raw JSON, not an Automerge CRDT document. A production integration would store an Automerge binary document here (via `AutomergeIndexedDbStorageAdapter`), enabling offline conflict resolution before syncing.

---

## Server — Deno KV

**Namespace constant:** `"denomerge-example"` (set in `example/main.ts`)

All keys follow the prefix pattern defined in `src/kv/keys.ts`:

```
["denomerge", <namespace>, <accountId>, <type>, ...]
```

### Key types

#### 1. Credential
```
["denomerge", "denomerge-example", <accountId>, "credential", <credentialId>]
```
Stored on registration. Holds the passkey public key used to verify assertions.

```json
{
  "credentialId": "<base64url>",
  "publicKeySpkiBase64Url": "<base64url SPKI>",
  "algorithm": { "name": "ECDSA", "namedCurve": "P-256", "hash": "SHA-256" }
}
```

#### 2. Sync session
```
["denomerge", "denomerge-example", <accountId>, "sync-session", <sessionId>]
```
Issued by `POST /auth/verify-prf` after successful WebAuthn + PRF login. TTL: 5 minutes (enforced by the client's `expiresAt` in the sync proof; no server-side KV TTL set).

```json
{
  "accountId": "<uuid>",
  "expiresAt": "<ISO 8601>"
}
```

#### 3. Sync document
```
["denomerge", "denomerge-example", <accountId>, "doc", "todo-doc-1"]
```
Written on every `PUT /sync/...` and read on `GET /sync/...`. Single record per (account, document).

```json
{
  "bytesBase64": "<base64url of JSON bytes>",
  "updatedAt": "<ISO 8601>"
}
```

The `bytesBase64` decodes to:
```json
{ "todos": [{ "id": 1782875816561, "text": "foo", "done": false }, ...] }
```

#### Defined but unused in example
| Key suffix | Purpose |
|-----------|---------|
| `"account"` | Account metadata (not written by example) |
| `"doc-clock", <docId>` | Vector clock for multi-peer sync (not yet implemented) |
| `"doc-chunk", <docId>, <n>` | Chunked storage for large documents (not yet implemented) |

---

## Data flow summary

```
[Browser action]
      │
      ▼
 IndexedDB write          ← structured clone of todo array
      │
      ▼
 PUT /sync/denomerge-example/<accountId>/todo-doc-1
   header: x-denomerge-sync-proof: { sessionId, expiresAt }
   body:   { bytesBase64: b64url(JSON({ todos: [...] })) }
      │
      ▼
 Server verifies sessionId against KV sync-session record
      │
      ▼
 KV write: ["denomerge", "denomerge-example", <accountId>, "doc", "todo-doc-1"]
           { bytesBase64, updatedAt }
```

---

## Notes

- `accountId` is a random UUID generated client-side and persisted in `localStorage`. There is no server-side account creation step — the credential ties the passkey to the account.
- The sync document is opaque bytes to the server; it does not inspect `bytesBase64`. This is where Automerge binary encoding would slot in without server changes.
- Session expiry is client-enforced only (checked against `proof.expiresAt` in `kv_endpoint.ts`). The KV session record is not deleted on logout; it expires passively.
