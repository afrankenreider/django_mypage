# AGENTS.md

Guidance for AI coding agents (Claude Code, Copilot, Codex, and others) working
in this repository. `CLAUDE.md` imports this file. The longer style guide lives
in `.github/copilot-instructions.md`.

## What this is

Andrew Frankenreider's personal portfolio. A React + TypeScript + Vite frontend
(`frontend/`) served by a Django + DRF backend (`src/apps/`). Interactive ML
demos (k-means, linear regression, neural net, stock predictions) call the
Django API under `/api/`.

## Commands

Use the Makefile. `make help` lists every target.

| Task | Command |
|---|---|
| Install everything | `make install` |
| Run Django and Vite together | `make dev` (Vite on :3000, Django on :8000) |
| Lint / format Python | `make lint` / `make format` |
| Type-check the frontend | `make typecheck` |
| Run tests | `make test` |
| Everything CI checks | `make check` |
| Production frontend build | `make build` |

Python dependencies are managed only with `uv` (`uv add`, `uv add --dev`).
Never edit `uv.lock` by hand. Frontend dependencies use `npm` inside
`frontend/`.

## Layout

- `src/apps/base_app/` - Django settings, root URLs, WSGI/ASGI.
- `src/apps/projects/` - Projects API and the ML demo endpoints (`api/`).
- `src/apps/weekly_media/` - Weekly media API.
- `frontend/src/pages/` - one component per route; `components/`, `hooks/`,
  `context/`, `types/`, `utils/` hold shared code.
- `frontend/src/index.css` - design tokens (CSS custom properties).
- `staticfiles/frontend/` - Vite build output that Django serves. Regenerate
  it with `make build`; never edit it by hand.
- `PRODUCT.md`, `DESIGN.md` - product context and the visual design system.

## Version control

Follow the `git-workflow` skill. In short:

- Never commit or push on `master`. Before the first edit of a task, make
  sure you're on a feature branch (`<type>/<slug>`, for example
  `feat/project-tags`), and create one from `origin/master` if you aren't. A
  hook in `.claude/settings.json` blocks commits and pushes on `master`.
- Commit at each coherent step using Conventional Commits.
- Push and open pull requests against `master` only when asked. Write the
  description from the actual diff (`make pr-context`) using
  `.github/pull_request_template.md`.
- Never merge PRs, force-push without `--force-with-lease`, or skip hooks.

## Conventions

- No emojis in code, comments, commits, docs, or UI.
- Python: type hints, ruff formatting (88 columns), absolute imports from
  `src`. Fat models, thin views. Never modify an existing migration.
- TypeScript: strict mode, no `any`, functional components and hooks.
- Commits follow Conventional Commits (`feat:`, `fix:`, `chore:`, ...).

## Design system

`DESIGN.md` is the source of truth for color, type, spacing, and motion. The
site has a committed identity (quiet, neutral, single warm accent), so
preserving it wins over restyling. Use the tokens in `frontend/src/index.css`
and their Tailwind aliases rather than raw colors. Text must meet WCAG AA
contrast in both light and dark mode, and motion must respect
`prefers-reduced-motion`.

## Agent skills

Project skills live in `.claude/skills/` (Claude Code loads them
automatically). Two of them are symlinks to their canonical copies in
`.agents/skills/` and `.github/skills/` so other agents can share them.
`skills-lock.json` pins each skill's source and hash; update with
`make skills-update`.

| Skill | Use it for |
|---|---|
| `impeccable` | Designing, critiquing, auditing, or polishing any UI. Reads PRODUCT.md and DESIGN.md. |
| `frontend-design` | Fresh visual direction for a new page or section. DESIGN.md still wins where it speaks. |
| `modern-web-guidance` | Current HTML, CSS, accessibility, and performance patterns before writing UI code. |
| `vercel-react-best-practices` | React performance: re-renders, bundle size, data fetching. |
| `vercel-composition-patterns` | Component API design: compound components, avoiding boolean-prop sprawl. |
| `webapp-testing` | Driving the running site with Playwright for screenshots and checks. |
| `systematic-debugging` | Any bug or failing test, before proposing a fix. |
| `test-driven-development` | New features or bug fixes in the Django API. |
| `verification-before-completion` | Before claiming work is done: run `make check` and read the output. |
| `git-workflow` | Branching, commits, PR descriptions, and `gh` usage. Written for this repo. |

## Before you finish

1. `make check` passes (ruff, tsc, pytest).
2. For UI changes, view the page at mobile and desktop widths in both color
   schemes.
3. If you changed the frontend for production, run `make build` so
   `staticfiles/frontend/` matches the source.
