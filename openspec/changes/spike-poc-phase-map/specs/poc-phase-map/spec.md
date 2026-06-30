## ADDED Requirements

### Requirement: Ordered POC spike phases

The repository SHALL define an ordered set of OpenSpec changes that represent the POC spike phases.

#### Scenario: Dashboard reviewer opens active changes

- **GIVEN** the OpenSpec dashboard lists active changes
- **WHEN** the reviewer opens the POC phase map
- **THEN** the reviewer can see the intended order of the current spike changes
- **AND** the reviewer can identify which change owns each phase

### Requirement: Phase exit criteria

Each POC spike phase SHALL state what evidence is required before advancing to the next phase.

#### Scenario: Phase is reviewed

- **GIVEN** a spike phase has implementation tasks
- **WHEN** the phase is reviewed
- **THEN** its tasks and spike notes identify proven behavior and remaining follow-up work

### Requirement: Combined POC path selection

The phase map SHALL record the selected combined POC path after the individual spikes produce enough
evidence to proceed without a major architecture fork.

#### Scenario: Spikes are complete

- **GIVEN** the package boundary, PRF auth, IndexedDB storage, and KV sync spikes are complete
- **WHEN** the phase map is reviewed
- **THEN** it identifies the selected browser-first Deno library flow
- **AND** it calls out any implementation decision that remains unresolved
