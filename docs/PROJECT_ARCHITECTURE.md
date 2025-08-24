# Nexus Project Architecture

High-level architecture overview:
- Backend: Django + DRF (v2 under `backend/api/v2`), Channels (WebSockets), GraphQL (Graphene)
- Frontend: React 19 + TS, Vite, Tailwind, Apollo Client
- Persistence: PostgreSQL in prod, SQLite for tests
- Realtime: Channels + Redis in prod

API versioning: Legacy endpoints under `/api/` remain; new DRF under `/api/v2/`.
