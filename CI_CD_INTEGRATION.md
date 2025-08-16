# CI/CD Integration Guide for RNexus

## Overview
This guide explains how to integrate the code quality tools into your CI/CD pipeline and how to use them locally for development.

## 🛠️ Available Tools

### Code Formatting
- **Black** - Automatic code formatting
- **isort** - Import statement organization

### Code Quality
- **MyPy** - Static type checking
- **Pre-commit hooks** - Automated quality checks

### Testing
- **Django tests** - Built-in Django testing
- **Pytest** - Advanced testing framework with coverage

### Security
- **Bandit** - Security vulnerability scanning
- **Safety** - Dependency vulnerability checking

## 🚀 Local Development

### Quick Start
```bash
cd backend
source venv/bin/activate

# Install development dependencies
make install

# Run all quality checks
make all

# Format code only
make format

# Run linting only
make lint

# Run tests with coverage
make coverage
```

### Available Make Commands
```bash
make help          # Show all available commands
make install       # Install development dependencies
make format        # Format code with Black and isort
make lint          # Run all linting tools
make test          # Run Django tests
make coverage      # Run tests with coverage
make security      # Run security scans
make clean         # Clean up generated files
make all           # Run all checks
make pre-commit    # Run pre-commit hooks
make dev           # Quick development workflow
```

### Individual Tool Usage
```bash
# Black - Code formatting
black .                    # Format all files
black . --check           # Check formatting without changing
black . --diff            # Show what would change

# isort - Import sorting
isort .                   # Sort imports in all files
isort . --check-only      # Check without changing
isort . --diff            # Show what would change

# MyPy - Type checking
mypy .                    # Run type checking
mypy . --ignore-missing-imports  # Ignore missing imports
mypy . --no-strict-optional      # Less strict type checking

# Pre-commit hooks
pre-commit run --all-files       # Run on all files
pre-commit install               # Install git hooks
pre-commit autoupdate            # Update hook versions
```

## 🔄 CI/CD Pipeline Integration

### GitHub Actions Workflow
The project includes a comprehensive GitHub Actions workflow (`.github/workflows/ci.yml`) that:

1. **Runs on every push and pull request**
2. **Tests multiple Python and Node.js versions**
3. **Integrates all code quality tools**
4. **Provides security scanning**
5. **Builds Docker images**
6. **Deploys to production**

### Workflow Jobs

#### Backend Tests
- Python 3.13
- Django 5.2.5
- Code formatting (Black)
- Import sorting (isort)
- Type checking (MyPy)
- Django tests
- Pytest with coverage
- Coverage reporting to Codecov

#### Frontend Tests
- Node.js 18 and 20
- ESLint
- TypeScript type checking
- Unit tests (Vitest)
- E2E tests (Playwright)

#### Security Scanning
- Bandit security scan
- Safety dependency check
- Artifact upload for review

#### Docker Build
- Builds Docker images
- Only runs on main branch
- Requires all tests to pass

#### Deployment
- Production deployment
- Only runs on main branch
- Requires Docker build to succeed

## 📊 Quality Gates

### Pre-commit Hooks
The following checks run automatically on every commit:
- ✅ Trailing whitespace removal
- ✅ End of file fixes
- ✅ YAML validation
- ✅ Large file detection
- ✅ Merge conflict detection
- ✅ Debug statement detection
- ✅ Code formatting (Black)
- ✅ Import sorting (isort)
- ✅ Type checking (MyPy)

### CI/CD Quality Gates
The following must pass for deployment:
- ✅ All code formatting checks
- ✅ All linting checks
- ✅ All type checking
- ✅ All tests passing
- ✅ Security scans clean
- ✅ Coverage thresholds met

## 🔧 Configuration Files

### Backend Configuration
- **`pyproject.toml`** - Tool configuration (Black, isort, MyPy, pytest)
- **`.pre-commit-config.yaml`** - Pre-commit hooks configuration
- **`requirements-dev.txt`** - Development dependencies
- **`Makefile`** - Development tool commands

