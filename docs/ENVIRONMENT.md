# RNexus Environment Configuration

Central reference for environment variables and configuration across environments.

## Backend (Django)

Preferred: set variables via a `.env` file in `backend/` (loaded via python-dotenv) or environment variables.

Variables:
- `DJANGO_SETTINGS_MODULE` (default: `core.settings`)
- `SECRET_KEY` (required in production)
- `DEBUG` (`True` for dev, `False` for prod)
- `ALLOWED_HOSTS` (comma-separated)
- `DATABASE_URL` (PostgreSQL URL, e.g. `postgres://user:pass@host:5432/db`)
- `CORS_ALLOWED_ORIGINS` (comma-separated URLs, e.g. `http://localhost:5173`)
- `REDIS_URL` (`redis://host:6379/0` for Channels)
- `EMAIL_BACKEND` (optional)
- `LOG_LEVEL` (optional)

SQLite dev (no DATABASE_URL needed) is supported by default test settings (`core/settings_test.py`).

## Frontend (Vite)

Create `frontend/.env` or `.env.local` as needed. Example variables (prefix with `VITE_`):
- `VITE_API_BASE_URL` (e.g., `http://localhost:8000`)
- `VITE_WS_BASE_URL` (e.g., `ws://localhost:8000`)

Note: Only `VITE_*` variables are exposed to client code.

## Local vs Production
- Local: `DEBUG=True`, SQLite or local Postgres, permissive CORS
- Staging/Prod: `DEBUG=False`, PostgreSQL via `DATABASE_URL`, restricted `ALLOWED_HOSTS`, HTTPS

## Secret management
- Do not commit `.env` files
- Use platform secret stores (GitHub Actions secrets, cloud secret managers)

## Example `.env` (backend)
```env
DJANGO_SETTINGS_MODULE=core.settings
SECRET_KEY=change-me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
# DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/rnexus
REDIS_URL=redis://localhost:6379/0
```
