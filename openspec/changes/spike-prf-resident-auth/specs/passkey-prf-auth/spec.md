## ADDED Requirements

### Requirement: Resident PRF registration options

The library SHALL provide a helper that builds WebAuthn registration options requiring a
discoverable credential and user verification while requesting PRF enablement.

#### Scenario: Registration options are constructed

- **GIVEN** an RP id, RP name, user identity, and challenge
- **WHEN** the caller builds registration options
- **THEN** the options require `residentKey: "required"`
- **AND** the options require user verification
- **AND** the options request the PRF extension

### Requirement: Scoped PRF authentication options

The library SHALL provide a helper that builds WebAuthn authentication options requesting PRF output
for a caller-provided scoped salt.

#### Scenario: Authentication options include PRF salt

- **GIVEN** an RP id, challenge, and 32-byte PRF salt
- **WHEN** the caller builds authentication options
- **THEN** the options request user verification
- **AND** the options request PRF evaluation for the salt

### Requirement: Client-only sync key derivation

The library SHALL derive separate sync authentication and encryption key material from PRF output
without exposing the PRF output to the server contract.

#### Scenario: PRF output derives separated keys

- **GIVEN** PRF output and a scoped salt
- **WHEN** sync keys are derived
- **THEN** the derived auth key and encryption key are distinct byte ranges
- **AND** each derived key is 32 bytes
