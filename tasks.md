# Project Progress & Tasks - RoomSync

## Feature Status Matrix

| Feature | Status | Evidence |
| :--- | :--- | :--- |
| **Landing Page** | Done | `LandingPage.tsx` |
| **Authentication (UI)** | Done | `AuthPage.tsx` |
| **Auth (Supabase)** | Partial | `AppContext.tsx` (Auth integrated, but OTP simulated) |
| **Onboarding Wizard** | Done | `AuthPage.tsx` (Lifestyle & Preference steps) |
| **Compatibility Scoring** | Done | `lib/scoring.ts`, `MatchesPage.tsx` |
| **Match Feed / Radar** | Done | `MatchesPage.tsx`, `RadarChartModal.tsx` |
| **Listing Discovery** | Done | `DiscoverPage.tsx` |
| **Trust Scoring Engine** | Done | `lib/trust.ts` |
| **Agreement Analyzer** | Done | `lib/nlp.ts`, `AgreementAnalyzerPage.tsx` |
| **Roommate Pact (Hashing)**| Done | `lib/crypto.ts`, `RoommatePactPage.tsx` |
| **Safety Map UI** | Partial | `SafetyMapPage.tsx` (Static data, simulation) |
| **SOS Visit Check-in** | Done | `AppContext.tsx` (Logic), `SosCheckinModal.tsx` |
| **Bill Splitter / UPI** | Done | `BillSplitterPage.tsx` |
| **Landlord Reviews** | Done | `ReviewsPage.tsx` |
| **Messaging (UI)** | Done | `MessagesPage.tsx`, `FloatingChat.tsx` |
| **Messaging (Realtime)** | Mocked | `AppContext.tsx` (Simulated replies) |
| **Admin Dashboard** | Not Started | N/A |

## Objective Alignment

| Objective | Status | Evidence |
| :--- | :--- | :--- |
| 1. Structured Profiling | **Done** | `AuthPage.tsx` (3-step wizard), `types/index.ts` |
| 2. Compatibility Scoring | **Done** | `lib/scoring.ts`, `MatchesPage.tsx` |
| 3. Fake Listing Detection | **Done** | `lib/trust.ts`, `DiscoverPage.tsx` |
| 4. Agreement NLP Analysis | **Done** | `lib/nlp.ts`, `AgreementAnalyzerPage.tsx` |
| 5. GIS Safety Map | **Partial** | `SafetyMapPage.tsx` (UI built, data seeded) |
| 6. Blockchain Hashing | **Mocked** | `lib/crypto.ts` (SHA-256 used, no actual chain) |
| 7. Integrated Web Platform | **Done** | `App.tsx` (All modules linked via Navigation) |

## Known Bugs & Gaps
- **Security:** RLS policies are currently "Allow All" (`using (true)`). This is a critical security gap.
- **Auth:** College email verification doesn't send real emails; it's a UI simulation.
- **Messaging:** No real-time Supabase Realtime subscription; responses are simulated.
- **Blockchain:** Hashing is done, but there is no "on-chain" anchor.

## Next Actions (Prioritized)
### P0: Critical (Objective Requirements)
1. **Fix RLS Policies:** Restrict `profiles` and `listings` so only authenticated users can write to their own data.
2. **Implement Real Email OTP:** Replace simulated OTP with Supabase Auth email confirmation.
3. **Actual On-Chain Anchor:** Implement a simple blockchain write (e.g., via a third-party API or L2) for Pact hashes.

### P1: Demo Polish
4. **Realtime Chat:** Implement `supabase.channel()` for actual real-time messaging.
5. **Interactive Safety Map:** Connect map markers to real-time filterable data.

### P2: Extra Features
6. **Admin Dashboard:** Build a view for managing verified badges and flagged listings.
7. **Export Data:** Add a "Download My Profile" feature.
