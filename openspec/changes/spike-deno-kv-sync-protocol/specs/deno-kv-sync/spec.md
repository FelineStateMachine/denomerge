## ADDED Requirements

### Requirement: Stable Deno KV keyspace

The library SHALL provide stable tuple key builders for account, credential, document, document
clock, document chunk, and sync session records.

#### Scenario: Document keys are deterministic

- **GIVEN** the same namespace, account id, and document id
- **WHEN** document keys are generated multiple times
- **THEN** each generated key is identical

### Requirement: Authenticated sync transport boundary

The library SHALL define a sync transport boundary where push and pull operations require sync
authentication proof.

#### Scenario: Pull requires proof

- **GIVEN** a document id
- **WHEN** a caller pulls from remote sync storage
- **THEN** the caller supplies sync authentication proof with the request

### Requirement: Sync pauses when key session is unavailable

The library SHALL expose sync policy logic that permits remote sync only while key presence is true
and the session expiry is in the future.

#### Scenario: Expired session stops sync

- **GIVEN** a sync policy with key presence true and an expired timestamp
- **WHEN** the policy is evaluated
- **THEN** remote sync is not allowed

### Requirement: KV sync endpoint proof gate

The library SHALL provide a Deno request handler shape for remote document sync that gates storage
access behind expiry checks and caller-supplied proof verification.

#### Scenario: Expired proof is rejected

- **GIVEN** a remote sync request with an expired proof
- **WHEN** the sync handler receives the request
- **THEN** the handler rejects it before reading or writing document storage

#### Scenario: Verified proof permits document update

- **GIVEN** a remote sync request with an unexpired proof accepted by the verifier
- **WHEN** the caller pushes document bytes
- **THEN** the handler writes the document record under the document KV key

### Requirement: WebAuthn sync proof verifier

The library SHALL provide a verifier that checks WebAuthn assertion proof against stored credential
public keys before a Deno KV sync handler accepts document access.

#### Scenario: Signed WebAuthn proof is accepted

- **GIVEN** a stored credential public key, expected RP id, expected origin, and expected challenge
- **WHEN** the verifier receives a proof with matching client data, authenticator RP hash, user
  presence/user verification flags, and a valid signature
- **THEN** proof verification succeeds

#### Scenario: Wrong challenge is rejected

- **GIVEN** a signed proof whose client challenge does not match the expected challenge
- **WHEN** the verifier checks the proof
- **THEN** proof verification fails
