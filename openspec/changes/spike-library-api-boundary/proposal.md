# Change: Spike public library API boundary

## Summary

Establish the initial Deno library module layout and exports so later spikes can fill
implementations without leaking unstable internals.

## Why

The project should be usable as a library, not just an app demo. Clear module boundaries make it
easier to publish to JSR later and keep browser/client/server responsibilities separate.

## Scope

- Deno package config and exports.
- Public modules for auth, crypto, KV, storage, and sync.
- README/AGENTS guidance for contributors and agents.
