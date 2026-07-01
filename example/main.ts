/**
 * example/main.ts
 * Deno Deploy server: serves the todo app and exposes the KV sync endpoint.
 *
 * Sync proof verification:
 * - On registration, the credential public key (SPKI) is stored in Deno KV.
 * - On login (verify-prf), a short-lived session token is issued and stored in KV.
 * - On sync, the session token is verified against KV (no per-sync WebAuthn round-trip).
 */

import {
  createKvSyncHandler,
  denomergeKvKeys,
  encodeBase64Url,
  normalizeWebAuthnEcdsaSignature,
  sha256,
  utf8,
} from "../src/index.ts"
import type { VerifySyncProof } from "../src/sync/kv_endpoint.ts"
import type { SyncRequestContext } from "../src/sync/kv_endpoint.ts"

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

const kv = await Deno.openKv()
const SYNC_NAMESPACE = "test-todo"

// ---------------------------------------------------------------------------
// Credential storage (KV-based)
// ---------------------------------------------------------------------------

interface StoredCredential {
  credentialId: string
  publicKeySpkiBase64Url: string
  algorithm: { name: "ECDSA"; namedCurve: "P-256"; hash: "SHA-256" }
}

/** Get a stored credential by ID, scoped to namespace + account. */
async function getStoredCredential(
  credentialId: string,
  _context: SyncRequestContext,
): Promise<StoredCredential | undefined> {
  const keys = denomergeKvKeys({ namespace: SYNC_NAMESPACE, accountId: _context.accountId })
  const entry = await kv.get<StoredCredential>(keys.credential(credentialId))
  return entry.value ?? undefined
}

/** Store a registered credential public key. */
async function storeCredential(
  credentialId: string,
  accountId: string,
  publicKeySpki: Uint8Array,
): Promise<void> {
  const keys = denomergeKvKeys({ namespace: SYNC_NAMESPACE, accountId })
  await kv.set(keys.credential(credentialId), {
    credentialId,
    publicKeySpkiBase64Url: encodeBase64Url(publicKeySpki),
    algorithm: { name: "ECDSA", namedCurve: "P-256", hash: "SHA-256" },
  } as StoredCredential)
}

// ---------------------------------------------------------------------------
// Sync proof verifier
// ---------------------------------------------------------------------------

// Session-based sync proof: the sessionId issued at login authorizes sync for its lifetime,
// avoiding a WebAuthn round-trip (and passkey prompt) on every sync operation.
const verifySyncProof: VerifySyncProof = async (proof, context) => {
  const { sessionId } = proof as unknown as { sessionId?: string }
  if (!sessionId) return false
  const keys = denomergeKvKeys({ namespace: SYNC_NAMESPACE, accountId: context.accountId })
  const session = await kv.get<{ accountId: string; expiresAt: string }>(
    keys.syncSession(sessionId),
  )
  return session.value?.accountId === context.accountId
}

// ---------------------------------------------------------------------------
// Sync handler
// ---------------------------------------------------------------------------

const syncHandler = createKvSyncHandler({ kv, verifyProof: verifySyncProof })

// ---------------------------------------------------------------------------
// In-memory challenge store (per-account, short-lived)
// ---------------------------------------------------------------------------

const challenges = new Map<string, { challenge: string; expiresAt: number }>()

function setChallenge(accountId: string, challenge: string): void {
  challenges.set(accountId, { challenge, expiresAt: Date.now() + 60_000 })
}

function getChallenge(accountId: string): string | undefined {
  const record = challenges.get(accountId)
  if (!record || record.expiresAt < Date.now()) {
    challenges.delete(accountId)
    return undefined
  }
  return record.challenge
}

// ---------------------------------------------------------------------------
// Helper: parse authenticator data
// ---------------------------------------------------------------------------

function parseAuthenticatorData(bytes: Uint8Array): { rpIdHash: Uint8Array; flags: number } | null {
  if (bytes.byteLength < 37) return null
  return {
    rpIdHash: bytes.slice(0, 32),
    flags: bytes[32],
  }
}

