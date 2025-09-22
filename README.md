# RNexus - React + Django Full-Stack Application

A comprehensive full-stack application built with React (Frontend) and Django (Backend) for managing organizational data, user profiles, and real-time communication.

## 🏗️ Project Structure

```
rnexus/
├── backend/                 # Django backend application
│   ├── api/                # Main API application
│   ├── core/               # Django core settings
│   ├── scripts/            # Backend utility scripts
│   ├── tests/              # Backend test files
│   └── venv/               # Python virtual environment
├── frontend/               # React frontend application
│   ├── src/                # Source code
│   ├── public/             # Static assets
│   └── dist/               # Build output
├── docs/                   # Project documentation
│   ├── architecture/       # System architecture docs
│   ├── pages/              # Page-specific documentation
│   ├── resolved_issues/    # Resolved issue documentation
│   └── testing/            # Testing documentation
├── testing/                # Test files and utilities
│   ├── legacy_tests/       # Historical test files
│   └── html/               # HTML test files
├── logs/                   # Application logs
│   └── archived/           # Archived log files
├── scripts/                # Project utility scripts
├── config/                 # Configuration files
└── public/                 # Public static files
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL (optional, SQLite by default)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Start Both Servers
```bash
./scripts/start_servers.sh
```

## 📚 Documentation

- [Project Architecture](docs/architecture/PROJECT_ARCHITECTURE.md)
- [Database Structure](docs/architecture/DATABASE_STRUCTURE.md)
- [Setup Guide](docs/setup/SETUP_GUIDE.md)
- [API Documentation](docs/API.md)

## 🧪 Testing

- Backend tests: `cd backend && python manage.py test`
- Frontend tests: `cd frontend && npm test`
- E2E tests: `cd frontend && npm run test:e2e`

## 🔧 Development

- Code formatting: `cd backend && black . && isort .`
- Type checking: `cd backend && mypy .`
- Frontend linting: `cd frontend && npm run lint`

## 📝 Recent Changes

- User profile field updates and phone field renaming
- Comprehensive database migrations
- Frontend component optimizations
- Documentation consolidation

## 🤝 Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for development guidelines.

## 📄 License

This project is proprietary software.
