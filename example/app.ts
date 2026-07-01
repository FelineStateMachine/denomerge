import { configure, getConsoleSink, getLevelFilter } from "@logtape/logtape";
import {
  buildPrfAuthenticationOptions,
  clone,
  createBrowserAutomergeRepo,
  createLogger,
  decodeBase64Url,
  deriveDenomergePrfSalt,
  encodeBase64Url,
  getChanges,
  getFirstPrfResult,
  isValidAutomergeUrl,
  load,
  merge,
  performPrfRegistration,
  save,
  sha256,
  type AutomergeUrl,
  type DocHandle,
  type PublicKeyCredentialWithPrf,
} from "@felinestatemachine/denomerge";

await configure({
  sinks: { console: getConsoleSink() },
  filters: {
    "debug+": getLevelFilter("debug"),
    "warning+": getLevelFilter("warning"),
  },
  loggers: [
    { category: ["test-todo"], sinks: ["console"], filters: ["debug+"] },
    { category: ["logtape", "meta"], sinks: ["console"], filters: ["warning+"] },
  ],
  reset: true,
});

const log = createLogger("test-todo");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Todo {
  id: number;
  text: string;
  done: boolean;
}
interface TodoDoc {
  todos: Todo[];
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ORIGIN = location.origin;
const NAMESPACE = "test-todo";
const DOCUMENT_ID = "todo-doc-1";

const KEYS = {
  account: "test-todo-account",
  credId: "test-todo-cred-id",
  session: "test-todo-session",
  sessionExpires: "test-todo-session-expires",
  docUrl: "test-todo-doc-url",
} as const;

// ---------------------------------------------------------------------------
// Auth state
// ---------------------------------------------------------------------------

const accountId = localStorage.getItem(KEYS.account) ?? crypto.randomUUID();
localStorage.setItem(KEYS.account, accountId);

let credentialId = localStorage.getItem(KEYS.credId);
let sessionId: string | null = null;
let sessionExpiresAt: Date | null = null;

function sessionActive(): boolean {
  return !!sessionId && !!sessionExpiresAt && sessionExpiresAt > new Date();
}

// ---------------------------------------------------------------------------
// Automerge document
// ---------------------------------------------------------------------------

const repo = createBrowserAutomergeRepo("test-todo-repo");
let handle: DocHandle<TodoDoc>;

async function initDoc(): Promise<void> {
  const storedUrl = localStorage.getItem(KEYS.docUrl);
  if (storedUrl && isValidAutomergeUrl(storedUrl)) {
    try {
      handle = repo.find<TodoDoc>(storedUrl as AutomergeUrl);
      await handle.whenReady();
      log.debug("doc loaded from storage: {url}", { url: storedUrl });
      return;
    } catch (e) {
      log.warn("stored doc URL not found ({url}): {err}", {
        url: storedUrl,
        err: String(e),
      });
      localStorage.removeItem(KEYS.docUrl);
    }
  }
  handle = repo.create<TodoDoc>({ todos: [] });
  localStorage.setItem(KEYS.docUrl, handle.url);
  await handle.whenReady();
  log.debug("new doc created: {url}", { url: handle.url });
}

function getTodos(): Todo[] {
  return [...(handle.doc()?.todos ?? [])];
}

// ---------------------------------------------------------------------------
// DOM
// ---------------------------------------------------------------------------

const $login = document.getElementById("login") as HTMLButtonElement;
const $register = document.getElementById("register") as HTMLButtonElement;
const $logout = document.getElementById("logout") as HTMLButtonElement;
const $userId = document.getElementById("userId") as HTMLElement;
const $status = document.getElementById("status") as HTMLElement;
const $todos = document.getElementById("todos") as HTMLUListElement;
const $newTodo = document.getElementById("newTodo") as HTMLInputElement;
const $addBtn = document.getElementById("addBtn") as HTMLButtonElement;

function setStatus(msg: string): void {
  $status.textContent = msg;
}

function renderTodos(items: Todo[]): void {
  $todos.innerHTML = "";
  for (const [i, todo] of items.entries()) {
    const li = document.createElement("li");
    li.className = todo.done ? "done" : "";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = todo.done;
    cb.addEventListener("change", () => toggleTodo(i));

    const label = document.createElement("span");
    label.textContent = todo.text;

    const del = document.createElement("button");
    del.textContent = "×";
    del.addEventListener("click", () => deleteTodo(i));

    li.append(cb, label, del);
    $todos.appendChild(li);
  }
}

// ---------------------------------------------------------------------------
// WebAuthn registration
// ---------------------------------------------------------------------------

async function register(): Promise<void> {
  const rpId = location.hostname;

  const cred = (await performPrfRegistration({
    rpId,
    rpName: "test-todo",
    userId: crypto.getRandomValues(new Uint8Array(32)),
    userName: accountId.slice(0, 8),
    userDisplayName: accountId.slice(0, 8),
    challenge: crypto.getRandomValues(new Uint8Array(32)),
  })) as PublicKeyCredential;

  const resp = cred.response as AuthenticatorAttestationResponse;
  const authDataBuf = resp.getAuthenticatorData();
  if (!authDataBuf) throw new Error("No authenticatorData");
  const pkBuf = resp.getPublicKey();
  if (!pkBuf) throw new Error("No public key");

  await fetch(`${ORIGIN}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accountId,
      credentialId: encodeBase64Url(new Uint8Array(cred.rawId)),
      attestationData: {
        clientDataJSON: encodeBase64Url(new Uint8Array(resp.clientDataJSON)),
        authenticatorData: encodeBase64Url(new Uint8Array(authDataBuf)),
        publicKey: encodeBase64Url(new Uint8Array(pkBuf)),
      },
    }),
  }).then((r) => {
    if (!r.ok) throw new Error(`register → ${r.status}`);
  });

  credentialId = encodeBase64Url(new Uint8Array(cred.rawId));
  localStorage.setItem(KEYS.credId, credentialId);
  log.info("registered credential {credentialId}", { accountId, credentialId });
}

// ---------------------------------------------------------------------------
// WebAuthn login + session
// ---------------------------------------------------------------------------

async function login(): Promise<void> {
  const { challenge, rpId } = (await fetch(
    `${ORIGIN}/auth/challenge?accountId=${encodeURIComponent(accountId)}`,
  ).then((r) => r.json())) as { challenge: string; rpId: string };

  // Stable PRF salt scoped to this account — deterministic across logins on the same device.
  const salt = await deriveDenomergePrfSalt({ rpId, realm: accountId });

  const options = buildPrfAuthenticationOptions({
    rpId,
    challenge: decodeBase64Url(challenge),
    salt,
    // Omit allowCredentialIds when unknown: browser surfaces all passkeys for this RP ID
    // (discoverable credentials), letting the user pick one.
    ...(credentialId
      ? { allowCredentialIds: [decodeBase64Url(credentialId)] }
      : {}),
  });

  const assertion = (await navigator.credentials.get({
    publicKey: options,
  })) as PublicKeyCredential | null;
  if (!assertion) throw new Error("No assertion");

  const aResp = assertion.response as AuthenticatorAssertionResponse;
  const prfResult = getFirstPrfResult(
    assertion as unknown as PublicKeyCredentialWithPrf,
  );
  if (!prfResult)
    throw new Error("No PRF result — passkey may not support PRF extension");

  // Discoverable credential path: store the credential ID the OS returned.
  if (!credentialId) {
    credentialId = encodeBase64Url(new Uint8Array(assertion.rawId));
    localStorage.setItem(KEYS.credId, credentialId);
    log.info("credential discovered: {credentialId}", { credentialId });
  }

  const saltHash = encodeBase64Url(await sha256(salt));

  const { sessionId: sid, expiresAt } = (await fetch(
    `${ORIGIN}/auth/verify-prf`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId,
        credentialId,
        challenge,
        prfResult: encodeBase64Url(prfResult),
        saltHash,
        clientDataJSON: encodeBase64Url(new Uint8Array(aResp.clientDataJSON)),
        authenticatorData: encodeBase64Url(
          new Uint8Array(aResp.authenticatorData),
        ),
        signature: encodeBase64Url(new Uint8Array(aResp.signature)),
      }),
    },
  ).then((r) => {
    if (!r.ok) throw new Error(`verify-prf → ${r.status}`);
    return r.json();
  })) as { sessionId: string; expiresAt: string };

  sessionId = sid;
  sessionExpiresAt = new Date(expiresAt);
  localStorage.setItem(KEYS.session, sessionId);
  localStorage.setItem(KEYS.sessionExpires, sessionExpiresAt.toISOString());
  log.info("session issued until {expiresAt}", { accountId, expiresAt });
}

// ---------------------------------------------------------------------------
// Session expiry
// ---------------------------------------------------------------------------

function handleSessionExpiry(): void {
  sessionId = null;
  sessionExpiresAt = null;
  localStorage.removeItem(KEYS.session);
  localStorage.removeItem(KEYS.sessionExpires);
  showLoggedOut();
  setStatus("Session expired — log in again to sync.");
  log.info("session expired, cleared local state");
}

// ---------------------------------------------------------------------------
// Sync
// ---------------------------------------------------------------------------

function syncProof() {
  if (!sessionActive()) throw new Error("No active session");
  return JSON.stringify({
    sessionId,
    expiresAt: sessionExpiresAt!.toISOString(),
  });
}

async function push(): Promise<void> {
  if (!sessionActive()) return;
  const doc = handle.doc();
  if (!doc) return;
  await fetch(`${ORIGIN}/sync/${NAMESPACE}/${accountId}/${DOCUMENT_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-denomerge-sync-proof": syncProof(),
    },
    body: JSON.stringify({ bytesBase64: encodeBase64Url(save(doc)) }),
  })
    .then((r) => {
      if (r.status === 401) handleSessionExpiry();
      else if (!r.ok) log.warn("push failed: HTTP {status}", { status: r.status });
      else log.debug("push ok");
    })
    .catch((e) => log.error("push error", { err: String(e) }));
}

