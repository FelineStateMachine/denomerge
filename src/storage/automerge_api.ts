// Re-export the Automerge document API and automerge-repo types so that
// downstream users only need to depend on denomerge, not @automerge/* directly.
export {
  clone,
  getAllChanges,
  getChanges,
  load,
  merge,
  save,
} from "@automerge/automerge"
export type { Doc, Heads } from "@automerge/automerge"

export {
  isValidAutomergeUrl,
  Repo,
} from "@automerge/automerge-repo"
export type { AutomergeUrl, DocHandle } from "@automerge/automerge-repo"
