This document has moved to docs/DEVELOPMENT_TOOLS_SUMMARY.md

#### JWT Debug Tools
```python
# backend/decode_token.py
import jwt
import time

def decode_and_validate_token(token, secret_key):
    """Debug tool for JWT token validation"""
    try:
        decoded = jwt.decode(token, secret_key, algorithms=['HS256'])
        current_time = int(time.time())
        exp_time = decoded.get('exp', 0)

        return {
            'valid': True,
            'payload': decoded,
            'expired': current_time > exp_time,
            'current_time': current_time,
            'expiration_time': exp_time
        }
    except Exception as e:
        return {'valid': False, 'error': str(e)}
```

### Security Testing Tools
- **JWT Token Validation**: Manual token testing and debugging
- **Authentication Flow Testing**: Comprehensive auth testing scripts
- **Security Headers**: CORS, CSRF, and security middleware testing

## 🐍 Python Development Tools

### Code Quality Tools

#### Black - Code Formatting
```bash
# Install Black
pip install black

# Format all Python files
black .

# Format specific files
black backend/api/middleware.py
black backend/api/views.py

# Check formatting without changes
black --check .
```

**Configuration** (pyproject.toml):
```toml
[tool.black]
line-length = 88
target-version = ['py311']
include = '\.pyi?$'
extend-exclude = '''
/(
  # directories
  \.eggs
  | \.git
  | \.hg
  | \.mypy_cache
  | \.tox
  | \.venv
  | build
  | dist
)/
'''
```

#### isort - Import Sorting
```bash
# Install isort
pip install isort

# Sort imports in all files
isort .

# Sort imports in specific files
isort backend/api/middleware.py

# Check import sorting without changes
isort --check-only .
```

**Configuration** (pyproject.toml):
```toml
[tool.isort]
profile = "black"
multi_line_output = 3
line_length = 88
known_first_party = ["api", "core"]
known_django = ["django"]
sections = ["FUTURE", "STDLIB", "DJANGO", "THIRDPARTY", "FIRSTPARTY", "LOCALFOLDER"]
```

#### MyPy - Type Checking
```bash
# Install MyPy
pip install mypy

# Run type checking
mypy .

# Run type checking on specific files
mypy backend/api/middleware.py

# Install missing type stubs
mypy --install-types
```

**Configuration** (pyrightconfig.json):
```json
{
  "include": [
    "backend"
  ],
  "exclude": [
    "**/node_modules",
    "**/__pycache__",
    "**/migrations"
  ],
  "ignore": [
    "setup.py"
  ],
  "reportMissingImports": true,
  "reportMissingTypeStubs": false,
  "pythonVersion": "3.11",
  "pythonPlatform": "Darwin"
}
```

### Testing Tools

#### pytest - Testing Framework
```bash
# Install pytest
pip install pytest pytest-django pytest-cov

# Run all tests
pytest

# Run tests with coverage
pytest --cov=api --cov-report=html

# Run specific test files
pytest backend/api/tests/test_views.py

# Run tests with verbose output
pytest -v

# Run tests and stop on first failure
pytest -x
```

#### Test Configuration
```python
# backend/pytest.ini
[tool:pytest]
DJANGO_SETTINGS_MODULE = core.settings
python_files = tests.py test_*.py *_tests.py
addopts = --strict-markers --strict-config
markers =
    slow: marks tests as slow (deselect with '-m "not slow"')
    integration: marks tests as integration tests
    unit: marks tests as unit tests
```

### Database Tools

#### Django Management Commands
```bash
# Database operations
python manage.py makemigrations
python manage.py migrate
python manage.py showmigrations

# Data population
python manage.py populate_all
python manage.py populate_activities
python manage.py populate_users

# Database utilities
python manage.py dbshell
python manage.py shell
python manage.py check
```

#### Database Setup Scripts
```python
# backend/setup_database.py
def setup_database():
    """Comprehensive database setup and population"""
    # Create superuser
    # Populate sample data
    # Set up initial configurations
    pass

# backend/create_sample_activities.py
def create_sample_activities():
    """Create sample manufacturing activities"""
    # Generate realistic activity data
    # Set up relationships
    # Configure tags and priorities
    pass
```

## ⚛️ JavaScript/TypeScript Development Tools

### Code Quality Tools

#### ESLint - Linting
```bash
# Install ESLint
npm install -g eslint

# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Lint specific files
npx eslint src/components/activities/ActivitiesLeftCardSimple.tsx
```

**Configuration** (eslint.config.js):
```javascript
export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'react': react,
      'react-hooks': reactHooks
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',

      // React rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
];
```

#### Prettier - Code Formatting
```bash
# Install Prettier
npm install -g prettier

# Format all files
npm run format

# Format specific files
npx prettier --write src/components/activities/ActivitiesLeftCardSimple.tsx

# Check formatting without changes
npm run format:check
```

**Configuration** (.prettierrc):
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### Testing Tools

#### Vitest - Unit Testing
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test files
npm run test -- src/components/activities/__tests__/ActivitiesLeftCardSimple.test.tsx
```

**Configuration** (vite.config.ts):
```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts'
      ]
    }
  }
});
```

#### Playwright - End-to-End Testing
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npx playwright test --ui

# Run specific test files
npx playwright test e2e/activities.test.ts
```

**Configuration** (playwright.config.ts):
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Build Tools

#### Vite - Build System
```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Build analysis
npm run build:analyze
```

