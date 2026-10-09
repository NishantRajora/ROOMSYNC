# Project Memory - RoomSync

## Core Context
RoomSync is a student-first flatmate-matching and safe-renting web platform ("Find Your People. Find Your Place.") targeting Indian college students and young professionals in the Delhi NCR / Gurugram pilot area (centered around the NCU campus).

---

## Project Objectives
1. **Structured Profiling:** Multi-step onboarding collecting personality, daily routines, hygiene habits, and financial preferences.
2. **Compatibility Scoring:** 5-dimension weighted scoring algorithm (Sleep 25%, Cleanliness 25%, Social 20%, Budget 20%, Food 10%) producing Recharts radar vectors and human-readable friction points.
3. **Fraud Detection & Trust Scoring:** 0–100 heuristic trust engine evaluating landlord KYC, rent-to-median locality ratios, scam keywords, and verified photos.
4. **Legal NLP Clause Analysis:** Rule-based detection flagging predatory clauses (excessive lock-ins, deposit forfeitures, arbitrary rent hikes) with fair replacement wording.
5. **Safety Mapping & SOS Check-in:** GIS locality safety ratings and a real-time countdown timer with automated emergency alert triggers.
6. **Tamper-Evident Roommate Pacts:** Multi-party signed living agreements anchored with deterministic SHA-256 cryptographic fingerprints.
7. **Unified Integrated Web Platform:** Full suite integrated into a single responsive application shell with real-time peer-to-peer communication.

---

## Key Decisions & Implementation History
- **Platform Architecture:** Desktop-first, fully responsive web application built with React 19, Vite, TypeScript, and Tailwind CSS v4.
- **Backend & BaaS:** Supabase for PostgreSQL persistence, user authentication, and real-time WebSocket updates.
- **Real-Time Bidirectional Messaging:**
  - Implemented real-time message sync using Supabase Realtime (`postgres_changes` on `messages`).
  - Implemented multi-tab synchronization using browser `window.addEventListener('storage')`.
  - Replaced one-way conversation IDs with deterministic symmetric IDs: `[user1Id, user2Id].sort().join('_')`.
  - Removed simulated auto-reply timers (`setTimeout`) to enable genuine user-to-user dialogue.
  - Purged legacy hardcoded seed messages (`msg_1`, `msg_2`) so newly created accounts start with a clean inbox.
  - Filtered conversation lists dynamically to only show contacts with whom conversations have been initiated.
  - Synchronized registered accounts into the flatmate directory so real users can discover and message each other.
- **Message Store Preservation:**
  - Preserved message stores across logins while ensuring strict participant-level scoping (`m.senderId === currentUser.id || m.recipientId === currentUser.id`).
- **Data Persistence:** Offline-first caching with `localStorage` paired with asynchronous background cloud synchronization to Supabase.

---

## Honesty Commitments
- **Authentication:** College `.edu` email verification uses a deterministic client verification fallback (`482910`) alongside Supabase Auth.
- **Messaging:** True real-time bidirectional messaging; mock auto-replies have been removed.
- **Blockchain Anchoring:** Roommate Pact hashing uses SHA-256 persisted to the database; on-chain smart contract transactions are planned for future phases.
- **Agreement NLP:** Utilizes a curated regex pattern engine, not a fine-tuned LLM or cloud NLP service.
- **Security State:** RLS is enabled on all tables, currently configured with open development policies for rapid pilot testing.

---

## Open Questions & Roadmap
1. **Row Level Security (RLS) Hardening:** Transition from development open policies to authenticated user-specific write restrictions.
2. **Production Email Delivery:** Configure transactional email delivery (Resend/SendGrid or Supabase SMTP) to replace the OTP fallback.
3. **On-Chain L2 Anchoring:** Evaluate Polygon or Base L2 contracts for on-chain anchoring of finalized Roommate Pacts.
4. **GIS Expansion:** Ingest official municipal and NCRB crime data to expand Safety Map coverage beyond Gurugram Sector 23 / DLF.
