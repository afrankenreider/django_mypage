# DESIGN.md

Visual design system for the portfolio frontend (`frontend/`). Read by the
impeccable design skill (`.github/skills/impeccable`) alongside PRODUCT.md.

## Theme

Golf resort clubhouse in the northwoods: calm, warm, traditional, and quietly
expensive. The reference is the feel of a resort like Sand Valley (parchment
pages, deep slate, a soft apricot accent, a light elegant serif, small
tracked capitals, square corners, lots of space). Take the feel, never the
brand: no copied logos, layouts, photography, or wording.

- **Parchment** page in light mode; **Slate night** in dark mode. The
  parchment is a deliberate reference choice, not a default; keep it.
- **Slate** carries the structure: the header bar (both schemes), the home
  demos band, demo headers, and the footer.
- **Rust / Apricot** is the one accent: labels, button outlines, the active
  tab rule, title periods, trend lines. Rust on parchment, Apricot on slate
  and in dark mode.
- **Sage, Lake, Lantern, Red** live only inside data visuals.
- Corners are square (2px). Buttons are outlined rectangles with tracked
  capitals; secondary links sit on a dotted rule.
- No stock photography. The data visuals are the imagery; a personal photo
  could earn a place later, but nothing decorative.

Signature details, each used once: the accent period after page titles, the
career-timeline flagstick, topographic contours on slate bands, and the
ridgeline the footer rises out of.

## Color

Tokens live in `frontend/src/index.css` as CSS custom properties. Each token
keeps its raw light and dark values and resolves through `light-dark()`, with a
`prefers-color-scheme` fallback. Tailwind exposes them as `text-ink`,
`text-body`, `text-muted`, `bg-page`, and `border-control`.

| Token | Name | Light | Dark | Role |
|---|---|---|---|---|
| `--page-bg` | Parchment / Slate night | `#faf7ec` | `#1b2526` | Page background |
| `--surface` | | `rgba(255,253,247,0.85)` | `rgba(35,48,49,0.8)` | Translucent card surface |
| `--surface-strong` | | `#fffdf7` | `#233031` | Solid card surface |
| `--text-primary` | Slate ink | `#2e4042` | `#f6f2e4` | Ink: slate, never black |
| `--text-body` | | `#3f4f4f` | `#d9d5c6` | Running copy |
| `--text-secondary` | | `#5c6a68` | `#a9b0a8` | Muted copy |
| `--hairline` | | `rgba(46,64,66,0.14)` | `rgba(246,242,228,0.12)` | Decorative rules |
| `--sand-line` | Sand | `#c9c5b1` | `#56625f` | Dotted rules under links and in the footer |
| `--control-border` | | `#7e8579` | `#8b948c` | Control boundaries (3:1) |
| `--signal` | Rust / Apricot | `#ad5524` | `#e8965f` | The accent: labels, outlines, active tab, title marks, fit lines |
| `--signal-ink` | | `#ffffff` | `#1b2526` | Text on an accent fill (button hover) |
| `--signal-hover` | | `#93461c` | `#f0ab7d` | Accent fill hover |
| `--cedar` | Cedar | `#8c5f36` | `#d6a872` | Warm secondary text, rarely used |
| `--data-teal` | Sage | `#4f6b58` | `#a3bfa8` | Data green: application layer, positive values |
| `--data-blue` | Lake | `#4c6390` | `#aebde3` | Data blue: infrastructure, C.H. Robinson, data series |
| `--accent` | Lantern | `#8a5f0c` | `#eec07a` | Data gold: small markers, the Data skill group |
| `--negative` | Red | `#b0262f` | `#f29a9e` | Negative values and errors |
| `--well` | | `#f1ecdc` | `#212d2e` | Sunken backgrounds: demo panels |
| `--line` | | `#e2dcc8` | `#344241` | Solid decorative borders; never a control edge |
| `--band-bg` | Slate | `#2e4042` | same | Header, demos band, demo headers, footer (`.ink-band`) |
| `--radius` | | `2px` | | Every corner except dots and markers |

Tailwind aliases every semantic token through `color-mix()`, so opacity
modifiers work: `text-ink`, `text-body`, `text-muted`, `bg-page`,
`bg-surface`, `bg-well`, `border-line`, `bg-hover`, `bg-signal`,
`text-signal-ink`, `bg-signal-hover`, `text-fairway`, `text-river`,
`text-aspen`, `text-negative`, `bg-spruce`, and so on. Never write raw hex or
Tailwind palette colors (`text-red-500`) in components; status colors are
Sage (positive), Lantern (warning), and Red (negative).

Recharts accepts CSS variables in `stroke` and `fill`, so chart colors are
written as `var(--signal)` and follow the scheme with no JavaScript.

Canvas code cannot resolve `light-dark()`, so `src/utils/palette.ts` mirrors
the data colors as RGB triples. Keep it in sync with the tokens.

Rules:

- Never use pure black or pure white; ink is slate and pages are parchment
  or slate night.
- The accent is for labels, outlines, and small marks; it never fills a
  large area. It never
  fills a page background, and body text never uses it.
- Data colors encode meaning (a layer, a company, a skill group) and should
  map the same way wherever they appear. Caterpillar is signal and C.H.
  Robinson is blue in every timeline and list.
