# Design System - RoomSync

## Visual Identity
RoomSync uses a "Safe, Student-Centric, and Modern" aesthetic. The palette is dominated by soft mints and deep charcols to evoke trust and cleanliness.

## Color Palette
| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Primary** | `#117c74` | Brand color, primary buttons, active states, verified badges |
| **Primary Hover**| `#0d635c` | Button hover states |
| **Background** | `#f6f9f8` | Main page backgrounds, soft-section fills |
| **Surface** | `#ffffff` | Cards, Modals, Navigation bars |
| **Text Primary** | `#17222b` | Headings, bold body text |
| **Text Secondary**| `#5f7572` | Captions, labels, muted descriptions |
| **Border** | `#e2ece9` | Dividers, card borders, input borders |
| **Verified Gold**| `#fef9c3` | Student verification backgrounds |
| **Verified Text**| `#854d0e` | Student verification text |
| **Success** | `#10b981` | Pass signals, checkmarks |
| **Danger** | `#f43f5e` | Scam warnings, risk flags |

## Typography
- **Headings:** `font-heading` (Bold, tracking-tight) for page titles and section headers.
- **Body:** `font-sans` (Clean, readable) for all descriptions and form labels.
- **Sizes:**
  - `text-xs` (12px): Labels, secondary metadata, badge text.
  - `text-sm` (14px): Primary body text, button labels.
  - `text-base` (16px): Standard paragraphs.
  - `text-lg` to `text-6xl`: Hierarchical headings.

## Components & Patterns

### Cards & Surfaces
- **Corners:** `rounded-2xl` (1rem) or `rounded-3xl` (1.5rem) for a soft, modern feel.
- **Shadows:** `shadow-xs` for default, `shadow-md` on hover.
- **Borders:** `border-[#e2ece9]` consistently used for subtle separation.

### Interaction Patterns
- **Buttons:** `rounded-xl` or `rounded-2xl`. Primary buttons use `bg-[#117c74]` with white text.
- **Inputs:** `bg-[#f6f9f8]` with `border-[#e2ece9]`, transitioning to `border-[#117c74]` on focus.
- **Modals:** `backdrop-blur-xs` background with a centered `white` card and `animate-in fade-in`.
- **Badges:** Pill-shaped `rounded-full` for status (e.g., Trust Score, Verified status).

### Layout
- **Navbar:** Sticky top, `backdrop-blur-md`, white background with a thin bottom border.
- **App Shell:** Responsive centering using `max-w-7xl mx-auto`.
- **Navigation:** Tab-based switching for the internal dashboard.
