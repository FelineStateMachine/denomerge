import { assertEquals } from "@std/assert"
import { canSync, denomergeKvKeys } from "../src/index.ts"

Deno.test("denomergeKvKeys builds stable tuple keys", () => {
  const keys = denomergeKvKeys({ namespace: "app", accountId: "acct" })
  assertEquals(keys.document("doc1"), ["denomerge", "app", "acct", "doc", "doc1"])
  assertEquals(keys.documentChunk("doc1", 2), ["denomerge", "app", "acct", "doc-chunk", "doc1", 2])
})

Deno.test("canSync requires a present key and future expiry", () => {
  const now = new Date("2026-01-01T00:00:00Z")
  assertEquals(
    canSync({ isKeyPresent: true, expiresAt: new Date("2026-01-01T00:01:00Z") }, now),
    true,
  )
  assertEquals(
    canSync({ isKeyPresent: false, expiresAt: new Date("2026-01-01T00:01:00Z") }, now),
    false,
  )
  assertEquals(
    canSync({ isKeyPresent: true, expiresAt: new Date("2025-12-31T23:59:00Z") }, now),
    false,
  )
})