async function pull(): Promise<void> {
  if (!sessionActive()) return;
  try {
    const res = await fetch(
      `${ORIGIN}/sync/${NAMESPACE}/${accountId}/${DOCUMENT_ID}`,
      {
        headers: { "x-denomerge-sync-proof": syncProof() },
      },
    );
    if (res.status === 401) {
      handleSessionExpiry();
      return;
    }
    if (!res.ok || res.status === 204) return;
    const { bytesBase64 } = (await res.json()) as { bytesBase64?: string };
    if (!bytesBase64) return;

    const remoteDoc = load<TodoDoc>(decodeBase64Url(bytesBase64));
    const localDoc = handle.doc()!;
    const merged = merge(clone(localDoc), remoteDoc);
    const incoming = getChanges(localDoc, merged);
    if (incoming.length > 0) {
      log.debug("pull: applying {count} remote changes", { count: incoming.length });
      const mergedTodos = [...merged.todos];
      handle.change((d) => {
        d.todos.splice(0, d.todos.length, ...mergedTodos);
      });
    } else {
      log.debug("pull: already up to date");
    }
  } catch (e) {
    log.error("pull failed", { err: String(e) });
  }
}

// ---------------------------------------------------------------------------
// Todo mutations
// ---------------------------------------------------------------------------