### Frontend Configuration
- **`package.json`** - Dependencies and scripts
- **`eslint.config.js`** - ESLint configuration
- **`tsconfig.json`** - TypeScript configuration
- **`playwright.config.ts`** - E2E testing configuration

## 📈 Coverage and Reporting

### Coverage Reports
- **Terminal output** - Shows coverage summary
- **HTML report** - Detailed coverage in `htmlcov/` directory
- **XML report** - For CI/CD integration
- **Codecov integration** - Historical coverage tracking

### Security Reports
- **Bandit** - Security vulnerability scan
- **Safety** - Dependency vulnerability check
- **Artifact storage** - Reports saved for review

## 🚀 Deployment Pipeline

### Branch Strategy
- **`main`** - Production branch
- **`develop`** - Development branch
- **Feature branches** - For new features

### Deployment Flow
1. **Code pushed to main**
2. **CI/CD pipeline triggers**
3. **All quality checks run**
4. **Tests execute**
5. **Security scans complete**
6. **Docker images built**
7. **Deployment to production**

### Rollback Strategy
- **Automatic rollback** on failed deployment
- **Manual rollback** via GitHub Actions
- **Health checks** before marking deployment successful

## 🔍 Monitoring and Alerting

### Quality Metrics
- **Code coverage** - Tracked over time
- **Type coverage** - MyPy compliance
- **Security issues** - Vulnerability tracking
- **Performance** - Build and test times

### Alerting
- **Failed builds** - Immediate notification
- **Security issues** - High priority alerts
- **Coverage drops** - Quality degradation alerts
- **Performance regressions** - Build time increases

## 🛠️ Troubleshooting

### Common Issues

#### Pre-commit Hooks Fail
```bash
# Reinstall hooks
pre-commit uninstall
pre-commit install

# Update hooks
pre-commit autoupdate
```

#### MyPy Type Errors
```bash
# Use more lenient configuration
mypy . --ignore-missing-imports --no-strict-optional

# Check specific file
mypy api/views.py
```

#### Coverage Issues
```bash
# Clean coverage data
make clean

# Run coverage again
make coverage
```

#### Security Scan Failures
```bash
# Update security tools
pip install --upgrade bandit safety

# Run individual scans
bandit -r . -f txt
safety check
```

## 📚 Best Practices

### Development Workflow
1. **Always run pre-commit hooks** before committing
2. **Use Make commands** for consistency
3. **Check coverage** regularly
4. **Address security issues** immediately
5. **Keep dependencies updated**

### Code Quality
1. **Follow Black formatting** strictly
2. **Organize imports** with isort
3. **Add type hints** gradually
4. **Write tests** for new features
5. **Maintain high coverage**

### CI/CD
1. **Never skip quality gates**
2. **Monitor pipeline performance**
3. **Review security reports**
4. **Test deployment process**
5. **Document changes**

## 🔗 Integration Examples

### Other CI/CD Platforms

#### GitLab CI
```yaml
# .gitlab-ci.yml
stages:
  - quality
  - test
  - build
  - deploy

quality:
  stage: quality
  script:
    - cd backend
    - pip install -r requirements-dev.txt
    - black . --check
    - isort . --check-only
    - mypy . --ignore-missing-imports
```

#### Jenkins Pipeline
```groovy
// Jenkinsfile
pipeline {
    agent any
    stages {
        stage('Quality') {
            steps {
                sh 'cd backend && make lint'
            }
        }
        stage('Test') {
            steps {
                sh 'cd backend && make test'
            }
        }
    }
}
```

#### Azure DevOps
```yaml
# azure-pipelines.yml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: UsePythonVersion@0
  inputs:
    versionSpec: '3.13'
- script: |
    cd backend
    pip install -r requirements-dev.txt
    make all
```

## 📞 Support

### Getting Help
- **Documentation** - Check this guide first
- **Issues** - Create GitHub issues for bugs
- **Discussions** - Use GitHub Discussions for questions
- **Team** - Reach out to the development team

### Contributing
- **Follow the quality standards**
- **Add tests for new features**
- **Update documentation**
- **Use the established workflow**

---

*This guide is maintained by the RNexus development team. Last updated: $(date)*
