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
