# DESIGN.md

Visual design system for the portfolio frontend (`frontend/`). Read by the
impeccable design skill (`.github/skills/impeccable`) alongside PRODUCT.md.

## Theme

Old clubhouse and mountain lodge: think a Jackson Hole trail map, a
vintage golf scorecard, a park poster of the Tetons. Large serif display
type over a quiet sans body, hairline rules, and generous space on a faintly
sage neutral. Color comes from the landscape and is carried by data
visuals: Blaze (rust) for action and emphasis, Spruce for the dark band and
footer, and Fairway, Snake River, and Aspen inside charts and diagrams.
Warmth lives in the accents and type, never in a cream page background.

Signature marks: a Blaze period after each page title (and a question mark
on the home contact heading), the Blaze underline on the current nav item,
the "currently" status dot on the home hero, the flagstick marking today on
the career timeline, topographic contours on the Spruce band, and the Teton
ridgeline the footer rises out of. Each motif appears once; do not repeat
them as decoration elsewhere.

## Color

Tokens live in `frontend/src/index.css` as CSS custom properties. Each token
keeps its raw light and dark values and resolves through `light-dark()`, with a
`prefers-color-scheme` fallback. Tailwind exposes them as `text-ink`,
`text-body`, `text-muted`, `bg-page`, and `border-control`.

| Token | Name | Light | Dark | Role |
|---|---|---|---|---|
| `--page-bg` | | `#f1f4ee` | `#0d1410` | Page background: faint sage, near-black spruce |
| `--surface` | | `rgba(255,255,255,0.78)` | `rgba(24,34,28,0.74)` | Translucent card surface |
| `--surface-strong` | | `#fbfcf9` | `#151e18` | Solid card surface |
| `--text-primary` | | `#15221a` | `#eef2ea` | Ink |
| `--text-body` | | `#38463d` | `#cdd7cd` | Running copy |
| `--text-secondary` | | `#56655b` | `#9fb1a4` | Muted copy |
| `--hairline` | | `rgba(21,34,26,0.12)` | `rgba(238,242,234,0.13)` | Decorative rules |
| `--control-border` | | `#7b8a80` | `#7f9185` | Control boundaries (3:1) |
| `--signal` | Blaze | `#a9441a` | `#ee8b55` | Primary CTA fill, current-page marker, title marks, trend lines |
| `--signal-ink` | | `#ffffff` | `#1d0c04` | Text on a Blaze fill |
| `--signal-hover` | | `#8d3712` | `#f5a577` | Blaze CTA hover |
| `--data-teal` | Fairway | `#2e6a3c` | `#86c493` | Data green: the application layer, the Web skill group |
| `--data-blue` | Snake River | `#33627d` | `#93bdd6` | Data slate-blue: infrastructure, C.H. Robinson |
| `--accent` | Aspen | `#8a6408` | `#e2b54a` | Data gold: small markers, the Data skill group |
| `--band-bg` | Spruce | `#163126` | same | Always-dark band and footer (`.ink-band`) |
| `--well` | | `#e5ebe2` | `#1c2821` | Sunken backgrounds: tab tracks, demo panels, chips |
| `--line` | | `#cdd6ca` | `#2d3b32` | Solid decorative borders (cards, panels); never a control edge |
| `--negative` | Cranberry | `#a3243a` | `#f08a9a` | Losses, negative coefficients, errors |

Tailwind aliases every semantic token through `color-mix()`, so opacity
modifiers work: `text-ink`, `text-body`, `text-muted`, `bg-page`,
`bg-surface`, `bg-well`, `border-line`, `bg-hover`, `bg-signal`,
`text-signal-ink`, `bg-signal-hover`, `text-fairway`, `text-river`,
`text-aspen`, `text-negative`, `bg-spruce`, and so on. Never write raw hex or
Tailwind palette colors (`text-red-500`) in components; status colors are
Fairway (positive), Aspen (warning), and Cranberry (negative).

Recharts accepts CSS variables in `stroke` and `fill`, so chart colors are
written as `var(--signal)` and follow the scheme with no JavaScript.

