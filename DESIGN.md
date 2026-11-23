# DESIGN.md

Visual design system for the portfolio frontend (`frontend/`). Read by the
impeccable design skill (`.github/skills/impeccable`) alongside PRODUCT.md.

## Theme

Hardware-inspired minimalism with a charting palette. Large type, hairline
rules, and generous negative space on a neutral base, with color carried by
data: a vermilion signal color for action and emphasis, an ink-blue band,
and teal, blue, and amber used inside visuals. The neutral base and system
type are the committed identity; color lives in the visuals and a few
deliberate marks, never in large page backgrounds.

Signature marks: a signal-colored period after each page title (and a
question mark on the home contact heading), the signal underline on the
current nav item, and the "currently" status dot on the home hero.

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
| `--accent` | `#a16207` | `#eab308` | Amber: eyebrows, small markers, the third data color |
| `--signal` | `#c2401d` | `#ff8159` | Vermilion: primary CTA fill, current-page marker, title periods, trend lines |
| `--signal-ink` | `#ffffff` | `#1a0904` | Text on a signal fill |
| `--signal-hover` | `#a83414` | `#ff9d7e` | Signal CTA hover |
| `--data-teal` | `#0e7a6b` | `#3fd0b9` | Data color: the application layer, the Web skill group |
| `--data-blue` | `#2f56c8` | `#8eaaff` | Data color: infrastructure, C.H. Robinson in timelines |
| `--band-bg` | `#101b3d` | same | Always-dark ink-blue band (`.ink-band`) |

Canvas code cannot resolve `light-dark()`, so `src/utils/palette.ts` mirrors
the data colors as RGB triples. Keep it in sync with the tokens.

Rules:

- Never use pure `#000000` page backgrounds; tint dark surfaces.
- Signal is for one primary action per view and for small marks. It never
  fills a page background, and body text never uses it.
- Data colors encode meaning (a layer, a company, a skill group) and should
  map the same way wherever they appear. Caterpillar is signal and C.H.
  Robinson is blue in every timeline and list.
- Every pairing above meets AA as text on its own page background; white on
  `--signal-light` is 5.2:1.
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

Mostly entrance motion, with ease-out-expo and ease-out-quart curves
(`--ease-out-expo`, `--ease-out-quart`). The site shell and content pages use the CSS `.enter`
class (stagger with the `enterIndex()` helper). Framer Motion is reserved for
the interactive demos and loads with them through `DemoLayout`.

- Home load is one orchestrated sequence: the name rises line by line from
  a mask (`.reveal-line`), the hero canvas unmasks (`.enter-visual`), then
  points, centroids, and the trend line draw in.
- SVG primitives: `.draw-in` (stroke draw, needs `pathLength="1"`),
  `.grow-x`, `.pop-in`, `.drop-in`. Inside an `.on-scroll` container they
  follow a named view timeline (`--reveal`) instead of page load, and
  `.scroll-reveal` fades HTML children in the same way. Unsupported browsers
  get the page-load version or nothing; content is always visible without
  animation.
- `.flow-dash` runs three cycles only, so it needs no pause control.
- Micro-interactions (hover, focus): ~100–200ms; CTA arrows nudge right.
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
- `.quiet-link` — pill CTA, signal background, `--signal-ink` text.
- `.text-link` — inline arrow link, underlined on hover.
- `.social-link`, `.icon-button` — 44px round icon controls. Icon-only
  controls carry a `.visually-hidden` text label.
- `.loading-spinner` — a native indeterminate `<progress>`; add
  `.loading-spinner-sm` inside buttons.
- `.ink-band` — the always-dark ink-blue band on the home page. It remaps the
  text, hairline, and signal tokens so anything inside it reads correctly.
  `.band-grid` adds a faint masked chart grid behind it.
- `.ghost-link` — outlined secondary CTA beside a `.quiet-link`.
- `DataScienceAnimation` — the home hero canvas: live k-means with three
  colored clusters and a signal trend line.
- `CareerTimeline` — one bar from 2018 to today, colored by company.
- `PlatformStack` — isometric layer diagram with a matching list.
- `DemoGlyph` — small SVG illustration per demo (home band, projects list).
  The demo list itself lives in `src/data/demos.ts`.
- `.metric-tile`, `.signal-strip` — dashboard widgets for the demos.
- Icons: Material Icons (`@mui/icons-material`) only, sized 17–18px inline.

## UX writing

- First person, plain, specific (see PRODUCT.md Voice).
- Buttons name the action and object: "Open demo", "Email me" — never
  "Submit", "Learn more", or "Start a conversation".
- Sentence case for headings; no exclamation marks; no "X, not Y" slogans.
