# DESIGN.md

Visual design system for the portfolio frontend (`frontend/`). Read by the
impeccable design skill (`.github/skills/impeccable`) alongside PRODUCT.md.

## Theme

Modern mountain luxury: a lodge built from black steel, cedar, and glass,
looking out at snow and pines at dusk. Old-money restraint with crisp,
architectural detail. Large Bodoni display type over a quiet sans body,
hairline rules, and generous space on a crisp Snow page (or a charcoal
Night page in dark mode).

Materials, each with one job:

- **Steel** — ink and window framing. Thin, black, precise.
- **Pine** — the deep green of the demos band, the demo headers, and the
  footer.
- **Cedar** — warm wood: the plank panel on the home contact section and
  small labels (demo categories).
- **Terracotta** — the pillows by the fire: the one accent. Buttons, title
  periods, trend lines, the current-page marker.
- **Sage, Alpenglow, Lantern** — sagebrush, dusk sky, and window glow; they
  live inside data visuals.

Warmth comes from cedar, terracotta, and type, never from a cream page.

Signature moments, each used once: the Terracotta period after page titles,
the "currently" status dot, the career-timeline flagstick (old-money golf),
the picture window on the home page (a dusk photo behind black-steel
mullions), the cedar plank contact panel with its steel button, topographic
contours on Pine bands, and the ridgeline the footer rises out of. Do not
repeat them as decoration elsewhere.

## Color

Tokens live in `frontend/src/index.css` as CSS custom properties. Each token
keeps its raw light and dark values and resolves through `light-dark()`, with a
`prefers-color-scheme` fallback. Tailwind exposes them as `text-ink`,
`text-body`, `text-muted`, `bg-page`, and `border-control`.

| Token | Name | Light | Dark | Role |
|---|---|---|---|---|
| `--page-bg` | Snow / Night | `#f8f8f6` | `#121413` | Page background |
| `--surface` | | `rgba(255,255,255,0.82)` | `rgba(27,30,28,0.78)` | Translucent card surface |
| `--surface-strong` | | `#ffffff` | `#1b1e1c` | Solid card surface |
| `--text-primary` | Steel | `#191b1a` | `#f2f0ea` | Ink |
| `--text-body` | | `#3c403d` | `#d2cfc7` | Running copy |
| `--text-secondary` | | `#5f6561` | `#a3a29a` | Muted copy |
| `--hairline` | | `rgba(25,27,26,0.1)` | `rgba(242,240,234,0.12)` | Decorative rules |
| `--control-border` | | `#7d837f` | `#858a85` | Control boundaries (3:1) |
| `--signal` | Terracotta | `#a8512c` | `#e2936a` | The accent: CTAs, title marks, fit lines, current page |
| `--signal-ink` | | `#ffffff` | `#1f0d05` | Text on a Terracotta fill |
| `--signal-hover` | | `#8e4222` | `#ecaa86` | Terracotta CTA hover |
| `--cedar` | Cedar | `#8c5f36` | `#d6a872` | Wood: category labels; the plank panel has its own tones |
| `--data-teal` | Sage | `#4f6b58` | `#a3bfa8` | Data green: application layer, positive values |
| `--data-blue` | Alpenglow | `#4c6390` | `#aebde3` | Data blue: infrastructure, C.H. Robinson, data series |
| `--accent` | Lantern | `#8a5f0c` | `#eec07a` | Data gold: small markers, the Data skill group |
| `--negative` | Red | `#b0262f` | `#f29a9e` | Negative values and errors (after the red lodge mullions) |
| `--well` | | `#eeefeb` | `#1f2320` | Sunken backgrounds: tab tracks, demo panels |
| `--line` | | `#dcded8` | `#2e3330` | Solid decorative borders; never a control edge |
| `--steel` | Steel | `#191b1a` | same | Window mullions and frames |
| `--band-bg` | Pine | `#18231e` | same | Always-dark band, demo headers, footer (`.ink-band`) |

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

- Never use pure `#000000` page backgrounds; Night is a warm charcoal.
- Signal is for one primary action per view and for small marks. It never
  fills a page background, and body text never uses it.
