# Nexus CI/CD Integration Guide

## 🚀 Continuous Integration & Deployment Overview

This document provides comprehensive information about the CI/CD pipeline integration for the Nexus manufacturing operations management system, including automated testing, quality checks, and deployment processes.

## 🔐 Recent System Updates

### JWT Authentication Fix
The system has been updated with a robust JWT authentication middleware that resolves the "logged out on refresh" issue:

- **Enhanced Middleware**: Added `process_view` method to ensure proper user authentication
- **Conflict Resolution**: Handles conflicts with Django's AuthenticationMiddleware
- **Improved Security**: Better token validation and user session management
- **Comprehensive Testing**: Full authentication flow testing and validation

### System Enhancements
- **Activities System**: Complete manufacturing activities management
- **Real-time Updates**: WebSocket-based notifications and updates
- **Enhanced Database Models**: Comprehensive data modeling for manufacturing operations
- **Frontend Components**: Improved React components with TypeScript

## 🏗️ CI/CD Pipeline Architecture

### Pipeline Stages
```
1. Code Quality Checks → 2. Testing → 3. Security Scanning → 4. Build → 5. Deploy
```

### Technology Stack
- **GitHub Actions**: CI/CD orchestration
- **Docker**: Containerization
- **Python**: Backend testing and quality checks
- **Node.js**: Frontend testing and building
- **PostgreSQL**: Database testing
- **Redis**: Cache and WebSocket testing

## 📋 GitHub Actions Workflow

### Main CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
name: Nexus CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

env:
  PYTHON_VERSION: '3.11'
  NODE_VERSION: '18'
  DJANGO_SETTINGS_MODULE: core.settings

jobs:
  quality-checks:
    name: Code Quality & Security
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: ${{ env.PYTHON_VERSION }}

    - name: Install Python dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r backend/requirements-dev.txt
This document has moved to docs/CI_CD_INTEGRATION.md
    volumes:
      - ./frontend:/app

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=nexus_db
      - POSTGRES_USER=nexus_user
      - POSTGRES_PASSWORD=nexus_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
  static_volume:
  media_volume:
```

## 🧪 Testing Strategy

### Test Types
1. **Unit Tests**: Individual component testing
2. **Integration Tests**: Component interaction testing
3. **End-to-End Tests**: Complete user flow testing
4. **Performance Tests**: Load and stress testing
5. **Security Tests**: Vulnerability and penetration testing

### Test Configuration
```python
# backend/pytest.ini
[tool:pytest]
DJANGO_SETTINGS_MODULE = core.settings
python_files = tests.py test_*.py *_tests.py
addopts =
    --strict-markers
    --strict-config
    --cov=api
    --cov-report=html
    --cov-report=xml
markers =
    slow: marks tests as slow
    integration: marks tests as integration tests
    unit: marks tests as unit tests
    auth: marks tests as authentication tests
```

### Test Data Management
```python
# backend/api/management/commands/populate_test_data.py
class Command(BaseCommand):
    help = 'Populate database with test data for CI/CD'

    def handle(self, *args, **options):
        self.stdout.write('Creating test data...')

        # Create test users
        self.create_test_users()

        # Create test activities
        self.create_test_activities()

        # Create test projects
        self.create_test_projects()

        self.stdout.write(
            self.style.SUCCESS('Successfully created test data')
        )
```

## 🔒 Security Integration

### Security Scanning
```yaml
# Security scanning in CI/CD
- name: Run Bandit security scan
  run: |
    cd backend
    bandit -r . -f json -o bandit-report.json

- name: Run Safety dependency check
  run: |
    cd backend
    safety check --json --output safety-report.json

- name: Run npm audit
  run: |
    cd frontend
    npm audit --audit-level=moderate
```

### Security Headers
```python
# backend/core/settings.py
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_SECONDS = 31536000
SECURE_REDIRECT_EXEMPT = []
SECURE_SSL_REDIRECT = False  # Set to True in production
SESSION_COOKIE_SECURE = False  # Set to True in production
CSRF_COOKIE_SECURE = False  # Set to True in production
```

## 📊 Monitoring & Observability

### Health Checks
```python
# backend/api/views.py
from django.http import JsonResponse
from django.db import connection
from redis import Redis
import os

def health_check(request):
    """Comprehensive health check endpoint"""
    health_status = {
        'status': 'healthy',
        'timestamp': timezone.now().isoformat(),
        'checks': {}
    }

    # Database health check
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        health_status['checks']['database'] = 'healthy'
    except Exception as e:
        health_status['checks']['database'] = f'unhealthy: {str(e)}'
        health_status['status'] = 'unhealthy'

    # Redis health check
    try:
        redis_client = Redis.from_url(settings.REDIS_URL)
        redis_client.ping()
        health_status['checks']['redis'] = 'healthy'
    except Exception as e:
        health_status['checks']['redis'] = f'unhealthy: {str(e)}'
        health_status['status'] = 'unhealthy'

    # File system health check
    try:
        test_file = os.path.join(settings.MEDIA_ROOT, 'health_check.txt')
        with open(test_file, 'w') as f:
            f.write('health check')
        os.remove(test_file)
        health_status['checks']['filesystem'] = 'healthy'
    except Exception as e:
        health_status['checks']['filesystem'] = f'unhealthy: {str(e)}'
        health_status['status'] = 'unhealthy'

    status_code = 200 if health_status['status'] == 'healthy' else 503
    return JsonResponse(health_status, status=status_code)
