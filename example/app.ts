/**
 * example/app.ts
 * Browser-side todo app — WebAuthn PRF auth, Automerge CRDT documents,
 * IndexedDB persistence via AutomergeRepo, and denomerge KV sync.
 */

import {
  clone,
  createBrowserAutomergeRepo,
  getAllChanges,
  getChanges,
  isValidAutomergeUrl,
  load,
  merge,
  save,
  type AutomergeUrl,
  type DocHandle,
} from "@felinestatemachine/denomerge"

// ---------------------------------------------------------------------------
// DOM refs
// ---------------------------------------------------------------------------

const $login = document.getElementById("login") as HTMLButtonElement
const $register = document.getElementById("register") as HTMLButtonElement
const $logout = document.getElementById("logout") as HTMLButtonElement
const $userId = document.getElementById("userId") as HTMLElement
const $status = document.getElementById("status") as HTMLElement
const $todos = document.getElementById("todos") as HTMLUListElement
const $newTodo = document.getElementById("newTodo") as HTMLInputElement
const $addBtn = document.getElementById("addBtn") as HTMLButtonElement

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ORIGIN = self.location.origin
const NAMESPACE = "test-todo"
const DOCUMENT_ID = "todo-doc-1"
const ACCOUNT_ID = localStorage.getItem("test-todo-account") || crypto.randomUUID()
localStorage.setItem("test-todo-account", ACCOUNT_ID)

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const accountId = ACCOUNT_ID
let credentialId = localStorage.getItem("test-todo-cred-id") ?? null
let sessionId: string | null = null
let sessionExpiresAt: Date | null = null
let prfSalt: Uint8Array | null = null

// ---------------------------------------------------------------------------
// Automerge document
// ---------------------------------------------------------------------------

interface Todo { id: number; text: string; done: boolean }
interface TodoDoc { todos: Todo[] }

// Use a distinct DB name from the old plain-IndexedDB storage ("test-todo")
// so IndexedDBStorageAdapter can create its own schema without conflict.
const repo = createBrowserAutomergeRepo({ databaseName: "test-todo-repo" })
let handle: DocHandle<TodoDoc>

async function initDoc(): Promise<Todo[]> {
  const storedUrl = localStorage.getItem("test-todo-doc-url")
  if (storedUrl && isValidAutomergeUrl(storedUrl)) {
    handle = repo.find<TodoDoc>(storedUrl as AutomergeUrl)
  } else {
    handle = repo.create<TodoDoc>({ todos: [] })
    localStorage.setItem("test-todo-doc-url", handle.url)
  }
  await handle.whenReady()
  return getTodos()
}

function getTodos(): Todo[] {
  return [...(handle.doc()?.todos ?? [])]
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

function b64urlEncode(bytes: Uint8Array | ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}

function b64urlDecode(value: string): Uint8Array {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=")
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
}

async function sha256(bytes: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))
}

async function hkdf(key: Uint8Array, salt: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
  const imported = await crypto.subtle.importKey("raw", key, "HKDF", false, ["deriveBits"])
  return new Uint8Array(
    await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, imported, length * 8),
  )
}

async function deriveSyncKeys(prfOutput: Uint8Array, salt: Uint8Array) {
  const material = await hkdf(
    prfOutput, salt,
    new TextEncoder().encode("denomerge/sync-key-material/v1"),
    64,
  )
  return { authKey: material.slice(0, 32), encryptionKey: material.slice(32, 64) }
}

// ---------------------------------------------------------------------------
// Server API helpers
// ---------------------------------------------------------------------------

async function api(url: string, options: RequestInit = {}): Promise<unknown> {
  const res = await fetch(`${ORIGIN}${url}`, {
    headers: { "Content-Type": "application/json", ...(options.headers as Record<string, string> ?? {}) },
    ...options,
  })
  if (!res.ok) throw new Error(`API ${options.method ?? "GET"} ${url} → ${res.status}`)
  return res.json()
}

// ---------------------------------------------------------------------------
// WebAuthn PRF
// ---------------------------------------------------------------------------

