# Design: Public library API boundary spike

## Decision

Expose small modules:

- `./auth` for WebAuthn PRF option/key helpers.
- `./crypto` for byte, SHA-256, and HKDF helpers.
- `./kv` for Deno KV key builders.
- `./storage` for local storage interfaces.
- `./sync` for sync transport contracts and policy helpers.

## Non-goal

Do not expose a full opinionated app framework yet. The immediate goal is stable primitives that the
following Automerge/IndexedDB/KV spikes can validate.
