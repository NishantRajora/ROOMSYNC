# ROOMSYNC 🏠

ROOMSYNC is a comprehensive roommate finding and co-living management ecosystem designed specifically for students. It goes beyond simple listing by integrating trust verification, compatibility scoring, and legal safety tools to ensure a secure and harmonious living experience.

## 🌟 Key Features

### 🔍 Smart Matchmaking & Discovery
- **Compatibility Scoring**: Uses a multi-dimensional vector (sleep, cleanliness, social habits, food, and budget) to match students with compatible roommates.
- **Verified Profiles**: Student verification via college email to reduce fake profiles.
- **Discover Page**: Browse potential roommates and listings with detailed compatibility insights.

### 🛡️ Safety & Trust
- **Listing Trust Score**: An AI-driven trust score for properties that analyzes landlord verification, rent vs. median price, and detects potential scam language.
- **Agreement Analyzer**: Upload rental agreements to detect predatory clauses (e.g., unfair lock-in periods or deposit risks) with AI-powered plain-English explanations and fairer alternatives.
- **Safety Map**: Visualizes locality safety scores, street lighting, and proximity to campus (NCU) to help students pick the safest areas.
- **Visit Alerts**: A safety-first feature for property visits that tracks duration and notifies emergency contacts if a user doesn't check in.

### 🤝 Co-Living Management
- **Roommate Pact**: Create and digitally sign "living contracts" covering quiet hours, chore schedules, guest policies, and deposit splits to prevent future conflicts.
- **Bill Splitter**: Manage shared expenses (Rent, WiFi, Maid, etc.) with integrated UPI settlement tracking.
- **Landlord Reviews**: A community-driven database where students rate landlords on deposit returns and maintenance.

### 💬 Communication
- **Integrated Chat**: Secure messaging between matched roommates and listing owners.

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4, Framer Motion
- **Backend/Database**: Firebase (Firestore, Auth)
- **AI/ML**: Google Gemini AI (Agreement analysis, scam detection, matching)
- **Maps**: Leaflet.js
- **Charts**: Recharts (for compatibility radar charts)

## 🛠️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)

### Local Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Environment Configuration**:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 📁 Project Structure
- `src/pages`: Main application views (Discover, SafetyMap, BillSplitter, etc.)
- `src/lib`: Core logic for scoring, trust analysis, settlement, and NLP.
- `src/components`: Reusable UI components (Chat, Layout, RadarCharts).
- `src/types`: Centralized TypeScript interfaces for Users, Listings, and Pacts.
- `src/context`: Global state management via AppContext.

## 📜 License
Private Project
