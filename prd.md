# Product Requirements Document (PRD) - RoomSync

## Vision
**RoomSync: "Find Your People. Find Your Place."**
A student-first flatmate-matching and safe-renting web platform designed specifically for Indian college students, piloted in Gurugram and Delhi NCR.

## Problem Statement
College students in India face three primary challenges when searching for housing:
1. **Compatibility Mismatch:** Traditional listings focus on the property, not the people, leading to friction in shared living.
2. **Safety & Fraud:** High prevalence of "token fraud," broker-inflated prices, and predatory rental agreements.
3. **Verification Gap:** Difficulty in verifying if a landlord is genuine or if a flatmate is actually a student.

## Target Users
- **Primary:** College students in Delhi NCR (specifically NCU pilot area).
- **Secondary:** Working professionals looking for respectful, student-friendly shared housing.
- **Tertiary:** Verified landlords and student subletters.

## Feature Set & Status

| Feature | Description | Status | Evidence |
| :--- | :--- | :--- | :--- |
| **Identity & Auth** | Sign-up/Login, .edu email verification (Golden Badge), onboarding wizard | **Partial** | `AuthPage.tsx` (UI built, OTP is simulated) |
| **Compatibility Scoring** | 5-dimension scoring (Sleep, Cleanliness, Social, Food, Budget) with human-readable reasons | **Done** | `lib/scoring.ts`, `MatchesPage.tsx` |
| **Trust-Verified Listings** | Discovery with trust scores based on rent vs median, scam keywords, and KYC | **Done** | `lib/trust.ts`, `DiscoverPage.tsx` |
| **Agreement Analyzer** | NLP analysis of rent agreements to flag predatory clauses (Lock-in, Deposit, etc.) | **Done** | `lib/nlp.ts`, `AgreementAnalyzerPage.tsx` |
| **Safety Map** | Locality-based risk scoring, campus proximity, and SOS visit check-in | **Partial** | `SafetyMapPage.tsx` (UI/Data exists, map is simulated/static) |
| **Roommate Pact** | Digitally signed agreements with SHA-256 tamper-evident hashing | **Done** | `lib/crypto.ts`, `RoommatePactPage.tsx` |
| **Bill Splitter** | Shared expense tracking with UPI integration | **Done** | `BillSplitterPage.tsx` |
| **Landlord Reviews** | Student-contributed reviews on landlord behavior and deposit returns | **Done** | `ReviewsPage.tsx` |
| **Messaging** | Floating chat widget for candidates and landlords | **Partial** | `FloatingChat.tsx` (Simulated replies) |
| **Admin Dashboard** | Management of verified users and listings | **Not Built** | N/A |

## Key User Flows (As they exist today)
1. **Onboarding:** User signs up $\rightarrow$ chooses avatar $\rightarrow$ completes 3-step lifestyle/preference wizard $\rightarrow$ receives Golden Badge if `.edu` email is used.
2. **Finding a Flatmate:** User navigates to Matches $\rightarrow$ views compatibility score $\rightarrow$ sees radar chart of differences $\rightarrow$ opens chat.
3. **Evaluating a Flat:** User discovers listing $\rightarrow$ clicks "Trust Score" $\rightarrow$ reviews signals (Rent vs Median, KYC) $\rightarrow$ checks Safety Map for locality risk.
4. **Closing the Deal:** User uploads agreement to Analyzer $\rightarrow$ flags risky clauses $\rightarrow$ generates Roommate Pact $\rightarrow$ all parties sign $\rightarrow$ SHA-256 hash generated.

## Non-Goals
- Native mobile application (Web-first responsive approach).
- Direct payment processing (uses UPI QR/External links).
- Full legal representation (Analyzer is a tool, not a lawyer).
