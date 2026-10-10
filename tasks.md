# Project Progress & Tasks - RoomSync

## Feature Status Matrix

| Feature | Status | Implementation Evidence |
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

## Objective Alignment Matrix

| Objective | Status | Implementation Evidence |
| :--- | :--- | :--- |
| **1. Structured Profiling** | **Done** | `AuthPage.tsx` (3-step onboarding wizard), `types/index.ts` |
| **2. Compatibility Scoring** | **Done** | `lib/scoring.ts`, `MatchesPage.tsx`, `RadarChartModal.tsx` |
| **3. Fake Listing Detection** | **Done** | `lib/trust.ts`, `DiscoverPage.tsx` |
| **4. Agreement NLP Analysis** | **Done** | `lib/nlp.ts`, `AgreementAnalyzerPage.tsx` |
| **5. GIS Safety Map & Visit SOS** | **Done** | `SafetyMapPage.tsx`, `SosCheckinModal.tsx` |
| **6. Cryptographic Tamper-Evidence**| **Done** | `lib/crypto.ts` (Deterministic SHA-256 digital fingerprinting) |
| **7. Integrated Web Platform** | **Done** | `App.tsx`, `AppShell.tsx` (All 9 core modules integrated into single shell) |

---

## Completed in Recent Sprint
- [x] **Real-Time Bidirectional Messaging:** Subscribed to Supabase Realtime WebSocket changes on `public.messages`.
- [x] **Multi-Tab Synchronization:** Added `window.addEventListener('storage')` for instant communication across browser windows.
- [x] **Removal of Mock Auto-Replies:** Eliminated `setTimeout` automated responses for authentic peer-to-peer conversations.
- [x] **Clean New Account Inboxes:** Purged hardcoded legacy seed messages (`msg_1`, `msg_2`) on initial load and account creation.
- [x] **Dynamic Active Chats Derivation:** Updated conversation lists to display only initiated conversations, with zero-state action triggers.
- [x] **Unified Contact Discovery:** Integrated newly registered accounts into the flatmate directory so real users can discover and message each other.
- [x] **Symmetric Conversation Matching:** Implemented `isMsgBetween` with deterministic IDs (`[uid1, uid2].sort().join('_')`).
- [x] **Message Store Preservation:** Fixed state wiping on logout/register so received messages persist safely.

---

## Known Bugs & Gaps to Address

1. **Row Level Security (RLS) Hardening:**
   - Database tables currently use open development policies (`using (true) with check (true)`).
   - Needs restrictive policies: `auth.uid() = id` for `profiles`, and `auth.uid() = owner_id` for `listings`.

2. **Production Email OTP:**
   - Educational `.edu` email verification currently uses a client-side verification fallback (`482910`).
   - Needs transactional SMTP (Resend, SendGrid, or Supabase SMTP) for real email delivery.

3. **On-Chain Blockchain Anchoring:**
   - Roommate Pact fingerprint is hashed using SHA-256 and stored in PostgreSQL.
   - True decentralized anchoring requires broadcasting the hash to an L2 blockchain (e.g., Polygon or Base).

---

## Next Actions (Prioritized)

### P0: Production Security & Compliance
1. **Hardened RLS Migration:** Update `supabase-schema.sql` with authenticated user constraints.
2. **Transactional Email OTP:** Replace the simulated fallback code with live email delivery.

### P1: Data & Feature Enhancements
3. **On-Chain Hash Anchoring:** Implement smart contract transaction or API call to record Pact hashes on Polygon/Base.
4. **GIS Safety Map Live Data:** Integrate real municipal or NCRB crime statistics into the safety scoring algorithm.

### P2: Administration & Operations
5. **Admin Management Console:** Build an administrative dashboard for verifying student ID cards and managing reported listings.
6. **Data Export:** Add user data download functionality (GDPR / Indian DPDP Act compliance).
