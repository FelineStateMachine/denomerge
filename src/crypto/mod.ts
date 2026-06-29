export async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", asArrayBuffer(data))
  return new Uint8Array(digest)
}

function asArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.slice().buffer
}

export function concatBytes(...chunks: Uint8Array[]): Uint8Array {
  const size = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
  const out = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.byteLength
  }
  return out
}

export function utf8(value: string): Uint8Array {
  return new TextEncoder().encode(value)
}

export async function hkdfSha256(
  inputKeyMaterial: Uint8Array,
  salt: Uint8Array,
  info: Uint8Array,
  length: number,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    asArrayBuffer(inputKeyMaterial),
    "HKDF",
    false,
    ["deriveBits"],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: asArrayBuffer(salt), info: asArrayBuffer(info) },
    key,
    length * 8,
  )
  return new Uint8Array(bits)
}
