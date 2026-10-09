# Coding Rules & Conventions - RoomSync

## General Development
- **Language:** TypeScript (Strict mode).
- **Styling:** Tailwind CSS v4.
- **Architecture:** Component-based React. Logic should be decoupled from UI.
- **State Management:** Use `AppContext` for global state; local state for form/modal transitions.

## Supabase & Database Rules
- **RLS First:** Always enable Row Level Security (RLS) on any new table. 
- **Security:** Never expose the `service_role` key in the frontend. Use only the `anon` key.
- **Types:** Use generated TypeScript types for database rows to ensure schema alignment.
- **Data Integrity:** Keep heavy calculations (scoring, trust, trust-breakdown) in `lib/` as pure functions. Never trust a score submitted directly from the client; recalculate on the server/edge if possible.
- **PII Handling:** Never store raw Aadhaar numbers or passwords in plain text (use Supabase Auth for passwords).

## Logic & Implementation Guidelines
- **Pure Functions:** Logic in `src/lib/` must be pure and testable. 
- **Symmetry:** When implementing "Reasons" for a match, provide "Differences" to ensure transparency.
- **Feedback:** All async actions (register, login, update) must trigger a `showToast` notification.
- **Onboarding:** Onboarding must be a multi-step wizard to avoid user fatigue.

## Design Tokens
- **Primary Color:** `#117c74` (RoomSync Mint).
- **Backgrounds:** `#f6f9f8` (Soft Mint Gray), `#ffffff` (White).
- **Text:** `#17222b` (Deep Charcoal), `#5f7572` (Muted Slate).
- **Accents:** `#fef9c3` (Gold/Verified Badge).
- **Borders:** `#e2ece9` (Soft Sage).
