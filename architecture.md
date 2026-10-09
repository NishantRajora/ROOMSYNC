# Architecture Documentation - RoomSync

## Tech Stack
- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS (v4).
- **Backend/BaaS:** Supabase (PostgreSQL, Auth, Storage).
- **State Management:** React Context API (`AppContext`).
- **Visualization:** Recharts (Compatibility Radar Charts), Leaflet (Safety Map).
- **Animation:** Framer Motion / Motion.

## Folder Structure
```text
/src
  /components      # Reusable UI (Common, Layout, Onboarding, Matching)
  /context         # Global state (AppContext)
  /data            # Seed data for demo and testing
  /lib             # Core business logic (Pure functions)
    - scoring.ts   # Compatibility algorithms
    - trust.ts     # Fraud & Trust scoring
    - nlp.ts       # Agreement clause analysis
    - crypto.ts    # SHA-256 hashing for Pacts
    - supabase.ts  # Supabase client configuration
    - settlement.ts# Expense splitting logic
  /pages           # Page-level components (Routing targets)
  /types           # TypeScript interfaces and type definitions
```

## Database Schema (PostgreSQL)

### Tables
| Table | Primary Key | Key Columns | Relationships |
| :--- | :--- | :--- | :--- |
| `profiles` | `id` (text) | `email`, `full_name`, `profile` (jsonb) | Linked to Supabase Auth |
| `listings` | `id` (text) | `owner_id`, `data` (jsonb) | `owner_id` $\rightarrow$ `profiles.id` |
| `pacts` | `id` (text) | `data` (jsonb) | - |
| `expenses` | `id` (text) | `data` (jsonb) | - |
| `reviews` | `id` (text) | `data` (jsonb) | - |
| `messages` | `id` (text) | `data` (jsonb) | - |

### Row Level Security (RLS)
- **Status:** Enabled on all tables.
- **Current Policy:** `Allow all on [table]` (Open policies: `using (true) with check (true)`).
- **Critical Note:** RLS is enabled but currently configured as "Open" for the pilot phase. This must be tightened to restrict writes to authenticated owners.

## Core Logic Implementation

### 1. Compatibility Scoring (`lib/scoring.ts`)
- **Mechanism:** Weighted average across 5 dimensions: Sleep (25%), Cleanliness (25%), Social (20%), Budget (20%), Food (10%).
- **Input:** `UserProfile` objects.
- **Output:** `CompatibilityResult` containing an overall score, radar chart vectors, and human-readable "Reasons" and "Differences".

### 2. Trust Scoring (`lib/trust.ts`)
- **Mechanism:** Heuristic-based analysis.
- **Signals:** 
  - Landlord KYC (+30 pts).
  - Rent vs Locality Median (+25 pts / -20 pts if abnormally low).
  - Scam Keyword Detection (+25 pts / -30 pts if found).
  - Image Authenticity (+20 pts).

### 3. Agreement Analysis (`lib/nlp.ts`)
- **Mechanism:** Rule-based regex matching.
- **Detection:** Scans text for predatory patterns in deposits, lock-in periods, and notice terms.
- **Output:** Risk score (0-100) and fairer suggested wording for flagged clauses.

### 4. Agreement Hashing (`lib/crypto.ts`)
- **Mechanism:** `crypto.subtle.digest('SHA-256')`.
- **Purpose:** Generates a unique fingerprint of the finalized Roommate Pact to ensure tamper-evidence.

## Honesty Notes (Current Gaps/Mocks)
- **Auth:** Email verification OTP is simulated (hardcoded fallback `482910`).
- **Messaging:** Replies from seed users are simulated with a `setTimeout`.
- **Safety Map:** Locality risk data is seeded; the map UI is a prototype.
- **Blockchain:** The "on-chain anchor" is currently a local SHA-256 hash stored in the DB; no actual blockchain transaction occurs.
- **NLP:** Agreement analysis uses Regex, not a trained LLM or ML model.
