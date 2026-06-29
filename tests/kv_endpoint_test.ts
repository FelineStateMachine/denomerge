import { assertEquals } from "@std/assert"
import { createKvSyncHandler, MemoryKv, type SyncAuthProof } from "../src/index.ts"

const proof: SyncAuthProof = {
  credentialId: "cred",
  challenge: "challenge",
  signature: "signature",
  clientDataJSON: "client",
  authenticatorData: "authenticator",
  prfSaltHash: "salt",
  expiresAt: "2026-01-01T00:10:00Z",
}

Deno.test("KV sync handler stores and returns document payloads behind proof verification", async () => {
  const kv = new MemoryKv()
  const handler = createKvSyncHandler({
    kv,
    now: () => new Date("2026-01-01T00:00:00Z"),
    verifyProof: (_proof, context) => context.namespace === "app",
  })
  const headers = { "x-denomerge-sync-proof": JSON.stringify(proof) }

  const put = await handler(
    new Request("http://local/sync/app/acct/doc1", {
      method: "PUT",
      headers,
      body: JSON.stringify({ bytesBase64: "AQID" }),
    }),
  )
  assertEquals(put.status, 201)

  const get = await handler(new Request("http://local/sync/app/acct/doc1", { headers }))
  assertEquals(get.status, 200)
  assertEquals(await get.json(), { bytesBase64: "AQID", updatedAt: "2026-01-01T00:00:00.000Z" })
})

Deno.test("KV sync handler rejects expired proof", async () => {
  const handler = createKvSyncHandler({
    kv: new MemoryKv(),
    now: () => new Date("2026-01-01T00:20:00Z"),
    verifyProof: () => true,
  })
  const response = await handler(
    new Request("http://local/sync/app/acct/doc1", {
      headers: { "x-denomerge-sync-proof": JSON.stringify(proof) },
    }),
  )
  assertEquals(response.status, 401)
  assertEquals(await response.json(), { error: "expired_sync_proof" })
})

Deno.test("KV sync handler rejects failed proof verification", async () => {
  const handler = createKvSyncHandler({
    kv: new MemoryKv(),
    now: () => new Date("2026-01-01T00:00:00Z"),
    verifyProof: () => false,
  })
  const response = await handler(
    new Request("http://local/sync/app/acct/doc1", {
      headers: { "x-denomerge-sync-proof": JSON.stringify(proof) },
    }),
  )
  assertEquals(response.status, 403)
  assertEquals(await response.json(), { error: "invalid_sync_proof" })
})
