# Spike Results: spike-deno-kv-sync-protocol

## Status

The remote sync shape now has code: a Deno `Request -> Response` handler, a Deno-KV-like storage
boundary, an in-memory KV test double, and tests for push/pull plus proof rejection.

## Proven

- Document sync records are keyed by namespace/account/document id.
- Remote push/pull is blocked without a serialized sync proof header.
- Expired proofs are rejected before storage access.
- Proof verification is an injected callback so the endpoint can be tested now and replaced with
  real WebAuthn verification later.

## Remaining

- Implement production WebAuthn assertion verification.
- Decide payload chunking thresholds against real Deno KV value limits.
- Wire this endpoint to a browser Automerge Repo client.
