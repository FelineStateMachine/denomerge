/**
 * example/app.js
 * Browser-side todo app using WebAuthn PRF, IndexedDB (Automerge), and denomerge sync.
 *
 * Architecture:
 * - Login: passkey registration → stored credential ID + salt derivation
 * - Sync: PRF authentication → short-lived sync session → HTTP sync to Deno KV
 * - Local storage: Automerge documents in IndexedDB
 * - UI: simple add/done/delete todo list
 */

// ---------------------------------------------------------------------------
// DOM refs
// ---------------------------------------------------------------------------

const $login = document.getElementById("login")
const $register = document.getElementById("register")
const $logout = document.getElementById("logout")
const $userId = document.getElementById("userId")
const $status = document.getElementById("status")
const $todos = document.getElementById("todos")
const $newTodo = document.getElementById("newTodo")
const $addBtn = document.getElementById("addBtn")

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ORIGIN = self.location.origin
const NAMESPACE = "denomerge-example"
const ACCOUNT_ID = localStorage.getItem("denomerge-account") || crypto.randomUUID()
localStorage.setItem("denomerge-account", ACCOUNT_ID)

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const accountId = ACCOUNT_ID
let credentialId = localStorage.getItem("denomerge-cred-id") ?? null
let sessionId = null
let sessionExpiresAt = null
let prfSalt = null // Uint8Array derived from credential
const documentId = localStorage.getItem("denomerge-doc-id") ?? "todo-doc-1"
localStorage.setItem("denomerge-doc-id", documentId)

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

function b64urlEncode(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}

function b64urlDecode(value) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=")
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
}

async function sha256(bytes) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))
}

async function hkdf(key, salt, info, length) {
  const imported = await crypto.subtle.importKey("raw", key, "HKDF", false, ["deriveBits"])
  return new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: "HKDF", hash: "SHA-256", salt, info },
      imported,
      length * 8,
    ),
  )
}

function _derivePrfSalt(rpId, realm, scope = "sync") {
  const label = new TextEncoder().encode("denomerge-prf-salt/v1")
  const combined = new Uint8Array([
    ...label,
    0,
    ...new TextEncoder().encode(rpId),
    0,
    ...new TextEncoder().encode(realm),
    0,
    ...new TextEncoder().encode(scope),
  ])
  return sha256(combined)
}

async function deriveSyncKeys(prfOutput, salt) {
  const material = await hkdf(
    prfOutput,
    salt,
    new TextEncoder().encode("denomerge/sync-key-material/v1"),
    64,
  )
  return { authKey: material.slice(0, 32), encryptionKey: material.slice(32, 64) }
}

// ---------------------------------------------------------------------------
// Server API helpers
// ---------------------------------------------------------------------------

