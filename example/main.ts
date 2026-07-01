/**
 * example/main.ts
 * Deno Deploy server: serves the todo app and exposes the KV sync endpoint.
 *
 * Auth flow:
 * - Registration: store the credential's SPKI public key in KV.
 * - Login (verify-prf): use createWebAuthnSyncProofVerifier to check the assertion,
 *   then issue a short-lived session token.
 * - Sync: the session token in x-denomerge-sync-proof authorises GET/PUT without
 *   a WebAuthn round-trip on every request.
 */

import {
  createKvSyncHandler,
  createLogger,
  createWebAuthnSyncProofVerifier,
  decodeBase64Url,
  denomergeKvKeys,
  encodeBase64Url,
  sha256,
  utf8,
  type StoredCredentialPublicKey,
  type SyncAuthProof,
  type SyncRequestContext,
  type VerifySyncProof,
} from "../src/index.ts"

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

const log = createLogger("test-todo", { level: "debug" })

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

async function getStoredCredential(
  credentialId: string,
  context: SyncRequestContext,
): Promise<StoredCredential | undefined> {
  const keys = denomergeKvKeys({ namespace: SYNC_NAMESPACE, accountId: context.accountId })
  const entry = await kv.get<StoredCredential>(keys.credential(credentialId))
  return entry.value ?? undefined
}

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
// WebAuthn assertion verifier
// ---------------------------------------------------------------------------

// Verifies a full WebAuthn assertion: origin, RP ID hash, flags, and ECDSA signature.
// Used in handleVerifyPrf to authenticate the login ceremony.
const webAuthnVerifier = createWebAuthnSyncProofVerifier({
  rpId: (context) =>
    Deno.env.get("DENOMERGE_RP_ID") ?? context.requestRpId ?? "localhost",
  origin: (context) =>
    Deno.env.get("DENOMERGE_ORIGIN") ?? context.requestOrigin ?? "http://localhost:8000",
  getCredential: async (credentialId, context): Promise<StoredCredentialPublicKey | undefined> =>
    await getStoredCredential(credentialId, context),
})

// ---------------------------------------------------------------------------
// Sync proof verifier (session-based)
// ---------------------------------------------------------------------------

// Session-based sync proof: the sessionId issued at login authorises sync for its lifetime,
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
// Helper: parse authenticator data (registration only)
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
// ---------------------------------------------------------------------------

async function handleRegister(req: Request): Promise<Response> {
  if (req.method !== "POST") return methodNotAllowed()
  const body = await req.json() as {
    accountId: string
    credentialId: string
    attestationData: { clientDataJSON: string; authenticatorData: string; publicKey: string }
  }

  if (!body.accountId || !body.credentialId || !body.attestationData) {
    log.warn("register: missing fields", { accountId: body.accountId })
    return json({ error: "missing fields" }, 400)
  }

  const clientDataBytes = decodeBase64Url(body.attestationData.clientDataJSON)
  const authenticatorDataBytes = decodeBase64Url(body.attestationData.authenticatorData)
  const publicKeySpki = decodeBase64Url(body.attestationData.publicKey)

  const clientData = JSON.parse(new TextDecoder().decode(clientDataBytes)) as { origin?: string }
  const expectedOrigin = Deno.env.get("DENOMERGE_ORIGIN") ?? new URL(req.url).origin
  if (clientData.origin !== expectedOrigin) {
    log.warn("register: origin mismatch", { got: clientData.origin, expected: expectedOrigin })
    return json({ error: "origin mismatch" }, 400)
  }

  const authData = parseAuthenticatorData(authenticatorDataBytes)
  if (!authData) return json({ error: "invalid authenticator data" }, 400)
  const authRpId = Deno.env.get("DENOMERGE_RP_ID") ?? new URL(expectedOrigin).hostname
  const expectedRpIdHash = await sha256(utf8(authRpId))
  let rpIdMatch = true
  for (let i = 0; i < 32; i++) {
    if (authData.rpIdHash[i] !== expectedRpIdHash[i]) { rpIdMatch = false; break }
  }
  if (!rpIdMatch) {
    log.warn("register: rpId mismatch", { accountId: body.accountId })
    return json({ error: "rpId mismatch" }, 400)
  }

  await storeCredential(body.credentialId, body.accountId, publicKeySpki)
  log.info("register: credential stored", { accountId: body.accountId, credentialId: body.credentialId })
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
// Verify the WebAuthn assertion and issue a short-lived sync session.
// ---------------------------------------------------------------------------

async function handleVerifyPrf(req: Request): Promise<Response> {
  if (req.method !== "POST") return methodNotAllowed()
  const body = await req.json() as {
    accountId: string
    credentialId: string
    challenge: string
    prfResult: string
    saltHash: string
    clientDataJSON: string
    authenticatorData: string
    signature: string
  }

  const storedChallenge = getChallenge(body.accountId)
  if (!storedChallenge) return json({ error: "challenge expired or missing" }, 400)
  if (storedChallenge !== body.challenge) return json({ error: "challenge mismatch" }, 400)

  const url = new URL(req.url)
  const proof: SyncAuthProof = {
    credentialId: body.credentialId,
    challenge: body.challenge,
    signature: body.signature,
    clientDataJSON: body.clientDataJSON,
    authenticatorData: body.authenticatorData,
    prfSaltHash: body.saltHash,
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  }
  const context: SyncRequestContext = {
    namespace: SYNC_NAMESPACE,
    accountId: body.accountId,
    documentId: "auth",
    method: "GET",
    requestOrigin: url.origin,
    requestRpId: url.hostname,
  }

  if (!(await webAuthnVerifier(proof, context))) {
    log.warn("verify-prf: signature invalid", { accountId: body.accountId })
    return json({ error: "signature verification failed" }, 403)
  }

  const sessionId = encodeBase64Url(crypto.getRandomValues(new Uint8Array(16)))
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
  const keys = denomergeKvKeys({ namespace: SYNC_NAMESPACE, accountId: body.accountId })
  await kv.set(keys.syncSession(sessionId), { accountId: body.accountId, expiresAt })
  log.info("verify-prf: session issued", { accountId: body.accountId, expiresAt })

  challenges.delete(body.accountId)

  return json({ ok: true, sessionId, expiresAt, prfSaltHash: body.saltHash })
}

// ---------------------------------------------------------------------------
// Static file serving
// ---------------------------------------------------------------------------

const STATIC_FILES = new Map<string, string>([
  ["/", "index.html"],
  ["/style.css", "style.css"],
  ["/app.js", "dist/app.bundle.js"],
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

  if (url.pathname === "/auth/register" && req.method === "POST") return handleRegister(req)
  if (url.pathname === "/auth/challenge" && req.method === "GET") return handleGetChallenge(req)
  if (url.pathname === "/auth/verify-prf" && req.method === "POST") return handleVerifyPrf(req)
  if (url.pathname.startsWith("/sync/")) return syncHandler(req)

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

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

const port = Number(Deno.env.get("PORT") ?? 8000)
log.info("server starting", { port })
Deno.serve({ port }, handler)
