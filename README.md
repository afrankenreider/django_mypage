# Andrew Frankenreider Portfolio

A modern personal portfolio website built with React/TypeScript frontend and Django REST API backend.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Material UI** - Component library

### Backend
- **Django 6.0** - Python web framework
- **Django REST Framework** - API toolkit
- **PostgreSQL** - Database (local via Docker, managed on Heroku)
- **uv** - Fast Python package manager

### Data Science
- **Jupyter Notebooks** - Interactive development
- **pandas** - Data manipulation
- **numpy** - Numerical computing

## Project Structure

```
django_mypage/
├── src/                    # Python source code
│   ├── apps/               # Django applications
│   │   ├── base_app/       # Django project settings & config
│   │   └── projects/       # Projects app with models and API
│   └── notebooks/          # Jupyter notebooks for data science/ML
├── frontend/               # React TypeScript frontend
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       └── types/          # TypeScript type definitions
├── tests/                  # Test suite
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
├── scripts/                # Utility scripts
├── docker/                 # Docker configuration
│   ├── Dockerfile
│   └── docker-compose.yaml
├── docs/                   # Documentation
├── manage.py               # Django CLI
└── pyproject.toml          # Python dependencies and project config
```

## Getting Started

### Prerequisites
- Python 3.13+
- [uv](https://docs.astral.sh/uv/) - Fast Python package manager
- Node.js 20+
- Docker (for local PostgreSQL)

### Quick Start (Docker)

The easiest way to run the full stack locally:

```bash
cd docker
docker-compose up
```

This starts:
- PostgreSQL database on port 5432
- Django backend on port 8000
- Vite frontend on port 3000

### Manual Setup

#### Backend Setup

1. Install uv (if not already installed):
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. Create virtual environment and install dependencies:
   ```bash
   uv sync --dev
   ```

3. Start PostgreSQL (via Docker):
   ```bash
   cd docker && docker-compose up db -d
   ```

4. Run migrations:
   ```bash
   uv run python manage.py migrate
   ```

5. Create a superuser (optional):
   ```bash
   uv run python manage.py createsuperuser
   ```

6. Start the Django development server:
   ```bash
   uv run python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Running Both Services

Use the start script to run both frontend and backend:

```bash
./scripts/start.sh
```

## Development

### Code Quality

This project uses:
- **Ruff** - Fast Python linter and formatter
- **Pre-commit** - Git hooks for code quality

Setup pre-commit hooks:
```bash
uv run pre-commit install
```

Run linting manually:
```bash
uv run ruff check --fix .
uv run ruff format .
```

### Jupyter Notebooks

Start Jupyter for data science work:
```bash
uv run jupyter notebook
```

Notebooks are located in `src/notebooks/`.

### Running Tests

The project uses Django's test framework with `unittest` style tests. Tests are organized by app within each app's `tests.py` file.

#### Test Structure

```
src/apps/
├── projects/
│   └── tests.py          # Projects app tests (model & API)
└── weekly_media/
    └── tests.py          # Weekly media app tests (model & API)
```

#### Running Tests with uv

```bash
# Run all tests
uv run python manage.py test

# Run tests with verbose output
uv run python manage.py test --verbosity=2

# Run tests for a specific app
uv run python manage.py test src.apps.projects
uv run python manage.py test src.apps.weekly_media

# Run a specific test class
uv run python manage.py test src.apps.projects.tests.ProjectsAPITests

# Run a specific test method
uv run python manage.py test src.apps.projects.tests.ProjectsAPITests.test_list_projects
```

#### Running Tests with Docker

```bash
# Run tests in the Docker container
cd docker
docker-compose exec web python manage.py test

# Run tests with verbose output
docker-compose exec web python manage.py test --verbosity=2

# Run tests for a specific app
docker-compose exec web python manage.py test src.apps.projects
```

#### Test Coverage

To run tests with coverage reporting:

```bash
# Install coverage (if not already installed)
uv add --dev coverage

# Run tests with coverage
uv run coverage run manage.py test

# View coverage report in terminal
uv run coverage report

# Generate HTML coverage report
uv run coverage html
# Open htmlcov/index.html in your browser
```

### Adding Dependencies

```bash
# Add production dependency
uv add <package-name>

# Add dev dependency
uv add --dev <package-name>
```

## API Endpoints

| Endpoint              | Method | Description            |
| --------------------- | ------ | ---------------------- |
| `/api/projects/`      | GET    | List all projects      |
| `/api/projects/{id}/` | GET    | Get a specific project |

## Deployment (Heroku)

The project is configured for Heroku deployment:

1. Create Heroku app and add PostgreSQL:
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:essential-0
   ```

2. Set environment variables:
   ```bash
   heroku config:set SECRET_KEY=your-secret-key
   ```

3. Deploy:
   ```bash
   git push heroku main
   ```

## Features

- 🏠 **Home** - Hero section with social links
- 👤 **About** - Professional background and story
- 🛠️ **Skills** - Technical skills and tools showcase
- 💼 **Projects** - Portfolio of work with filtering
- 📊 **Notebooks** - Data science experiments and ML projects
