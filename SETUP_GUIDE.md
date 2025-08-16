# RNexus Platform Setup Guide

## Quick Start

### Prerequisites
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Python**: 3.13.0 or higher (for backend)
- **Git**: Latest version

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd rnexus

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Start Development Servers

```bash
# Terminal 1: Start frontend (from project root)
cd frontend
npm run dev

# Terminal 2: Start backend (from project root)
cd backend
source venv/bin/activate
python manage.py runserver

# Or use the provided script (from project root)
./start_servers.sh
```

### 3. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## Platform Modules

### 📢 News, Alerts, and Communication
This module is a centralized tool for disseminating important information, managing alerts, and broadcasting official communications to the entire organization or specific departments.

**Core Functions:**
- **News Publishing**: Empowers every department to publish official news and updates to a designated news feed
- **Alerts Management**: Designed to create and manage time-sensitive alerts, ensuring critical information reaches the right people immediately
- **Official Communications**: Serves as a platform for sending formal communications and memos to targeted groups or the entire company

**Technical Implementation:**
- Uses `NewsContext` for state management
- Master-detail pattern with article list and detailed view
- Real-time updates and notification system
- Department-based publishing permissions

### 🏭 Production Management
Real-time monitoring and management of manufacturing lines with efficiency tracking and alerts.

### 📊 Business Intelligence
Comprehensive analytics dashboard with KPI visualization, trend analysis, and reporting.

### 👥 Team Collaboration
Project monitoring, task management, and collaboration tools with real-time communication.

## Detailed Setup

### Frontend Setup

#### Dependencies Overview
```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.8.0",
    "lucide-react": "^0.539.0",
    "tailwindcss": "^4.1.11",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "vite": "^7.0.6",
    "typescript": "^5.9.2",
    "eslint": "^9.32.0",
    "prettier": "^3.6.2",
    "vitest": "^3.2.4",
    "playwright": "^1.54.2"
  }
}
```

#### Build Commands
```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Run e2e tests
npm run test:e2e
```

### Backend Setup

#### Dependencies Overview
```txt
Django==5.2.5
djangorestframework==3.16.1
django-cors-headers==4.7.0
graphene-django==3.2.3
psycopg2-binary==2.9.10
pillow==11.3.0
```

#### Django Commands
```bash
# Create and apply migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Run development server
python manage.py runserver

# Run tests
python manage.py test
```

## Development Environment

### VS Code Setup
Recommended extensions:
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-python.python",
    "ms-python.pylint"
  ]
}
```

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Nexus LMD
VITE_APP_VERSION=1.0.0
```

#### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## Project Structure Deep Dive

### Frontend Architecture
```
frontend/
├── public/                 # Static assets
│   ├── Nexus.svg          # Application logo
│   └── vite.svg           # Vite logo
├── src/
│   ├── components/        # React components
│   │   ├── templates/     # Layout templates
│   │   ├── ui/           # Base UI components
│   │   ├── [feature]/    # Feature modules
│   │   └── StableLayout.tsx
│   ├── pages/            # Page components
│   ├── lib/              # Utilities
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── tailwind.config.ts    # Tailwind configuration
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

### Backend Architecture
```
backend/
├── api/                  # Main API app
│   ├── models.py        # Data models
│   ├── views.py         # API views
│   ├── schema.py        # GraphQL schema
│   └── migrations/      # Database migrations
├── core/                # Django project settings
│   ├── settings.py      # Configuration
│   ├── urls.py          # URL routing
│   └── wsgi.py          # WSGI application
├── manage.py            # Django management
├── requirements.txt     # Python dependencies
└── venv/                # Virtual environment
```

## Component Development

### Creating a New Feature

1. **Create the feature directory:**
```bash
mkdir frontend/src/components/[feature]
```

2. **Create context file:**
```typescript
// [Feature]Context.tsx
import React, { createContext, useContext, useState } from 'react'

export interface FeatureItem {
  id: string
  name: string
  // ... other properties
}

interface FeatureContextType {
  selectedItem: FeatureItem | null
  setSelectedItem: (item: FeatureItem | null) => void
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined)

