# Tasks

- [ ] Add deterministic COSE_Key test vectors for ES256 credential public keys.
- [ ] Define the stored credential record shape with `publicKeyCoseBase64Url` as the primary
      persisted key material.
- [ ] Add COSE-to-WebCrypto conversion helper and tests.
- [ ] Update WebAuthn sync proof verifier to verify signatures from stored COSE public keys.
- [ ] Keep or remove SPKI compatibility deliberately after COSE verifier tests pass.
- [ ] Update README/spike notes to document COSE as the credential public-key storage format.
- [ ] Run `deno task check`, OpenSpec strict validation, and `deno publish --dry-run`.
