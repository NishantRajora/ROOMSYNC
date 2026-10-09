# Architecture Documentation - RoomSync

## Tech Stack
- **Frontend Framework:** React 19, Vite, TypeScript.
- **Styling & Design System:** Tailwind CSS (v4), Lucide React (icons), Canvas Confetti (celebration effects).
- **Backend / BaaS:** Supabase (PostgreSQL, Supabase Auth, Supabase Realtime via WebSocket channels).
- **State Management & Communication:** React Context API (`AppContext`), Cross-Tab Storage Event Bus (`window.addEventListener('storage')`).
- **Data Visualization & GIS:** Recharts (5-axis Compatibility Radar Charts), Leaflet / GIS locality mapping.
- **Client Routing & Shell:** Hash/Path based view state management with `AppShell`.

---

## Folder Structure
```text
/src
  /components
    /chat            # Floating chat widget (FloatingChat.tsx)
    /common          # Shared UI (VerifiedBadge.tsx, SosCheckinModal.tsx)
    /layout          # Top navigation, mobile drawer, app shell (AppShell.tsx)
    /matching        # Radar compatibility visualization modal (RadarChartModal.tsx)
    /onboarding      # Profile onboarding modal (OnboardingModal.tsx)
  /context           # Unified state management & BaaS synchronization (AppContext.tsx)
  /data              # Seed candidates, listings, pacts, localities (seedData.ts)
  /lib               # Pure algorithmic business logic
    - scoring.ts     # 5-dimension compatibility scoring engine
    - trust.ts       # Fraud detection & 0-100 listing trust scoring
    - nlp.ts         # Regex-based predatory rental agreement analysis
    - crypto.ts      # SHA-256 digital fingerprinting for Roommate Pacts
    - settlement.ts  # Shared flatmate expense splitting calculations
    - supabase.ts    # Supabase BaaS client initialization
  /pages             # Top-level view controllers
    - LandingPage.tsx           # Public marketing & hero section
    - AuthPage.tsx              # Login/signup & 3-step lifestyle wizard
    - DiscoverPage.tsx          # Housing listings with trust breakdown
    - MatchesPage.tsx           # Flatmate compatibility recommendations
    - MessagesPage.tsx          # Dedicated split-view messaging center
    - AgreementAnalyzerPage.tsx # Legal clause risk evaluation
    - RoommatePactPage.tsx      # Digital pact signing & hash anchoring
    - BillSplitterPage.tsx      # Shared expenses & UPI settle flow
    - ReviewsPage.tsx           # Student reviews for landlords & localities
    - SafetyMapPage.tsx         # Locality safety scores & SOS visit alerts
    - ProfilePage.tsx           # Identity verification & preference manager
  /types             # TypeScript models and interfaces (index.ts)
  /utils             # Shared utility functions (chatUtils.ts)
```

---

## Database Schema (PostgreSQL on Supabase)

### Tables
| Table | Primary Key | Key Columns | Relationships & Purpose |
| :--- | :--- | :--- | :--- |
| `profiles` | `id` (text) | `email`, `full_name`, `profile` (jsonb), `updated_at` | Stores structured student profiles; linked to Supabase Auth user IDs |
| `listings` | `id` (text) | `owner_id`, `data` (jsonb), `created_at` | Verified rental properties with trust metrics (`owner_id` $\rightarrow$ `profiles.id`) |
| `pacts` | `id` (text) | `data` (jsonb), `created_at` | Digitally signed roommate agreements with tamper-evident hashes |
| `expenses` | `id` (text) | `data` (jsonb), `created_at` | Shared flatmate bills, split amounts, and settlement statuses |
| `reviews` | `id` (text) | `data` (jsonb), `created_at` | Student-submitted landlord and neighborhood reviews |
| `messages` | `id` (text) | `data` (jsonb), `created_at` | Real-time chat messages between flatmates and landlords |

### Message Payload Schema (`messages.data`)
```typescript
export interface ChatMessage {
  id: string;               // Unique message identifier (msg_<timestamp>_<rand>)
  conversationId: string;   // Symmetric identifier: [senderId, recipientId].sort().join('_')
  senderId: string;         // UserProfile.id of the sender
  senderName: string;       // Display name of sender
  recipientId?: string;     // UserProfile.id of the intended recipient
  recipientName?: string;   // Display name of recipient
  recipientAvatar?: string; // Avatar URL of recipient
  text: string;             // Message body content
  timestamp: string;        // Human-readable timestamp (e.g., '10:45 AM')
  isSelf?: boolean;         // Evaluated dynamically against currentUser.id
}
```

