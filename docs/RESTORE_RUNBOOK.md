# RNexus Restore Runbook

This runbook provides end-to-end steps to restore the RNexus application on a fresh machine or server.

Audience: Ops/Developers restoring the full stack (backend, frontend, DB, websockets) from scratch.

## 1) Prerequisites
- macOS/Linux or a Linux VM
- Python 3.11+ (3.13 OK)
- Node.js 18+ (LTS recommended)
- PostgreSQL 13+ (production) or SQLite (local/dev)
- Redis 6+ (for Channels websockets)
- Git

Optional:
- Nginx (production serve)
- Docker/Compose (alternative deployment)

## 2) Clone repository
```bash
git clone https://github.com/mfpop/rnexus.git
cd rnexus
```

## 3) Environment configuration
See docs/ENVIRONMENT.md for full details. Quick start below.

### Backend env (.env)
Create `backend/.env` with at least:
```env
# Core
DJANGO_SETTINGS_MODULE=core.settings
SECRET_KEY=change-me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (Pick one)
# For SQLite local dev (implicit, no envs needed)
# For Postgres:
# DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/rnexus

# CORS (adjust for your frontend host/port)
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Redis for Channels
REDIS_URL=redis://localhost:6379/0
```
Note: The project uses python-dotenv; `.env` will be automatically loaded by Django settings if configured.

### Frontend env (optional)
If needed, create `frontend/.env` for frontend-specific variables (API URLs, etc.). Default dev assumes backend on http://localhost:8000.

## 4) Services (Postgres/Redis)
Ensure Postgres and Redis are running. Example (Homebrew on macOS):
```bash
brew services start postgresql
brew services start redis
```
Create the database (Postgres only):
```bash
createdb rnexus || true
```

## 5) Backend setup (use existing venv)
The repo expects `backend/venv` to exist.
```bash
cd backend
# If venv already exists:
source venv/bin/activate
# If missing, create once:
# python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Optional for dev/tests:
pip install -r requirements-dev.txt
```

Apply database migrations:
```bash
python manage.py migrate
```

Create an admin user (interactive):
```bash
python manage.py createsuperuser
```

Collect static files (production):
```bash
python manage.py collectstatic --noinput
```

Start backend (development):
```bash
python manage.py runserver 0.0.0.0:8000
```

## 6) Frontend setup
```bash
cd ../frontend
npm install
# Optional: install Playwright browsers if running e2e
npx playwright install
npm run dev
```

## 7) WebSockets (Channels)
- Ensure Redis is up (REDIS_URL configured).
- ASGI is configured in `backend/core/asgi.py`.
- For production, prefer Daphne/Uvicorn:
```bash
# Example (from backend directory with venv active)
python -m pip install daphne
DJANGO_SETTINGS_MODULE=core.settings daphne -b 0.0.0.0 -p 8000 core.asgi:application
```

## 8) Verification (smoke tests)
Backend:
```bash
# Health
curl -s http://localhost:8000/api/health
# DRF v2 endpoint
curl -s http://localhost:8000/api/v2/activities
```
Frontend:
- Open http://localhost:5173 and check the app loads.

E2E tests (optional):
```bash
cd frontend
npm run test:e2e
```

## 9) Backups and restore
### PostgreSQL
- Backup:
```bash
pg_dump --no-owner --format=c rnexus > rnexus.dump
```
- Restore:
```bash
createdb rnexus || true
pg_restore --no-owner --dbname=rnexus rnexus.dump
```

### SQLite (dev)
- Backup: copy the SQLite DB file.
- Restore: place the DB file back under backend (update settings to SQLite if needed).

## 10) Production notes (summary)
See docs/DEPLOYMENT_PRODUCTION.md for detailed steps.
- Use DEBUG=False, strong SECRET_KEY, proper ALLOWED_HOSTS
- Serve via Daphne/Uvicorn behind Nginx
- Configure SSL/TLS
- Run collectstatic and serve static/media via Nginx
- Use systemd or process manager for services

## 11) Troubleshooting
- Migrations missing: run `python manage.py migrate` in correct venv.
- Cannot connect to Postgres: verify DATABASE_URL and that the DB exists.
- WebSockets not working: ensure Redis is running and REDIS_URL set.
- Frontend API calls failing: check CORS and API base URLs.
- E2E fails due to browsers: run `npx playwright install`.

---
This runbook is designed to be self-contained. Pair it with ENVIRONMENT.md for variables and DEPLOYMENT_PRODUCTION.md for production specifics.
