# GitHub Copilot Instructions

## Project Overview

You are working in a full-stack web application built with:
- **Backend**: Django (Python)
- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS

## Core Principles

### 1. Follow DRY (Don't Repeat Yourself)
- Extract reusable logic into utility functions, hooks, or services
- Create shared components for repeated UI patterns
- Use Django's class-based views and mixins to avoid code duplication
- Leverage composition over inheritance where appropriate

### 2. Modern Best Practices
Always follow current best practices for Python, Django, React, and TypeScript development.

### 3. Do Not Use Emojis
Do not use any emojis in code comments, commit messages, documentation, or
user interfaces. If icons are being used, please use Google's Material Icons.

### 4. All Python Dependencies Must Be Managed with UV
- Use `uv` for managing Python dependencies and virtual environments.
- Ensure `uv.lock` is updated whenever dependencies change.

## Python & Django Guidelines

### Code Style
- Follow PEP 8 style guidelines
- Use type hints for function parameters and return values (PEP 484)
- Use f-strings for string formatting
- Keep functions focused and single-purpose
- Maximum line length: 88 characters (Black formatter standard)

### Django Specific
- Use Django's built-in features (ORM, forms, authentication) over custom solutions
- Keep models focused with clear field types and validators
- Use Django REST Framework serializers for API endpoints
- Implement proper error handling and validation
- Use `select_related()` and `prefetch_related()` to optimize database queries
- Follow the Fat Models, Thin Views pattern
- Use Django's migration system properly - never modify existing migrations
- Implement proper permissions and authentication checks
- Use environment variables for sensitive configuration (via `.env` files)

### Python Project Structure
- Keep imports organized: standard library, third-party, local imports (separated by blank lines)
- Use absolute imports from the `src/` directory
- Place Django apps in `src/apps/`
- Keep business logic in models, services, or utility modules, not in views

### Testing
- Write unit tests for models, views, and serializers
- Use Django's TestCase or pytest-django
- Test edge cases and error conditions
- Aim for meaningful test coverage

## React & TypeScript Guidelines

### TypeScript
- Always use explicit types - avoid `any` unless absolutely necessary
- Define interfaces for props, state, and API responses
- Use type inference where it improves readability
- Leverage union types and discriminated unions for better type safety
- Use enums or const objects for fixed sets of values

### React Best Practices
- Use functional components with hooks (not class components)
- Keep components small and focused on a single responsibility
- Extract custom hooks for reusable stateful logic
- Use proper React hooks: `useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`
- Avoid prop drilling - use Context API or state management when needed
- Implement proper error boundaries
- Use React.memo() for expensive component renders
- Clean up effects properly (return cleanup functions)

### Component Organization
- Place shared/reusable components in `frontend/src/components/`
- Place page-level components in `frontend/src/pages/`
- Use custom hooks in `frontend/src/hooks/`
- Define shared types in `frontend/src/types/`
- Keep components in their own files with clear, descriptive names

### State Management
- Use local state for component-specific data
- Use Context API for shared application state (e.g., theme, user)
- Consider more robust solutions (Zustand, Redux) for complex state needs
- Avoid unnecessary re-renders by proper state structure

### Styling
- Use Google's Material Icons for icons
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Extract repeated class combinations into components
- Use the `cn()` utility for conditional classes if available

## API & Integration

### Backend API
- Use Django REST Framework for API endpoints
- Follow RESTful conventions (proper HTTP methods, status codes)
- Implement proper serialization and validation
- Use viewsets and routers for standard CRUD operations
- Return consistent error response formats
- Implement pagination for list endpoints

### Frontend API Calls
- Use async/await syntax over promises
- Implement proper error handling with try/catch
- Show loading states during API calls
- Handle different error scenarios (network errors, validation errors, server errors)
- Type API responses with TypeScript interfaces

## Security Best Practices

- Never commit secrets or API keys to the repository
- Use environment variables for configuration
- Implement CSRF protection (Django provides this by default)
- Validate and sanitize all user inputs
- Use Django's built-in protection against SQL injection, XSS, etc.
- Implement proper authentication and authorization
- Use HTTPS in production
- Follow OWASP guidelines for web application security

## Performance

### Backend
- Use database indexes on frequently queried fields
- Optimize ORM queries (avoid N+1 queries)
- Implement caching where appropriate (Django cache framework)
- Use pagination for large datasets

### Frontend
- Lazy load routes and components with React.lazy()
- Optimize images and assets
- Minimize bundle size (code splitting, tree shaking)
- Use production builds for deployment
- Implement proper memoization for expensive calculations

## Code Quality

### Documentation
- Write clear docstrings for Python functions and classes (Google or NumPy style)
- Add JSDoc comments for complex TypeScript functions
- Keep README.md updated with setup and deployment instructions
- Document API endpoints and their expected inputs/outputs

### Version Control
- Write clear, descriptive commit messages
- Keep commits atomic and focused
- Use feature branches for new development
- Follow conventional commits format when possible

### Code Review
- Keep pull requests focused and reviewable
- Write descriptive PR descriptions
- Ensure all tests pass before requesting review
- Address review comments thoughtfully

## File Organization

```
django_mypage/
├── src/                    # Python source code
│   ├── apps/              # Django applications
│   │   ├── base_app/     # Core application settings
│   │   └── projects/     # Project-specific app
│   └── notebooks/         # Jupyter notebooks for analysis
├── frontend/              # React frontend
│   └── src/
│       ├── components/    # Reusable React components
│       ├── pages/        # Page-level components
│       ├── hooks/        # Custom React hooks
│       ├── context/      # React Context providers
│       └── types/        # TypeScript type definitions
├── tests/                 # Test files
├── staticfiles/          # Collected static files
└── scripts/              # Utility scripts
```

## Common Patterns

### Django Model Example
```python
from django.db import models
from typing import Optional

class Project(models.Model):
    """Represents a portfolio project."""

    title: str = models.CharField(max_length=200)
    description: str = models.TextField()
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return self.title
```

### React Component with TypeScript Example
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
    >
      {label}
    </button>
  );
};
```

## Additional Notes

- This project uses Vite for fast frontend builds
- Static files are collected to `staticfiles/` for Django to serve
- Pre-commit hooks are configured for code quality checks
- Environment variables should be defined in `.env` (never committed)
- The project supports Docker deployment (see `docker/` directory)
