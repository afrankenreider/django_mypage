# syntax=docker/dockerfile:1
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js for frontend build
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Copy files needed for dependency installation
COPY pyproject.toml uv.lock* README.md /app/
COPY src/__init__.py /app/src/__init__.py
COPY src/apps/__init__.py /app/src/apps/__init__.py
COPY src/apps/base_app/__init__.py /app/src/apps/base_app/__init__.py

# Install Python dependencies using uv
RUN uv sync --frozen --no-dev

# Copy application code
COPY . /app/

# Build frontend
WORKDIR /app/frontend
RUN npm install && npm run build

WORKDIR /app