// ---------------------------------------------------------------------------
// Route: POST /auth/register
// Register a passkey: store the credential public key from the attestation.
// ---------------------------------------------------------------------------

async function handleRegister(req: Request): Promise<Response> {
  if (req.method !== "POST") return methodNotAllowed()
  const body = await req.json() as {
    accountId: string
    credentialId: string
    attestationData: { clientDataJSON: string; authenticatorData: string; publicKey: string }
  }

  if (!body.accountId || !body.credentialId || !body.attestationData) {
    return json({ error: "missing fields" }, 400)
  }

  // Decode attestation data
  const clientDataBytes = decodeBase64Url(body.attestationData.clientDataJSON)
  const authenticatorDataBytes = decodeBase64Url(body.attestationData.authenticatorData)
  const publicKeySpki = decodeBase64Url(body.attestationData.publicKey)

  // Basic validation: verify origin in clientDataJSON
  const clientData = JSON.parse(new TextDecoder().decode(clientDataBytes)) as { origin?: string }
  const expectedOrigin = Deno.env.get("DENOMERGE_ORIGIN") ?? new URL(req.url).origin
  if (clientData.origin !== expectedOrigin) {
    return json({ error: "origin mismatch" }, 400)
  }

  // Verify authenticator data RP ID hash matches
  const authData = parseAuthenticatorData(authenticatorDataBytes)
  if (!authData) return json({ error: "invalid authenticator data" }, 400)
  const authRpId = Deno.env.get("DENOMERGE_RP_ID") ?? new URL(expectedOrigin).hostname
  const expectedRpIdHashFromHost = await sha256(utf8(authRpId))
  let rpIdMatch = true
  for (let i = 0; i < 32; i++) {
    if (authData.rpIdHash[i] !== expectedRpIdHashFromHost[i]) {
      rpIdMatch = false
      break
    }
  }
  if (!rpIdMatch) return json({ error: "rpId mismatch" }, 400)

  await storeCredential(body.credentialId, body.accountId, publicKeySpki)
  return json({ ok: true })
}

// ---------------------------------------------------------------------------
// Route: GET /auth/challenge
// ---------------------------------------------------------------------------

function handleGetChallenge(req: Request): Response {
  if (req.method !== "GET") return methodNotAllowed()
  const url = new URL(req.url)
  const accountId = url.searchParams.get("accountId")
  if (!accountId) return json({ error: "missing accountId" }, 400)

  const challengeBytes = crypto.getRandomValues(new Uint8Array(32))
  const challenge = encodeBase64Url(challengeBytes)
  setChallenge(accountId, challenge)

  return json({
    challenge,
    rpId: Deno.env.get("DENOMERGE_RP_ID") ?? url.hostname,
    origin: Deno.env.get("DENOMERGE_ORIGIN") ?? url.origin,
  })
}

// ---------------------------------------------------------------------------
// Route: POST /auth/verify-prf
// Verify a PRF result and issue a short-lived sync session.
// ---------------------------------------------------------------------------

