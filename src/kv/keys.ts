export type KvKey = readonly [string, ...Array<string | number | boolean | Uint8Array>]

export interface DenomergeKvKeyInput {
  namespace: string
  accountId: string
}

export interface DenomergeKvKeys {
  account(): KvKey
  credential(credentialIdHash: string): KvKey
  document(documentId: string): KvKey
  documentClock(documentId: string): KvKey
  documentChunk(documentId: string, chunkIndex: number): KvKey
  syncSession(sessionId: string): KvKey
}

export function denomergeKvKeys(input: DenomergeKvKeyInput): DenomergeKvKeys {
  const prefix = ["denomerge", input.namespace, input.accountId] as const
  return {
    account: () => [...prefix, "account"] as KvKey,
    credential: (credentialIdHash: string) => [...prefix, "credential", credentialIdHash] as KvKey,
    document: (documentId: string) => [...prefix, "doc", documentId] as KvKey,
    documentClock: (documentId: string) => [...prefix, "doc-clock", documentId] as KvKey,
    documentChunk: (documentId: string, chunkIndex: number) =>
      [...prefix, "doc-chunk", documentId, chunkIndex] as KvKey,
    syncSession: (sessionId: string) => [...prefix, "sync-session", sessionId] as KvKey,
  }
}