```

### Logging Configuration
```python
# backend/core/settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'json': {
            'format': '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s"}',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/django.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'api': {
            'handlers': ['file', 'console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

## 🚀 Deployment Strategies

### Blue-Green Deployment
```yaml
# Blue-green deployment configuration
deploy-blue:
  name: Deploy Blue Environment
  runs-on: ubuntu-latest

  steps:
  - name: Deploy to blue environment
    run: |
      echo "Deploying to blue environment..."
      # Blue deployment logic

  - name: Run health checks on blue
    run: |
      echo "Running health checks on blue..."
      # Health check logic

  - name: Switch traffic to blue
    run: |
      echo "Switching traffic to blue..."
      # Traffic switching logic

deploy-green:
  name: Deploy Green Environment
  runs-on: ubuntu-latest

  steps:
  - name: Deploy to green environment
    run: |
      echo "Deploying to green environment..."
      # Green deployment logic

  - name: Run health checks on green
    run: |
      echo "Running health checks on green..."
      # Health check logic

  - name: Switch traffic to green
    run: |
      echo "Switching traffic to green..."
      # Traffic switching logic
```

### Canary Deployment
```yaml
# Canary deployment configuration
deploy-canary:
  name: Deploy Canary
  runs-on: ubuntu-latest

  steps:
  - name: Deploy canary version
    run: |
      echo "Deploying canary version..."
      # Canary deployment logic

  - name: Route small traffic to canary
    run: |
      echo "Routing 5% traffic to canary..."
      # Traffic routing logic

  - name: Monitor canary performance
    run: |
      echo "Monitoring canary performance..."
      # Performance monitoring logic

  - name: Roll forward or rollback
    run: |
      echo "Evaluating canary performance..."
      # Decision logic
```

## 🔄 Rollback Procedures

### Automatic Rollback
```yaml
# Automatic rollback on failure
deploy-with-rollback:
  name: Deploy with Auto-rollback
  runs-on: ubuntu-latest

  steps:
  - name: Deploy new version
    run: |
      echo "Deploying new version..."
      # Deployment logic

  - name: Wait for deployment to stabilize
    run: |
      echo "Waiting for deployment to stabilize..."
      sleep 60

  - name: Run health checks
    run: |
      echo "Running health checks..."
      # Health check logic

  - name: Rollback on failure
    if: failure()
    run: |
      echo "Health checks failed, rolling back..."
      # Rollback logic
```

### Manual Rollback
```bash
# Manual rollback commands
# Rollback to previous version
git checkout HEAD~1
docker-compose down
docker-compose up -d

# Rollback to specific tag
git checkout v1.2.3
docker-compose down
docker-compose up -d

# Database rollback
python manage.py migrate api 0008  # Rollback to migration 0008
```

## 📈 Performance Monitoring

### Load Testing
```python
# backend/load_testing.py
import asyncio
import aiohttp
import time
from concurrent.futures import ThreadPoolExecutor

async def load_test_endpoint(url, num_requests, concurrent_users):
    """Load test a specific endpoint"""
    async with aiohttp.ClientSession() as session:
        tasks = []
        for i in range(num_requests):
            task = asyncio.create_task(make_request(session, url))
            tasks.append(task)

            if len(tasks) >= concurrent_users:
                await asyncio.gather(*tasks)
                tasks = []

        if tasks:
            await asyncio.gather(*tasks)

async def make_request(session, url):
    """Make a single request and measure performance"""
    start_time = time.time()
    try:
        async with session.get(url) as response:
            response_time = time.time() - start_time
            return {
                'status': response.status,
                'response_time': response_time,
                'success': response.status == 200
            }
    except Exception as e:
        response_time = time.time() - start_time
        return {
            'status': 'error',
            'response_time': response_time,
            'success': False,
            'error': str(e)
        }
```

### Performance Metrics
```python
# backend/api/middleware.py
import time
from django.utils.deprecation import MiddlewareMixin
from django.core.cache import cache

class PerformanceMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()

    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time

            # Record performance metrics
            endpoint = request.path
            method = request.method
            status_code = response.status_code

            cache_key = f'perf:{endpoint}:{method}:{status_code}'
            cache.set(cache_key, duration, timeout=3600)

            # Add response time header
            response['X-Response-Time'] = f'{duration:.4f}s'

            # Log slow requests
            if duration > 1.0:  # Log requests slower than 1 second
                logger.warning(f'Slow request: {method} {endpoint} took {duration:.4f}s')

        return response
```

## 🔮 Future CI/CD Enhancements

### Planned Features
- **Multi-environment deployment** (dev, staging, production)
- **Automated performance testing** with load testing tools
- **Advanced security scanning** with SAST/DAST tools
- **Infrastructure as Code** with Terraform
- **Kubernetes orchestration** for container management
- **Advanced monitoring** with Prometheus + Grafana
- **Error tracking** with Sentry integration
- **Automated rollback** based on health metrics

### Advanced Deployment Strategies
- **Progressive delivery** with feature flags
- **A/B testing** integration
- **Dark launches** for testing in production
- **Chaos engineering** for resilience testing
- **Automated scaling** based on metrics

---

**This comprehensive CI/CD integration guide provides everything needed to implement professional-grade continuous integration and deployment for the Nexus system.**
