# Change: COSE credential storage spike

## Summary

Define the rollout path for storing WebAuthn credential public keys as COSE_Key bytes, matching what
registration produces, while keeping the Deno KV sync verifier smooth to integrate with WebCrypto.

## Why

The current verifier spike used SPKI because WebCrypto imports it directly. That is useful for
proving signature verification, but WebAuthn registration naturally returns credential public keys
in COSE format inside attestation/authenticator data. Storing COSE avoids a premature
legacy-oriented conversion boundary and keeps persisted credential metadata closer to the modern
WebAuthn source format.

## Scope

- Specify the stored credential record shape for COSE public keys.
- Define conversion requirements from COSE_Key to WebCrypto import parameters.
- Define rollout/migration behavior from the current SPKI spike contract.
- Identify test coverage needed before replacing the verifier input contract.

## Non-goals

- Implement full attestation trust-chain validation.
- Implement production registration persistence.
- Remove the existing verifier proof checks before a COSE path is tested.
