# DESIGN.md

Visual design system for the portfolio frontend (`frontend/`). Read by the
impeccable design skill (`.github/skills/impeccable`) alongside PRODUCT.md.

## Theme

Quiet, hardware-inspired minimalism. Large type, hairline rules, generous
negative space. The committed identity is an Apple-adjacent neutral system;
identity-preservation wins over restyling. A single warm industrial accent
nods to Caterpillar heritage without imitating the trademark.

## Color

Tokens live in `frontend/src/index.css` as CSS custom properties. Each token
keeps its raw light and dark values and resolves through `light-dark()`, with a
`prefers-color-scheme` fallback. Tailwind exposes them as `text-ink`,
`text-body`, `text-muted`, `bg-page`, and `border-control`.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--page-bg` | `#f5f5f7` | `#0a0a0c` | Page background (tinted neutral, never pure black) |
| `--surface` | `rgba(255,255,255,0.82)` | `rgba(29,29,31,0.74)` | Translucent card surface |
| `--surface-strong` | `#ffffff` | `#161617` | Solid card surface |
| `--text-primary` | `#1d1d1f` | `#f5f5f7` | Ink |
| `--text-body` | `#424245` | `#d2d2d7` | Running copy |
| `--text-secondary` | `#6e6e73` | `#a1a1a6` | Muted copy |
| `--hairline` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.14)` | Decorative rules and separators |
| `--control-border` | `#86868b` | `#8e8e93` | Boundaries of inputs, chips, and icon buttons (3:1) |
| `--accent` | `#a16207` | `#eab308` | Warm industrial accent (eyebrows, small markers) |

Rules:

- Never use pure `#000000` page backgrounds; tint dark surfaces.
- The accent is a seasoning, not a paint job: eyebrow labels, index numbers,
  small markers. Never large fills, never body text.
- Muted gray copy must keep at least 4.5:1 contrast against its background.
  `#86868b` fails this as text on the light page (3.3:1); use `text-muted`.
- Hairlines are decoration only. Anything that marks the edge of a control
  uses `--control-border`.

### Color scheme

The site follows the OS color scheme by default. The header toggle is a
two-state override stored in `localStorage` under `color-scheme` and reflected
in `<meta name="color-scheme">`; CSS maps that meta back onto the
`color-scheme` property. Tailwind's `dark:` variant is configured in
`tailwind.config.js` to follow the same signal, so there is no `.dark` class.
In JavaScript (canvas, charts), read the rendered scheme from `useTheme()`.

## Typography

- Family: system stack (`-apple-system`, SF Pro, Segoe UI). Intentional: the
  site borrows Apple's hardware-catalog register, and the system stack is that
  identity, not a default.
- Display headings: `.display-heading` — semibold, tracking `-0.04em`. Size
  comes from `.display-hero` (home) or `.display-page` (every other page),
  both `clamp()` scales with rem bounds so browser zoom still works and long
  words fit at 320px.
- Eyebrow labels: `.eyebrow` — 12px uppercase, `0.22em` tracking, accent color.
  Use sparingly inside the demos; page headers do not carry one.
- Body: `.body-copy` for running text, `.apple-copy` for muted supporting
  text. Measure capped around 60–70ch via `max-w-[..ch]` utilities.
- Headings use `text-wrap: balance`; paragraphs and list items use
  `text-wrap: pretty`.
- No web fonts are loaded.

## Layout

- Content column: `.apple-section` — `max-w-6xl`, responsive padding.
- Rhythm: hairline rules (`.soft-rule`, `border-t hairline`) separate
  sections; spacing steps follow the Tailwind 4pt grid.
- Cards: `.apple-card` (translucent, blurred) and `.apple-card-solid`
  (opaque), both `rounded-[2rem]` with hairline borders. Do not nest cards.

## Motion

Entrance-only, ease-out. The site shell and content pages use the CSS `.enter`
class (stagger with the `enterIndex()` helper). Framer Motion is reserved for
the interactive demos and loads with them through `DemoLayout`.

- Micro-interactions (hover, focus): ~100ms via `transition-colors`.
- Element entrances: 300–500ms fade + small y-offset, staggered by ≤80ms.
- No bounce or elastic easing.
- Reduced motion is handled where each animation is declared, not with a
  global override: entrances only run under `prefers-reduced-motion:
  no-preference`, spinners slow down instead of stopping, and `DemoLayout`
  sets `MotionConfig reducedMotion="user"`.
- Anything that moves indefinitely needs a pause control (see the hero canvas).

## Components

- Site header (`Navbar.tsx`) — one `<nav>` list at every width: a native
  popover while collapsed, an inline row once the measured row fits. The
  current page is marked with `aria-current="page"`.
- `.quiet-link` — pill CTA, ink background, page-colored text.
- `.text-link` — inline arrow link, underlined on hover.
- `.social-link`, `.icon-button` — 44px round icon controls. Icon-only
  controls carry a `.visually-hidden` text label.
- `.loading-spinner` — a native indeterminate `<progress>`; add
  `.loading-spinner-sm` inside buttons.
- `.ink-band` — the always-dark band on the home page.
- `.metric-tile`, `.signal-strip` — dashboard widgets for the demos.
- Icons: Material Icons (`@mui/icons-material`) only, sized 17–18px inline.

## UX writing

- First person, plain, specific (see PRODUCT.md Voice).
- Buttons name the action and object: "Open demo", "Email me" — never
  "Submit", "Learn more", or "Start a conversation".
- Sentence case for headings; no exclamation marks; no "X, not Y" slogans.
