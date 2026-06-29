# Design: Resident passkey PRF authentication spike

## Decision

Use WebAuthn discoverable credentials (`residentKey: "required"`) with user verification and the PRF
extension. The client asks the authenticator to evaluate a domain-scoped salt during
`navigator.credentials.get()`, then derives separate sync keys with HKDF.

## Notes from research

- MDN documents `credProps` for discoverable credential feedback and `prf` as a WebAuthn extension.
- The W3C PRF explainer states PRF maps to CTAP2 `hmac-secret` on capable security keys and cannot
  be evaluated silently; it is part of a WebAuthn ceremony.
- Browser/authenticator support is uneven. Chromium supports PRF for security keys; Safari support
  depends on modern OS versions; not every passkey provider supports it.

## Security boundary

The server may verify WebAuthn assertions and store public credential metadata, but PRF output and
derived keys remain client-only. Salts include `denomerge sync v1`, RP/app namespace, realm, and
scope for domain separation.