export const FeatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState<FeatureItem | null>(null)

  return (
    <FeatureContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </FeatureContext.Provider>
  )
}

export const useFeatureContext = () => {
  const context = useContext(FeatureContext)
  if (!context) {
    throw new Error('useFeatureContext must be used within FeatureProvider')
  }
  return context
}
```

3. **Create left card component:**
```typescript
// [Feature]LeftCard.tsx
import React from 'react'
import { useFeatureContext } from './FeatureContext'

const FeatureLeftCard: React.FC = () => {
  const { selectedItem, setSelectedItem } = useFeatureContext()

  // Sample data and component logic
  return (
    <div className="space-y-4 p-4">
      {/* List items with click handlers */}
    </div>
  )
}

export default FeatureLeftCard
```

4. **Create right card component:**
```typescript
// [Feature]RightCard.tsx
import React from 'react'
import { useFeatureContext } from './FeatureContext'

const FeatureRightCard: React.FC = () => {
  const { selectedItem } = useFeatureContext()

  if (!selectedItem) {
    return <div>Select an item to view details</div>
  }

  return (
    <div className="space-y-6 p-4">
      {/* Detail view content */}
    </div>
  )
}

export default FeatureRightCard
```

5. **Create index file:**
```typescript
// index.ts
export { default as FeatureLeftCard } from './FeatureLeftCard'
export { default as FeatureRightCard } from './FeatureRightCard'
export { FeatureProvider, useFeatureContext } from './FeatureContext'
export type { FeatureItem } from './FeatureContext'
```

6. **Create page component:**
```typescript
// pages/FeaturePage.tsx
import React from 'react'
import { FeatureRightCard } from '../components/feature'

const FeaturePage: React.FC = () => {
  return <FeatureRightCard />
}

export default FeaturePage
```

7. **Add to StableLayout:**
```typescript
// In StableLayout.tsx
import { FeatureLeftCard, FeatureProvider } from './components/feature'

// Add to getPageConfig
case '/feature':
  return {
    leftTitle: 'Feature Navigation',
    rightTitle: 'Feature Details',
    // ... other config
  }

// Add to conditional rendering
{location.pathname === '/feature' ? (
  <FeatureProvider>
    <MainContainerTemplate
      leftContent={<FeatureLeftCard />}
      rightContent={<Outlet />}
      // ... other props
    />
  </FeatureProvider>
) : (
  // ... other conditions
)}
```

8. **Add route to App.tsx:**
```typescript
<Route path="/feature" element={<StableLayout />}>
  <Route index element={<FeaturePage />} />
</Route>
```

## Testing

### Unit Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### E2E Testing
```bash
# Install Playwright browsers
npx playwright install

# Run e2e tests
npm run test:e2e

# Run e2e tests in UI mode
npx playwright test --ui
```

### Test Structure
```
frontend/
├── src/
│   └── __tests__/        # Unit tests
└── e2e/                  # E2E tests
    └── demo.test.ts
```

## Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build
# Output: frontend/dist/

# Backend
cd backend
python manage.py collectstatic
python manage.py migrate
```

### Environment Setup
- Configure production environment variables
- Set up database (PostgreSQL recommended)
- Configure web server (Nginx + Gunicorn)
- Set up SSL certificates

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Change frontend port
npm run dev -- --port 3000

# Change backend port
python manage.py runserver 8080
```

#### Node Version Issues
```bash
# Check Node version
node --version

# Use Node Version Manager
nvm install 18
nvm use 18
```

#### Python Virtual Environment Issues
```bash
# Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Database Issues
```bash
# Reset database
rm backend/db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Performance Issues
- Clear browser cache
- Restart development servers
- Check for memory leaks in React DevTools
- Optimize bundle size with `npm run build -- --analyze`

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use conventional commit messages
- Write tests for new features

### Pull Request Process
1. Create feature branch from main
2. Make changes with tests
3. Run linting and tests
4. Submit pull request with description
5. Address review feedback

---

This setup guide provides everything needed to get the RNexus platform running and to contribute effectively to the project.
