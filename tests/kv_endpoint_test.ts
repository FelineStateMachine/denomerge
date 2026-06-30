import { assertEquals } from "@std/assert"
import {
  concatBytes,
  createKvSyncHandler,
  createWebAuthnSyncProofVerifier,
  encodeBase64Url,
  MemoryKv,
  sha256,
  type SyncAuthProof,
  utf8,
} from "../src/index.ts"

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

Deno.test("WebAuthn sync proof verifier checks challenge, origin, RP hash, UV, and signature", async () => {
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  )
  const publicKeySpki = new Uint8Array(await crypto.subtle.exportKey("spki", keyPair.publicKey))
  const clientDataJSON = utf8(JSON.stringify({
    type: "webauthn.get",
    challenge: "challenge",
    origin: "https://example.com",
  }))
  const authenticatorData = concatBytes(
    await sha256(utf8("example.com")),
    new Uint8Array([0x05, 0, 0, 0, 1]),
  )
  const signatureBase = concatBytes(authenticatorData, await sha256(clientDataJSON))
  const signature = new Uint8Array(
    await crypto.subtle.sign(
      { name: "ECDSA", hash: "SHA-256" },
      keyPair.privateKey,
      signatureBase.buffer.slice(
        signatureBase.byteOffset,
        signatureBase.byteOffset + signatureBase.byteLength,
      ) as ArrayBuffer,
    ),
  )
  const signedProof: SyncAuthProof = {
    ...proof,
    signature: encodeBase64Url(signature),
    clientDataJSON: encodeBase64Url(clientDataJSON),
    authenticatorData: encodeBase64Url(authenticatorData),
  }
  const verifier = createWebAuthnSyncProofVerifier({
    rpId: "example.com",
    origin: "https://example.com",
    expectedChallenge: () => "challenge",
    getCredential: () => ({
      credentialId: "cred",
      publicKeySpkiBase64Url: encodeBase64Url(publicKeySpki),
      algorithm: { name: "ECDSA", namedCurve: "P-256", hash: "SHA-256" },
    }),
  })

  assertEquals(
    await verifier(signedProof, {
      namespace: "app",
      accountId: "acct",
      documentId: "doc1",
      method: "PUT",
    }),
    true,
  )
  const wrongChallengeVerifier = createWebAuthnSyncProofVerifier({
    rpId: "example.com",
    origin: "https://example.com",
    expectedChallenge: () => "other",
    getCredential: () => ({
      credentialId: "cred",
      publicKeySpkiBase64Url: encodeBase64Url(publicKeySpki),
      algorithm: { name: "ECDSA", namedCurve: "P-256", hash: "SHA-256" },
    }),
  })
  assertEquals(
    await wrongChallengeVerifier(signedProof, {
      namespace: "app",
      accountId: "acct",
      documentId: "doc1",
      method: "PUT",
    }),
    false,
  )
})
