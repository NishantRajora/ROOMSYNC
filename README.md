# RoomSync 🏠

> **Smart Roommate Matching & Co-Living Safety Ecosystem for Students & Young Professionals**

RoomSync is a comprehensive roommate matching and flat-sharing management platform designed for college students and working professionals. It bridges the gap between searching for accommodation and harmonious co-living by combining **multi-vector lifestyle compatibility scoring**, **AI-driven rental agreement analysis**, **verified housing listings with scam detection**, and **digitally signed roommate pacts**.

---

## 🌟 Key Features

### 🔍 1. Multi-Vector Roommate Matching
* **5-Vector Compatibility Matrix:** Scores compatibility based on **Sleep Schedule** (early bird vs. night owl), **Cleanliness** (relaxed to neat freak), **Social Habits** (introvert to extrovert), **Food Preferences** (pure veg, eggetarian, non-veg, etc.), and **Budget Match**.
* **Visual Radar Charts:** Interactive Recharts radar charts comparing your lifestyle habits side-by-side with prospective flatmates.
* **Dealbreaker Detection:** Highlights potential clashes in advance (smoking, alcohol, overnight guests, noise levels).

### 🛡️ 2. Rental Agreement Analyzer (AI-Powered)
* **Predatory Clause Flagging:** Scans rental contracts for arbitrary rent escalations, unreasonable deposit forfeiture, unfair notice periods, or privacy intrusions.
* **Plain-English Explanations:** Explains legal jargon in simple terms.
* **Fairer Suggestions:** Provides student-friendly alternate clause drafting to counter landlord demands.
* **Deposit Safety Rating:** Rates overall risk level from Low Risk to Severe Predatory Clauses.

### 🏡 3. Verified Housing & Trust Scores
* **Listing Trust Score (0–100):** Evaluates listings based on landlord verification, deposit-to-rent ratio vs. locality median, and detects scam keywords.
* **NCU Campus Proximity:** Displays exact distance and commute times to colleges and tech hubs (Sector 23, DLF Phase 3, Cyber City).
* **Direct Flat Posting:** Allows landlords and flatmates to publish rooms with photos, amenities, and rent details.

### 🤝 4. Roommate Pacts (Living Agreements)
* **Digital Cohabitation Contracts:** Establishes agreed-upon rules for quiet hours, cleaning schedules, kitchen sharing, and guest policies.
* **SHA-256 Tamper-Proof Cryptographic Hash:** Locks pacts with an unalterable digital hash once all flatmates sign.
* **Digital Signatures:** Track individual signing timestamps and recorded consent.

### 💸 5. Shared Bill Splitter & UPI Settlements
* **Expense Categorization:** Rent, Electricity, Groceries, WiFi, Maid & Cook, and Maintenance.
* **Debt Minimization:** Automatically calculates who owes whom and generates instant UPI settlement amounts.
* **Settlement Tracking:** Mark expenses as paid/settled in real time.

### 🗺️ 6. Locality Safety Map
* **Interactive Leaflet Map:** Displays student density, street lighting ratings, night safety scores, and nearest police stations.
* **Commute & Caution Alerts:** Real-time tips and transit highlights for safe travel.

### ⏱️ 7. Safety Visit Alerts (SOS)
* **Property Visit Timer:** Start a countdown before entering an unfamiliar property.
* **Emergency Contact Fallback:** If the timer reaches zero without a safe check-in, an emergency alert is triggered with your location details.

### 💬 8. In-App Messaging
* **Direct Flatmate Chat:** Floating chat modal and full conversations tab to coordinate flat visits and agreements.

---

## 🚀 Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Animation** | Tailwind CSS 4, Motion (Framer Motion), Canvas Confetti |
| **Backend & Cloud Database** | **Supabase** (Auth, PostgreSQL Database, Row-Level Security) |
| **AI & NLP Analysis** | Google Gemini AI (`@google/genai`) |
| **Interactive Maps** | Leaflet.js, React-Leaflet |
| **Data Visualizations** | Recharts (Radar Charts) |
| **Icons** | Lucide React |

---

