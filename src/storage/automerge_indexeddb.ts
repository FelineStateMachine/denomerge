import { Repo } from "@automerge/automerge-repo"
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb"

export interface BrowserAutomergeRepoOptions {
  databaseName?: string
}

export function createBrowserAutomergeRepo(options: BrowserAutomergeRepoOptions = {}): Repo {
  return new Repo({
    storage: new IndexedDBStorageAdapter(options.databaseName),
  })
}
