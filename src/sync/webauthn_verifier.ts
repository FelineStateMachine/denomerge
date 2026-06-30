import { concatBytes, sha256, utf8 } from "../crypto/mod.ts"
import { type SyncAuthProof } from "./types.ts"
import { type SyncRequestContext, type VerifySyncProof } from "./kv_endpoint.ts"

export interface StoredCredentialPublicKey {
  credentialId: string
  publicKeySpkiBase64Url: string
  algorithm: WebAuthnPublicKeyAlgorithm
}

export type WebAuthnPublicKeyAlgorithm =
  | { name: "ECDSA"; namedCurve: "P-256"; hash: "SHA-256" }
  | { name: "RSASSA-PKCS1-v1_5"; hash: "SHA-256" }

export interface CreateWebAuthnSyncProofVerifierOptions {
  rpId: string | ((context: SyncRequestContext) => string | Promise<string>)
  origin: string | ((context: SyncRequestContext) => string | Promise<string>)
  getCredential: (
    credentialId: string,
    context: SyncRequestContext,
  ) => StoredCredentialPublicKey | undefined | Promise<StoredCredentialPublicKey | undefined>
  expectedChallenge?: (context: SyncRequestContext) => string | Promise<string>
}

interface ClientDataJSON {
  type?: string
  challenge?: string
  origin?: string
}

export function createWebAuthnSyncProofVerifier(
  options: CreateWebAuthnSyncProofVerifierOptions,
): VerifySyncProof {
  return async (proof: SyncAuthProof, context: SyncRequestContext): Promise<boolean> => {
    const credential = await options.getCredential(proof.credentialId, context)
    if (!credential || credential.credentialId !== proof.credentialId) return false

    const clientDataBytes = decodeBase64Url(proof.clientDataJSON)
    const authenticatorData = decodeBase64Url(proof.authenticatorData)
    const signature = decodeBase64Url(proof.signature)
    const clientData = parseClientData(clientDataBytes)
    if (!clientData) return false

    if (clientData.type !== "webauthn.get") return false
    if (clientData.origin !== (await resolveExpected(options.origin, context))) return false
    if (clientData.challenge !== (await expectedChallenge(options, proof, context))) return false
    if (
      !(await authenticatorDataMatches(
        authenticatorData,
        await resolveExpected(options.rpId, context),
      ))
    ) {
      return false
    }
    if (!hasUserPresenceAndVerification(authenticatorData)) return false

    const publicKey = await crypto.subtle.importKey(
      "spki",
      toArrayBuffer(decodeBase64Url(credential.publicKeySpkiBase64Url)),
      credential.algorithm,
      false,
      ["verify"],
    )
    return await crypto.subtle.verify(
      credential.algorithm,
      publicKey,
      toArrayBuffer(signature),
      toArrayBuffer(concatBytes(authenticatorData, await sha256(clientDataBytes))),
    )
  }
}

async function resolveExpected(
  expected: string | ((context: SyncRequestContext) => string | Promise<string>),
  context: SyncRequestContext,
): Promise<string> {
  return typeof expected === "function" ? await expected(context) : expected
}

async function expectedChallenge(
  options: CreateWebAuthnSyncProofVerifierOptions,
  proof: SyncAuthProof,
  context: SyncRequestContext,
): Promise<string> {
  return options.expectedChallenge ? await options.expectedChallenge(context) : proof.challenge
}

function parseClientData(bytes: Uint8Array): ClientDataJSON | undefined {
  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as ClientDataJSON
  } catch {
    return undefined
  }
}

async function authenticatorDataMatches(bytes: Uint8Array, rpId: string): Promise<boolean> {
  if (bytes.byteLength < 37) return false
  const expectedRpIdHash = await sha256(utf8(rpId))
  const actualRpIdHash = bytes.slice(0, 32)
  return constantTimeEqual(actualRpIdHash, expectedRpIdHash)
}

function hasUserPresenceAndVerification(bytes: Uint8Array): boolean {
  if (bytes.byteLength < 33) return false
  const flags = bytes[32]
  const userPresent = (flags & 0x01) !== 0
  const userVerified = (flags & 0x04) !== 0
  return userPresent && userVerified
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false
  let diff = 0
  for (let index = 0; index < a.byteLength; index += 1) diff |= a[index] ^ b[index]
  return diff === 0
}

export function encodeBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "")
}

export function decodeBase64Url(value: string): Uint8Array {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=")
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}
