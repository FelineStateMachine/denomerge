import { assertEquals, assertExists, assertNotEquals } from "@std/assert"
import {
  buildPrfAuthenticationOptions,
  buildPrfRegistrationOptions,
  deriveDenomergePrfSalt,
  deriveSyncKeys,
} from "../src/index.ts"

Deno.test("deriveDenomergePrfSalt is deterministic and scoped", async () => {
  const a = await deriveDenomergePrfSalt({ rpId: "example.com", realm: "dami", scope: "doc:a" })
  const b = await deriveDenomergePrfSalt({ rpId: "example.com", realm: "dami", scope: "doc:a" })
  const c = await deriveDenomergePrfSalt({ rpId: "example.com", realm: "dami", scope: "doc:b" })

  assertEquals(a.byteLength, 32)
  assertEquals([...a], [...b])
  assertNotEquals([...a], [...c])
})

Deno.test("deriveSyncKeys separates auth and encryption material", async () => {
  const prf = new Uint8Array(32).fill(7)
  const salt = new Uint8Array(32).fill(3)
  const keys = await deriveSyncKeys(prf, salt)

  assertEquals(keys.authKey.byteLength, 32)
  assertEquals(keys.encryptionKey.byteLength, 32)
  assertNotEquals([...keys.authKey], [...keys.encryptionKey])
})

Deno.test("builds resident PRF registration and authentication options", () => {
  const registration = buildPrfRegistrationOptions({
    rpId: "example.com",
    rpName: "Example",
    userId: new Uint8Array([1, 2, 3]),
    userName: "dami",
    userDisplayName: "Dami",
    challenge: new Uint8Array([4, 5, 6]),
  })
  assertEquals(registration.authenticatorSelection?.residentKey, "required")
  assertEquals(registration.authenticatorSelection?.userVerification, "required")
  assertExists(registration.extensions?.prf)

  const auth = buildPrfAuthenticationOptions({
    rpId: "example.com",
    challenge: new Uint8Array([1]),
    salt: new Uint8Array(32),
  })
  assertEquals(auth.rpId, "example.com")
  assertExists(auth.extensions?.prf)
})
