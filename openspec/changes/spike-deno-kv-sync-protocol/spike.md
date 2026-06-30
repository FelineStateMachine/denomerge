# Spike Results: spike-deno-kv-sync-protocol

## Status

Complete locally. The Deno KV handler remains storage-agnostic, and the verifier path now includes
real WebAuthn assertion checks against stored credential public keys instead of only a
caller-provided mock.

## Proven

- KV tuple keys are stable for account, credential, document, clock, chunk, and session records.
- Sync policy blocks remote sync when key presence is false or the session is expired.
- The KV request handler rejects missing, expired, or invalid proof before document access.
- The WebAuthn verifier checks client data type/origin/challenge, authenticator RP hash, user
  presence/user verification flags, and signature validity.
- Tests cover accepted signed proof and rejected wrong-challenge proof using generated WebCrypto
  keys.

## Remaining

- The verifier currently accepts stored SPKI public keys. Credential-registration persistence still
  needs to decide whether to store SPKI directly or convert WebAuthn COSE keys at registration time.
