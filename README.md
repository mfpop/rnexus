# RNexus Platform

A comprehensive business platform for news management, production monitoring, project management, and team collaboration.

## 🚀 Quick Start

```bash
# Start all servers
./start_servers.sh

# Or start individually
cd backend && source venv/bin/activate && python manage.py runserver
cd frontend && npm run dev
```

## 📁 Project Structure

```
rnexus/
├── 📚 docs/                          # Project documentation
│   ├── 🏗️ architecture/              # System design & architecture
│   ├── 🚀 setup/                     # Setup & deployment guides
│   ├── 💻 implementation/            # Feature implementation details
│   ├── 🧪 testing/                   # Testing & debugging guides
│   └── 🔧 development/               # Development tools & processes
├── 🐍 backend/                       # Django backend
│   ├── api/                          # API endpoints & views
│   ├── core/                         # Django settings & configuration
│   ├── scripts/                      # Utility & setup scripts
│   ├── tests/                        # Test suites
│   ├── docs/                         # Backend-specific documentation
│   └── venv/                         # Python virtual environment
├── ⚛️ frontend/                      # React frontend
│   ├── src/                          # Source code
│   ├── components/                   # Reusable components
│   └── pages/                        # Page components
├── 🧪 testing/                       # Test files & results
│   ├── html/                         # HTML test files
│   └── test-results/                 # Test execution results
├── 🛠️ tools/                         # Development tools
├── 📖 README.md                      # This file
└── 🚀 start_servers.sh               # Server startup script
```

## 🎯 Core Features

- **📰 News & Communication** - Centralized information management
- **🏭 Production Monitoring** - Real-time manufacturing oversight
- **📊 Business Intelligence** - Analytics and reporting
- **📋 Project Management** - Task and portfolio tracking
- **💬 Team Collaboration** - Real-time communication
- **👥 User Management** - Authentication and profiles

## 🛠️ Technology Stack

### Backend
- **Django 5.2.5** - Web framework
- **Django REST Framework** - API development
- **Graphene-Django** - GraphQL support
- **Channels** - WebSocket support
- **PostgreSQL** - Database

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## 📚 Documentation

- **Getting Started**: [docs/setup/SETUP_GUIDE.md](docs/setup/SETUP_GUIDE.md)
- **Architecture**: [docs/architecture/PROJECT_ARCHITECTURE.md](docs/architecture/PROJECT_ARCHITECTURE.md)
- **Development**: [docs/development/DEVELOPMENT_TOOLS_SUMMARY.md](docs/development/DEVELOPMENT_TOOLS_SUMMARY.md)
- **API Reference**: [docs/implementation/](docs/implementation/)

## 🔧 Development

### Backend Setup
```bash
cd backend
./activate_venv.sh
pip install -r requirements.txt
pip install -r requirements-dev.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Testing
```bash
# Backend tests
cd backend && source venv/bin/activate
python manage.py test

# Frontend tests
cd frontend
npm run test
```

## 🚀 Deployment

- **Development**: Use `start_servers.sh`
- **Production**: See [docs/setup/DEPLOYMENT_PRODUCTION.md](docs/setup/DEPLOYMENT_PRODUCTION.md)
- **Environment**: See [docs/setup/ENVIRONMENT.md](docs/setup/ENVIRONMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is proprietary software.

## 🔗 Links

- **Documentation**: [docs/](docs/)
- **Backend Setup**: [backend/VENV_SETUP.md](backend/VENV_SETUP.md)
- **Start Servers**: [start_servers.sh](start_servers.sh)
