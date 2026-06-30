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
    const signature = normalizeWebAuthnEcdsaSignature(decodeBase64Url(proof.signature))
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

/**
 * WebAuthn authenticators return ECDSA signatures as ASN.1 DER, while WebCrypto
 * verifies ECDSA with the fixed-width IEEE P1363 form (`r || s`).
 *
 * Deno/WebCrypto-generated test signatures are already P1363, so this accepts
 * both forms and normalizes DER signatures to the 64-byte P-256 shape.
 */
export function normalizeWebAuthnEcdsaSignature(signature: Uint8Array): Uint8Array {
  if (signature.byteLength === 64) return signature
  const parsed = parseDerEcdsaSignature(signature)
  if (!parsed) return signature
  return concatBytes(toFixedWidthInteger(parsed.r, 32), toFixedWidthInteger(parsed.s, 32))
}

function parseDerEcdsaSignature(
  signature: Uint8Array,
): { r: Uint8Array; s: Uint8Array } | undefined {
  let offset = 0
  if (signature[offset++] !== 0x30) return undefined
  const sequenceLength = readDerLength(signature, offset)
  if (!sequenceLength) return undefined
  offset = sequenceLength.nextOffset
  if (offset + sequenceLength.length !== signature.byteLength) return undefined

  const r = readDerInteger(signature, offset)
  if (!r) return undefined
  offset = r.nextOffset
  const s = readDerInteger(signature, offset)
  if (!s) return undefined
  if (s.nextOffset !== signature.byteLength) return undefined
  return { r: r.value, s: s.value }
}

function readDerLength(
  bytes: Uint8Array,
  offset: number,
): { length: number; nextOffset: number } | undefined {
  if (offset >= bytes.byteLength) return undefined
  const first = bytes[offset++]
  if ((first & 0x80) === 0) return { length: first, nextOffset: offset }

  const byteCount = first & 0x7f
  if (byteCount === 0 || byteCount > 2 || offset + byteCount > bytes.byteLength) return undefined
  let length = 0
  for (let index = 0; index < byteCount; index += 1) length = (length << 8) | bytes[offset++]
  return { length, nextOffset: offset }
}

function readDerInteger(bytes: Uint8Array, offset: number):
  | { value: Uint8Array; nextOffset: number }
  | undefined {
  if (bytes[offset++] !== 0x02) return undefined
  const length = readDerLength(bytes, offset)
  if (!length) return undefined
  offset = length.nextOffset
  if (length.length < 1 || offset + length.length > bytes.byteLength) return undefined
  return { value: bytes.slice(offset, offset + length.length), nextOffset: offset + length.length }
}

function toFixedWidthInteger(bytes: Uint8Array, width: number): Uint8Array {
  let value = bytes
  while (value.byteLength > 0 && value[0] === 0) value = value.slice(1)
  if (value.byteLength > width) throw new Error("ECDSA integer is wider than expected")
  const out = new Uint8Array(width)
  out.set(value, width - value.byteLength)
  return out
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}
