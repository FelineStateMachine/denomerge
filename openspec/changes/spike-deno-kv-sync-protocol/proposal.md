# Change: Spike Deno KV sync protocol

## Summary

Shape the Deno KV keyspace and sync transport contract for storing Automerge sync state remotely.

## Why

Sync needs a durable, Deno-native server-side storage model that can store document records,
metadata, chunks, credentials, and session state without becoming a SQL-shaped dependency.

## Scope

- Deno KV tuple key builders.
- Sync transport interfaces for push/pull guarded by proof material.
- Sync availability policy based on key presence and expiry.
- Explicit non-goal: production KV endpoint in this spike.
