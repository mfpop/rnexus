This document has moved to docs/SETUP_GUIDE.md

# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Database Setup
```bash
# Create PostgreSQL database and user
sudo -u postgres psql

CREATE DATABASE nexus_db;
CREATE USER nexus_user WITH PASSWORD 'nexus_password';
GRANT ALL PRIVILEGES ON DATABASE nexus_db TO nexus_user;
ALTER USER nexus_user CREATEDB;
\q

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 4. Data Population
```bash
# Populate database with sample data
python setup_database.py
python manage.py populate_all
```

### 5. Start Backend Server
```bash
python manage.py runserver
```

**Backend will be available at**: http://localhost:8000

## ⚛️ Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the frontend directory:
```bash
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_APP_TITLE=Nexus Manufacturing
```

### 3. Start Development Server
```bash
npm run dev
```

**Frontend will be available at**: http://localhost:5173

## 🔐 Authentication Setup

### JWT Configuration
The system now includes a robust JWT authentication system with the following features:

#### Backend JWT Settings
```python
# backend/core/settings.py
JWT_AUTH = {
    'JWT_SECRET_KEY': 'your-secret-key',
    'JWT_ALGORITHM': 'HS256',
    'JWT_EXPIRATION_DELTA': timedelta(hours=24),
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=7),
}
```

#### JWT Middleware Configuration
```python
# backend/api/middleware.py
MIDDLEWARE = [
    # ... other middleware
    'api.middleware.JWTAuthenticationMiddleware',  # Must come before Django's auth middleware
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    # ... other middleware
]
```

#### Frontend Authentication
```typescript
// frontend/src/lib/authService.ts
const authService = {
  login: async (credentials) => {
    const response = await fetch('/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      return data.user;
    }
    throw new Error(data.error);
  }
};
```

## 🗄️ Database Configuration

### PostgreSQL Setup
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres createuser --interactive
sudo -u postgres createdb nexus_db
```

### Redis Setup
```bash
# Install Redis (Ubuntu/Debian)
sudo apt install redis-server

# Start Redis service
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis connection
redis-cli ping
```

## 🧪 Testing Setup

### Backend Testing
```bash
cd backend
source venv/bin/activate

# Run all tests
python manage.py test

# Run specific test files
python manage.py test api.tests.test_views
python manage.py test api.tests.test_models

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Frontend Testing
```bash
cd frontend

# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## 🛠️ Development Tools

### Code Quality Tools
```bash
# Backend (Python)
cd backend
source venv/bin/activate

# Install pre-commit hooks
pip install pre-commit
pre-commit install

# Manual formatting
black .
isort .
mypy .

# Frontend (JavaScript/TypeScript)
cd frontend

# Install pre-commit hooks
npm install -g husky
npx husky install

# Manual formatting
npm run lint
npm run format
```

### Pre-commit Hooks Configuration
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black
        language_version: python3

  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies: [types-requests]
```

## 🚀 Production Setup

### Environment Variables
```bash
# Production environment variables
DJANGO_SECRET_KEY=your-production-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=your-domain.com,www.your-domain.com

# Database (production)
DATABASE_URL=postgresql://user:password@host:port/database

# Redis (production)
REDIS_URL=redis://host:port

# Security
DJANGO_CSRF_TRUSTED_ORIGINS=https://your-domain.com
DJANGO_SECURE_SSL_REDIRECT=True
DJANGO_SESSION_COOKIE_SECURE=True
```

### Static Files
```bash
cd backend
python manage.py collectstatic
python manage.py compress
```

### Database Optimization
```bash
# Create database indexes
python manage.py dbshell
CREATE INDEX CONCURRENTLY idx_activities_status ON api_activity(status);
CREATE INDEX CONCURRENTLY idx_activities_type ON api_activity(type);
CREATE INDEX CONCURRENTLY idx_activities_assigned_to ON api_activity(assigned_to_id);
```

## 🔧 Troubleshooting

### Common Issues

#### JWT Authentication Problems
```bash
# Check JWT middleware logs
tail -f backend/django.log

# Verify token expiration
python backend/decode_token.py

# Check middleware order in settings.py
MIDDLEWARE = [
    'api.middleware.JWTAuthenticationMiddleware',  # Must be first
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    # ... other middleware
]
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
psql -h localhost -U nexus_user -d nexus_db

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### Frontend Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev

# Check for TypeScript errors
npm run type-check
```

#### WebSocket Connection Issues
```bash
# Check Redis status
sudo systemctl status redis-server

# Test Redis connection
redis-cli ping

# Check Django Channels configuration
python manage.py shell
from channels.layers import get_channel_layer
channel_layer = get_channel_layer()
```

### Performance Optimization

#### Database Optimization
```bash
# Analyze query performance
python manage.py shell
from django.db import connection
from django.db import reset_queries
import time

reset_queries()
# ... your code ...
print(f"Number of queries: {len(connection.queries)}")
for query in connection.queries:
    print(f"Time: {query['time']}")
```

#### Frontend Optimization
```bash
# Build analysis
npm run build
npm run analyze

# Bundle size optimization
npm run build:analyze
```

## 📚 Additional Resources

### Documentation
- **[PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md)** - System architecture details
- **[DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md)** - Database schema documentation
- **[DEVELOPMENT_TOOLS_SUMMARY.md](DEVELOPMENT_TOOLS_SUMMARY.md)** - Development tools guide

### API Documentation
- **REST API**: http://localhost:8000/api/
- **GraphQL**: http://localhost:8000/graphql/
- **Admin Panel**: http://localhost:8000/admin/

### Development Commands
```bash
# Start all services
./start_servers.sh

# Database operations
python manage.py makemigrations
python manage.py migrate
python manage.py showmigrations

# User management
python manage.py createsuperuser
python manage.py changepassword <username>

# Static files
python manage.py collectstatic
python manage.py compress

# Development utilities
python manage.py shell
python manage.py dbshell
python manage.py check
```

---

**This setup guide provides everything needed to get the Nexus system running in development and production environments.**
