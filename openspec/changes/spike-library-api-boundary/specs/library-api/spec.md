## ADDED Requirements

### Requirement: Deno-native package exports

The package SHALL expose Deno-native TypeScript modules for authentication, crypto, KV, storage, and
sync primitives.

#### Scenario: Caller imports public helpers

- **GIVEN** a Deno TypeScript consumer
- **WHEN** the consumer imports from the package root
- **THEN** the current public helpers are exported without requiring Node build tooling

### Requirement: Repository development contract

The repository SHALL document how to check, test, and safely contribute to the library.

#### Scenario: Agent prepares to modify the repo

- **GIVEN** an agent or contributor reads the repository
- **WHEN** they inspect project instructions
- **THEN** they find the Deno check command, OpenSpec validation command, and secret-handling
  warning
