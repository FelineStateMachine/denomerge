# Spike Results: POC phase map

## Status

Complete. All spike phases now have local evidence, tests, and OpenSpec notes. No blocker was hit.

## Completed phase order

1. `spike-library-api-boundary` — package exports, JSR dry-run, and repo-local agent rules.
2. `spike-prf-resident-auth` — resident passkey/PRF option builders, key derivation, and mocked
   ceremony helpers.
3. `spike-indexeddb-automerge-storage` — browser Automerge Repo/IndexedDB wiring with injectable
   storage tests.
4. `spike-deno-kv-sync-protocol` — KV document sync handler plus WebAuthn assertion proof verifier.

## Selected combined POC path

Build the combined POC as a browser-first Deno library flow:

- Browser creates/loads Automerge documents through the IndexedDB-backed repo factory.
- Passkey PRF ceremony derives client-only sync/auth material while the key session is present.
- Client sends WebAuthn assertion proof with sync requests.
- Deno KV handler verifies assertion proof before reading/writing document bytes.

## Decision to carry forward

The only implementation fork is credential public-key format: store SPKI at registration time, or
store COSE and add COSE-to-WebCrypto conversion before verifier import. The spike used SPKI because
WebCrypto can verify it directly; the combined implementation should decide this explicitly when
registration persistence is added.
