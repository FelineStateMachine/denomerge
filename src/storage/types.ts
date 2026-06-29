export interface LocalDocStore<
  TDocId extends string = string,
  TBytes extends Uint8Array = Uint8Array,
> {
  load(documentId: TDocId): Promise<TBytes | undefined>
  save(documentId: TDocId, bytes: TBytes): Promise<void>
  remove(documentId: TDocId): Promise<void>
}

export interface IndexedDbStoreOptions {
  databaseName?: string
  storeName?: string
}
