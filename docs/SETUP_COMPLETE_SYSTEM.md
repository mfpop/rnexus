# Complete System Setup Guide

End-to-end setup steps:
- Backend: create venv, `pip install -r requirements.txt`, `python manage.py migrate`, runserver
- Frontend: `npm install`, `npm run dev`
- Optional services: PostgreSQL, Redis for Channels
- WebSocket: configure Channels in `core/asgi.py`

See also: `docs/SETUP_GUIDE.md` for detailed local setup.
