# Nexus Setup Guide

## Prereqs
- Python 3.11+, Node 18+, PostgreSQL 13+ (or SQLite), Redis (for websockets)

## Backend
- `cd backend && source venv/bin/activate`  # uses the existing virtual environment at backend/venv
- `pip install -r requirements.txt` (and optionally `-r requirements-dev.txt`)
	Note: If `venv` is missing, create it once with `python -m venv venv` and then activate it as above.
- `python manage.py migrate`
- `python manage.py runserver`

## Frontend
- `cd frontend && npm install && npm run dev`

## Testing
- Backend: `python manage.py test --settings=core.settings_test`
- Frontend: `npm run test` and `npm run test:e2e`
