# RoomSync Progress

This file records the implementation that is currently present in the repository. The working product is an offline-first demonstration vertical slice for student flatmate discovery in Gurugram. Synthetic and stubbed behavior is called out explicitly below.

## Completed Repository Setup

- Added the project control documents: `README.md`, `PLAN.md`, and this progress ledger.
- Added a Django backend under `backend/` with a small JSON API and SQLite configuration.
- Added a React 18, TypeScript, and Vite frontend under `frontend/`.
- Added a Solidity agreement registry contract under `contracts/AgreementRegistry.sol`.
- Added architecture, API, privacy/DPDP, and five-minute demo documentation under `docs/`.
- Added `Makefile` shortcuts for Docker startup, seeding, tests, frontend development, and the Python demo script.
- Added `docker-compose.yml` with separate Python backend and Node frontend services.
- Kept the default local path credential-free and based on SQLite plus deterministic Python logic.

## Backend API Completed

Routes are registered in `backend/config/urls.py` and implemented in `backend/apps/api.py`.

### Health and accounts

- `GET /api/health/` returns the service name, `ok` status, and an explicit `demo: true` marker.
- `POST /api/auth/register/` accepts name, email, phone, and password.
- Registration rejects invalid JSON, missing required fields, and passwords shorter than eight characters.
- Registration normalizes email addresses to lowercase and rejects duplicate emails with HTTP 409.
- Accounts are stored in a SQLite table named `roomsync_accounts`, created on demand.
- Passwords are stored as salted PBKDF2-HMAC-SHA256 hashes using 120,000 iterations.
- Registration returns a public user object and a demo session token.
- `POST /api/auth/login/` checks the stored password with constant-time digest comparison.
- Login returns HTTP 401 for an unknown email or incorrect password.
- `GET /api/auth/accounts/` returns account records for the demo admin view without exposing password hashes.
- A demo account is created automatically when the API module initializes: `demo@roomsync.test` with the documented demo password.
- Account authentication is demo-level only; there is no Django session, token validation middleware, ownership authorization, or account deletion flow.

### Matching API

- `GET /api/matches/` ranks the built-in demo profile against three synthetic candidates.
- Hard filters exclude candidates from another city.
- Hard filters exclude candidates whose budget overlap is below INR 1,000.
- A non-smoker profile is protected from a regular smoker dealbreaker.
- Compatible candidates receive a descending score and explainable output.
- Scoring includes routine similarity, cleanliness, social/noise tolerance, study style, food preference, and a baseline contribution.
- Responses include human-readable reasons, conflicts, and individual scoring contributions.

### Discovery listing inventory and CRUD

- Added a synthetic inventory covering Gurugram localities including Sector 23, Sector 40, Sushant Lok, DLF Phase 3, Palam Vihar, South City 1, Sector 57, Golf Course Road, Nirvana Country, and MG Road.
- Listings include title, owner, city, locality, address, rent, BHK, occupancy, gender preference, furnishing, description, amenities, highlights, photo count, owner verification, active status, and a synthetic marker.
- `GET /api/listings/` returns listings enriched with trust, safety, and favorite state.
- Location filtering searches city and locality case-insensitively.
- Rent range filtering supports `minRent` and `maxRent`.
- Occupancy filtering supports the listing occupancy value.
- Gender filtering accepts matching preference listings plus listings marked `Any`.
- Amenity filtering returns listings containing the requested amenity.
- `verified=true` restricts results to demo owner-verified listings.
- `minTrust` filters on the generated trust score.
- `sort=rent_asc` and `sort=rent_desc` provide rent ordering.
- `POST /api/listings/` validates positive rent values.
- Listing creation limits images to three items.
- Each submitted image must have an `image/*` MIME type and be smaller than 10 MB.
- New listing records receive a generated ID, default room metadata, a synthetic marker, and owner verification set to false.
- `GET /api/listings/{id}/` returns one enriched listing or HTTP 404.
- `PATCH` and `PUT` update listing fields in the demo store and return the enriched record.
- `DELETE /api/listings/{id}/` removes a listing from the demo store.
- Invalid JSON receives HTTP 400 on JSON endpoints.

### Favorites and connect requests

- `POST /api/listings/{id}/favorite/` saves a listing in an in-memory favorites set.
- `DELETE /api/listings/{id}/favorite/` removes a saved listing.
- `GET /api/favorites/` returns enriched saved listings.
- `POST /api/listings/{id}/connect/` creates a pending connect request.
- Connect responses include a request ID, listing ID, pending status, and a safety reminder to meet publicly and verify before paying.
- Connect requests are held in memory and have no recipient workflow, acceptance action, messaging, or persistence.

### Safety and agreement endpoints

