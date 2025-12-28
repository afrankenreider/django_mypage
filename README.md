# Andrew Frankenreider Portfolio

A modern personal portfolio website built with React/TypeScript frontend and Django REST API backend.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **Django 4.1** - Python web framework
- **Django REST Framework** - API toolkit
- **SQLite** (development) / PostgreSQL (production)
- **uv** - Fast Python package manager

## Project Structure

```
django_mypage/
├── base_app/          # Django project settings
├── my_webpage/        # Django app with models and API
│   ├── api/           # REST API views
│   ├── models.py      # Data models
│   └── serializers.py # DRF serializers
├── frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── types/       # TypeScript type definitions
│   └── ...
└── pyproject.toml     # Python dependencies and project config
```

## Getting Started

### Prerequisites
- Python 3.8+
- [uv](https://docs.astral.sh/uv/) - Fast Python package manager
- Node.js 14+ (16+ recommended)
- npm or yarn

### Backend Setup

1. Install uv (if not already installed):
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. Create virtual environment and install dependencies:
   ```bash
   uv sync
   ```

3. Run migrations:
   ```bash
   uv run python manage.py migrate
   ```

4. Create a superuser (optional, for admin access):
   ```bash
   uv run python manage.py createsuperuser
   ```

5. Start the Django development server:
   ```bash
   uv run python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

### Frontend Setup

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

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects/` | GET | List all projects |
| `/api/projects/{id}/` | GET | Get a specific project |

## Development

### Running Both Servers

For development, you need to run both the Django backend and Vite frontend:

**Terminal 1 - Backend:**
```bash
uv run python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

### Adding Dependencies

To add a new Python dependency:
```bash
uv add <package-name>
```

To add a dev dependency:
```bash
uv add --dev <package-name>
```

### Building for Production

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. The built files will be output to `base_app/static/frontend/`

3. Collect static files:
   ```bash
   uv run python manage.py collectstatic
   ```

## Features

- 🏠 **Home** - Hero section with social links
- 👤 **About** - Professional background and story
- 🛠️ **Skills** - Technical skills and tools showcase
- 💼 **Projects** - Portfolio of work with filtering

## License

MIT License