async function registerResidentKey() {
  const rpId = self.location.hostname
  const userId = crypto.getRandomValues(new Uint8Array(32))
  const challenge = crypto.getRandomValues(new Uint8Array(32))

  const cred = await navigator.credentials.create({
    publicKey: {
      rp: { id: rpId, name: "test-todo" },
      user: { id: userId, name: "test-todo user", displayName: "test-todo user" },
      challenge,
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      authenticatorSelection: { residentKey: "required", requireResidentKey: true, userVerification: "required" },
      extensions: { credProps: true, prf: {} },
    },
  }) as PublicKeyCredential | null

  if (!cred) throw new Error("No credential returned")
  const resp = cred.response as AuthenticatorAttestationResponse

  const rawId = b64urlEncode(cred.rawId)
  const clientDataJSON = b64urlEncode(new Uint8Array(resp.clientDataJSON))

  // AuthenticatorAttestationResponse exposes authenticatorData via method, not direct property
  const authenticatorDataBuffer = resp.getAuthenticatorData()
  if (!authenticatorDataBuffer) throw new Error("Could not get authenticatorData")
  const authenticatorData = b64urlEncode(new Uint8Array(authenticatorDataBuffer))

  let publicKeySpki: string | null = null
  const pkBuf = resp.getPublicKey()
  if (pkBuf) publicKeySpki = b64urlEncode(new Uint8Array(pkBuf))
  if (!publicKeySpki) throw new Error("Could not extract credential public key")

  await api("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      accountId,
      credentialId: rawId,
      attestationData: { clientDataJSON, authenticatorData, publicKey: publicKeySpki },
    }),
  })

  credentialId = rawId
  localStorage.setItem("test-todo-cred-id", credentialId)
  setStatus("Registered! Now authenticate to start syncing.")
  $userId.textContent = `Account: ${accountId.slice(0, 8)}…`
  $register.style.display = "none"
  $login.style.display = "inline-block"
}

async function authenticateAndGetSyncSession() {
  if (!credentialId) { setStatus("No credential found. Please register first."); return }

  const { challenge, rpId } = await api(
    `/auth/challenge?accountId=${encodeURIComponent(accountId)}`,
  ) as { challenge: string; rpId: string }

  const saltBytes = crypto.getRandomValues(new Uint8Array(32))
  prfSalt = saltBytes
  const saltHash = b64urlEncode(await sha256(saltBytes))
  const encodedChallenge = typeof challenge === "string" ? challenge : b64urlEncode(challenge as unknown as Uint8Array)

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: b64urlDecode(encodedChallenge),
      rpId,
      allowCredentials: [{ type: "public-key", id: b64urlDecode(credentialId) }],
      userVerification: "required",
      extensions: { prf: { eval: { first: saltBytes } } },
    },
  }) as PublicKeyCredential | null

  if (!assertion) throw new Error("No assertion returned")
  const aResp = assertion.response as AuthenticatorAssertionResponse

  const clientDataJSON = b64urlEncode(new Uint8Array(aResp.clientDataJSON))
  const authenticatorData = b64urlEncode(new Uint8Array(aResp.authenticatorData))
  const signature = aResp.signature ? b64urlEncode(new Uint8Array(aResp.signature)) : null

  const extResults = assertion.getClientExtensionResults() as { prf?: { results?: { first?: ArrayBuffer } } }
  const prfResult = extResults?.prf?.results?.first ? new Uint8Array(extResults.prf.results.first) : null
  if (!prfResult) throw new Error("No PRF result from authenticator")

  await deriveSyncKeys(prfResult, saltBytes)

  const verifyRes = await api("/auth/verify-prf", {
    method: "POST",
    body: JSON.stringify({ accountId, prfResult: b64urlEncode(prfResult), saltHash, challenge: encodedChallenge, signature, clientDataJSON, authenticatorData, credentialId }),
  }) as { sessionId: string; expiresAt: string }

  sessionId = verifyRes.sessionId
  sessionExpiresAt = new Date(verifyRes.expiresAt)
  localStorage.setItem("test-todo-session", sessionId)
  localStorage.setItem("test-todo-session-expires", sessionExpiresAt.toISOString())

  setStatus(`Logged in! Session expires ${sessionExpiresAt.toLocaleTimeString()}`)
  $userId.textContent = `Account: ${accountId.slice(0, 8)}…`
  $logout.style.display = "inline-block"
  $login.style.display = "none"

  await loadAndRenderTodos()
}

// ---------------------------------------------------------------------------
// Sync
// ---------------------------------------------------------------------------

function buildSyncProof() {
  if (!sessionId || !sessionExpiresAt) throw new Error("No active sync session")
  return { sessionId, expiresAt: sessionExpiresAt.toISOString() }
}

