# Design System - RoomSync

## Visual Identity
RoomSync adheres to a **student-centric, trust-forward, and modern** aesthetic. The color palette pairs organic mints and teals with deep slate charcoals and clean surface whites to evoke safety, approachability, and reliability.

---

## Color Palette
| Token | Hex / Classes | Visual Purpose |
| :--- | :--- | :--- |
| **Primary (Teal)** | `#117c74` | Main brand color, primary actions, active tabs, header banners |
| **Primary Hover** | `#0d635c` | Interactive button hover and pressed states |
| **Background** | `#f6f9f8` | Primary page backdrop, light chat bubbles, card header accents |
| **Surface (Card)** | `#ffffff` | Content containers, modal dialogs, message input boxes, sidebars |
| **Text Primary** | `#17222b` | Page titles, headings, bold body text, participant names |
| **Text Secondary**| `#5f7572` | Subtitles, college/course tags, timestamps, secondary labels |
| **Border** | `#e2ece9` | Card borders, sidebar dividers, message borders, form outlines |
| **Success / Online** | `#10b981` | Real-time "Online" badges (`#ecfdf5`), high trust scores, safe clauses |
| **Danger / Alert** | `#f43f5e` | SOS emergency banner, scam keywords, predatory agreement clause flags |
| **Verified Student**| `#fef9c3` / `#854d0e` | Golden student badge for verified `.edu` college affiliations |
| **Verified Pro** | `#e0f2fe` / `#0369a1` | Work verification badge for verified corporate flatmates |

---

## Typography
- **Headings (`font-heading`):** Bold, tightly tracked geometric typography used for primary navigation, page titles, and modal headers.
- **Body (`font-sans`):** High-legibility sans-serif for message streams, descriptions, metadata, and form inputs.
- **Type Scale:**
  - `text-[10px]` & `text-[11px]`: Message timestamps, secondary metadata, badge labels.
  - `text-xs` (12px): Standard body descriptions, navigation tab labels, input placeholders.
  - `text-sm` (14px): Section headings, user full names in lists, button text.
  - `text-base` to `text-2xl`: Page headings, feature banners, modal titles.

---

## Component Specifications & Layout Patterns

### 1. Dedicated Messaging Center (`MessagesPage.tsx`)
- **Container:** `max-w-7xl mx-auto h-[calc(100vh-140px)]` full-height view.
- **Left Sidebar (`w-80`):**
  - Header with active chats counter and `+ New Chat` trigger.
  - Interactive conversation cards with avatar, name, verification badge, last message preview, and timestamp.
  - Active conversation highlighted with `border-l-4 border-l-[#117c74]` and elevated shadow.
  - Empty state with informative graphic when no conversations have been initiated.
- **Main Chat Viewport:**
  - Top bar featuring partner avatar, full name, course/company subtitle, verified badge, and live "Online" indicator.
  - Chat stream with distinct message bubbles:
    - **Self messages:** Styled in `bg-[#117c74] text-white rounded-br-xs shadow-2xs` aligned to the right.
    - **Partner messages:** Styled in `bg-white text-[#17222b] border border-[#e2ece9] rounded-bl-xs shadow-2xs` aligned to the left.
  - Smooth autoscroll to the latest message.
  - Zero-conversation state featuring quick-action cards to find flatmates, discover flats, or start a new chat.
- **Start New Chat Modal:**
  - Centered backdrop-blurred modal (`backdrop-blur-xs`).
  - Real-time search filter for both prospective flatmates and verified property landlords.

### 2. Floating Chat Drawer (`FloatingChat.tsx`)
- **Docked State:** Fixed pill button at `bottom-6 right-6` with pulsating online green indicator.
- **Expanded State:** Rounded container (`rounded-3xl shadow-2xl`, `w-80 sm:w-96`, height `480px`).
- **Minimizable:** Collapses into a sleek 56px header bar with expand/minimize toggle.
- **Empty State Quick-Launcher:** Displays recommended candidates with one-click "Chat" initiation if no conversation partner is selected.

### 3. Verification Badges (`VerifiedBadge.tsx`)
- **Student Verified:** Shield icon with golden yellow background (`bg-[#fef9c3] text-[#854d0e]`).
- **Professional Verified:** Briefcase icon with clean sky blue background (`bg-[#e0f2fe] text-[#0369a1]`).
- **Landlord Verified:** Checkmark badge confirming KYC identity and property deed ownership.

### 4. Compatibility Radar Modal (`RadarChartModal.tsx`)
- Recharts-powered 5-point radar visualization comparing Sleep, Cleanliness, Social, Food, and Budget.
- Summary score card displaying overall match percentage and specific lifestyle alignment reasons.
- Direct "Start Conversation" CTA to immediately launch chat with the candidate.

### 5. SOS Visit Check-In (`SosCheckinModal.tsx` & `AppShell.tsx`)
- **Modal:** Duration selector (15–60 mins), emergency contact details, and destination address.
- **Persistent Header Banner:**
  - Normal countdown state: Teal banner (`bg-[#117c74]`) showing remaining minutes and "I Am Safe" check-in button.
  - Triggered alert state: Pulsing red banner (`bg-[#f43f5e] animate-pulse`) with emergency alert notification.

### 6. Agreement Analyzer & Trust Badges
- **Trust Score Pills:** Numeric 0–100 score with contextual color coding (Green $\ge$ 80, Amber 60–79, Red < 60).
- **Clause Highlighting:** Color-coded severity tags (High Risk, Caution, Standard) with "Suggested Fair Clause" replacement text.
