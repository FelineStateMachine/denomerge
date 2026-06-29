# Change: Spike Automerge IndexedDB local storage

## Summary

Validate the browser-local document storage boundary for Automerge documents persisted in IndexedDB.

## Why

The core product model is local-first: documents must be editable and durable locally whether sync
is available or not.

## Scope

- Use Automerge Repo's IndexedDB storage adapter as the default browser-local storage candidate.
- Define a local document store interface so app code is not coupled to one persistence backend.
- Explicit non-goal: full browser demo app in this spike.
