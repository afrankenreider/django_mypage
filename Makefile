# Developer tasks for the portfolio site. Run `make` or `make help` to list them.

.DEFAULT_GOAL := help
SHELL := /bin/bash

UV      ?= uv
NPM     ?= npm
MANAGE  := $(UV) run python manage.py
FE      := frontend
COMPOSE := docker compose -f docker/docker-compose.yaml

BACKEND_PORT  ?= 8000
FRONTEND_PORT ?= 3000

.PHONY: help
help: ## List available targets
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make <target>\n"} \
		/^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } \
		/^[a-zA-Z0-9_-]+:.*##/ { printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

##@ Setup

.PHONY: install install-backend install-frontend hooks env
install: install-backend install-frontend hooks ## Install all dependencies and git hooks

install-backend: ## Install Python dependencies with uv
	$(UV) sync --dev

install-frontend: ## Install frontend dependencies from the lockfile
	cd $(FE) && $(NPM) ci

hooks: ## Install pre-commit git hooks
	$(UV) run pre-commit install

env: ## Create .env from .env.example if it does not exist
	@test -f .env && echo ".env already exists" || (cp .env.example .env && echo "Created .env")

##@ Development

.PHONY: dev backend frontend shell notebook
dev: ## Run Django and Vite together (Ctrl-C stops both)
	@$(MAKE) -j2 --no-print-directory backend frontend

backend: ## Run the Django dev server
	$(MANAGE) runserver $(BACKEND_PORT)

frontend: ## Run the Vite dev server (proxies /api to Django)
	cd $(FE) && $(NPM) run dev -- --port $(FRONTEND_PORT)

shell: ## Open a Django shell
	$(MANAGE) shell

notebook: ## Start Jupyter for src/notebooks
	$(UV) run jupyter notebook src/notebooks

##@ Database

.PHONY: db-up db-down migrate migrations superuser
db-up: ## Start local PostgreSQL in Docker
	$(COMPOSE) up -d db

db-down: ## Stop local Docker services
	$(COMPOSE) down

migrate: ## Apply database migrations
	$(MANAGE) migrate

migrations: ## Create new migrations from model changes
	$(MANAGE) makemigrations

superuser: ## Create a Django admin user
	$(MANAGE) createsuperuser

##@ Quality

.PHONY: lint format typecheck test coverage check pre-commit
lint: ## Lint Python with ruff
	$(UV) run ruff check .
	$(UV) run ruff format --check .

format: ## Auto-fix and format Python with ruff
	$(UV) run ruff check --fix .
	$(UV) run ruff format .

typecheck: ## Type-check the frontend
	cd $(FE) && $(NPM) run typecheck

test: ## Run the Python test suite
	$(UV) run pytest

coverage: ## Run tests with a coverage report (HTML in htmlcov/)
	$(UV) run pytest --cov --cov-report=term-missing --cov-report=html

check: lint typecheck test ## Run everything CI runs

pre-commit: ## Run all pre-commit hooks on every file
	$(UV) run pre-commit run --all-files

##@ Build and deploy

.PHONY: build collectstatic docker-up docker-down
build: ## Build the frontend into staticfiles/frontend
	cd $(FE) && $(NPM) run build

collectstatic: build ## Build the frontend and collect static files
	$(MANAGE) collectstatic --noinput

docker-up: ## Run the full stack in Docker
	$(COMPOSE) up --build

docker-down: ## Stop the Docker stack
	$(COMPOSE) down

##@ Git and pull requests

.PHONY: branch pr-context pr sync
branch: ## Start a feature branch from origin/master: make branch NAME=feat/thing
	@test -n "$(NAME)" || (echo "Usage: make branch NAME=<type>/<slug>"; exit 1)
	git fetch origin
	git switch -c $(NAME) origin/master

pr-context: ## Show commits, files, and diff for the current branch vs master
	@.claude/skills/git-workflow/scripts/pr-context.sh

pr: ## Push the current branch and open a PR to master in the browser
	git push -u origin HEAD
	gh pr create --base master --web

sync: ## Merge the latest origin/master into the current branch
	git fetch origin
	git merge origin/master

##@ Agent skills

.PHONY: skills skills-update
skills: ## List installed agent skills
	@DISABLE_TELEMETRY=1 npx -y skills@latest list

skills-update: ## Update skills pinned in skills-lock.json
	DISABLE_TELEMETRY=1 npx -y skills@latest update -p -y

##@ Housekeeping

.PHONY: clean
clean: ## Remove caches and local build artifacts
	find . -type d -name __pycache__ -not -path './.venv/*' -prune -exec rm -rf {} +
	rm -rf .pytest_cache .ruff_cache .coverage htmlcov staticfiles/collected
