# RoomSync Build Plan

## Architecture
- `backend/`: Django REST API with a dependency-light local demo mode, pure Python ML modules, and SQLite fallback for zero-credential startup.
- `frontend/`: React 18 + Vite + TypeScript desktop dashboard.
- `contracts/`: Hardhat Solidity registry for agreement hash anchoring.
- `data/seed/`: clearly synthetic demo data and sample agreements.
- `docs/`: architecture, API, privacy, ML, and demo notes.
- `docker-compose.yml`: local services; optional PostgreSQL/PostGIS, Redis, MinIO, and chain profiles.

## Milestones
- [x] Project control documents and assumptions
- [x] Runnable backend API and health endpoint
- [x] Matching engine with hard filters, weighted score, and explanations
- [x] Listing trust and safety scoring modules
- [x] Agreement parsing, risk rules, and hash verification
- [x] Solidity registry and local chain integration
- [x] Desktop frontend dashboard and core flows
- [x] Seed data and demo script
- [x] Tests, linting, CI, and documentation

## Room & Flatmate Discovery Feature
- [x] Inspect current architecture and identify demo-only listing/API constraints
- [x] Add validated listing/search API with synthetic room inventory
- [x] Add desktop discovery section with room/roommate mode selection
- [x] Add create-room form with privacy, amenities, highlights, and image validation
- [x] Add result cards, detail view, trust/safety integration, favorites, and connect actions
- [x] Add API and frontend tests for discovery flows

## Advanced Features Slice
- [x] Real-time chat & messaging system with persistent conversations and polling
- [x] Solidity smart contract testing suite, Hardhat deployment scripts, and MetaMask frontend integration
- [x] Interactive Leaflet safety map with Gurugram locality coordinates, NCU campus, and amenity pins
- [x] Enhanced NLP agreement analysis (10+ clauses, Model Tenancy Act mapping, multi-clause summary, comparison)
- [x] File upload backend endpoints and drag-and-drop ImageUpload UI
- [x] Production Dockerfile (multi-stage build), render.yaml, and railway.json
- [x] GitHub Actions CI/CD matrix pipeline (.github/workflows/ci.yml)
- [x] Mobile responsive CSS improvements and dynamic header/initials fixes

## Discovery Integration Assumptions
- The current repository has no persistent Django Listing/Profile models, authentication middleware, MinIO client, frontend router, or connect/chat API. The first integrated slice will use a validated in-memory demo store and explicit synthetic records.
- Image selection is validated in the browser and represented as local previews; production storage must be wired to MinIO before real user uploads are accepted.
- Compatibility is displayed only when an existing MatchResult-style record is available; room listings without a computed match do not receive fabricated percentages.

## Acceptance Strategy
Build an offline-first demo path first. Optional integrations (PostGIS, MinIO, Redis, transformer models, DigiLocker, public chains) must be explicitly marked and degrade to local implementations.
