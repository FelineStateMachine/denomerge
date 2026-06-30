import { assertEquals } from "@std/assert"
import { createBrowserAutomergeRepo, createBrowserAutomergeRepoConfig } from "../src/index.ts"

Deno.test("browser Automerge repo config uses injectable IndexedDB storage adapter factory", () => {
  const fakeStorage = { kind: "mock-indexeddb" }
  const seenDatabaseNames: Array<string | undefined> = []

  const config = createBrowserAutomergeRepoConfig({
    databaseName: "denomerge-test",
    createStorageAdapter: (databaseName) => {
      seenDatabaseNames.push(databaseName)
      return fakeStorage
    },
  })

  assertEquals(config.storage, fakeStorage)
  assertEquals(seenDatabaseNames, ["denomerge-test"])
})

Deno.test("browser Automerge repo factory accepts a mocked storage adapter", () => {
  const repo = createBrowserAutomergeRepo({
    storageAdapter: {
      load: () => Promise.resolve(undefined),
      loadRange: () => Promise.resolve([]),
      remove: () => Promise.resolve(),
      save: () => Promise.resolve(),
    },
  })

  assertEquals(typeof repo, "object")
})
