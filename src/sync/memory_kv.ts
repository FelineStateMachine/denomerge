import { type KvKey } from "../kv/mod.ts"
import { type KvEntry, type KvLike } from "./kv_endpoint.ts"

export class MemoryKv implements KvLike {
  #values = new Map<string, unknown>()

  get<T>(key: KvKey): Promise<KvEntry<T>> {
    return Promise.resolve({ value: (this.#values.get(encodeKey(key)) as T | undefined) ?? null })
  }

  set<T>(key: KvKey, value: T): Promise<void> {
    this.#values.set(encodeKey(key), value)
    return Promise.resolve()
  }

  delete(key: KvKey): Promise<void> {
    this.#values.delete(encodeKey(key))
    return Promise.resolve()
  }
}

function encodeKey(key: KvKey): string {
  return JSON.stringify(key)
}
