# DESIGN.md

Visual design system for the portfolio frontend (`frontend/`). Read by the
impeccable design skill (`.github/skills/impeccable`) alongside PRODUCT.md.

## Theme

Quiet, hardware-inspired minimalism. Large type, hairline rules, generous
negative space. The committed identity is an Apple-adjacent neutral system;
identity-preservation wins over restyling. A single warm industrial accent
nods to Caterpillar heritage without imitating the trademark.

## Color

Tokens live in `frontend/src/index.css` as CSS custom properties plus Tailwind
arbitrary values.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--page-bg` | `#f5f5f7` | `#0a0a0c` | Page background (tinted neutral, never pure black) |
| `--surface` | `rgba(255,255,255,0.82)` | `rgba(29,29,31,0.74)` | Translucent card surface |
| `--surface-strong` | `#ffffff` | `#161617` | Solid card surface |
| `--text-primary` | `#1d1d1f` | `#f5f5f7` | Ink |
| `--text-secondary` | `#6e6e73` | `#a1a1a6` | Muted copy |
| `--hairline` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.14)` | Rules and borders |
| `--accent` | `#a16207` | `#eab308` | Warm industrial accent (eyebrows, small markers) |

Rules:

- Never use pure `#000000` page backgrounds; tint dark surfaces.
- The accent is a seasoning, not a paint job: eyebrow labels, index numbers,
  small markers. Never large fills, never body text.
- Muted gray copy must keep at least 4.5:1 contrast against its background.

## Typography

- Family: system stack (`-apple-system`, SF Pro, Segoe UI). Intentional: the
  site borrows Apple's hardware-catalog register, and the system stack is that
  identity, not a default.
- Display headings: `.display-heading` — semibold, tracking `-0.055em`,
  fluid sizes from `text-5xl` up to `text-8xl`.
- Eyebrow labels: `.eyebrow` — 12px uppercase, `0.22em` tracking, accent color.
- Body: `.apple-copy` — muted secondary color, relaxed line-height, measure
  capped around 65–75ch via `max-w-*` utilities.

## Layout

- Content column: `.apple-section` — `max-w-6xl`, responsive padding.
- Rhythm: hairline rules (`.soft-rule`, `border-t hairline`) separate
  sections; spacing steps follow the Tailwind 4pt grid.
- Cards: `.apple-card` (translucent, blurred) and `.apple-card-solid`
  (opaque), both `rounded-[2rem]` with hairline borders. Do not nest cards.

## Motion

Framer Motion, entrance-only, ease-out.

- Micro-interactions (hover, focus): ~100ms via `transition-colors`.
- Element entrances: 300–500ms fade + small y-offset, staggered by ≤80ms.
- No bounce or elastic easing. `prefers-reduced-motion` collapses all
  animation (see `index.css`).

## Components

- `.quiet-link` — pill CTA, ink background, white text.
- `.text-link` — inline arrow link.
- `.metric-tile`, `.signal-strip` — dashboard widgets for the demos.
- Icons: Material Icons (`@mui/icons-material`) only, sized 17–18px inline.

## UX writing

- First person, plain, specific (see PRODUCT.md Voice).
- Buttons name the action and object: "Open demo", "Email me" — never
  "Submit", "Learn more", or "Start a conversation".
- Sentence case for headings; no exclamation marks; no "X, not Y" slogans.
