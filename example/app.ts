import {
  clone,
  createBrowserAutomergeRepo,
  createLogger,
  getChanges,
  isValidAutomergeUrl,
  load,
  merge,
  save,
  type AutomergeUrl,
  type DocHandle,
} from "@felinestatemachine/denomerge"

const log = createLogger("test-todo", { level: "debug" })

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Todo { id: number; text: string; done: boolean }
interface TodoDoc { todos: Todo[] }

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ORIGIN = location.origin
const NAMESPACE = "test-todo"
const DOCUMENT_ID = "todo-doc-1"

const KEYS = {
  account: "test-todo-account",
  credId: "test-todo-cred-id",
  session: "test-todo-session",
  sessionExpires: "test-todo-session-expires",
  docUrl: "test-todo-doc-url",
} as const

// ---------------------------------------------------------------------------
// Auth state
// ---------------------------------------------------------------------------

const accountId = localStorage.getItem(KEYS.account) ?? crypto.randomUUID()
localStorage.setItem(KEYS.account, accountId)

let credentialId = localStorage.getItem(KEYS.credId)
let sessionId: string | null = null
let sessionExpiresAt: Date | null = null

function sessionActive(): boolean {
  return !!sessionId && !!sessionExpiresAt && sessionExpiresAt > new Date()
}

// ---------------------------------------------------------------------------
// Automerge document
// ---------------------------------------------------------------------------

const repo = createBrowserAutomergeRepo("test-todo-repo")
let handle: DocHandle<TodoDoc>

async function initDoc(): Promise<void> {
  const storedUrl = localStorage.getItem(KEYS.docUrl)
  if (storedUrl && isValidAutomergeUrl(storedUrl)) {
    try {
      handle = repo.find<TodoDoc>(storedUrl as AutomergeUrl)
      await handle.whenReady()
      log.debug("doc loaded from storage", { url: storedUrl })
      return
    } catch (e) {
      log.warn("stored doc URL not found, creating fresh", { url: storedUrl, err: String(e) })
      localStorage.removeItem(KEYS.docUrl)
    }
  }
  handle = repo.create<TodoDoc>({ todos: [] })
  localStorage.setItem(KEYS.docUrl, handle.url)
  await handle.whenReady()
  log.debug("new doc created", { url: handle.url })
}

function getTodos(): Todo[] {
  return [...(handle.docSync()?.todos ?? [])]
}

// ---------------------------------------------------------------------------
// DOM
// ---------------------------------------------------------------------------

const $login = document.getElementById("login") as HTMLButtonElement
const $register = document.getElementById("register") as HTMLButtonElement
const $logout = document.getElementById("logout") as HTMLButtonElement
const $userId = document.getElementById("userId") as HTMLElement
const $status = document.getElementById("status") as HTMLElement
const $todos = document.getElementById("todos") as HTMLUListElement
const $newTodo = document.getElementById("newTodo") as HTMLInputElement
const $addBtn = document.getElementById("addBtn") as HTMLButtonElement

function setStatus(msg: string): void {
  $status.textContent = msg
}

function renderTodos(items: Todo[]): void {
  $todos.innerHTML = ""
  for (const [i, todo] of items.entries()) {
    const li = document.createElement("li")
    li.className = todo.done ? "done" : ""

    const cb = document.createElement("input")
    cb.type = "checkbox"
    cb.checked = todo.done
    cb.addEventListener("change", () => toggleTodo(i))

    const label = document.createElement("span")
    label.textContent = todo.text

    const del = document.createElement("button")
    del.textContent = "×"
    del.addEventListener("click", () => deleteTodo(i))

    li.append(cb, label, del)
    $todos.appendChild(li)
  }
}

// ---------------------------------------------------------------------------
// Crypto helpers
// ---------------------------------------------------------------------------

function b64urlEncode(bytes: ArrayBuffer | Uint8Array): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}

function b64urlDecode(s: string): Uint8Array {
  const padded = s.replaceAll("-", "+").replaceAll("_", "/")
    .padEnd(Math.ceil(s.length / 4) * 4, "=")
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
}

async function sha256(data: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", data))
}

// ---------------------------------------------------------------------------
// WebAuthn registration
// ---------------------------------------------------------------------------

