# Spike Results: spike-cose-credential-storage

## Status

Planned, not implemented. This spike exists to make COSE credential public-key storage the
deliberate next step before changing verifier code.

## Direction

Use COSE_Key as the persisted credential public-key format. Convert COSE to WebCrypto-compatible
verification material inside the verifier boundary.

## Exit criteria

- Deterministic ES256 COSE_Key vectors exist.
- COSE-to-WebCrypto conversion is tested.
- The sync proof verifier verifies signatures from stored COSE public keys.
- SPKI compatibility is either removed or explicitly retained as temporary compatibility.