- `GET /api/safety/?lat=&lng=` returns coordinates, a moderate sample geo-risk score, component scores, campus distance, commute band, and nearest police, hospital, and metro amenities.
- Safety output identifies its NCRB/OSM-style values as sample demo metrics that must be replaced with documented source extracts.
- `POST /api/agreements/analyse/` accepts agreement text and returns a SHA-256 digest.
- Agreement analysis detects seeded security-deposit, short-notice-period, landlord-entry, and rent-escalation patterns.
- Each detected clause includes type, risk level, matched text, character offsets, explanation, suggestion, and an informational Model Tenancy Act 2021 mapping.
- Overall agreement risk is calculated from detected high-risk clauses and the response includes a not-legal-advice disclaimer.

## ML and Explainability Modules Completed

- `backend/ml/matching/engine.py` provides deterministic pure-Python compatibility ranking.
- `backend/ml/verification/trust.py` computes a trust score from seeded scam phrases, low-price anomaly, owner verification, and photo completeness.
- Trust signals distinguish pass and warning states and explain each result.
- `backend/ml/safety/risk.py` provides deterministic safety components and campus proximity for the demo location.
- `backend/ml/nlp/analyser.py` provides offline regular-expression agreement analysis and hashing.
- `backend/scripts/demo.py` exercises matching, trust, safety, and agreement analysis together and prints JSON.

## Frontend Completed

- Added a Vite React TypeScript application with `npm run dev`, `npm run build`, and a Vitest command in `frontend/package.json`.
- Added a desktop dashboard shell with sidebar navigation, overview, compatibility, discovery, safety, agreements, profile, notifications, settings, and admin-oriented views.
- Added Lucide icons and Recharts-based visual UI dependencies.
- Added a branded RoomSync visual system using DM Sans and Space Grotesk, teal/green dashboard styling, responsive layout rules, cards, panels, buttons, badges, and toast notifications.
- Added backend health indicators for health, matches, listings, and safety endpoints.
- Added startup loading of matches, listings, safety data, and account records.
- Added login handling for the demo admin credentials and the backend account login endpoint.
- Added multi-step account registration with password confirmation and profile preferences.
- Added profile display/edit state, profile photo selection state, logout handling, and admin account/person inspection UI.
- Added the discovery experience in `frontend/src/Discovery.tsx` with room and roommate modes.
- Added location, rent range, occupancy, and verified-owner search controls.
- Added listing result cards with rent, occupancy, furnishing, amenities, highlights, trust score, safety context, favorite state, and connect action.
- Added listing detail behavior for reviewing listing information and trust/safety signals.
- Added a create-room form for locality, address, rent, occupancy, gender preference, amenities, highlights, contact visibility, and images.
- Added browser-side image validation for a maximum of three images, image MIME types, and the 10 MB size limit.
- Added local image previews using object URLs before the listing is posted.
- Added API-backed listing creation, search refresh, favorites, and connect requests with user-facing success/error toasts.
- Added safety map-style presentation of sample risk data and commute context.
- Added agreement upload/text analysis presentation, clause highlighting, risk messaging, and hash-oriented demo actions.

## Contracts and Documentation Completed

- Added `AgreementRegistry.sol` using Solidity `^0.8.24`.
- The contract stores one record per document hash with registrant and timestamp.
- Duplicate hashes are rejected.
- Registration emits a `Registered` event.
- A read-only `get` function returns the stored record.
- Added an architecture diagram describing browser, API, ML, database, chain, and explainability flow.
- Added API documentation for health, account, matching, listing, favorites, connect, safety, and agreement routes.
- Added DPDP-oriented intentions: purpose-specific consent, export/deletion goals, no raw Aadhaar storage, and exclusion of protected attributes from matching.
- Added a five-minute demo walkthrough covering matches, listing trust, safety, agreement analysis, and hash verification concepts.

## Tests and Verification

- Backend tests cover account registration and login persistence.
- Backend tests cover duplicate account rejection.
- Backend tests verify that admin account responses exclude password hashes.
- Backend tests cover listing inventory, location/rent filtering, and trust/safety enrichment.
- Backend tests cover invalid rent and excessive image-count rejection.
- Backend tests cover favorite creation, connect request creation, and saved-listing retrieval.
- ML tests cover different-city exclusion, scam-language trust warnings, and high-risk agreement clauses.
- The current backend result is `python -m pytest backend/tests -q`: 9 passed.
- The recorded frontend result is `npm run build`: passed, including TypeScript compilation and Vite production bundling.
- The local demo path requires no external service credentials.
- `python backend/manage.py check` was not recorded as runnable in the earlier environment because Django/Python was not selected there; this remains a validation gap until rerun in the configured environment.
- No frontend Vitest test files are currently present.
- No CI workflow, lint run, contract test suite, or deployed-chain integration test is currently present.

## Explicit Demo Boundaries

