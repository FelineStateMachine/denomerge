import { concatBytes, sha256, utf8 } from "../crypto/mod.ts"

export const DENOMERGE_PRF_LABEL = "denomerge sync v1"

export type PublicKeyCredentialDescriptorLike = {
  type: "public-key"
  id: Uint8Array
}

export type PrfRegistrationOptions = {
  rp: { id: string; name: string }
  user: { id: Uint8Array; name: string; displayName: string }
  challenge: Uint8Array
  pubKeyCredParams: Array<{ type: "public-key"; alg: number }>
  authenticatorSelection: {
    residentKey: "required"
    requireResidentKey: true
    userVerification: "required"
  }
  extensions: { credProps: true; prf: Record<string, never> }
}

export type PrfAuthenticationOptions = {
  rpId: string
  challenge: Uint8Array
  allowCredentials?: PublicKeyCredentialDescriptorLike[]
  userVerification: "required"
  extensions: { prf: { eval: { first: Uint8Array } } }
}

export type PublicKeyCredentialWithPrf = {
  getClientExtensionResults(): {
    prf?: { results?: { first?: ArrayBuffer } }
  }
}

export interface PrfSaltInput {
  /** Stable relying-party or app namespace, for example example.com or com.example.app. */
  rpId: string
  /** Stable user/document realm. Do not put secrets here. */
  realm: string
  /** Optional document id or collection id to scope derived material. */
  scope?: string
}

export async function deriveDenomergePrfSalt(input: PrfSaltInput): Promise<Uint8Array> {
  return await sha256(
    concatBytes(
      utf8(DENOMERGE_PRF_LABEL),
      new Uint8Array([0]),
      utf8(input.rpId),
      new Uint8Array([0]),
      utf8(input.realm),
      new Uint8Array([0]),
      utf8(input.scope ?? "sync"),
    ),
  )
}

export interface BuildRegistrationOptionsInput {
  rpId: string
  rpName: string
  userId: Uint8Array
  userName: string
  userDisplayName: string
  challenge: Uint8Array
}

export function buildPrfRegistrationOptions(
  input: BuildRegistrationOptionsInput,
): PrfRegistrationOptions {
  return {
    rp: { id: input.rpId, name: input.rpName },
    user: {
      id: input.userId,
      name: input.userName,
      displayName: input.userDisplayName,
    },
    challenge: input.challenge,
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },
      { type: "public-key", alg: -257 },
    ],
    authenticatorSelection: {
      residentKey: "required",
      requireResidentKey: true,
      userVerification: "required",
    },
    extensions: {
      credProps: true,
      prf: {},
    },
  }
}

export interface BuildAuthenticationOptionsInput {
  rpId: string
  challenge: Uint8Array
  salt: Uint8Array
  allowCredentialIds?: Uint8Array[]
}

export function buildPrfAuthenticationOptions(
  input: BuildAuthenticationOptionsInput,
): PrfAuthenticationOptions {
  return {
    rpId: input.rpId,
    challenge: input.challenge,
    allowCredentials: input.allowCredentialIds?.map((id) => ({ type: "public-key", id })),
    userVerification: "required",
    extensions: {
      prf: {
        eval: { first: input.salt },
      },
    },
  }
}

export function getFirstPrfResult(credential: PublicKeyCredentialWithPrf): Uint8Array | undefined {
  const first = credential.getClientExtensionResults().prf?.results?.first
  return first ? new Uint8Array(first) : undefined
}
