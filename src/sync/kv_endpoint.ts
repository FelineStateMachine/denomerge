import { denomergeKvKeys, type KvKey } from "../kv/mod.ts"
import { type SyncAuthProof } from "./types.ts"

export interface KvEntry<T> {
  value: T | null
}

export interface KvLike {
  get<T>(key: KvKey): Promise<KvEntry<T>>
  set<T>(key: KvKey, value: T): Promise<unknown>
  delete(key: KvKey): Promise<unknown>
}

export interface StoredSyncDocument {
  bytesBase64: string
  updatedAt: string
}

export type VerifySyncProof = (
  proof: SyncAuthProof,
  context: SyncRequestContext,
) => boolean | Promise<boolean>

export interface SyncRequestContext {
  namespace: string
  accountId: string
  documentId: string
  method: "GET" | "PUT" | "DELETE"
}

export interface CreateKvSyncHandlerOptions {
  kv: KvLike
  verifyProof: VerifySyncProof
  now?: () => Date
}

export type KvSyncHandler = (request: Request) => Promise<Response>

export function createKvSyncHandler(options: CreateKvSyncHandlerOptions): KvSyncHandler {
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url)
    const match = url.pathname.match(/^\/sync\/([^/]+)\/([^/]+)\/([^/]+)$/)
    if (!match) return json({ error: "not_found" }, 404)

    const method = request.method as SyncRequestContext["method"]
    if (method !== "GET" && method !== "PUT" && method !== "DELETE") {
      return json({ error: "method_not_allowed" }, 405)
    }

    const [, namespace, accountId, documentId] = match.map(decodeURIComponent)
    const context: SyncRequestContext = { namespace, accountId, documentId, method }
    const proof = readProof(request)
    if (!proof) return json({ error: "missing_sync_proof" }, 401)

    const expiresAt = Date.parse(proof.expiresAt)
    if (!Number.isFinite(expiresAt) || expiresAt <= (options.now?.() ?? new Date()).getTime()) {
      return json({ error: "expired_sync_proof" }, 401)
    }

    if (!(await options.verifyProof(proof, context))) {
      return json({ error: "invalid_sync_proof" }, 403)
    }

    const key = denomergeKvKeys({ namespace, accountId }).document(documentId)
    if (method === "GET") {
      const entry = await options.kv.get<StoredSyncDocument>(key)
      if (!entry.value) return new Response(null, { status: 204 })
      return json(entry.value)
    }

    if (method === "DELETE") {
      await options.kv.delete(key)
      return json({ ok: true })
    }

    const body = await request.json() as Partial<StoredSyncDocument>
    if (typeof body.bytesBase64 !== "string") return json({ error: "missing_bytesBase64" }, 400)
    const record: StoredSyncDocument = {
      bytesBase64: body.bytesBase64,
      updatedAt: (options.now?.() ?? new Date()).toISOString(),
    }
    await options.kv.set(key, record)
    return json(record, 201)
  }
}

function readProof(request: Request): SyncAuthProof | undefined {
  const raw = request.headers.get("x-denomerge-sync-proof")
  if (!raw) return undefined
  try {
    return JSON.parse(raw) as SyncAuthProof
  } catch {
    return undefined
  }
}

function json(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  })
}
