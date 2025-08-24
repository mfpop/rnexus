# Nexus Project Architecture

This document describes the end-to-end architecture of RNexus: components, data flow, interfaces, and operational concerns.

## 1. System Overview
- Frontend: React 19 + TypeScript, Vite build, Tailwind CSS for styling, Apollo Client for GraphQL (v3, planning v4).
- Backend: Django 5.2 (MVC), Django REST Framework (DRF) for API v2, Graphene-Django for GraphQL, Channels (ASGI) for WebSockets.
- Realtime: Django Channels using Redis as the channel layer.
- Persistence: PostgreSQL (production), SQLite (tests and local quick start).

## 2. Codebase Layout
```
rnexus/
├─ backend/
│  ├─ api/
│  │  ├─ models.py          # UserProfile, Activity*, Chat, Message, Tags, Updates, etc.
│  │  ├─ views.py           # Legacy HTTP endpoints under /api/
│  │  ├─ schema.py          # GraphQL schema (Graphene)
│  │  └─ v2/                # DRF viewsets/permissions/routers
│  ├─ core/
│  │  ├─ asgi.py            # ASGI entrypoint (Channels)
│  │  ├─ urls.py            # URL routing: legacy /api + /api/v2 (DRF)
│  │  └─ settings.py        # Django settings (+ settings_test.py)
│  └─ manage.py
├─ frontend/
│  ├─ src/
│  │  ├─ components/        # Page components and UI
│  │  ├─ contexts/          # React Context state
│  │  ├─ graphql/           # GraphQL documents
│  │  └─ lib/               # API helpers, websockets
│  └─ vite.config.ts
└─ docs/
```

## 3. API Layers
### 3.1 Legacy HTTP Endpoints (/api/*)
- Implemented in `backend/api/views.py` and wired in `core/urls.py`.
- Cover auth (login/register/profile), chat, updates (CRUD, likes, comments), tags, activities, health/version.
- Useful during migration; being gradually replaced by DRF in `/api/v2`.

### 3.2 DRF v2 (/api/v2/*)
- Router and viewsets under `backend/api/v2/`.
- Example: Activities endpoints via `ActivityViewSet` with SAFE_METHODS open and JWT-protected writes using `IsAuthenticatedJWT`.
- Benefits: consistent serializers, permissions, pagination, filtering.

### 3.3 GraphQL (/graphql)
- Graphene-Django exposes selected types and resolvers defined in `api/schema.py`.
- Frontend Apollo Client consumes queries/mutations where appropriate.

## 4. Authentication & Permissions
- JWT-based custom middleware secures write operations.
- DRF `IsAuthenticatedJWT` (api/v2/permissions.py) allows unauthenticated SAFE_METHODS; attaches `request.user` on valid JWT.
- CSRF: Legacy endpoints with csrf_exempt where needed; DRF handles per-viewset.

## 5. Data Model (Highlights)
Defined in `backend/api/models.py`.
- UserProfile: 1:1 extension of `django.contrib.auth.models.User` with contact and professional details.
- ActivityStatus/Priority: Config tables for labels, Tailwind classes, icons; referenced by Activity.
- Activity: Core scheduling entity with status/priority, times, assignees, progress; links to status/priority configs.
- Chat/Message: User and group chats, message types and statuses, last_activity, indexes for performance.
- Tags/Updates/Relations/Likes/Comments: Social/newsfeed domain for internal communications with attachments/media.

Indexes and ordering are defined for query performance (e.g., chat by last_activity, activity by created_at descending).

## 6. Realtime (Channels)
- ASGI application in `core/asgi.py` wires Channels.
- Redis is required in production; local tests can mock or run Redis.
- WebSocket consumers (in `api/consumers.py`) support system messages and chat.

## 7. Frontend Architecture
- StableLayout with two-card master-detail pages.
- Context-based state (e.g., NewsContext, ActivitiesContext) encapsulates data fetching and UI state.
- UI components organized per feature; shared UI primitives under `components/ui` and `components/ui/bits`.
- Router (React Router v7) defines page navigation.

## 8. Environments & Configuration
See `docs/ENVIRONMENT.md` for detailed variables.
- Backend `.env`: SECRET_KEY, DEBUG, ALLOWED_HOSTS, DATABASE_URL, CORS_ALLOWED_ORIGINS, REDIS_URL.
- Frontend `.env`: VITE_API_BASE_URL, VITE_WS_BASE_URL if overriding defaults.

## 9. Testing Strategy
- Backend: pytest + pytest-django, lightweight SQLite DB via `core/settings_test.py`; smoke tests for health and `/api/v2` endpoints.
- Frontend: ESLint, Vitest (unit tests), Playwright (e2e with local webServer using Vite build/preview).

## 10. Migration Plan
- Keep legacy `/api/*` endpoints operational.
- Introduce new resources under `/api/v2` with DRF viewsets/serializers/permissions.
- Migrate clients incrementally from legacy endpoints to `/api/v2`.

## 11. Deployment
See `docs/DEPLOYMENT_PRODUCTION.md` for end-to-end production setup with ASGI (Daphne), Nginx, Redis, Postgres.

## 12. Observability & Operations
- Health endpoint: `/api/health`.
- Logs: configure via Django LOGGING settings; process manager (systemd) supervises ASGI.
- Backups: database dumps (pg_dump), static/media snapshots.

## 13. Future Work
- Migrate remaining legacy endpoints (Updates, Chat, Tags) into DRF `/api/v2`.
- Apollo Client v4 migration plan with incremental roll-out.
- Typed API clients and OpenAPI schema generation for `/api/v2`.