async function addTodo(text: string): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;
  handle.change((d) => {
    d.todos.push({ id: Date.now(), text: trimmed, done: false });
  });
  renderTodos(getTodos());
  await push();
}

async function toggleTodo(index: number): Promise<void> {
  handle.change((d) => {
    if (d.todos[index]) d.todos[index].done = !d.todos[index].done;
  });
  renderTodos(getTodos());
  await push();
}

async function deleteTodo(index: number): Promise<void> {
  handle.change((d) => {
    d.todos.splice(index, 1);
  });
  renderTodos(getTodos());
  await push();
}

// ---------------------------------------------------------------------------
// UI state
// ---------------------------------------------------------------------------

function showLoggedIn(): void {
  $userId.textContent = `Account: ${accountId.slice(0, 8)}…`;
  $login.style.display = "none";
  $register.style.display = "none";
  $logout.style.display = "inline-block";
}

function showLoggedOut(): void {
  $login.style.display = "inline-block";
  $register.style.display = credentialId ? "none" : "inline-block";
  $logout.style.display = "none";
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------

$register.addEventListener("click", async () => {
  try {
    setStatus("Registering passkey…");
    await register();
    setStatus("Registered. Click Log in to continue.");
    showLoggedOut();
  } catch (e) {
    setStatus(`Registration failed: ${(e as Error).message}`);
  }
});

$login.addEventListener("click", async () => {
  try {
    setStatus("Authenticating…");
    await login();
    showLoggedIn();
    setStatus(`Session active until ${sessionExpiresAt!.toLocaleTimeString()}`);
    await pull();
    renderTodos(getTodos());
  } catch (e) {
    setStatus(`Login failed: ${(e as Error).message}`);
  }
});

$logout.addEventListener("click", () => {
  sessionId = null;
  sessionExpiresAt = null;
  localStorage.removeItem(KEYS.session);
  localStorage.removeItem(KEYS.sessionExpires);
  showLoggedOut();
  setStatus("Logged out.");
});

$addBtn.addEventListener("click", async () => {
  await addTodo($newTodo.value);
  $newTodo.value = "";
});

$newTodo.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    await addTodo($newTodo.value);
    $newTodo.value = "";
  }
});

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

async function init(): Promise<void> {
  log.debug("init");
  await initDoc();

  const storedSession = localStorage.getItem(KEYS.session);
  const storedExpires = localStorage.getItem(KEYS.sessionExpires);

  if (storedSession && storedExpires) {
    const expires = new Date(storedExpires);
    if (expires > new Date()) {
      sessionId = storedSession;
      sessionExpiresAt = expires;
      log.info("session restored, expires {expiresAt}", { expiresAt: expires.toISOString() });
      showLoggedIn();
      setStatus(`Session active until ${expires.toLocaleTimeString()}`);
      await pull();
      renderTodos(getTodos());
      return;
    }
  }

  $userId.textContent = `Account: ${accountId.slice(0, 8)}…`;
  showLoggedOut();
  setStatus(
    credentialId ? "Log in to sync." : "Register a passkey to get started.",
  );
  renderTodos(getTodos());
  log.debug("ready", { hasCredential: !!credentialId });
}

init();
