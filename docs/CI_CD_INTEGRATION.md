# Nexus CI/CD Integration Guide

## 🚀 Continuous Integration & Deployment Overview

This document provides comprehensive information about the CI/CD pipeline integration for the Nexus manufacturing operations management system, including automated testing, quality checks, and deployment processes.

## 🔐 Recent System Updates

### JWT Authentication Fix
The system has been updated with a robust JWT authentication middleware that resolves the "logged out on refresh" issue:

- Enhanced Middleware: Added `process_view` method to ensure proper user authentication
- Conflict Resolution: Handles conflicts with Django's AuthenticationMiddleware
- Improved Security: Better token validation and user session management
- Comprehensive Testing: Full authentication flow testing and validation

### System Enhancements
- Activities System: Complete manufacturing activities management
- Real-time Updates: WebSocket-based notifications and updates
- Enhanced Database Models: Comprehensive data modeling for manufacturing operations
- Frontend Components: Improved React components with TypeScript

## 🏗️ CI/CD Pipeline Architecture

### Pipeline Stages
```
1. Code Quality Checks → 2. Testing → 3. Security Scanning → 4. Build → 5. Deploy
```

### Technology Stack
- GitHub Actions: CI/CD orchestration
- Docker: Containerization
- Python: Backend testing and quality checks
- Node.js: Frontend testing and building
- PostgreSQL: Database testing
- Redis: Cache and WebSocket testing

## 📋 GitHub Actions Workflow

See `.github/workflows` for the latest workflows.

- Code quality for backend with Black, isort, MyPy, Bandit, Safety
- Backend tests (Django) and coverage
- Frontend lint, type-check, unit tests (Vitest)
- Build Docker images for backend and frontend
- Staging/Production deploy placeholders

## 🐳 Docker Configuration

- Multi-stage frontend build (Vite) with Nginx serve
- Slim Python backend image with collectstatic and migrations

## ✅ Tips
- Keep requirements split into runtime (`backend/requirements.txt`) and dev (`backend/requirements-dev.txt`)
- Cache dependencies in CI for speed
- Upload artifacts (coverage, reports) for visibility
