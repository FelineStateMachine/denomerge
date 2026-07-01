import { Repo } from "@automerge/automerge-repo"
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb"

export function createBrowserAutomergeRepo(databaseName = "automerge"): Repo {
  return new Repo({ storage: new IndexedDBStorageAdapter(databaseName) })
}
