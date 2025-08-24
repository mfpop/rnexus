# Nexus Dependencies Update Report

This document tracks dependency versions and upgrade plans.

## Backend (Python)
- Runtime (requirements.txt): Django 5.2.x, DRF 3.16.x, Channels 4.x, Graphene 3.x, PostgreSQL adapter, Redis client, Pillow
- Dev (requirements-dev.txt): black, isort, mypy, pyright, pre-commit, pytest, pytest-django, coverage, django-debug-toolbar

Notes:
- Keep runtime and dev requirements separated
- Run `pip list --outdated` regularly and update minor versions

## Frontend (Node)
- React 19, React Router 7, Vite 7, Tailwind 4, Vitest 3, Playwright 1.55
- Apollo Client currently v3.x. v4 is a major upgrade with breaking changes → schedule a migration spike before bumping

## Security
- Run `npm audit` and `pip-audit`/`safety` routinely

## Commands
Frontend:
```
cd frontend
npm outdated
npm run lint
npm run build
npm run test && npm run test:e2e
```

Backend:
```
cd backend
source venv/bin/activate
pip list --outdated
python manage.py check
pytest --ds core.settings_test -q
```

## Upgrade policy
- Patch/minor: auto or monthly
- Major: plan, spike, then migrate with tests