- Every pairing above meets AA as text on its own page background. Rust on
  parchment is 4.8:1 (light Apricot `#e38c54` is only 2.4:1, so it is never
  used as text or a control edge on parchment). Apricot on slate is 4.7:1.
- Token names `--data-teal`, `--data-blue`, and `--accent` predate this
  palette; they hold Sage, Lake, and Lantern. Tailwind aliases:
  `fairway` (Sage), `river` (Lake), `aspen` (Lantern), `pine`/`spruce`
  (Slate), `cedar`, `sand`.
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

- Display: Libre Caslon Display (self-hosted via
  `@fontsource/libre-caslon-display`, Latin subset, imported in
  `main.tsx`). Light, slightly condensed, traditional; the closest free
  match to the resort-serif feel. One weight (400): never bold it.
  Normal tracking, line-height 1.1. Tailwind: `font-display`.
- Display headings: `.display-heading`. Size comes from `.display-hero`
  (home) or `.display-page` (other pages), both `clamp()` scales with rem
  bounds. Card and list titles (projects, platform layers, skill areas,
  demo tiles) also use the serif; dense lists (roles on About) stay sans.
- Labels: `.eyebrow` — 12px tracked capitals (`0.25em`), weight 500, in the
  accent. Used for the hero role line, home section labels, demo and project
  categories. Not above every heading.
- Wordmark: `.wordmark` — the name in the serif, tracked capitals, in the
  header and footer. Tightens below 480px so the header fits.
- Body and UI: the system stack (`system-ui`, SF Pro, Segoe UI). Buttons,
  nav links, and tabs use tracked capitals at 12px.
- Body: `.body-copy` for running text, `.apple-copy` for muted supporting
  text. Measure capped around 55–70ch.
- Headings use `text-wrap: balance`; paragraphs and list items use
  `text-wrap: pretty`.
- Libre Caslon Display is the only web font.

## Layout

- Content column: `.apple-section` — `max-w-6xl`, responsive padding.
- Rhythm: hairline rules (`.soft-rule`, `border-t hairline`) separate
  sections; spacing steps follow the Tailwind 4pt grid.
- Cards: `.apple-card` (translucent, blurred) and `.apple-card-solid`
  (opaque), both square (`--radius`) with hairline borders. Do not nest cards.

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

- Site header (`Navbar.tsx`) — a slate bar in both schemes (`.ink-band`
  remaps its tokens), serif wordmark, tracked-capital links with an accent
  rule under the current page. One `<nav>` list at every width: a native
  popover (also slate) while collapsed, an inline row once it fits.
- `.quiet-link` — primary CTA: square, 1px accent outline, tracked capitals;
  fills with the accent on hover.
- `.ghost-link` — secondary CTA: tracked capitals over a dotted sand rule.
- `.text-link` — inline link over a dotted sand rule; the rule turns to the
  accent on hover.
- `.social-link`, `.icon-button` — 44px square icon controls. Icon-only
  controls carry a `.visually-hidden` text label.
- `.loading-spinner` — a native indeterminate `<progress>`; add
  `.loading-spinner-sm` inside buttons.
- `.ink-band` — always-dark slate band. It remaps the text, hairline, sand,
  and accent tokens so anything inside it reads correctly. On the home page
  the demos band runs full-bleed.
- `TopoLines` — procedural contour lines behind slate bands (home demos band
  and demo headers); they draw in on load or scroll.
- `Ridgeline` — layered mountain silhouette at the top of the footer. Its
  front ridge is filled with `--band-bg`, so it flows into the footer.
- Footer — centered: wordmark, role, square social links, a dotted rule,
  tracked-capital links.
- `DataScienceAnimation` — the home hero canvas: live k-means with Lake,
  Sage, and Lantern clusters and an accent trend line.
- `CareerTimeline` — one bar from 2018 to today, colored by company (accent
  for Caterpillar, Lake for C.H. Robinson), with a flagstick at today.
- `PlatformStack` — isometric layer diagram with a matching list.
- `DemoGlyph` — small SVG illustration per demo (home band, projects list,
  demo headers). The demo list lives in `src/data/demos.ts`.
- `DemoHeader` — opening slate band on every demo page: back link, category
  label, serif title with the accent period, lede, optional actions, and the
  demo's glyph (hidden on phones) over contour lines.
- `DemoTabs` / `.demo-tab` — section switcher: tracked capitals over a
  hairline; the active tab gets an accent underline. Scrolls sideways on
  narrow screens.
- `.demo-icon` — accent-tinted icon mark beside demo headings (never a black
  tile). `.step-badge` — numbered steps as serif numerals on a Sage tint.
- Demo chart conventions: data series in Lake, fitted and forecast lines in
  the accent, positive values in Sage, negative in Red, k-means clusters
  cycle accent, Sage, Lake, Lantern, Red. Centroids are ring markers.
- `.metric-tile`, `.signal-strip` — dashboard widgets for the demos.
- Icons: Material Icons (`@mui/icons-material`) only, sized 16–18px inline.

## UX writing

- First person, plain, specific (see PRODUCT.md Voice).
- Buttons name the action and object: "Open demo", "Email me" — never
  "Submit", "Learn more", or "Start a conversation".
- Sentence case for headings; no exclamation marks; no "X, not Y" slogans.