Canvas code cannot resolve `light-dark()`, so `src/utils/palette.ts` mirrors
the data colors as RGB triples. Keep it in sync with the tokens.

Rules:

- Never use pure `#000000` page backgrounds; tint dark surfaces toward spruce.
- Signal is for one primary action per view and for small marks. It never
  fills a page background, and body text never uses it.
- Data colors encode meaning (a layer, a company, a skill group) and should
  map the same way wherever they appear. Caterpillar is signal and C.H.
  Robinson is blue in every timeline and list.
- Every pairing above meets AA as text on its own page background; white on
  Blaze is 5.9:1, and Blaze and Aspen both pass on Spruce.
- The token names `--data-teal` and `--data-blue` predate the lodge palette;
  they now hold Fairway and Snake River.
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

- Display: Young Serif (self-hosted via `@fontsource/young-serif`, Latin
  subset, imported in `main.tsx`). A sturdy old-style serif with the feel of
  a clubhouse sign. It ships one weight, so `.display-heading` sets weight
  400 and `font-synthesis: none`; never bold it. Tailwind: `font-display`.
- Body and UI: the system stack (`system-ui`, SF Pro, Segoe UI). The serif
  and sans pair on a contrast axis; do not add a second serif or sans.
- Display headings: `.display-heading` — Young Serif, tracking `-0.015em`.
  Demo section headings (h2) use it too, at `text-3xl`. Size
  comes from `.display-hero` (home) or `.display-page` (every other page),
  both `clamp()` scales with rem bounds so browser zoom still works and long
  words fit at 320px.
- Eyebrow labels: `.eyebrow` — 12px uppercase, `0.22em` tracking, accent color.
  Use sparingly inside the demos; page headers do not carry one.
- Body: `.body-copy` for running text, `.apple-copy` for muted supporting
  text. Measure capped around 60–70ch via `max-w-[..ch]` utilities.
- Headings use `text-wrap: balance`; paragraphs and list items use
  `text-wrap: pretty`.
- Young Serif is the only web font.

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
- `.ink-band` — the always-dark Spruce band (home demos section, footer). It
  remaps the text, hairline, and signal tokens so anything inside it reads
  correctly.
- `TopoLines` — procedural contour lines behind the home Spruce band; they
  draw in on scroll.
- `Ridgeline` — layered Teton silhouette at the top of the footer. Its front
  ridge is filled with `--band-bg`, so it flows into the footer band.
- `.ghost-link` — outlined secondary CTA beside a `.quiet-link`.
- `DataScienceAnimation` — the home hero canvas: live k-means with Snake
  River, Fairway, and Aspen clusters and a Blaze trend line.
- `CareerTimeline` — one bar from 2018 to today, colored by company, with a
  flagstick at today.
- `PlatformStack` — isometric layer diagram with a matching list.
- `DemoGlyph` — small SVG illustration per demo (home band, projects list,
  demo headers).
- `DemoHeader` — opening Spruce band on every demo page: back link, category
  in Aspen, serif title with the Blaze period, lede, optional actions, and
  the demo's glyph (hidden on phones) over contour lines.
- `DemoTabs` / `.demo-tab` — section switcher on a sunken track; the active
  tab is Blaze. Scrolls sideways on narrow screens.
- `.demo-icon` — Blaze-tinted icon mark beside demo headings (never a black
  tile). `.step-badge` — numbered steps as Young Serif numerals on a
  Fairway tint, like a scorecard.
- Demo chart conventions: data series in Snake River, fitted and forecast
  lines in Blaze, positive values in Fairway, negative in Cranberry, k-means
  clusters cycle Blaze, Fairway, Snake River, Aspen, Cranberry. Centroids are
  ring markers.
  The demo list itself lives in `src/data/demos.ts`.
- `.metric-tile`, `.signal-strip` — dashboard widgets for the demos.
- Icons: Material Icons (`@mui/icons-material`) only, sized 17–18px inline.

## UX writing

- First person, plain, specific (see PRODUCT.md Voice).
- Buttons name the action and object: "Open demo", "Email me" — never
  "Submit", "Learn more", or "Start a conversation".
- Sentence case for headings; no exclamation marks; no "X, not Y" slogans.
