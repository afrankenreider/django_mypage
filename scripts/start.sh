#!/bin/bash
set -e

# Determine if running on Heroku
if [ -n "$DYNO" ]; then
    echo "Running on Heroku..."

    # Run migrations
    python manage.py migrate --noinput

    # Collect static files
    python manage.py collectstatic --noinput

    # Start gunicorn (frontend is pre-built during deployment)
    exec gunicorn src.apps.base_app.wsgi:application --bind 0.0.0.0:$PORT --workers 2
else
    echo "Running locally..."

    # Run migrations
    python manage.py makemigrations --noinput
    python manage.py migrate --noinput

    # Collect static files
    python manage.py collectstatic --noinput

    # Start backend in background
    echo "Starting Django backend on port 8000..."
    python manage.py runserver 0.0.0.0:8000 &
    BACKEND_PID=$!

    # Start frontend
    echo "Starting Vite frontend on port 3000..."
    cd frontend
    npm install
    npm run dev -- --host 0.0.0.0 --port 3000 &
    FRONTEND_PID=$!

    cd ..

    # Handle shutdown
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

    echo "Both services started!"
    echo "  - Backend:  http://localhost:8000"
    echo "  - Frontend: http://localhost:3000"

    # Wait for both processes
    wait
fi
