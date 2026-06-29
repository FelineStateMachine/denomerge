# Tasks

- [x] Research WebAuthn PRF/resident-key API shape and current browser/security-key constraints.
- [x] Add library helpers for PRF registration/authentication option construction.
- [x] Add deterministic PRF salt and HKDF sync-key derivation helpers.
- [x] Add unit tests for deterministic salts, separated keys, and required
      resident/user-verification options.
- [x] Add mocked WebAuthn ceremony test with an injectable credentials client, standing in for the
      physical key press.