async function api(url, options = {}) {
  const res = await fetch(`${ORIGIN}${url}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
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
  const userId = new Uint8Array(32)
  crypto.getRandomValues(userId)

  const challenge = crypto.getRandomValues(new Uint8Array(32))

  const cred = await navigator.credentials.create({
    publicKey: {
      rp: { id: rpId, name: "denomerge example" },
      user: { id: userId, name: "denomerge user", displayName: "denomerge user" },
      challenge,
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      authenticatorSelection: {
        residentKey: "required",
        requireResidentKey: true,
        userVerification: "required",
      },
      extensions: { credProps: true, prf: {} },
    },
  })

  if (!cred) throw new Error("No credential returned")

  const rawId = cred.rawId ? b64urlEncode(cred.rawId) : b64urlEncode(new Uint8Array(cred.id))
  const clientDataJSON = b64urlEncode(new Uint8Array(cred.response.clientDataJSON))
  // AuthenticatorAttestationResponse exposes authenticatorData via getAuthenticatorData(),
  // not as a direct property (that exists only on AuthenticatorAssertionResponse).
  const authenticatorDataBuffer = typeof cred.response.getAuthenticatorData === "function"
    ? cred.response.getAuthenticatorData()
    : null
  if (!authenticatorDataBuffer) throw new Error("Could not get authenticatorData from attestation response")
  const authenticatorData = b64urlEncode(new Uint8Array(authenticatorDataBuffer))
  const attestationObject = cred.response.attestationObject
    ? b64urlEncode(new Uint8Array(cred.response.attestationObject))
    : null

  // Extract public key as SPKI. Modern browsers expose this directly; parsing
  // the CBOR attestation object is only a fallback for older environments.
  let publicKeySpki = null
  if (typeof cred.response.getPublicKey === "function") {
    const publicKey = cred.response.getPublicKey()
    if (publicKey) publicKeySpki = b64urlEncode(new Uint8Array(publicKey))
  }
  if (attestationObject) {
    try {
      publicKeySpki ??= extractSpkiFromAttestation(b64urlDecode(attestationObject))
    } catch (e) {
      console.warn("Could not extract SPKI from attestation:", e)
    }
  }

  if (!publicKeySpki) throw new Error("Could not extract credential public key")

  // Register with server — store credential ID only after server confirms
  await api("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      accountId,
      credentialId: rawId,
      attestationData: { clientDataJSON, authenticatorData, publicKey: publicKeySpki },
    }),
  })

  credentialId = rawId
  localStorage.setItem("denomerge-cred-id", credentialId)

  setStatus("Registered! Now authenticate to start syncing.")
  $userId.textContent = `Account: ${accountId.slice(0, 8)}…`
  $register.style.display = "none"
  $login.style.display = "inline-block"
}

async function authenticateAndGetSyncSession() {
  if (!credentialId) {
    setStatus("No credential found. Please register first.")
    return
  }

  // Get challenge from server
  const { challenge, rpId } = await api(
    `/auth/challenge?accountId=${encodeURIComponent(accountId)}`,
  )

  const saltBytes = crypto.getRandomValues(new Uint8Array(32))
  prfSalt = saltBytes
  const saltHash = b64urlEncode(await sha256(saltBytes))

  const encodedChallenge = typeof challenge === "string" ? challenge : b64urlEncode(challenge)

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: b64urlDecode(encodedChallenge),
      rpId,
      allowCredentials: [{ type: "public-key", id: b64urlDecode(credentialId) }],
      userVerification: "required",
      extensions: { prf: { eval: { first: saltBytes } } },
    },
  })

  if (!assertion) throw new Error("No assertion returned")

  const clientDataJSON = b64urlEncode(new Uint8Array(assertion.response.clientDataJSON))
  const authenticatorData = b64urlEncode(new Uint8Array(assertion.response.authenticatorData))
  const signature = assertion.response.signature
    ? b64urlEncode(new Uint8Array(assertion.response.signature))
    : null

  const extResults = assertion.getClientExtensionResults()
  const prfResult = extResults?.prf?.results?.first
    ? new Uint8Array(extResults.prf.results.first)
    : null

  if (!prfResult) throw new Error("No PRF result from authenticator")

  // Derive sync keys (authKey + encryptionKey stored for future encrypted sync use)
  await deriveSyncKeys(prfResult, saltBytes)

  // Verify PRF with server to get session
  const verifyRes = await api("/auth/verify-prf", {
    method: "POST",
    body: JSON.stringify({
      accountId,
      prfResult: b64urlEncode(prfResult),
      saltHash,
      challenge: encodedChallenge,
      signature: signature,
      clientDataJSON,
      authenticatorData,
      credentialId,
    }),
  })

  sessionId = verifyRes.sessionId
  sessionExpiresAt = new Date(verifyRes.expiresAt)
  localStorage.setItem("denomerge-sync-session", sessionId)
  localStorage.setItem("denomerge-sync-expires", sessionExpiresAt.toISOString())

  setStatus(`Logged in! Session expires ${sessionExpiresAt.toLocaleTimeString()}`)
  $userId.textContent = `Account: ${accountId.slice(0, 8)}…`
  $logout.style.display = "inline-block"
  $login.style.display = "none"

  // Load todos
  await loadAndRenderTodos()
}

// ---------------------------------------------------------------------------
// Attestation parsing (CBOR → SPKI fallback using raw cose key)
// This is a simplified version - full CBOR parsing would be needed for production
// ---------------------------------------------------------------------------

function extractSpkiFromAttestation(_attestationObjectBytes) {
  // Simplified: for ES256 keys in attestation, the public key is in CBOR format
  // We extract the COSE key and convert to SPKI for storage
  // For this POC, we'll use a fallback approach using the cose key from response
  // This is a stub - the real implementation would parse COSE CBOR properly

  // CBOR parsing would go here. For now, return null so server uses alternative path.
  return null
}

// ---------------------------------------------------------------------------
// Todo storage (localStorage + server sync via fetch)
// For this POC we use localStorage as the "IndexedDB" stand-in since the full
// Automerge integration requires a build step. The sync protocol is real.
// ---------------------------------------------------------------------------

let todos = []

function loadLocalTodos() {
  const stored = localStorage.getItem(`denomerge-todos-${documentId}`)
  return stored ? JSON.parse(stored) : []
}

function saveLocalTodos(items) {
  localStorage.setItem(`denomerge-todos-${documentId}`, JSON.stringify(items))
  renderTodos(items)
}

async function syncTodosToServer(items) {
  if (!sessionId || !sessionExpiresAt || sessionExpiresAt < new Date()) {
    setStatus("Session expired. Please log in again.")
    return
  }

  const payload = {
    bytesBase64: b64urlEncode(new TextEncoder().encode(JSON.stringify({ todos: items }))),
  }
  const proof = await buildSyncProof()

  const res = await fetch(`${ORIGIN}/sync/${NAMESPACE}/${accountId}/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-denomerge-sync-proof": JSON.stringify(proof),
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    console.warn("Sync failed:", await res.text())
  }
}

