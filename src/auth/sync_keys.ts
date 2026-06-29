import { hkdfSha256, utf8 } from "../crypto/mod.ts"

export interface DerivedSyncKeys {
  authKey: Uint8Array
  encryptionKey: Uint8Array
}

export async function deriveSyncKeys(
  prfOutput: Uint8Array,
  salt: Uint8Array,
): Promise<DerivedSyncKeys> {
  const material = await hkdfSha256(prfOutput, salt, utf8("denomerge/sync-key-material/v1"), 64)
  return {
    authKey: material.slice(0, 32),
    encryptionKey: material.slice(32, 64),
  }
}
