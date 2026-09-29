# Stage 1: Build the React frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

# Install dependencies and build the frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Python backend and serve
FROM python:3.12-slim
WORKDIR /app

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend_dist

# Create a place for collected static files
RUN mkdir -p /app/staticfiles

# Setup environment for collectstatic
ENV SECRET_KEY=build_secret
RUN cd backend && python manage.py collectstatic --noinput

EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/api/health/ || exit 1

# Start the gunicorn server
WORKDIR /app/backend
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]