async function pushToServer(): Promise<void> {
  if (!sessionId || !sessionExpiresAt || sessionExpiresAt < new Date()) return
  const doc = handle.doc()
  if (!doc) return
  const bytes = save(doc)
  const res = await fetch(`${ORIGIN}/sync/${NAMESPACE}/${accountId}/${DOCUMENT_ID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-denomerge-sync-proof": JSON.stringify(buildSyncProof()) },
    body: JSON.stringify({ bytesBase64: b64urlEncode(bytes) }),
  })
  if (!res.ok) console.warn("[sync] push failed:", res.status, await res.text())
}

async function loadAndRenderTodos(): Promise<void> {
  if (!sessionId || !sessionExpiresAt || sessionExpiresAt < new Date()) return

  try {
    const res = await fetch(`${ORIGIN}/sync/${NAMESPACE}/${accountId}/${DOCUMENT_ID}`, {
      headers: { "x-denomerge-sync-proof": JSON.stringify(buildSyncProof()) },
    })
    if (res.ok && res.status !== 204) {
      const data = await res.json() as { bytesBase64?: string }
      if (data.bytesBase64) {
        const remoteDoc = load<TodoDoc>(b64urlDecode(data.bytesBase64))
        const localDoc = handle.doc()!
        // CRDT merge: bring in remote changes that local doesn't have
        const merged = merge(clone(localDoc), remoteDoc)
        const incoming = getChanges(localDoc, merged)
        if (incoming.length > 0) {
          const mergedTodos = [...merged.todos]
          handle.change((d) => {
            while (d.todos.length > 0) d.todos.pop()
            for (const t of mergedTodos) d.todos.push({ id: t.id, text: t.text, done: t.done })
          })
        }
      }
    }
  } catch (e) {
    console.warn("[sync] pull failed:", e)
  }

  renderTodos(getTodos())
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function renderTodos(items: Todo[]) {
  $todos.innerHTML = ""
  items.forEach((todo, i) => {
    const li = document.createElement("li")
    li.className = todo.done ? "done" : ""

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = !!todo.done
    checkbox.addEventListener("change", () => toggleTodo(i))

    const label = document.createElement("span")
    label.textContent = todo.text

    const del = document.createElement("button")
    del.textContent = "×"
    del.addEventListener("click", () => deleteTodo(i))

    li.append(checkbox, label, del)
    $todos.appendChild(li)
  })
}

function setStatus(msg: string) {
  $status.textContent = msg
  console.log("[test-todo]", msg)
}

// ---------------------------------------------------------------------------
// Todo mutations — all go through Automerge change()
// ---------------------------------------------------------------------------

async function addTodo(text: string) {
  if (!text.trim()) return
  handle.change((d) => { d.todos.push({ id: Date.now(), text: text.trim(), done: false }) })
  renderTodos(getTodos())
  await pushToServer()
}

async function toggleTodo(index: number) {
  handle.change((d) => { if (d.todos[index]) d.todos[index].done = !d.todos[index].done })
  renderTodos(getTodos())
  await pushToServer()
}

async function deleteTodo(index: number) {
  handle.change((d) => { d.todos.splice(index, 1) })
  renderTodos(getTodos())
  await pushToServer()
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------

$register.addEventListener("click", async () => {
  try { setStatus("Registering passkey…"); await registerResidentKey() }
  catch (e) { setStatus(`Registration failed: ${(e as Error).message}`) }
})

$login.addEventListener("click", async () => {
  try { setStatus("Authenticating…"); await authenticateAndGetSyncSession() }
  catch (e) { setStatus(`Login failed: ${(e as Error).message}`) }
})

$logout.addEventListener("click", () => {
  sessionId = null; sessionExpiresAt = null; prfSalt = null
  localStorage.removeItem("test-todo-session")
  localStorage.removeItem("test-todo-session-expires")
  setStatus("Logged out.")
  $logout.style.display = "none"
  $login.style.display = "inline-block"
  $register.style.display = "inline-block"
  $todos.innerHTML = ""
})

$addBtn.addEventListener("click", async () => { await addTodo($newTodo.value); $newTodo.value = "" })
$newTodo.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") { await addTodo($newTodo.value); $newTodo.value = "" }
})

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

async function init() {
  const storedSession = localStorage.getItem("test-todo-session")
  const storedExpires = localStorage.getItem("test-todo-session-expires")

  const todos = await initDoc()

  if (storedSession && storedExpires) {
    sessionId = storedSession
    sessionExpiresAt = new Date(storedExpires)
    if (sessionExpiresAt > new Date()) {
      setStatus(`Session active until ${sessionExpiresAt.toLocaleTimeString()}`)
      $userId.textContent = `Account: ${accountId.slice(0, 8)}…`
      $logout.style.display = "inline-block"
      $login.style.display = "none"
      $register.style.display = "none"
      renderTodos(todos)
      await loadAndRenderTodos()
      return
    }
  }

  $userId.textContent = `Account: ${accountId.slice(0, 8)}…`
  setStatus("Please register or log in to start syncing.")
  renderTodos(todos)
}

init()
