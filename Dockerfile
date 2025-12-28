# syntax=docker/dockerfile:1
FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /code
COPY pyproject.toml uv.lock* /code/

# Install dependencies using uv
RUN uv sync --frozen --no-dev

COPY . /code/
