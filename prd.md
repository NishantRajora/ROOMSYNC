# Product Requirements Document (PRD) - RoomSync

## Vision
**RoomSync: "Find Your People. Find Your Place."**
A student-first flatmate-matching and safe-renting web platform designed specifically for Indian college students and young professionals, piloted in the Gurugram and Delhi NCR university corridors (centered around The NorthCap University / Sector 23).

---

## Problem Statement
College students and young graduates in India face three acute pain points when searching for rental housing:
1. **Lifestyle Compatibility Friction:** Traditional real estate platforms list physical properties without profiling prospective roommates, causing severe lifestyle clashes regarding sleep schedules, hygiene standards, guests, and food habits.
2. **Rental Fraud & Broker Exploitation:** Rampant "token deposit fraud", artificial broker price inflation, unverified listings, and predatory clauses in informal lease agreements.
3. **Safety & Verification Deficit:** Inability to independently verify if a flatmate is a registered student or if a landlord has legitimate property ownership, alongside safety vulnerabilities during in-person flat viewings.

---

## Target Personas
- **Primary: University Students (Ages 18–23):** Undergraduates moving out of hostels or family homes looking for budget-conscious, routine-aligned roommates and safe flats near campus.
- **Secondary: Early-Career Professionals (Ages 22–27):** Tech/corporate professionals seeking clean, quiet, and reliable shared flats in major employment hubs (Cyber Hub, DLF Phase 3).
- **Tertiary: Verified Landlords & Student Housing Providers:** Property owners seeking verified, respectful student tenants with transparent agreement terms.

---

## Feature Matrix & Implementation Status

| Module | Feature Description | Status | Implementation Evidence |
| :--- | :--- | :--- | :--- |
| **Identity & Authentication** | Email sign-up/login, .edu college verification (Golden Badge), multi-step profile onboarding wizard | **Done** | `AuthPage.tsx`, `AppContext.tsx`, Supabase Auth |
| **Compatibility Scoring Engine** | 5-dimension algorithm (Sleep 25%, Cleanliness 25%, Social 20%, Budget 20%, Food 10%) with match highlights | **Done** | `lib/scoring.ts`, `MatchesPage.tsx`, `RadarChartModal.tsx` |
| **Trust-Scored Listings** | Housing search with 0–100 trust scores (Rent vs median, scam keywords, landlord KYC, photo audits) | **Done** | `lib/trust.ts`, `DiscoverPage.tsx` |
| **Rental Agreement Analyzer** | Regex NLP engine flagging predatory clauses (excessive lock-ins, deposit forfeitures) with fair rewrites | **Done** | `lib/nlp.ts`, `AgreementAnalyzerPage.tsx` |
| **Safety Map & Locality GIS** | Neighborhood safety scores, proximity to campus, and emergency SOS Visit countdown timer | **Done** | `SafetyMapPage.tsx`, `SosCheckinModal.tsx`, `AppShell.tsx` |
| **Tamper-Evident Roommate Pact**| Multi-party digital agreement with deterministic SHA-256 cryptographic hash generation | **Done** | `lib/crypto.ts`, `RoommatePactPage.tsx` |
| **Bill Splitter & Expense Sharing**| Shared flat expense tracking, equal/custom splits, and UPI payment reconciliation | **Done** | `lib/settlement.ts`, `BillSplitterPage.tsx` |
| **Landlord & Locality Reviews** | Community reviews on landlord deposit returns, maintenance responsiveness, and neighborhood safety | **Done** | `ReviewsPage.tsx` |
| **Real-Time Messaging Center** | Dedicated split-view chat dashboard and floating drawer powered by Supabase Realtime & multi-tab sync | **Done** | `MessagesPage.tsx`, `FloatingChat.tsx`, `AppContext.tsx` |
| **Admin Management Console** | Platform administration for KYC reviews, listing moderation, and verification badge approval | **Planned** | Roadmap Phase 2 |

---

## Core User Workflows

### 1. Onboarding & Lifestyle Profiling
1. User signs up via email/password or logs into an existing account.
2. Completes the 3-step Onboarding Wizard specifying sleep schedule, cleanliness rating, social preferences, food habits, budget range, and preferred localities.
3. Supplying an institutional `.edu` email awards the **Golden Student Verified Badge**.

### 2. Roommate Discovery & Lifestyle Comparison
1. User navigates to **Roommate Matches**.
2. Candidates are ranked dynamically by overall compatibility percentage.
3. User opens the **Radar Chart Modal** to inspect lifestyle alignment across all 5 dimensions.
4. Clicks **Chat** to immediately initiate communication.

### 3. Real-Time Peer-to-Peer Communication
1. User navigates to **Messages** or clicks the floating chat drawer.
2. The conversation list dynamically reflects only initiated conversations with prospective flatmates or verified landlords.
3. Messages are routed symmetrically using deterministic thread IDs (`[uid1, uid2].sort().join('_')`).
4. Messages sync instantly across tabs and devices via Supabase Realtime WebSocket events.

### 4. Evaluating Flats & Verifying Landlords
1. User explores properties in **Discover Flats** with budget, locality, and verified-only filters.
2. Inspects the **Trust Score Breakdown** (KYC verified, rent vs locality median, scam keyword audit).
3. Directly contacts verified landlords through integrated messaging.

### 5. Lease Agreement Safety & Roommate Pacts
1. User pastes a rental agreement into the **Agreement Analyzer**.
2. High-risk clauses are flagged with color-coded severity badges and suggested fair terms.
3. User and prospective flatmates generate a **Roommate Pact** outlining house rules, quiet hours, and chore duties.
4. All flatmates digitally sign; the agreement is hashed using SHA-256 for tamper-evidence.

### 6. Safe Flat Tours (SOS Visit Check-In)
1. Before visiting an unfamiliar rental property, the user activates an **SOS Visit Check-In**.
2. Configures a countdown timer (15–60 minutes), property address, and emergency contact.
3. A persistent top banner tracks remaining time; failing to confirm safety triggers an emergency alert.

---

## Non-Goals & Boundaries
- **Native Mobile Apps:** RoomSync is optimized as a mobile-responsive web platform.
- **In-App Payment Gateway:** Utilizes direct UPI deep-linking rather than taking custody of user funds.
- **Legal Counsel:** The Agreement Analyzer provides educational risk assessment, not formal legal representation.
