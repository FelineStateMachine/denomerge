## ADDED Requirements

### Requirement: COSE public-key credential storage

The library SHALL treat COSE_Key bytes from WebAuthn registration as the primary persisted
credential public-key format.

#### Scenario: Credential record stores COSE key

- **GIVEN** a WebAuthn registration result with a credential id and COSE public key bytes
- **WHEN** denomerge persists credential metadata
- **THEN** the record stores the credential id
- **AND** the record stores the public key as base64url-encoded COSE bytes
- **AND** the record does not require SPKI as the persisted source of truth

### Requirement: COSE verifier import path

The library SHALL convert stored COSE_Key public keys into WebCrypto-compatible verification
material before checking sync proof signatures.

#### Scenario: ES256 COSE key verifies proof

- **GIVEN** a stored ES256 COSE_Key public key and a WebAuthn sync proof signed by its matching
  private key
- **WHEN** the sync proof verifier checks the proof
- **THEN** it imports verification material derived from the COSE key
- **AND** it verifies the assertion signature over authenticator data plus the client-data hash

#### Scenario: Unsupported COSE algorithm is rejected

- **GIVEN** a stored COSE_Key with an unsupported or mismatched algorithm
- **WHEN** the verifier checks a sync proof
- **THEN** verification fails closed

### Requirement: Smooth SPKI-to-COSE rollout

The library SHALL define a migration path from the spike-era SPKI verifier contract to COSE primary
storage without weakening proof verification.

#### Scenario: Existing verifier code is updated

- **GIVEN** verifier code that previously accepted `publicKeySpkiBase64Url`
- **WHEN** COSE storage support is introduced
- **THEN** tests prove the COSE path before SPKI-only language is removed
- **AND** any temporary compatibility behavior is documented and deliberately removed or retained
