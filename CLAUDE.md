# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development Server**: `npm run dev` (runs on port 3000)
- **Build for Production**: `npm run build`
- **Preview Production Build**: `npm run preview`
- **Type Checking/Linting**: `npm run lint`
- **Clean Build Artifacts**: `npm run clean`

## Architecture Overview

RoomSync is a React 19 SPA built with Vite and TypeScript, using Supabase for the backend and Google Gemini AI for contract analysis.

### Core Structure
- **`src/pages/`**: contains the primary views (e.g., `DiscoverPage`, `MatchesPage`, `AgreementAnalyzerPage`).
- **`src/components/`**: organized by feature (chat, layout, matching, onboarding, common).
- **`src/lib/`**: core business logic and utility engines:
    - `scoring.ts`: 5-Vector compatibility computation.
    - `nlp.ts`: AI-powered lease scanning and scam detection.
    - `trust.ts`: Listing trust score calculation.
    - `crypto.ts`: SHA-256 hashing for roommate pacts.
    - `settlement.ts`: Bill splitting and debt minimization logic.
- **`src/context/`**: `AppContext.tsx` handles global state and Supabase synchronization.
- **`src/types/`**: central TypeScript interfaces for the application.

### Integration Points
- **Backend**: Supabase (Auth, PostgreSQL, RLS) via `src/lib/supabase.ts`.
- **AI**: Google Gemini API (`@google/genai`) integrated through `src/lib/nlp.ts`.
- **Maps**: Leaflet.js for locality safety mapping in `SafetyMapPage.tsx`.
- **Visualization**: Recharts for compatibility radar charts in `matching` components.
