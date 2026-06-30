# Design: COSE credential storage spike

## Decision

Use COSE_Key as the persisted credential public-key format for denomerge credential records.

The verifier should import keys through a small conversion boundary:

```txt
stored COSE_Key bytes → parsed COSE public key → WebCrypto import material → signature verify
```

## Rationale

- WebAuthn authenticators expose public keys as COSE in registration attestation data.
- COSE storage preserves the source format and avoids committing registration to SPKI-only
  persistence.
- WebCrypto still needs SPKI/raw/JWK-like import material, so conversion is a verifier concern, not
  a storage concern.

## Stored record shape

A credential record should store at least:

```ts
interface StoredCredentialPublicKey {
  credentialId: string
  publicKeyCoseBase64Url: string
  algorithm: WebAuthnCoseAlgorithm
}
```

`algorithm` should be derived from COSE `alg`, not separately trusted when COSE is available. The
explicit field is useful for indexes/debugging, but verification should reject mismatches.

## Supported first-pass algorithms

Start narrow:

- ES256 / COSE alg `-7` / P-256 ECDSA SHA-256.
- RS256 / COSE alg `-257` only if tests prove clean WebCrypto import behavior.

Do not pretend broad COSE support exists until test vectors cover it.

## Rollout

1. Add COSE parser/converter tests using deterministic COSE_Key vectors.
2. Add verifier support for `publicKeyCoseBase64Url` while keeping SPKI test helper support only if
   needed.
3. Update verifier stored credential type to make COSE the primary field.
4. Update spike notes and README to describe COSE as the persisted format.
5. Remove SPKI-only language once the COSE verifier path passes JSR dry-run.

## Risks

- COSE parsing mistakes can silently break valid credentials. Keep parser small and vector-tested.
- Multiple algorithms invite under-tested branches. Keep first implementation to ES256 unless RS256
  is immediately required.
- Attestation parsing and trust validation are separate problems; do not mix them into this
  storage-format spike.
