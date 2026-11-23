# Andrew Frankenreider Portfolio

[![CI](https://github.com/afrankenreider/django_mypage/actions/workflows/ci.yml/badge.svg)](https://github.com/afrankenreider/django_mypage/actions/workflows/ci.yml)

My personal portfolio: a React + TypeScript frontend served by a Django REST
API, with interactive machine learning demos backed by real Python models.

## Features

- **Home, About, Skills** - background, story, and tooling.
- **Projects** - filterable portfolio of work.
- **Interactive demos** - k-means clustering, linear regression, a neural
  network visualizer, and a stock dashboard with model-based price
  predictions.
- **Weekly media** - what I'm reading, watching, and listening to.
- **Light and dark themes** built on a token-based design system
  ([DESIGN.md](DESIGN.md)).

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Material UI, Recharts, Framer Motion (demos only) |
| Backend | Python 3.13, Django, Django REST Framework, WhiteNoise, Gunicorn |
| Data / ML | pandas, numpy, statsmodels, XGBoost, LightGBM, CatBoost, yfinance |
| Database | PostgreSQL (Docker locally, managed on Heroku); SQLite fallback |
| Tooling | uv, npm, ruff, pre-commit, pytest, GitHub Actions, Make |

## Quick start

Prerequisites: [uv](https://docs.astral.sh/uv/), Node.js (see
`frontend/.nvmrc`), and Docker if you want PostgreSQL locally.

```bash
make install   # uv sync, npm ci, pre-commit hooks
make env       # create .env from .env.example
make migrate   # set up the database
make dev       # Django on :8000, Vite on :3000
```

Open <http://localhost:3000>. Vite proxies `/api` to Django, so both halves
work together with hot reload.

Without a `DATABASE_URL` or `POSTGRES_HOST` set, Django uses a local SQLite
file. To use PostgreSQL instead, run `make db-up` and set `POSTGRES_HOST` in
`.env`.

To run the whole stack in containers instead:

```bash
make docker-up
```

## Make targets

Run `make help` for the full list.

| Target | What it does |
|---|---|
| `make install` | Install Python and frontend dependencies and git hooks |
| `make dev` | Run Django and Vite together |
| `make backend` / `make frontend` | Run one server on its own |
| `make db-up` / `make db-down` | Start or stop local PostgreSQL |
| `make migrate` / `make migrations` | Apply or create migrations |
| `make lint` / `make format` | Check or fix Python style with ruff |
| `make typecheck` | Type-check the frontend with `tsc` |
| `make test` / `make coverage` | Run pytest, optionally with coverage |
| `make check` | Lint, type-check, and test (what CI runs) |
| `make build` | Build the frontend into `staticfiles/frontend/` |
| `make branch NAME=...` / `make pr` | Start a feature branch / open a PR to master |
| `make notebook` | Start Jupyter in `src/notebooks/` |
| `make skills-update` | Update the pinned agent skills |
| `make clean` | Remove caches and build artifacts |

## Project structure

```
django_mypage/
├── src/
│   ├── apps/
│   │   ├── base_app/       Django settings, URLs, WSGI/ASGI
│   │   ├── projects/       Projects API and ML demo endpoints
│   │   └── weekly_media/   Weekly media API
│   └── notebooks/          Jupyter notebooks
├── frontend/               React + TypeScript + Vite app
│   └── src/
│       ├── pages/          One component per route
│       ├── components/     Shared UI
│       ├── hooks/ context/ types/ utils/
│       └── index.css       Design tokens
├── staticfiles/frontend/   Vite build output served by Django
├── tests/                  Cross-app unit and integration tests
├── docker/                 Dockerfile and compose file
├── scripts/                Start script used by Heroku and Docker
├── bin/post_compile        Heroku build hook (builds the frontend)
├── .claude/                Claude Code skills, hooks, and shared settings
├── AGENTS.md               Instructions for AI coding agents
├── PRODUCT.md, DESIGN.md   Product context and design system
├── Makefile                Developer tasks
└── pyproject.toml          Python dependencies and tool config
```

## Development

### Tests

Tests use pytest with pytest-django and live in each app's `tests.py` and in
`tests/`.

```bash
make test
uv run pytest src/apps/projects/tests.py -k list_projects   # a single test
make coverage                                                # HTML report in htmlcov/
```

### Code quality

Ruff lints and formats Python; pre-commit runs it plus whitespace and YAML
checks on every commit. CI runs pre-commit, the test suite against
PostgreSQL, and a frontend type check and build.

```bash
make format       # fix what can be fixed
make pre-commit   # run every hook on every file
```

### Branches and pull requests

`master` only changes through pull requests. Work on a feature branch named
`<type>/<slug>` (`feat/`, `fix/`, `design/`, `refactor/`, `docs/`,
`chore/`, `test/`) and use Conventional Commits.

```bash
make branch NAME=feat/project-tags   # new branch from origin/master
make sync                            # merge the latest master into it
make pr-context                      # commits, files by area, and the diff
make pr                              # push and open a PR in the browser
```

`make pr` needs the [GitHub CLI](https://cli.github.com/) (`brew install gh`,
then `gh auth login`). New PRs start from
`.github/pull_request_template.md`.

Claude Code follows the same flow through the `git-workflow` skill: it
creates a feature branch before its first edit, commits there, and opens PRs
with descriptions written from the diff when you ask. A hook in
`.claude/settings.json` blocks commits and pushes on `master` as a backstop.

### Dependencies

```bash
uv add <package>          # runtime dependency
uv add --dev <package>    # dev dependency
cd frontend && npm install <package>
```

## Working with AI agents

[AGENTS.md](AGENTS.md) gives coding agents the commands, layout, and
conventions for this repo; `CLAUDE.md` imports it for Claude Code. Agent
skills in `.claude/skills/` add focused expertise:

| Skill | Source | Purpose |
|---|---|---|
| `impeccable` | vendored in `.github/skills/` | Design, critique, and polish UI against PRODUCT.md and DESIGN.md |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) | Distinctive visual direction for new UI |
| `modern-web-guidance` | [GoogleChrome/modern-web-guidance](https://github.com/GoogleChrome/modern-web-guidance) | Current HTML, CSS, accessibility, and performance practice |
| `vercel-react-best-practices` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | React performance rules |
| `vercel-composition-patterns` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Scalable component APIs |
| `webapp-testing` | [anthropics/skills](https://github.com/anthropics/skills) | Playwright checks and screenshots of the running site |
| `systematic-debugging` | [obra/superpowers](https://github.com/obra/superpowers) | Root-cause debugging before fixing |
| `test-driven-development` | [obra/superpowers](https://github.com/obra/superpowers) | Red-green-refactor for new code |
| `verification-before-completion` | [obra/superpowers](https://github.com/obra/superpowers) | Run the checks before calling work done |
| `git-workflow` | written for this repo | Feature branches, commits, and PRs to `master` with diff-based descriptions |

`skills-lock.json` pins each installed skill to a source commit and content
hash. Add more with `npx skills add <owner/repo> -s <skill> -a claude-code`.
The skills CLI and the Modern Web Guidance CLI send anonymous telemetry; the
Make targets set `DISABLE_TELEMETRY=1`.

## API

| Endpoint | Method | Description |
|---|---|---|
| `/api/projects/` | GET | List projects |
| `/api/projects/{id}/` | GET | Get one project |

The ML demo and stock endpoints are registered in
`src/apps/base_app/urls.py`.

## Deployment

The site deploys to Heroku. During the build, `bin/post_compile` builds the
frontend; on release, `Procfile` runs migrations, and `scripts/start.sh`
collects static files and starts Gunicorn.

```bash
heroku create <app-name>
heroku addons:create heroku-postgresql:essential-0
heroku config:set SECRET_KEY=<secret>
git push heroku master
```