async function register(): Promise<void> {
  const rpId = location.hostname
  const cred = await navigator.credentials.create({
    publicKey: {
      rp: { id: rpId, name: "test-todo" },
      user: { id: crypto.getRandomValues(new Uint8Array(32)), name: "user", displayName: "user" },
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      authenticatorSelection: { residentKey: "required", requireResidentKey: true, userVerification: "required" },
      extensions: { prf: {} },
    },
  }) as PublicKeyCredential | null
  if (!cred) throw new Error("No credential returned")

  const resp = cred.response as AuthenticatorAttestationResponse
  const authDataBuf = resp.getAuthenticatorData()
  if (!authDataBuf) throw new Error("No authenticatorData")
  const pkBuf = resp.getPublicKey()
  if (!pkBuf) throw new Error("No public key")

  await fetch(`${ORIGIN}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accountId,
      credentialId: b64urlEncode(cred.rawId),
      attestationData: {
        clientDataJSON: b64urlEncode(resp.clientDataJSON),
        authenticatorData: b64urlEncode(authDataBuf),
        publicKey: b64urlEncode(pkBuf),
      },
    }),
  }).then((r) => { if (!r.ok) throw new Error(`register → ${r.status}`) })

  credentialId = b64urlEncode(cred.rawId)
  localStorage.setItem(KEYS.credId, credentialId)
  log.info("registered", { accountId, credentialId })
}

// ---------------------------------------------------------------------------
// WebAuthn login + session
// ---------------------------------------------------------------------------

async function login(): Promise<void> {
  if (!credentialId) throw new Error("No credential — register first")

  const { challenge, rpId } = await fetch(
    `${ORIGIN}/auth/challenge?accountId=${encodeURIComponent(accountId)}`,
  ).then((r) => r.json()) as { challenge: string; rpId: string }

  const saltBytes = crypto.getRandomValues(new Uint8Array(32))

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: b64urlDecode(challenge),
      rpId,
      allowCredentials: [{ type: "public-key", id: b64urlDecode(credentialId) }],
      userVerification: "required",
      extensions: { prf: { eval: { first: saltBytes } } },
    },
  }) as PublicKeyCredential | null
  if (!assertion) throw new Error("No assertion")

  const aResp = assertion.response as AuthenticatorAssertionResponse
  const extResults = assertion.getClientExtensionResults() as { prf?: { results?: { first?: ArrayBuffer } } }
  const prfResult = extResults?.prf?.results?.first
  if (!prfResult) throw new Error("No PRF result — passkey may not support PRF extension")

  const saltHash = b64urlEncode(await sha256(saltBytes))

  const { sessionId: sid, expiresAt } = await fetch(`${ORIGIN}/auth/verify-prf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accountId,
      credentialId,
      challenge,
      prfResult: b64urlEncode(prfResult),
      saltHash,
      clientDataJSON: b64urlEncode(aResp.clientDataJSON),
      authenticatorData: b64urlEncode(aResp.authenticatorData),
      signature: b64urlEncode(aResp.signature),
    }),
  }).then((r) => { if (!r.ok) throw new Error(`verify-prf → ${r.status}`); return r.json() }) as { sessionId: string; expiresAt: string }

  sessionId = sid
  sessionExpiresAt = new Date(expiresAt)
  localStorage.setItem(KEYS.session, sessionId)
  localStorage.setItem(KEYS.sessionExpires, sessionExpiresAt.toISOString())
  log.info("session issued", { accountId, expiresAt })
}

// ---------------------------------------------------------------------------
// Sync
// ---------------------------------------------------------------------------

function syncProof() {
  if (!sessionActive()) throw new Error("No active session")
  return JSON.stringify({ sessionId, expiresAt: sessionExpiresAt!.toISOString() })
}