- Synthetic listings and profiles are labeled as demo data.
- Listings, favorites, and connect requests are process-memory data and disappear when the backend restarts.
- The account table is SQLite-backed, but account authentication is not production-grade authorization.
- Uploaded images are metadata and browser previews only; binary files are not stored in MinIO or another object store.
- Safety values are sample metrics and are not live NCRB, OSM, police, hospital, transit, or lighting data.
- Identity verification and DigiLocker behavior are not implemented; verification is a documented stub boundary.
- Agreement analysis is rule-based, offline, informational, and not legal advice.
- The Solidity registry is supplied as a contract source file; local-chain deployment and frontend/API chain integration are not wired up.
- Matching weights are deterministic demo logic and are not calibrated from consented real outcomes.
- The frontend uses a single dashboard application rather than a production router and authenticated route guards.
- The repository does not yet provide moderated user-generated content, real identity lifecycle, production observability, or mobile clients.

## Advanced Features Slice Completed

- **Real-Time Chat & Messaging (`backend/apps/chat.py`, `frontend/src/Chat.tsx`)**:
  - SQLite tables `roomsync_conversations` and `roomsync_messages`.
  - Normalized participant ordering preventing duplicate conversations.
  - Endpoints: `POST /api/chat/conversations/`, `GET /api/chat/conversations/`, `POST /api/chat/messages/`, `GET /api/chat/messages/`, `GET /api/chat/unread/`.
  - Frontend chat component with conversation list, message thread, auto-scroll, unread badges, and 3-second live polling.
  - Integrated into Room & Flatmate Discovery: clicking "Connect" automatically initializes a conversation with the listing owner.

- **Blockchain Smart Contract Integration (`contracts/`, `frontend/src/blockchain.ts`, `frontend/src/AgreementVerifier.tsx`)**:
  - Hardhat setup with `@nomicfoundation/hardhat-toolbox` and ethers.js v6.
  - Deployment script `deploy.js` generating `deployed-address.json`.
  - Unit tests in `AgreementRegistry.test.js` covering registration, duplicate rejection, and events.
  - `blockchain.ts` provider/signer wrapper with `connectWallet()`, `registerHash()`, `verifyHash()`.
  - `AgreementVerifier.tsx` UI allowing users to paste agreements, analyse clauses, hash with SHA-256, anchor to Ethereum/Hardhat, and verify validity on-chain.

- **Cloud Deployment Configurations (`Dockerfile`, `render.yaml`, `railway.json`, `.dockerignore`)**:
  - Multi-stage Dockerfile: Node 22 Vite build -> Python 3.12 Slim runtime with Gunicorn and health check.
  - Render.com web service blueprint with healthcheck at `/api/health/`.
  - Railway deployment config with automatic nixpack build and health checks.

- **CI/CD Pipeline (`.github/workflows/ci.yml`)**:
  - GitHub Actions matrix workflow testing Python 3.11 and 3.12 with `pytest` and `ruff`.
  - Frontend Node build and TypeScript verification job with dependency caching.

- **Interactive Safety Map (`frontend/src/SafetyMap.tsx`)**:
  - Interactive Leaflet map centered at The NorthCap University, Gurugram.
  - Locality coordinate resolver for Gurugram sectors (Sector 23, DLF Phase 3, Sushant Lok, etc.).
  - Pins for campus, listings with rent & trust score popups, police stations, hospitals, and metro stations.
  - Visual crime risk zone overlay circle.

- **Enhanced NLP Agreement Analyser (`backend/ml/nlp/enhanced_analyser.py`)**:
  - 10+ new clause detection patterns (maintenance, subletting, pets, utilities, lock-in period, late payment fees, parking, guest restrictions, damage liabilities, notice period).
  - Multi-clause agreement summary endpoint (`/api/agreements/summary/`) with overall safety rating (Safe, Caution, Risky).
  - Agreement diff/comparison endpoint (`/api/agreements/compare/`) identifying unique and common clauses between two contracts.

- **File & Image Uploads (`backend/apps/uploads.py`, `frontend/src/ImageUpload.tsx`)**:
  - Multipart upload handler validating MIME type and 10 MB file size limit.
  - Storage in `backend/media/listings/` with UUID-based collision-free filenames.
  - SQLite metadata table `roomsync_uploads`.
  - Drag-and-drop ImageUpload UI with preview thumbnails and deletion.

- **UI/UX & Security Hardening**:
  - Environment-driven `SECRET_KEY`, `DEBUG`, and `ALLOWED_HOSTS` in `backend/config/settings.py`.
  - Dynamic calendar date and profile initials in dashboard header.
  - Fixed missing `@csrf_exempt` decorators and nested modal JSX bugs.
  - Comprehensive responsive mobile CSS rules added to `styles.css`.
  - 14 automated backend tests passing.

## Remaining Work

- Add persistent Django ORM models for listings, profiles, and favorites (currently SQLite raw tables and demo memory stores).
- Add production-grade JWT authentication and session expiration lifecycle.
- Connect binary uploads to MinIO or AWS S3 bucket for cloud-scale object storage.
- Deploy smart contract to an active public testnet (Sepolia or Polygon Amoy).
