# Design: Automerge IndexedDB local storage spike

## Decision

Start from `@automerge/automerge-repo` plus `@automerge/automerge-repo-storage-indexeddb` through
Deno npm imports. Keep denomerge's public boundary as small interfaces until the adapter behavior is
proven in browser integration tests.

## Notes from research

Automerge Repo documents pluggable storage and publishes an IndexedDB adapter. The package is
available via `deno add npm:@automerge/automerge-repo-storage-indexeddb`, which is enough for Deno
type/cache checks, but IndexedDB itself is a browser runtime concern.

## Risk

Deno tests can type-check the imports, but the IndexedDB adapter must be proven in a real browser or
browser automation environment.
