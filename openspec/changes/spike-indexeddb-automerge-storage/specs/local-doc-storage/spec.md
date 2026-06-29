## ADDED Requirements

### Requirement: Local document store boundary

The library SHALL expose a local document store boundary that can load, save, and remove document
bytes by document id.

#### Scenario: Store implementation can persist document bytes

- **GIVEN** a document id and serialized Automerge bytes
- **WHEN** an implementation saves the bytes
- **THEN** a later load for the same document id returns the saved bytes

### Requirement: IndexedDB remains the browser-local target

The library SHALL treat IndexedDB as the default browser-local persistence target for Automerge
document data.

#### Scenario: Browser runtime uses local durability

- **GIVEN** a browser app using denomerge
- **WHEN** sync is unavailable
- **THEN** document interactions continue against local IndexedDB-backed data

### Requirement: Browser Automerge repo factory

The library SHALL provide a browser-facing factory that wires Automerge Repo to IndexedDB storage.

#### Scenario: Caller creates browser repo

- **GIVEN** a browser app using denomerge
- **WHEN** the app creates a browser Automerge repo
- **THEN** the repo uses IndexedDB as its storage adapter