**Configuration** (vite.config.ts):
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'tailwind-merge']
        }
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000',
      '/graphql': 'http://localhost:8000'
    }
  }
});
```

## 🔄 Pre-commit Hooks

### Installation and Configuration
```bash
# Install pre-commit
pip install pre-commit

# Install git hooks
pre-commit install

# Run hooks on all files
pre-commit run --all-files

# Run specific hooks
pre-commit run black --all-files
pre-commit run isort --all-files
pre-commit run mypy --all-files
```

### Pre-commit Configuration
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black
        language_version: python3
        args: [--line-length=88]

  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
        args: [--profile=black]

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies: [types-requests, django-stubs]
        args: [--ignore-missing-imports]

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
      - id: check-merge-conflict
      - id: debug-statements

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v9.32.0
    hooks:
      - id: eslint
        files: \.(js|jsx|ts|tsx)$
        types: [file]
        additional_dependencies:
          - eslint@9.32.0
          - '@typescript-eslint/eslint-plugin'
          - '@typescript-eslint/parser'
```

## 🧪 Testing Infrastructure

### Test Data Management
```python
# backend/api/management/commands/populate_all.py
class Command(BaseCommand):
    help = 'Populate database with comprehensive sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create users
        self.create_users()

        # Create activities
        self.create_activities()

        # Create projects
        self.create_projects()

        # Create updates
        self.create_updates()

        self.stdout.write(
            self.style.SUCCESS('Successfully populated database')
        )
```

### Test Utilities
```python
# backend/api/tests/utils.py
class TestUtils:
    @staticmethod
    def create_test_user(username='testuser', role='user'):
        """Create a test user for testing"""
        user = User.objects.create_user(
            username=username,
            email=f'{username}@example.com',
            password='testpass123',
            role=role
        )
        return user

    @staticmethod
    def create_test_activity(user, **kwargs):
        """Create a test activity for testing"""
        defaults = {
            'title': 'Test Activity',
            'description': 'Test Description',
            'type': 'Production',
            'status': 'planned',
            'priority': 'medium',
            'start_time': timezone.now(),
            'end_time': timezone.now() + timedelta(hours=2),
            'assigned_to': user,
            'created_by': user
        }
        defaults.update(kwargs)

        activity = Activity.objects.create(**defaults)
        return activity
```

## 📊 Code Quality Metrics

### Coverage Reporting
```bash
# Python coverage
coverage run --source='.' manage.py test
coverage report
coverage html

# JavaScript coverage
npm run test:coverage
```

### Performance Monitoring
```python
# backend/api/middleware.py
import time
from django.utils.deprecation import MiddlewareMixin

class PerformanceMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()

    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            response['X-Response-Time'] = str(duration)
        return response
```

### Code Complexity Analysis
```bash
# Install radon for Python complexity analysis
pip install radon

# Analyze code complexity
radon cc backend/api/ -a

# Generate complexity report
radon cc backend/api/ -j > complexity_report.json

# Install jscpd for JavaScript duplication detection
npm install -g jscpd

# Check for code duplication
jscpd src/
```

## 🚀 Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/jwt-authentication-fix
git add .
git commit -m "Fix JWT authentication middleware and add comprehensive system updates"
git push origin feature/jwt-authentication-fix

# Code review and merge
git checkout main
git merge feature/jwt-authentication-fix
git push origin main
```

### Development Commands
```bash
# Start development environment
./start_servers.sh

# Quality checks
./run_quality_checks.sh

# Database operations
cd backend && python manage.py migrate
cd backend && python manage.py populate_all

# Frontend operations
cd frontend && npm run dev
cd frontend && npm run build
cd frontend && npm run test
```

### Environment Management
```bash
# Python virtual environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Node.js dependencies
cd frontend
npm install
npm audit fix

# Environment variables
cp .env.example .env
# Edit .env with your configuration
```

## 🔧 Troubleshooting Tools

### Debug Scripts
```python
# backend/debug_jwt.py
def debug_jwt_token(token):
    """Debug JWT token issues"""
    try:
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        print(f"Token decoded successfully: {decoded}")
        return decoded
    except Exception as e:
        print(f"Token decode error: {e}")
        return None

# backend/test_auth.py
def test_authentication_flow():
    """Test complete authentication flow"""
    # Test login
    # Test token validation
    # Test protected endpoints
    pass
```

### Logging and Monitoring
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
    },
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
        'api': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

## 📚 Documentation Tools

### API Documentation
- **Django REST Framework**: Automatic API documentation
- **GraphQL Playground**: Interactive GraphQL testing
- **Swagger/OpenAPI**: REST API specification

### Code Documentation
- **Docstrings**: Comprehensive Python documentation
- **TypeScript Comments**: JSDoc style documentation
- **README Files**: Component and feature documentation

## 🔮 Future Development Tools

### Planned Integrations
- **Docker**: Containerization for development and deployment
- **Kubernetes**: Orchestration for production environments
- **CI/CD Pipelines**: Automated testing and deployment
- **Monitoring Stack**: Prometheus + Grafana for system monitoring
- **Error Tracking**: Sentry for production error monitoring

### Tool Improvements
- **Automated Testing**: Enhanced test coverage and automation
- **Performance Testing**: Load testing and performance monitoring
- **Security Scanning**: Automated security vulnerability detection
- **Code Review**: Automated code review and quality gates

---

**This comprehensive development tools summary provides everything needed to maintain high code quality, ensure proper testing, and follow best practices in the Nexus system development.**
