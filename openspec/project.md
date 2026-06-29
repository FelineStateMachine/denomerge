# denomerge Project Context

## Purpose

`denomerge` is a Deno TypeScript library for local-first document applications that use Automerge in
the browser, IndexedDB for local durability, Deno KV for sync persistence, and WebAuthn PRF/passkeys
for user-present sync authorization.

## Constraints

- Deno-native TypeScript package; no Node build step for the library itself.
- Browser local data remains usable offline and while no authenticator is present.
- PRF-derived secret material never leaves the client.
- Deno KV stores sync records and metadata, not raw passkey private material or PRF output.
- WebAuthn PRF requires an interactive browser/authenticator ceremony; no silent background refresh.

## Verification

- `deno task check`
- `openspec validate --all --strict --json --no-interactive`
