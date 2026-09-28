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
- [ ] Runnable backend API and health endpoint
- [ ] Matching engine with hard filters, weighted score, and explanations
- [ ] Listing trust and safety scoring modules
- [ ] Agreement parsing, risk rules, and hash verification
- [ ] Solidity registry and local chain integration
- [ ] Desktop frontend dashboard and core flows
- [ ] Seed data and demo script
- [ ] Tests, linting, CI, and documentation

## Room & Flatmate Discovery Feature
- [x] Inspect current architecture and identify demo-only listing/API constraints
- [ ] Add validated listing/search API with synthetic room inventory
- [ ] Add desktop discovery section with room/roommate mode selection
- [ ] Add create-room form with privacy, amenities, highlights, and image validation
- [ ] Add result cards, detail view, trust/safety integration, favorites, and connect actions
- [ ] Add API and frontend tests for discovery flows

## Discovery Integration Assumptions
- The current repository has no persistent Django Listing/Profile models, authentication middleware, MinIO client, frontend router, or connect/chat API. The first integrated slice will use a validated in-memory demo store and explicit synthetic records.
- Image selection is validated in the browser and represented as local previews; production storage must be wired to MinIO before real user uploads are accepted.
- Compatibility is displayed only when an existing MatchResult-style record is available; room listings without a computed match do not receive fabricated percentages.

## Acceptance Strategy
Build an offline-first demo path first. Optional integrations (PostGIS, MinIO, Redis, transformer models, DigiLocker, public chains) must be explicitly marked and degrade to local implementations.