async function handleVerifyPrf(req: Request): Promise<Response> {
  if (req.method !== "POST") return methodNotAllowed()
  const body = await req.json() as {
    accountId: string
    prfResult: string // base64url
    saltHash: string // base64url of sha256(salt)
    challenge: string
    signature: string
    clientDataJSON: string
    authenticatorData: string
    credentialId: string
  }

  const challenge2 = getChallenge(body.accountId)
  if (!challenge2) return json({ error: "challenge expired or missing" }, 400)
  if (challenge2 !== body.challenge) return json({ error: "challenge mismatch" }, 400)

  // Verify the assertion signature over the challenge
  const credential = await getStoredCredential(body.credentialId, {
    namespace: SYNC_NAMESPACE,
    accountId: body.accountId,
    documentId: "auth",
    method: "GET",
  })
  if (!credential) return json({ error: "credential not found" }, 404)

  // Verify signature
  const clientDataBytes = decodeBase64Url(body.clientDataJSON)
  const authenticatorDataBytes = decodeBase64Url(body.authenticatorData)
  const signatureBytes = normalizeWebAuthnEcdsaSignature(decodeBase64Url(body.signature))

  // Import the stored SPKI key
  const publicKey = await crypto.subtle.importKey(
    "spki",
    decodeBase64Url(credential.publicKeySpkiBase64Url).buffer,
    { name: "ECDSA", namedCurve: "P-256", hash: "SHA-256" },
    false,
    ["verify"],
  )

  const clientDataHash = await sha256(clientDataBytes)
  const signedData = concatBytes(authenticatorDataBytes, clientDataHash)
  const valid = await crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    publicKey,
    signatureBytes,
    signedData.buffer,
  )

  if (!valid) return json({ error: "signature verification failed" }, 403)

  // Issue sync session: store a short-lived session token in KV
  const sessionId = encodeBase64Url(crypto.getRandomValues(new Uint8Array(16)))
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
  const keys = denomergeKvKeys({ namespace: SYNC_NAMESPACE, accountId: body.accountId })
  await kv.set(keys.syncSession(sessionId), { accountId: body.accountId, expiresAt })

  challenges.delete(body.accountId)

  return json({
    ok: true,
    sessionId,
    expiresAt,
    // Also return the prfSaltHash for client to include in subsequent sync requests
    prfSaltHash: body.saltHash,
  })
}

// ---------------------------------------------------------------------------
// Static file serving
// ---------------------------------------------------------------------------

const STATIC_FILES = new Map<string, string>([
  ["/", "index.html"],
  ["/style.css", "style.css"],
  ["/app.js", "dist/app.bundle.js"],
  ["/automerge_wasm_bg.wasm", "dist/automerge_wasm_bg.wasm"],
])

async function serveStatic(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const pathname = url.pathname
  const fileName = STATIC_FILES.get(pathname) ?? STATIC_FILES.get(pathname + "/") ??
    STATIC_FILES.get("/")

  if (!fileName) return json({ error: "not_found" }, 404)

  const filePath = `./${fileName}`
  try {
    const stat = await Deno.stat(filePath)
    if (!stat.isFile) return json({ error: "not_found" }, 404)
    const body = await Deno.readFile(filePath)
    const contentType = fileName.endsWith(".css")
      ? "text/css"
      : fileName.endsWith(".js")
      ? "application/javascript"
      : fileName.endsWith(".wasm")
      ? "application/wasm"
      : "text/html; charset=utf-8"
    return new Response(body, { headers: { "Content-Type": contentType } })
  } catch {
    return json({ error: "not_found" }, 404)
  }
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

function handler(req: Request): Response | Promise<Response> {
  const url = new URL(req.url)

  if (url.pathname === "/auth/register" && req.method === "POST") {
    return handleRegister(req)
  }
  if (url.pathname === "/auth/challenge" && req.method === "GET") {
    return handleGetChallenge(req)
  }
  if (url.pathname === "/auth/verify-prf" && req.method === "POST") {
    return handleVerifyPrf(req)
  }

  // Sync endpoint
  if (url.pathname.startsWith("/sync/")) {
    return syncHandler(req)
  }

  // Static files
  return serveStatic(req)
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function json(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })
}

function methodNotAllowed(): Response {
  return json({ error: "method_not_allowed" }, 405)
}

function concatBytes(...chunks: Uint8Array[]): Uint8Array {
  const size = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
  const out = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.byteLength
  }
  return out
}

function decodeBase64Url(value: string): Uint8Array {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=")
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))
}

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

const port = Number(Deno.env.get("PORT") ?? 8000)
console.log(`denomerge example server listening on :${port}`)
Deno.serve({ port }, handler)
