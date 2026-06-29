# Design: POC phase map

## Phase order

1. `spike-library-api-boundary` — package shape and stable public exports.
2. `spike-prf-resident-auth` — resident credential + PRF-derived sync material.
3. `spike-indexeddb-automerge-storage` — browser-local Automerge durability.
4. `spike-deno-kv-sync-protocol` — remote sync keyspace and endpoint contract.
5. Combined POC follow-up — wire browser repo + passkey ceremony + Deno KV sync endpoint.

## Review rule

A phase is ready to advance when its OpenSpec tasks, tests, and spike notes show what was proven and
what remains blocked by browser/hardware/deployment constraints.
