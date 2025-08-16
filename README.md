# RNexus Platform

A comprehensive production management platform built with React 19 and Django, featuring real-time monitoring, analytics, and team collaboration tools.

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd rnexus

# Install and start (requires Node.js 18+ and Python 3.13+)
cd frontend && npm install
cd ../backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt

# Start development servers
./start_servers.sh
```

**Access**: Frontend at http://localhost:5173 | Backend at http://localhost:8000

## 📋 Features

### 🏭 Production Management
- **Real-time Monitoring**: Live production line metrics and alerts
- **Quality Control**: Compliance tracking and quality assurance
- **Equipment Management**: Asset monitoring and maintenance scheduling
- **Performance Analytics**: Efficiency metrics and trend analysis

### 📊 Business Intelligence  
- **Interactive Dashboards**: Customizable KPI visualizations
- **Advanced Analytics**: Trend analysis and predictive insights
- **Reporting System**: Automated reports and data exports
- **Metrics Tracking**: Comprehensive business performance monitoring

### 📢 News, Alerts, and Communication
- **Centralized Information Hub**: Disseminate important information across the organization
- **News Publishing**: Empowers every department to publish official news and updates to a designated news feed
- **Alerts Management**: Designed to create and manage time-sensitive alerts, ensuring critical information reaches the right people immediately
- **Official Communications**: Serves as a platform for sending formal communications and memos to targeted groups or the entire company

### 👥 Team Collaboration
- **Project Management**: Task tracking and project portfolio management
- **Activity Scheduling**: Resource planning and task assignments  
- **Real-time Chat**: Team communication with file sharing
- **News & Updates**: Company announcements and industry updates

### ⚙️ System Administration
- **User Management**: Role-based access control (Admin/Staff/User)
- **System Monitoring**: Performance metrics and health checks
- **Settings Management**: Customizable preferences and configurations
- **Help & Support**: Integrated knowledge base and tutorials

## 🏗️ Architecture

### Frontend (React 19 + TypeScript)
- **Stable Layout Pattern**: Consistent UI framework across all pages
- **Master-Detail Architecture**: Two-card layout for efficient data browsing
- **Context-Based State**: React Context API for component communication
- **Template System**: Reusable layout templates and components

### Backend (Django 5.2 + DRF)
- **RESTful API**: Comprehensive API with Django REST Framework
- **GraphQL Integration**: Flexible data querying with Graphene
- **Real-time Features**: WebSocket support for live updates
- **Database**: PostgreSQL with Django ORM

### Tech Stack
```json
{
  "frontend": {
    "framework": "React 19.1.1",
    "routing": "React Router 7.8.0", 
    "styling": "Tailwind CSS 4.1.11",
    "icons": "Lucide React 0.539.0",
    "build": "Vite 7.0.6",
    "testing": "Vitest + Playwright"
  },
  "backend": {
    "framework": "Django 5.2.5",
    "api": "Django REST Framework 3.16.1",
    "graphql": "Graphene Django 3.2.3",
    "database": "PostgreSQL + SQLite (dev)",
    "cors": "django-cors-headers"
  }
}
```

## 📁 Project Structure

```
rnexus/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Feature components
│   │   │   ├── templates/   # Layout templates  
│   │   │   ├── ui/         # Base UI components
│   │   │   ├── [feature]/  # Feature modules (news, production, etc.)
│   │   │   └── StableLayout.tsx
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utilities
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Django application  
│   ├── api/                # Main API app
│   ├── core/               # Django settings
│   ├── requirements.txt
│   └── manage.py
├── docs/                   # Documentation
│   ├── pages/             # Page-specific docs
│   └── README.md
├── PROJECT_ARCHITECTURE.md # Detailed architecture
├── SETUP_GUIDE.md         # Complete setup guide
└── start_servers.sh       # Development startup script
```

## 🔧 Development

### Prerequisites
- Node.js 18.0+ with npm 9.0+
- Python 3.13+ with pip
- Git latest version

### Development Commands

#### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Production build  
npm run test         # Run tests
npm run lint         # Code linting
npm run format       # Code formatting
```

#### Backend  
```bash
cd backend
source venv/bin/activate
python manage.py runserver     # Start Django server
python manage.py test          # Run tests
python manage.py migrate       # Apply migrations
python manage.py createsuperuser  # Create admin user
```

### Creating New Features

The platform uses a standardized feature module pattern:

1. **Context** (`FeatureContext.tsx`) - State management
2. **Left Card** (`FeatureLeftCard.tsx`) - Master list component  
3. **Right Card** (`FeatureRightCard.tsx`) - Detail view component
4. **Page** (`FeaturePage.tsx`) - Route component
5. **Integration** - Add to StableLayout and App routing

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

## 📖 Documentation

### Complete Guides
- **[Setup Guide](./SETUP_GUIDE.md)** - Development environment setup
- **[Architecture Guide](./PROJECT_ARCHITECTURE.md)** - Technical architecture details
- **[Page Documentation](./docs/)** - Individual page specifications

### API Documentation
- **REST API**: http://localhost:8000/api/
- **GraphQL**: http://localhost:8000/graphql/
- **Admin Panel**: http://localhost:8000/admin/

## 🛡️ Security & Quality

### Security Features
- Multi-factor authentication
- Role-based access control (Admin/Staff/User)  
- CSRF protection and input validation
- Secure session management

### Code Quality
- TypeScript for type safety
- ESLint + Prettier for code consistency
- Comprehensive test coverage (Vitest + Playwright)
- Automated linting and formatting

### Performance
- Route-based code splitting
- Optimized bundle sizes
- React 19 performance improvements
- Efficient context-based state management

## 🚦 Current Status

### ✅ Completed Features
- ✅ **Core Architecture**: Stable layout system with master-detail pattern
- ✅ **Navigation**: Complete sidebar navigation with 20 buttons (B1-B20)
- ✅ **Main Pages**: News, Production, Metrics, Projects, Activities, About
- ✅ **Functional Pages**: Chat, Contact, Help, Settings, System  
- ✅ **Authentication**: Login, Registration, Password Reset
- ✅ **Legal Pages**: Privacy Policy, Terms of Service
- ✅ **Responsive Design**: Mobile-first responsive layouts
- ✅ **Latest Dependencies**: All packages updated to latest stable versions

### 🔄 In Development
- Real-time WebSocket integration
- Advanced analytics dashboards
- File upload and management system
- Enhanced mobile experience

### 📋 Planned Features
- Multi-tenant architecture
- Advanced reporting system
- Third-party integrations
- Mobile native app

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript and ESLint configurations
- Write tests for new features
- Use conventional commit messages
- Maintain documentation updates

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

- **Documentation**: Check [docs/](./docs/) for detailed guides
- **Issues**: GitHub Issues for bug reports and feature requests  
- **Discussions**: GitHub Discussions for questions and ideas

---

**RNexus Platform** - Built with ❤️ for modern production management