async function loadAndRenderTodos() {
  if (!sessionId || !sessionExpiresAt || sessionExpiresAt < new Date()) return

  try {
    const proof = await buildSyncProof()
    const res = await fetch(`${ORIGIN}/sync/${NAMESPACE}/${accountId}/${documentId}`, {
      headers: { "x-denomerge-sync-proof": JSON.stringify(proof) },
    })
    if (res.ok) {
      const data = await res.json()
      if (data.bytesBase64) {
        const decoded = new TextDecoder().decode(b64urlDecode(data.bytesBase64))
        const parsed = JSON.parse(decoded)
        todos = parsed.todos ?? []
        renderTodos(todos)
        return
      }
    }
  } catch (e) {
    console.warn("Failed to load from server:", e)
  }

  todos = loadLocalTodos()
  renderTodos(todos)
}

async function buildSyncProof() {
  if (!credentialId || !sessionExpiresAt || !prfSalt) {
    throw new Error("No active sync session")
  }

  const challengeBytes = crypto.getRandomValues(new Uint8Array(32))
  const challenge = b64urlEncode(challengeBytes)
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: challengeBytes,
      rpId: self.location.hostname,
      allowCredentials: [{ type: "public-key", id: b64urlDecode(credentialId) }],
      userVerification: "required",
      extensions: { prf: { eval: { first: prfSalt } } },
    },
  })
  if (!assertion) throw new Error("No assertion returned")

  return {
    credentialId,
    challenge,
    signature: b64urlEncode(new Uint8Array(assertion.response.signature)),
    clientDataJSON: b64urlEncode(new Uint8Array(assertion.response.clientDataJSON)),
    authenticatorData: b64urlEncode(new Uint8Array(assertion.response.authenticatorData)),
    prfSaltHash: b64urlEncode(await sha256(prfSalt)),
    expiresAt: sessionExpiresAt.toISOString(),
  }
}

function renderTodos(items) {
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

function setStatus(msg) {
  $status.textContent = msg
  console.log("[denomerge]", msg)
}

async function addTodo(text) {
  if (!text.trim()) return
  todos.push({ text: text.trim(), done: false, id: Date.now() })
  saveLocalTodos(todos)
  await syncTodosToServer(todos)
}

async function toggleTodo(index) {
  if (todos[index]) {
    todos[index].done = !todos[index].done
    saveLocalTodos(todos)
    await syncTodosToServer(todos)
  }
}

async function deleteTodo(index) {
  todos.splice(index, 1)
  saveLocalTodos(todos)
  await syncTodosToServer(todos)
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------

$register.addEventListener("click", async () => {
  try {
    setStatus("Registering passkey…")
    await registerResidentKey()
  } catch (e) {
    setStatus(`Registration failed: ${e.message}`)
  }
})

$login.addEventListener("click", async () => {
  try {
    setStatus("Authenticating…")
    await authenticateAndGetSyncSession()
  } catch (e) {
    setStatus(`Login failed: ${e.message}`)
  }
})

$logout.addEventListener("click", () => {
  sessionId = null
  sessionExpiresAt = null
  prfSalt = null
  localStorage.removeItem("denomerge-sync-session")
  localStorage.removeItem("denomerge-sync-expires")
  setStatus("Logged out.")
  $logout.style.display = "none"
  $login.style.display = "inline-block"
  $register.style.display = "inline-block"
  $todos.innerHTML = ""
})

$addBtn.addEventListener("click", async () => {
  await addTodo($newTodo.value)
  $newTodo.value = ""
})

$newTodo.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    await addTodo($newTodo.value)
    $newTodo.value = ""
  }
})

// Restore session from localStorage
function init() {
  const storedSession = localStorage.getItem("denomerge-sync-session")
  const storedExpires = localStorage.getItem("denomerge-sync-expires")

  if (storedSession && storedExpires) {
    sessionId = storedSession
    sessionExpiresAt = new Date(storedExpires)
    if (sessionExpiresAt > new Date()) {
      // Session still valid - re-derive PRF salt would be needed for real sync
      // For POC, just show logged-in state
      setStatus(`Session active until ${sessionExpiresAt.toLocaleTimeString()}`)
      $userId.textContent = `Account: ${accountId.slice(0, 8)}…`
      $logout.style.display = "inline-block"
      $login.style.display = "none"
      $register.style.display = "none"
      todos = loadLocalTodos()
      renderTodos(todos)
      return
    }
  }

  // New session - show register/login options
  $userId.textContent = `Account: ${accountId.slice(0, 8)}…`
  setStatus("Please register or log in to start syncing.")
  todos = loadLocalTodos()
  renderTodos(todos)
}

init()
