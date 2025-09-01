# Virtual Environment Setup Guide

This guide explains how to properly set up and use the virtual environment for the RNexus project, including pre-commit hooks.

## 🚀 Quick Start

### 1. Activate Virtual Environment
```bash
# From the project root directory
source backend/venv/bin/activate

# Or use the convenience script
./activate_venv.sh
```

### 2. Install Dependencies
```bash
# Ensure you're in the backend directory with venv activated
cd backend
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### 3. Install Pre-commit Hooks
```bash
# From the project root directory
pre-commit install
```

## 🔧 Pre-commit Configuration

The pre-commit hooks are configured in `.pre-commit-config.yaml` at the project root and are set up to:

- **Use the backend virtual environment** for all Python tools
- **Reference backend/pyproject.toml** for tool configurations
- **Run all quality checks** before each commit

### Available Hooks

1. **Code Formatting**
   - `black` - Python code formatter
   - `isort` - Import sorting

2. **Code Quality**
   - `mypy` - Type checking
   - `debug-statements` - Check for debug code

3. **File Quality**
   - `trailing-whitespace` - Remove trailing spaces
   - `end-of-file-fixer` - Ensure files end with newline
   - `check-yaml` - Validate YAML files
   - `check-added-large-files` - Prevent large file commits

## 📁 Project Structure

```
rnexus/
├── .pre-commit-config.yaml     # Pre-commit configuration
├── activate_venv.sh            # Virtual environment activation script
├── backend/
│   ├── venv/                   # Virtual environment
│   ├── pyproject.toml         # Tool configurations
│   ├── requirements.txt        # Production dependencies
│   └── requirements-dev.txt    # Development dependencies
└── ...
```

## 🐍 Virtual Environment Management

### Activation
```bash
# Method 1: Direct activation
source backend/venv/bin/activate

# Method 2: Use convenience script
./activate_venv.sh

# Method 3: From backend directory
cd backend
source venv/bin/activate
```

### Deactivation
```bash
deactivate
```

### Environment Variables
The virtual environment automatically sets:
- `DJANGO_SETTINGS_MODULE=core.settings`
- `PYTHONPATH` includes the backend directory

## 🔍 Pre-commit Usage

### Manual Run
```bash
# Run all hooks on all files
pre-commit run --all-files

# Run specific hook
pre-commit run black
pre-commit run mypy
```

### During Development
- Hooks run automatically on `git commit`
- Failed hooks prevent commit until fixed
- Hooks can be skipped with `git commit --no-verify` (not recommended)

### Troubleshooting
```bash
# Update pre-commit hooks
pre-commit autoupdate

# Clean pre-commit cache
pre-commit clean

# Skip specific hooks temporarily
SKIP=mypy git commit -m "Skip type checking"
```

## 🛠️ Development Workflow

### 1. Start Development Session
```bash
./activate_venv.sh
cd backend
```

### 2. Make Changes
- Edit code files
- Run tests: `python manage.py test`
- Check formatting: `black .`
- Check types: `mypy api/`

### 3. Commit Changes
```bash
git add .
git commit -m "Your commit message"
# Pre-commit hooks run automatically
```

### 4. End Session
```bash
deactivate
```

## 📋 Common Commands

### Django Management
```bash
python backend/manage.py runserver
python backend/manage.py migrate
python backend/manage.py shell
python backend/manage.py collectstatic
```

### Code Quality
```bash
# Format code
black backend/
isort backend/

# Type checking
mypy backend/api/ --ignore-missing-imports

# Run tests
python backend/manage.py test
```

### Pre-commit
```bash
# Install hooks
pre-commit install

# Run manually
pre-commit run --all-files

# Update hooks
pre-commit autoupdate
```

## 🚨 Troubleshooting

### Virtual Environment Issues
```bash
# Recreate virtual environment
rm -rf backend/venv
python3 -m venv backend/venv
source backend/venv/bin/activate
pip install -r backend/requirements.txt
pip install -r backend/requirements-dev.txt
```

### Pre-commit Issues
```bash
# Reinstall hooks
pre-commit uninstall
pre-commit install

# Clear cache
pre-commit clean
```

### Import Issues
```bash
# Ensure PYTHONPATH is set
export PYTHONPATH="${PYTHONPATH}:$(pwd)/backend"

# Check Django settings
python -c "import django; print(django.get_version())"
```

## 📚 Additional Resources

- [Pre-commit Documentation](https://pre-commit.com/)
- [Black Code Formatter](https://black.readthedocs.io/)
- [isort Import Sorting](https://pycqa.github.io/isort/)
- [mypy Type Checking](https://mypy.readthedocs.io/)
- [Django Documentation](https://docs.djangoproject.com/)

---

**Note**: Always ensure the virtual environment is activated before running Python commands or pre-commit hooks. The `activate_venv.sh` script provides a convenient way to do this.
