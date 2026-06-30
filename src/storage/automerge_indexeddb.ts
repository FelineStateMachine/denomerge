import { Repo } from "@automerge/automerge-repo"
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb"

export interface BrowserAutomergeRepoOptions {
  databaseName?: string
  storageAdapter?: unknown
  createStorageAdapter?: (databaseName?: string) => unknown
}

export interface BrowserAutomergeRepoConfig {
  storage: unknown
}

export function createIndexedDbStorageAdapter(databaseName?: string): unknown {
  return new IndexedDBStorageAdapter(databaseName)
}

export function createBrowserAutomergeRepoConfig(
  options: BrowserAutomergeRepoOptions = {},
): BrowserAutomergeRepoConfig {
  return {
    storage: options.storageAdapter ??
      (options.createStorageAdapter ?? createIndexedDbStorageAdapter)(options.databaseName),
  }
}

export function createBrowserAutomergeRepo(options: BrowserAutomergeRepoOptions = {}): Repo {
  return new Repo(
    createBrowserAutomergeRepoConfig(options) as ConstructorParameters<typeof Repo>[0],
  )
}
