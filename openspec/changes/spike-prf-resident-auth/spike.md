# Spike Results: spike-prf-resident-auth

## Status

Complete locally with hardware access mocked. The code now exposes injectable WebAuthn ceremony
helpers, so tests can stand in for the physical key press and still verify resident-key and PRF
option wiring.

## Proven

- Registration options require discoverable credentials and user verification.
- Authentication options request user verification and PRF evaluation for a scoped salt.
- PRF output is converted into client-only bytes and fed into separated sync-key derivation.
- Automated tests cover the ceremony path through a stubbed credentials client instead of a local
  FIDO2 key.

## Remaining

- Physical authenticator compatibility still needs real browser/device validation outside this
  environment.