## 📁 Project Folder Structure

```plaintext
ROOMSYNC/
├── .env.example              # Environment variables template
├── supabase-schema.sql       # 1-Click Supabase database migration script
├── vercel.json               # SPA routing rewrite configuration for Vercel
├── vite.config.ts            # Vite build configuration (React & Tailwind plugins)
├── package.json              # Project dependencies and npm scripts
├── src/
│   ├── main.tsx              # React application entry point
│   ├── App.tsx               # Client-side router & AppShell view controller
│   ├── index.css             # Tailwind CSS 4 design tokens & base styling
│   │
│   ├── components/
│   │   ├── chat/             # FloatingChat widget & quick messaging
│   │   ├── common/           # SosCheckinModal, VerifiedBadge, utility modals
│   │   ├── layout/           # AppShell, responsive sidebar & top navigation
│   │   ├── matching/         # RadarChartModal for side-by-side compatibility
│   │   └── onboarding/       # Secondary multi-step profile builder modal
│   │
│   ├── context/
│   │   └── AppContext.tsx    # Global state management & Supabase cloud sync
│   │
│   ├── data/
│   │   └── seedData.ts       # Curated NCU student profiles, listings, localities
│   │
│   ├── lib/
│   │   ├── crypto.ts         # SHA-256 hashing for Roommate Pacts
│   │   ├── nlp.ts            # Agreement clause analysis & scam detection
│   │   ├── scoring.ts        # 5-Vector compatibility computation engine
│   │   ├── settlement.ts     # Split bill settlement & debt minimization
│   │   ├── supabase.ts       # Supabase client initialization & connection checks
│   │   └── trust.ts          # Housing listing Trust Score calculator
│   │
│   ├── pages/
│   │   ├── AgreementAnalyzerPage.tsx  # Legal lease scanner & clause grader
│   │   ├── AuthPage.tsx               # Login, Sign Up, & lifestyle onboarding
│   │   ├── BillSplitterPage.tsx       # Expense tracker & UPI settlements
│   │   ├── DiscoverPage.tsx           # Housing listings & flatmate candidate feed
│   │   ├── LandingPage.tsx            # Public homepage & hero presentation
│   │   ├── MatchesPage.tsx            # Sorted compatibility results & radar modal
│   │   ├── MessagesPage.tsx           # Conversations & direct flatmate inbox
│   │   ├── ProfilePage.tsx            # User profile editor & student badge status
│   │   ├── ReviewsPage.tsx            # Student reviews on landlords & deposits
│   │   ├── RoommatePactPage.tsx       # Digital cohabitation contract builder
│   │   └── SafetyMapPage.tsx          # Leaflet geographic locality safety index
│   │
│   └── types/
│       └── index.ts          # TypeScript interfaces (UserProfile, Listing, Pact, etc.)
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- A free **Supabase** account ([supabase.com](https://supabase.com))

### 2. Clone and Install
```bash
git clone https://github.com/NishantRajora/ROOMSYNC.git
cd ROOMSYNC
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Supabase Configuration (Find in Supabase Dashboard -> Project Settings -> API)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# Optional: Google Gemini API Key for lease scanning
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Supabase Database Setup
1. In your [Supabase Dashboard](https://supabase.com/dashboard), open the **SQL Editor** tab (`>_`).
2. Open [`supabase-schema.sql`](./supabase-schema.sql), copy the contents, paste into the query box, and click **Run**.
3. Under **Authentication ➔ Providers ➔ Email**, disable **"Confirm email"** so users can sign in immediately after registration.

### 5. Run the Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 📦 Production Build & Deployment

### Build for Production
```bash
npm run build
```
This bundles the optimized application into the `dist/` directory.

### Deploying on Vercel
1. Import your GitHub repository to [Vercel](https://vercel.com).
2. Add your environment variables under **Project Settings ➔ Environment Variables**:
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
3. Single Page App (SPA) route rewrites are handled by the included [`vercel.json`](./vercel.json).
4. Click **Deploy**.

---

## 📄 License
This project is licensed under the MIT License — see the repository for details.
