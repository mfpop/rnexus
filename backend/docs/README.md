# Backend (Django)

This backend powers RNexus with Django, Channels, GraphQL, and a DRF-based v2 API.

## Structure

- `api/`
  - `views.py`: Legacy monolithic HTTP endpoints (kept for compatibility)
  - `consumers.py`: WebSocket consumers (Channels)
  - `schema.py`: GraphQL schema (Graphene)
  - `v2/`: New DRF-based API (incremental migration)
    - `viewsets.py`: ActivityViewSet with custom actions (start/pause)
    - `permissions.py`: JWT permission (SAFE_METHODS allowed during migration)
    - `routers.py`: DRF router mounted under `/api/v2/`
- `core/`
  - `settings.py`: Main settings (PostgreSQL in dev)
  - `settings_test.py`: Test settings (SQLite)
  - `urls.py`: Routes (legacy under `/api/`, DRF under `/api/v2/`)

## Run (dev)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8001
```

Health check: http://127.0.0.1:8001/api/health/

DRF v2 list: http://127.0.0.1:8001/api/v2/activities/

## Tests

Use SQLite-backed settings for fast tests:

```bash
cd backend
source venv/bin/activate
python manage.py test --settings=core.settings_test
```

## Notes

- v2 API is read-only for anonymous GETs during migration; write actions require JWT.
- Once the frontend switches to v2, legacy endpoints can be deprecated and removed.