### Row Level Security (RLS)
- **Status:** Enabled on all tables (`profiles`, `listings`, `pacts`, `expenses`, `reviews`, `messages`).
- **Current Policy:** Open development policies (`using (true) with check (true)`).
- **Roadmap Requirement:** Restrict write permissions so users can only insert or update records matching their authenticated Supabase UID.

---

## Real-Time Messaging Architecture

RoomSync utilizes a **dual-layer real-time communication pipeline**:

1. **Supabase Realtime Channel (`postgres_changes`):**
   - Subscribed via `supabase.channel('roomsync_messages_live')`.
   - Listens to all `INSERT`, `UPDATE`, and `DELETE` events on `public.messages`.
   - Incoming messages are merged into React state and immediately cached locally.
   - Enables instant cross-device and cross-browser chat synchronization.

2. **Cross-Tab LocalStorage Event Bus:**
   - Listens to browser `window.addEventListener('storage')` on `'roomsync_messages'`.
   - When Person 1 sends a message on Tab A, Tab B updates React state immediately without waiting for network latency.

3. **Symmetric Conversation Matching:**
   - Conversation IDs are computed deterministically: `[user1Id, user2Id].sort().join('_')`.
   - Matching helper `isMsgBetween(message, user1, user2)` resolves messages symmetrically, ensuring both parties see the identical thread.
   - Pre-existing mock messages (`msg_1`, `msg_2`) are purged, and automatic bot replies have been removed in favor of genuine peer-to-peer communication.

4. **Dynamic Active Chats Filtering:**
   - Conversations in [`MessagesPage.tsx`](file:///c:/My%20Space/Github_Repo/ROOMSYNC/src/pages/MessagesPage.tsx) are dynamically derived from messages exchanged by `currentUser`.
   - New accounts start with a clean inbox with no uninitiated candidate chats.
   - Newly registered accounts are synchronized into the candidate directory so real users can find and message each other.

---

## Core Algorithmic Implementations

### 1. Compatibility Scoring (`lib/scoring.ts`)
- **Dimensions & Weights:**
  - Sleep Schedule & Routine: **25%**
  - Cleanliness Standards: **25%**
  - Social & Guest Habits: **20%**
  - Budget Overlap: **20%**
  - Food & Diet Preferences: **10%**
- **Output:** `CompatibilityResult` with composite score (0–100), Recharts-compatible radar vector data, positive compatibility highlights, and lifestyle friction points.

### 2. Listing Trust Scoring Engine (`lib/trust.ts`)
- **Evaluation Criteria (0–100 Score):**
  - Landlord Identity & KYC verification: **+30 points**
  - Fair Price Verification (Rent vs locality median threshold): **+25 points** (Abnormally low rent penalizes **-20 points** for bait-and-switch)
  - Scam Keyword Detection (Tokens, Western Union, deposit-before-visit): **+25 points** if clean / **-30 points** if flagged
  - Verified Property Photography: **+20 points**
- **Classification:** Categorized as **High Trust (80-100)**, **Moderate Trust (60-79)**, or **Caution Needed (<60)**.

### 3. Rental Agreement NLP Analysis (`lib/nlp.ts`)
- **Mechanism:** Deterministic regex pattern matching tailored to Indian residential lease conventions.
- **Analyzed Risks:**
  - Non-refundable deposit deductions and forfeiture terms
  - Excessive lock-in periods (>11 months)
  - Unreasonable rent escalation clauses (>10% per annum)
  - Unannounced landlord inspection rights
  - Strict guest and late-entry penalties
- **Output:** Overall agreement risk rating with clause-by-clause fair wording recommendations.

### 4. Roommate Pact Digital Anchoring (`lib/crypto.ts`)
- **Mechanism:** Web Cryptography API (`crypto.subtle.digest('SHA-256')`).
- **Functionality:** Normalizes agreed house rules, quiet hours, chore splits, and signatures into a deterministic string and computes an immutable SHA-256 tamper hash.

---

## Honesty & Transparency Commitments
- **Authentication:** Email OTP utilizes a deterministic client fallback (`482910`) alongside Supabase Auth password and profile metadata syncing.
- **Messaging:** True bidirectional messaging via Supabase Realtime; automated mock replies have been permanently eliminated.
- **Blockchain Anchoring:** Agreement fingerprinting uses SHA-256 hashing persisted to the database; on-chain smart contract integration remains planned.
- **Agreement Analysis:** Employs an expert-curated regex ruleset rather than a hosted Large Language Model.
- **Safety GIS:** Locality risk metrics and NCU proximity are pre-calculated based on seeded regional data.
