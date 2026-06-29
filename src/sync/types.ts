export interface SyncAuthProof {
  credentialId: string
  challenge: string
  signature: string
  clientDataJSON: string
  authenticatorData: string
  prfSaltHash: string
  expiresAt: string
}

export interface SyncTransport<TDocId extends string = string> {
  pull(documentId: TDocId, proof: SyncAuthProof): Promise<Uint8Array | undefined>
  push(documentId: TDocId, bytes: Uint8Array, proof: SyncAuthProof): Promise<void>
}

export interface SyncPolicy {
  isKeyPresent: boolean
  expiresAt: Date
}

export function canSync(policy: SyncPolicy, now: Date = new Date()): boolean {
  return policy.isKeyPresent && policy.expiresAt.getTime() > now.getTime()
}
