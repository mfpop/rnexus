# RNexus Production Deployment Guide

Comprehensive steps to deploy RNexus in production.

## Architecture
- Django (ASGI) served by Daphne/Uvicorn
- Redis for Channels
- PostgreSQL for database
- Nginx as reverse proxy and static file server

## 1) Server prep
- OS updates, firewall, users
- Install Python 3.11+, Node 18+, Postgres, Redis, Nginx

## 2) Code & environment
```bash
sudo mkdir -p /opt/rnexus && sudo chown $USER /opt/rnexus
cd /opt/rnexus
git clone https://github.com/mfpop/rnexus.git .
```

Create `backend/.env` with production values (see ENVIRONMENT.md):
- `DEBUG=False`
- strong `SECRET_KEY`
- `ALLOWED_HOSTS` to your domain(s)
- `DATABASE_URL` to managed Postgres
- `CORS_ALLOWED_ORIGINS` to your frontend URLs
- `REDIS_URL` to your Redis instance

## 3) Python env and deps
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
Optional dev tooling is not required in prod.

## 4) Database and static files
```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

## 5) ASGI server (Daphne)
Create a systemd service `rnexus-backend.service`:
```
[Unit]
Description=RNexus Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/rnexus/backend
Environment=DJANGO_SETTINGS_MODULE=core.settings
Environment=PYTHONUNBUFFERED=1
EnvironmentFile=/opt/rnexus/backend/.env
ExecStart=/opt/rnexus/backend/venv/bin/daphne -b 0.0.0.0 -p 8000 core.asgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```

## 6) Nginx
Serve `frontend/dist` and reverse-proxy to backend 8000.

Example server block (simplified):
```
server {
    listen 80;
    server_name example.com;

    root /opt/rnexus/frontend/dist;
    index index.html;

    location /assets/ {
        try_files $uri =404;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri /index.html;
    }
}
```

## 7) Frontend build
```bash
cd /opt/rnexus/frontend
npm ci
npm run build
```

## 8) Observability
- Configure logging level and rotation
- Monitor systemd services, Nginx logs, Postgres
- Health checks on `/api/health`

## 9) Security
- TLS certificates (Let’s Encrypt)
- Harden Nginx headers
- Keep dependencies updated
- Backups for DB and `.env`

## 10) Rolling updates
- Pull latest, build frontend, restart backend service

This guide pairs with RESTORE_RUNBOOK.md and ENVIRONMENT.md for a full restore/deploy picture.
