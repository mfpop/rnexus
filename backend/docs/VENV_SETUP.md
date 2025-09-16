# RNexus Backend Virtual Environment Setup

## Overview
This document describes the consolidated virtual environment setup for the RNexus backend project. All Python dependencies are now managed in a single virtual environment located in the `backend/venv/` directory.

## Virtual Environment Location
- **Path**: `backend/venv/`
- **Python Version**: 3.13.4
- **Activation Script**: `activate_venv.sh`

## Quick Start

### 1. Activate the Virtual Environment
```bash
cd backend
./activate_venv.sh
```

### 2. Manual Activation (Alternative)
```bash
cd backend
source venv/bin/activate
```

### 3. Deactivate
```bash
deactivate
```

## Package Management

### Install Production Dependencies
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Install Development Dependencies
```bash
source venv/bin/activate
pip install -r requirements-dev.txt
```

### Install All Dependencies (Production + Development)
```bash
source venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

## Available Packages

### Production Packages
- Django 5.2.5
- Django REST Framework 3.16.1
- Graphene-Django 3.2.3
- Channels 4.3.1 (WebSocket support)
- Daphne 4.2.1 (ASGI server)
- PyJWT 2.10.1 (JWT authentication)
- PostgreSQL support (psycopg2-binary)
- And more...

### Development Packages
- Black (code formatting)
- isort (import sorting)
- MyPy (type checking)
- Pyright (type checking)
- pytest (testing)
- pre-commit (git hooks)
- Sphinx (documentation)
- And more...

## Project Structure
```
backend/
├── venv/                    # Consolidated virtual environment
├── requirements.txt         # Production dependencies
├── requirements-dev.txt     # Development dependencies
├── activate_venv.sh        # Activation script
├── VENV_SETUP.md          # This documentation
└── ...                     # Other project files
```

## Scripts and Tools

### Start Servers
```bash
# From project root
./start_servers.sh
```

### Development Tools
```bash
cd backend
source venv/bin/activate

# Code formatting
make format

# Linting
make lint

# Testing
make test

# All checks
make all
```

## Troubleshooting

### Virtual Environment Not Found
If you get an error about the virtual environment not being found:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### Package Import Errors
If you get import errors after activating the virtual environment:
```bash
source venv/bin/activate
pip install --upgrade -r requirements.txt
pip install --upgrade -r requirements-dev.txt
```

### Permission Issues
If you get permission errors:
```bash
chmod +x activate_venv.sh
```

## Benefits of Consolidation

1. **Single Source of Truth**: All Python dependencies in one place
2. **Easier Management**: No need to maintain multiple virtual environments
3. **Consistent Dependencies**: Same package versions across all tools
4. **Simplified Setup**: One activation script for all development needs
5. **Better CI/CD**: Easier to replicate the environment in deployment

## Migration Notes

- **Removed**: `.venv/` directories from root and backend
- **Consolidated**: All packages now in `backend/venv/`
- **Updated**: Scripts and configuration files reference the consolidated venv
- **Maintained**: All existing functionality and package versions