async function push(): Promise<void> {
  if (!sessionActive()) return
  const doc = handle.docSync()
  if (!doc) return
  await fetch(`${ORIGIN}/sync/${NAMESPACE}/${accountId}/${DOCUMENT_ID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-denomerge-sync-proof": syncProof() },
    body: JSON.stringify({ bytesBase64: b64urlEncode(save(doc)) }),
  }).then((r) => {
    if (!r.ok) log.warn("push failed", { status: r.status })
    else log.debug("push ok")
  }).catch((e) => log.error("push error", { err: String(e) }))
}

async function pull(): Promise<void> {
  if (!sessionActive()) return
  try {
    const res = await fetch(`${ORIGIN}/sync/${NAMESPACE}/${accountId}/${DOCUMENT_ID}`, {
      headers: { "x-denomerge-sync-proof": syncProof() },
    })
    if (!res.ok || res.status === 204) return
    const { bytesBase64 } = await res.json() as { bytesBase64?: string }
    if (!bytesBase64) return

    const remoteDoc = load<TodoDoc>(b64urlDecode(bytesBase64))
    const localDoc = handle.docSync()!
    const merged = merge(clone(localDoc), remoteDoc)
    const incoming = getChanges(localDoc, merged)
    if (incoming.length > 0) {
      log.debug("pull: applying remote changes", { count: incoming.length })
      const mergedTodos = [...merged.todos]
      handle.change((d) => {
        d.todos.splice(0, d.todos.length, ...mergedTodos)
      })
    } else {
      log.debug("pull: already up to date")
    }
  } catch (e) {
    log.error("pull failed", { err: String(e) })
  }
}

// ---------------------------------------------------------------------------
// Todo mutations
// ---------------------------------------------------------------------------

async function addTodo(text: string): Promise<void> {
  const trimmed = text.trim()
  if (!trimmed) return
  handle.change((d) => { d.todos.push({ id: Date.now(), text: trimmed, done: false }) })
  renderTodos(getTodos())
  await push()
}

async function toggleTodo(index: number): Promise<void> {
  handle.change((d) => { if (d.todos[index]) d.todos[index].done = !d.todos[index].done })
  renderTodos(getTodos())
  await push()
}

async function deleteTodo(index: number): Promise<void> {
  handle.change((d) => { d.todos.splice(index, 1) })
  renderTodos(getTodos())
  await push()
}

// ---------------------------------------------------------------------------
// UI state
// ---------------------------------------------------------------------------

function showLoggedIn(): void {
  $userId.textContent = `Account: ${accountId.slice(0, 8)}…`
  $login.style.display = "none"
  $register.style.display = "none"
  $logout.style.display = "inline-block"
}

function showLoggedOut(): void {
  $login.style.display = "inline-block"
  $register.style.display = credentialId ? "none" : "inline-block"
  $logout.style.display = "none"
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------

$register.addEventListener("click", async () => {
  try {
    setStatus("Registering passkey…")
    await register()
    setStatus("Registered. Click Log in to continue.")
    showLoggedOut()
  } catch (e) {
    setStatus(`Registration failed: ${(e as Error).message}`)
  }
})

$login.addEventListener("click", async () => {
  try {
    setStatus("Authenticating…")
    await login()
    showLoggedIn()
    setStatus(`Session active until ${sessionExpiresAt!.toLocaleTimeString()}`)
    await pull()
    renderTodos(getTodos())
  } catch (e) {
    setStatus(`Login failed: ${(e as Error).message}`)
  }
})

$logout.addEventListener("click", () => {
  sessionId = null
  sessionExpiresAt = null
  localStorage.removeItem(KEYS.session)
  localStorage.removeItem(KEYS.sessionExpires)
  showLoggedOut()
  setStatus("Logged out.")
})

$addBtn.addEventListener("click", async () => {
  await addTodo($newTodo.value)
  $newTodo.value = ""
})

$newTodo.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") { await addTodo($newTodo.value); $newTodo.value = "" }
})

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

async function init(): Promise<void> {
  log.debug("init")
  await initDoc()

  const storedSession = localStorage.getItem(KEYS.session)
  const storedExpires = localStorage.getItem(KEYS.sessionExpires)

  if (storedSession && storedExpires) {
    const expires = new Date(storedExpires)
    if (expires > new Date()) {
      sessionId = storedSession
      sessionExpiresAt = expires
      log.info("session restored", { expiresAt: expires.toISOString() })
      showLoggedIn()
      setStatus(`Session active until ${expires.toLocaleTimeString()}`)
      await pull()
      renderTodos(getTodos())
      return
    }
  }

  $userId.textContent = `Account: ${accountId.slice(0, 8)}…`
  showLoggedOut()
  setStatus(credentialId ? "Log in to sync." : "Register a passkey to get started.")
  renderTodos(getTodos())
  log.debug("ready", { hasCredential: !!credentialId })
}

init()
