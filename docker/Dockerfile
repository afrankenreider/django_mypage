# syntax=docker/dockerfile:1
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV UV_SYSTEM_PYTHON=1

# Install system dependencies and Node.js
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    curl \
    ca-certificates \
    gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Copy requirements and install dependencies directly into system Python
COPY pyproject.toml uv.lock* README.md /app/
COPY src/__init__.py /app/src/__init__.py
COPY src/apps/__init__.py /app/src/apps/__init__.py
COPY src/apps/base_app/__init__.py /app/src/apps/base_app/__init__.py

# Install dependencies directly into system Python using pip interface
RUN uv pip install --system -e . --no-cache

# Copy application code
COPY . /app/

# Build frontend
WORKDIR /app/frontend
RUN npm install && npm run build

WORKDIR /app
