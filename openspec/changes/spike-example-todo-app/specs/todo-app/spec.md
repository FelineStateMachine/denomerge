## ADDED Requirements

### Requirement: Example app serves HTTP on configured port

The example server SHALL start and listen on the port configured via the `PORT` environment variable
or default to 8000.

#### Scenario: Server starts on configured port

- **GIVEN** the PORT environment variable is set to 9000
- **WHEN** the example server starts
- **THEN** it binds to port 9000
- **AND** it logs "denomerge example server listening on :9000"

#### Scenario: Server starts on default port

- **GIVEN** the PORT environment variable is not set
- **WHEN** the example server starts
- **THEN** it binds to port 8000

### Requirement: Static files are served correctly

The example server SHALL serve `index.html`, `style.css`, and `app.js` from the example directory.

#### Scenario: index.html is served at root

- **GIVEN** a GET request to `/`
- **WHEN** the server receives the request
- **THEN** it returns the contents of `index.html` with Content-Type `text/html; charset=utf-8`

#### Scenario: CSS and JS files are served with correct MIME types

- **GIVEN** a GET request to `/style.css`
- **WHEN** the server receives the request
- **THEN** it returns the contents of `style.css` with Content-Type `text/css`

### Requirement: Auth challenge endpoint issues a challenge

The example server SHALL expose a `GET /auth/challenge?accountId=:accountId` endpoint that returns a
challenge, rpId, and origin.

#### Scenario: Challenge endpoint returns challenge data

- **GIVEN** a GET request to `/auth/challenge?accountId=test-account`
- **WHEN** the server receives the request
- **THEN** it returns a JSON body containing `challenge`, `rpId`, and `origin` fields

### Requirement: Auth register endpoint stores credential in KV

The example server SHALL expose a `POST /auth/register` endpoint that accepts a credential ID and
attestation data and stores the credential public key in Deno KV.

#### Scenario: Registration stores SPKI in KV

- **GIVEN** a POST request to `/auth/register` with valid registration data
- **WHEN** the server processes the request
- **THEN** it stores the credential SPKI in Deno KV under the account's credential key
- **AND** it returns `{ "ok": true }`

### Requirement: KV sync handler stores and retrieves documents

The example server SHALL expose a sync handler at `/sync/:namespace/:accountId/:documentId` that
stores and retrieves document payloads behind proof verification.

#### Scenario: PUT stores document with valid proof

- **GIVEN** a PUT request to `/sync/denomerge-example/acct/doc1` with a valid sync proof header
- **WHEN** the server receives the request
- **THEN** it stores the document payload in Deno KV
- **AND** it returns the stored record with status 201

#### Scenario: GET retrieves stored document

- **GIVEN** a stored document exists in Deno KV for `doc1`
- **WHEN** a GET request is made to `/sync/denomerge-example/acct/doc1` with a valid sync proof
  header
- **THEN** it returns the stored document bytes with status 200

#### Scenario: Request without proof header is rejected

- **GIVEN** a request to `/sync/:namespace/:accountId/:docId`
- **WHEN** the request does not include the `x-denomerge-sync-proof` header
- **THEN** the server returns status 401 with `{ "error": "missing_sync_proof" }`

#### Scenario: Request with expired proof is rejected

- **GIVEN** a request to `/sync/:namespace/:accountId/:docId`
- **WHEN** the proof header contains an `expiresAt` timestamp in the past
- **THEN** the server returns status 401 with `{ "error": "expired_sync_proof" }`
