# Change: Spike resident passkey PRF authentication

## Summary

Validate the passkey/authentication model for deriving sync-scoped key material from a discoverable
WebAuthn credential using the PRF extension (`hmac-secret` on capable FIDO2 authenticators).

## Why

The library needs an authentication primitive that can prove user presence and derive client-only
sync material without sending PRF output or private credential data to Deno KV.

## Scope

- Registration options for resident/discoverable credentials.
- Authentication options that request PRF output for a scoped salt.
- Key-derivation boundary between PRF output and sync auth/encryption keys.
- Explicit non-goal: production server-side WebAuthn verification in this spike.
