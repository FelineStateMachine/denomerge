# Spike Results: spike-indexeddb-automerge-storage

## Status

The local storage spike now has a browser-facing repo factory that wires `@automerge/automerge-repo`
to `IndexedDBStorageAdapter`.

## Proven

- The Automerge IndexedDB package is importable through Deno npm compatibility.
- The public library can expose a small `createBrowserAutomergeRepo()` factory without forcing app
  code to know adapter internals.
- Deno type checks validate the import and public API shape.

## Remaining

- Real IndexedDB persistence still needs browser automation or a browser app fixture. Deno type
  checks are not enough because IndexedDB behavior is runtime/browser-specific.
