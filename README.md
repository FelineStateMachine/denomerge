# denomerge

Deno-native TypeScript library experiments for local-first Automerge document storage with browser
IndexedDB, Deno KV sync, and passkey/PRF-derived sync authentication.

## Goal

`denomerge` is intended to make this shape boring:

1. A browser app stores and edits Automerge documents locally in IndexedDB.
2. A passkey login creates or unlocks a discoverable credential.
3. The WebAuthn PRF extension (`hmac-secret` underneath on security keys) derives scoped sync key
   material after user presence/PIN.
4. While the key/session is fresh, the client syncs encrypted/authenticated Automerge payloads to a
   Deno KV-backed endpoint.
5. When the key is absent or the assertion expires, local editing continues and sync pauses.

This repo starts as spikes, not a production auth system.

## Current package shape

```ts
import {
  buildPrfAuthenticationOptions,
  denomergeKvKeys,
  deriveSyncKeys,
} from "@felinestatemachine/denomerge"
```

Implemented now:

- WebAuthn PRF request helpers and deterministic salt derivation.
- HKDF-based derivation of separate sync authentication/encryption key bytes from PRF output.
- Deno KV tuple key builders for Automerge document sync state.
- Minimal interfaces for local storage and sync transport boundaries.

Not implemented yet:

- Full Automerge Repo adapter wiring.
- Production WebAuthn challenge verification.
- Hosted Deno KV server.
- Browser integration tests with a real or virtual authenticator.

## Development

```bash
deno task check
openspec validate --all --strict --json --no-interactive
```

## Security posture

- PRF output must never be sent to the server.
- Deno KV should store encrypted/authed sync data and replay-resistant metadata, not raw local
  document secrets.
- WebAuthn ceremonies are interactive by design; silent background PRF refresh is not available.
- Resident/discoverable credential support and PRF support are browser/authenticator dependent.
