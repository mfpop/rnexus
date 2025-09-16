# Nexus - Manufacturing Operations Management System

Note: This file replaces the former root README and now lives under docs/.

## 🚀 Project Overview

Nexus is a comprehensive manufacturing operations management system built with modern web technologies. It provides a unified platform for managing activities, projects, production processes, and team collaboration in manufacturing environments.

## ✨ Recent Updates (August 2025)

### 🔐 JWT Authentication Fix
- **Resolved "logged out on refresh" issue** with improved JWT middleware
- Added `process_view` method to ensure proper user authentication
- Enhanced middleware to handle Django's AuthenticationMiddleware conflicts
- Improved token validation and user session management

### 🏗️ System Architecture Improvements
- **Comprehensive activities system** with frontend components
- **Enhanced database models** for manufacturing operations
- **WebSocket integration** for real-time communication
- **Improved error handling** and user experience

### 📊 New Features
- **Activities Management**: Full CRUD operations for manufacturing activities
- **Real-time Updates**: WebSocket-based notifications and updates
- **Advanced Filtering**: Search, sort, and filter capabilities
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠️ Technology Stack

### Backend
- **Django 5.2.x** - Web framework
- **PostgreSQL** - Database
- **Channels** - WebSocket support
- **JWT** - Authentication
- **GraphQL** - API layer

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Apollo Client** - GraphQL client

### Development Tools
- **Black** - Python code formatting
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **MyPy** - Python type checking
- **Pre-commit hooks** - Code quality

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 13+
- Redis (for WebSocket support)

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

### Database Setup
```bash
cd backend
python setup_database.py
python manage.py populate_all
```

## 📁 Project Structure

```
rnexus/
├── backend/                 # Django backend
│   ├── api/                # Main application
│   ├── core/               # Django settings
│   ├── management/         # Custom commands
│   └── migrations/         # Database migrations
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/           # API clients
│   │   └── pages/         # Page components
│   └── public/            # Static assets
├── docs/                  # Documentation
└── tools/                 # Development tools
```

## 🔧 Key Features

### Authentication & Security
- **JWT-based authentication** with secure token handling
- **Role-based access control** for different user types
- **Secure WebSocket connections** with authentication
- **CSRF protection** and security middleware

### Activities Management
- **Create, read, update, delete** manufacturing activities
- **Status tracking** (planned, in-progress, completed, cancelled)
- **Priority management** (low, medium, high, urgent)
- **Type categorization** (Production, Maintenance, Quality, etc.)
- **Assignment tracking** and team collaboration

### Real-time Communication
- **WebSocket-based updates** for live data
- **Notification system** for important events
- **Chat functionality** for team communication
- **Real-time activity status** updates

### Data Management
- **Comprehensive database models** for manufacturing operations
- **Data population scripts** for testing and development
- **Migration management** for schema evolution
- **Backup and restore** capabilities

## 📚 Documentation

- **[PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md)** - Detailed system architecture
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[DATABASE_STRUCTURE.md](./DATABASE_STRUCTURE.md)** - Database schema documentation
- **[DEVELOPMENT_TOOLS_SUMMARY.md](./DEVELOPMENT_TOOLS_SUMMARY.md)** - Development tools guide
- **[CI_CD_INTEGRATION.md](./CI_CD_INTEGRATION.md)** - CI/CD pipeline documentation

## 🧪 Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm run test
npm run test:e2e
```

## 🚀 Deployment

### Production Setup
- **Environment variables** configuration
- **Static file serving** with proper caching
- **Database optimization** for production workloads
- **Security hardening** and best practices

### Docker Support
- **Multi-stage builds** for optimized images
- **Environment-specific** configurations
- **Health checks** and monitoring
- **Resource optimization** for containers

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- **Follow coding standards** (Black, ESLint, Prettier)
- **Write tests** for new features
- **Update documentation** for changes
- **Use conventional commits** for commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

### Common Issues
- **JWT Authentication**: Check token expiration and middleware configuration
- **Database Connection**: Verify PostgreSQL service and connection settings
- **WebSocket Issues**: Ensure Redis is running and Channels is configured
- **Build Errors**: Clear node_modules and reinstall dependencies

### Getting Help
- **Check the documentation** in the `docs/` folder
- **Review recent commits** for recent changes
- **Check server logs** for detailed error information
- **Open an issue** with detailed problem description

## 🔄 Changelog

### v2.0.0 (August 2025)
- ✅ **Fixed JWT authentication** middleware issues
- ✅ **Added comprehensive activities system**
- ✅ **Implemented real-time WebSocket updates**
- ✅ **Enhanced database models** and relationships
- ✅ **Improved frontend components** and user experience
- ✅ **Added development tools** and quality checks

### v1.0.0 (Initial Release)
- ✅ **Basic authentication system**
- ✅ **Core database models**
- ✅ **Basic frontend interface**
- ✅ **Project structure setup**

---

**Built with ❤️ for modern manufacturing operations**
