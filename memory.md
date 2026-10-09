# Project Memory - RoomSync

## Core Context
RoomSync is a student-first flatmate-matching and safe-renting web platform ("Find Your People. Find Your Place.") targeting Indian college students in the Delhi NCR / Gurugram pilot area.

## Project Objectives
1. **Structured Profiling:** Comprehensive personality, lifestyle, and routine data collection via a multi-step onboarding wizard.
2. **Compatibility Scoring:** A 5-dimension weighted algorithm (Sleep, Cleanliness, Social, Budget, Food) with human-readable match reasons.
3. **Fraud Detection:** Trust-scoring engine for listings based on rent-to-median ratios, scam keywords, and KYC.
4. **Legal NLP:** Rule-based analysis of rent agreements to flag predatory clauses (Lock-ins, Deposit forfeiture).
5. **Safety Mapping:** GIS-based locality risk scores and a "SOS Visit Check-in" tool for property visits.
6. **Tamper-Evidence:** SHA-256 hashing of finalized roommate pacts to ensure integrity.
7. **Integration:** All modules unified into a single responsive web platform.

## Key Decisions
- **Platform:** Website (Desktop-first, responsive) instead of a native app.
- **Stack:** React + Vite + TypeScript + Tailwind CSS.
- **Backend:** Supabase (PostgreSQL, Auth, Storage) instead of Firebase.
- **Architecture:** Logic decoupled into `lib/` pure functions to ensure testability and consistency.

## Honesty Commitments
- **Mocked Features:** 
  - Email OTPs are simulated (fallback code `482910`).
  - Chat responses are simulated via `setTimeout`.
  - Blockchain "anchoring" is currently a local SHA-256 hash stored in the database.
  - Agreement analysis uses a robust Regex rule-set, not a trained ML model.
- **Security State:** RLS is enabled on all tables but currently set to `Allow All` for the pilot phase. This is a known gap.

## Open Questions
- Which L2 blockchain or hashing service to use for actual on-chain anchoring of Pacts?
- How to integrate real NCRB crime data into the Safety Map beyond the current seeded data?
- Should the Admin Dashboard be a separate app or a protected route within the main platform?
