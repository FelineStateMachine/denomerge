# Design: Deno KV sync protocol spike

## Decision

Use tuple keys under `["denomerge", namespace, accountId, ...]` so one deployment can host multiple
application namespaces. Keep document payloads separate from clocks/chunks/session records to permit
later chunking and conflict-aware sync.

## Sync gating

The browser can keep editing locally at all times. Remote sync is allowed only while the client has
proof/session state that indicates the authenticator is present and not expired.

## Risk

Deno KV value limits may require chunking Automerge payloads. The keyspace includes document chunks
now so the protocol can evolve without replacing account/document prefixes.