- Data colors encode meaning (a layer, a company, a skill group) and should
  map the same way wherever they appear. Caterpillar is signal and C.H.
  Robinson is blue in every timeline and list.
- Every pairing above meets AA as text on its own page background; white on
  Terracotta is 5.4:1, and Terracotta and Cedar both pass on Pine. Steel
  text on the light cedar planks is at least 5.5:1.
- Token names `--data-teal`, `--data-blue`, and `--accent` predate this
  palette; they hold Sage, Alpenglow, and Lantern. Tailwind aliases:
  `fairway` (Sage), `river` (Alpenglow), `aspen` (Lantern), `pine`/`spruce`,
  `cedar`, `steel`.
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

- Display: Bodoni Moda (self-hosted variable font via
  `@fontsource-variable/bodoni-moda`, optical-size axis, imported in
  `main.tsx`). Crisp high-contrast hairlines read as quiet luxury;
  `font-optical-sizing: auto` keeps them sturdy at section sizes. Weight 560:
  lighter weights lose the hairline hyphen ("K-Means"). Tailwind:
  `font-display`.
- Body and UI: the system stack (`system-ui`, SF Pro, Segoe UI). The serif
  and sans pair on a contrast axis; do not add a second serif or sans.
- Display headings: `.display-heading` — Bodoni Moda, tracking `-0.02em`.
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
- Bodoni Moda is the only web font.

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
- `.ink-band` — the always-dark Pine band (home demos section, footer). It
  remaps the text, hairline, and signal tokens so anything inside it reads
  correctly.
- `TopoLines` — procedural contour lines behind Pine bands (home demos band
  and demo headers); they draw in on load or scroll.
- `Ridgeline` — layered Teton silhouette at the top of the footer. Its front
  ridge is filled with `--band-bg`, so it flows into the footer band.
- `.ghost-link` — outlined secondary CTA beside a `.quiet-link`.
- `.steel-link` — black-steel pill CTA for use on cedar (inverts to warm
  white on the dark walnut planks).
- `PictureWindow` — the home page's single photograph (Unsplash, credited
  in its caption) behind a steel frame, two mullions, and a transom. The
  photo drifts and the glass reflection slides on scroll. Swap the photo
  for your own by changing the constants at the top of the component.
- `.cedar-panel` — horizontal cedar planks (light honey, or dark walnut in
  dark mode) with fine shadow gaps; sets its own text and button colors.
- `DataScienceAnimation` — the home hero canvas: live k-means with
  Alpenglow, Sage, and Lantern clusters and a Terracotta trend line.
- `CareerTimeline` — one bar from 2018 to today, colored by company
  (Terracotta for Caterpillar, Alpenglow for C.H. Robinson), with a
  flagstick at today.
- `PlatformStack` — isometric layer diagram with a matching list.
- `DemoGlyph` — small SVG illustration per demo (home band, projects list,
  demo headers).
- `DemoHeader` — opening Pine band on every demo page: back link, category
  in Cedar, serif title with the Terracotta period, lede, optional actions, and
  the demo's glyph (hidden on phones) over contour lines.
- `DemoTabs` / `.demo-tab` — section switcher on a sunken track; the active
  tab is Terracotta. Scrolls sideways on narrow screens.
- `.demo-icon` — Terracotta-tinted icon mark beside demo headings (never a black
  tile). `.step-badge` — numbered steps as Bodoni numerals on a
  Sage tint, like a scorecard.
- Demo chart conventions: data series in Alpenglow, fitted and forecast
  lines in Terracotta, positive values in Sage, negative in Red, k-means
  clusters cycle Terracotta, Sage, Alpenglow, Lantern, Red. Centroids are
  ring markers.
  The demo list itself lives in `src/data/demos.ts`.
- `.metric-tile`, `.signal-strip` — dashboard widgets for the demos.
- Icons: Material Icons (`@mui/icons-material`) only, sized 17–18px inline.

## UX writing

- First person, plain, specific (see PRODUCT.md Voice).
- Buttons name the action and object: "Open demo", "Email me" — never
  "Submit", "Learn more", or "Start a conversation".
- Sentence case for headings; no exclamation marks; no "X, not Y" slogans.
