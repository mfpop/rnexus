# Nexus Setup Guide

## Prereqs
- Python 3.11+, Node 18+, PostgreSQL 13+ (or SQLite), Redis (for websockets)

## Backend
- `cd backend && python -m venv venv && source venv/bin/activate`
- `pip install -r requirements.txt` (and optionally `-r requirements-dev.txt`)
- `python manage.py migrate`
- `python manage.py runserver`

## Frontend
- `cd frontend && npm install && npm run dev`

## Testing
- Backend: `python manage.py test --settings=core.settings_test`
- Frontend: `npm run test` and `npm run test:e2e`
