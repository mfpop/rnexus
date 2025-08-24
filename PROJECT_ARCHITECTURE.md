# Nexus Project Architecture

## 🏗️ System Overview

Nexus is a modern manufacturing operations management system built with a microservices-inspired architecture, featuring a Django backend with REST/GraphQL APIs and a React frontend with real-time WebSocket capabilities.

## 🔐 Authentication & Security Architecture

### JWT Authentication System
- **Token-based authentication** using JSON Web Tokens
- **Secure middleware implementation** with conflict resolution
- **Automatic token refresh** and validation
- **Role-based access control** (Admin, Staff, User)

#### JWT Middleware Implementation
```python
class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Handle JWT authentication in process_request
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header.startswith("Bearer "):
            user = get_user_jwt(request)
            request.user = user

    def process_view(self, request, view_func, view_args, view_kwargs):
        # Re-ensure user authentication before view execution
        # Resolves conflicts with Django's AuthenticationMiddleware
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header.startswith("Bearer "):
            user = get_user_jwt(request)
            if user and not isinstance(user, AnonymousUser):
                request.user = user
```

#### Security Features
- **CSRF protection** on all forms and API endpoints
- **Input validation** and sanitization
- **Rate limiting** on authentication endpoints
- **Secure headers** (HSTS, XSS protection)
- **Session management** with secure cookies

## 🗄️ Database Architecture

### Core Models
- **User Management**: Custom user model with role-based permissions
- **Activities System**: Comprehensive manufacturing activity tracking
- **Projects**: Project management with team collaboration
- **Updates**: Real-time system updates and notifications
- **Chat System**: Team communication with message persistence

### Database Schema
```sql
-- Core user management
users (id, username, email, role, created_at, updated_at)

-- Activities system
activities (id, title, description, type, status, priority,
           start_time, end_time, assigned_to, created_by)

-- Project management
projects (id, name, description, status, start_date, end_date,
         manager_id, team_members)

-- Real-time updates
updates (id, title, content, type, priority, created_by,
        created_at, updated_at)

-- Chat system
chat_messages (id, sender_id, receiver_id, content,
              message_type, created_at)
```

### Data Relationships
- **One-to-Many**: User → Activities, User → Projects
- **Many-to-Many**: Users ↔ Projects (team members)
- **One-to-One**: User ↔ UserProfile (extended information)

## 🌐 API Architecture

### REST API Endpoints
```
/api/auth/
├── login/          # User authentication
├── logout/         # User logout
├── register/       # User registration
├── user/           # Current user info
└── password/       # Password management

/api/activities/
├── /               # List/Create activities
├── <id>/           # Retrieve/Update/Delete activity
├── types/          # Activity type definitions
└── statuses/       # Status definitions

/api/projects/
├── /               # List/Create projects
├── <id>/           # Project details
├── <id>/team/      # Team management
└── <id>/activities/ # Project activities

/api/updates/
├── /               # System updates
├── <id>/           # Update details
└── notifications/  # User notifications
```

### GraphQL Integration
- **Flexible data querying** with Graphene-Django
- **Real-time subscriptions** for live updates
- **Optimized queries** with field selection
- **Type-safe schema** with automatic validation

### WebSocket Architecture
- **Channels 4.x** for WebSocket support
- **Redis backend** for channel layers
- **Authentication middleware** for secure connections
- **Real-time notifications** and updates

## 🎨 Frontend Architecture

### Component Architecture
```
src/
├── components/
│   ├── templates/           # Layout templates
│   │   ├── LayoutTemplate.tsx
│   │   ├── LeftCardTemplate.tsx
│   │   └── RightCardTemplate.tsx
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── bits/           # Advanced components
│   └── [feature]/          # Feature-specific components
│       ├── [Feature]Context.tsx
│       ├── [Feature]LeftCard.tsx
│       └── [Feature]RightCard.tsx
├── contexts/                # React contexts
├── lib/                     # API clients and utilities
└── pages/                   # Route components
```

### State Management
- **React Context API** for global state
- **Local component state** for UI interactions
- **Custom hooks** for reusable logic
- **Optimistic updates** for better UX

### Routing System
- **React Router 7** for client-side routing
- **Protected routes** with authentication guards
- **Dynamic routing** for dynamic content
- **Route-based code splitting** for performance

## 🔄 Data Flow Architecture

### Authentication Flow
```
1. User Login → JWT Token Generation
2. Token Storage → localStorage/sessionStorage
3. API Requests → Token in Authorization Header
4. Middleware Processing → User Authentication
5. Response → User Data + Updated Token
```

### Real-time Data Flow
```
1. Database Change → Django Signal
2. Signal Handler → WebSocket Message
3. Channel Layer → Redis
4. Consumer → Frontend Update
5. UI Update → Real-time Display
```

### Activity Management Flow
```
1. Create Activity → Frontend Form
2. API Request → Django Backend
3. Validation → Model Validation + Business Logic
4. Database Save → ORM Operations
5. Response → Success/Error + Updated Data
6. Real-time Update → WebSocket Notification
```

## 🛠️ Development Architecture

### Code Quality Tools
- **Pre-commit hooks** for automated quality checks
- **Black** for Python code formatting
- **ESLint + Prettier** for JavaScript/TypeScript
- **MyPy** for Python type checking
- **Testing frameworks** (pytest, Vitest, Playwright)

### Build System
- **Vite** for frontend development and building
- **Django** for backend development
- **PostgreSQL** for production database
- **Redis** for caching and WebSocket support

### Development Workflow
```
1. Feature Development → Feature Branch
2. Code Quality → Pre-commit Hooks
3. Testing → Unit + Integration Tests
4. Code Review → Pull Request
5. Deployment → Staging → Production
```

## 🚀 Performance Architecture

### Frontend Optimization
- **Code splitting** by routes and components
- **Lazy loading** for non-critical components
- **Memoization** for expensive computations
- **Virtual scrolling** for large lists
- **Image optimization** and lazy loading

### Backend Optimization
- **Database query optimization** with select_related/prefetch_related
- **Caching strategies** with Redis
- **Connection pooling** for database connections
- **Async operations** for I/O intensive tasks
- **Background tasks** with Celery (planned)

### Database Optimization
- **Indexed queries** for common operations
- **Connection pooling** for high concurrency
- **Query optimization** with Django ORM
- **Database partitioning** for large datasets (planned)

## 🔒 Security Architecture

### Authentication Security
- **JWT token expiration** and refresh mechanisms
- **Secure token storage** in HTTP-only cookies
- **Rate limiting** on authentication endpoints
- **Account lockout** after failed attempts

### Data Security
- **Input validation** and sanitization
- **SQL injection prevention** with ORM
- **XSS protection** with content security policies
- **CSRF protection** on all forms

### API Security
- **CORS configuration** for cross-origin requests
- **API rate limiting** for abuse prevention
- **Request validation** with serializers
- **Audit logging** for security events

## 📊 Monitoring & Observability

### Application Monitoring
- **Django logging** with structured logging
- **Performance metrics** with custom middleware
- **Error tracking** with detailed error reports
- **Health checks** for system components

### Infrastructure Monitoring
- **Database performance** monitoring
- **WebSocket connection** tracking
- **API response times** and error rates
- **Resource utilization** monitoring

## 🔮 Future Architecture Plans

### Scalability Improvements
- **Microservices architecture** for specific domains
- **Event-driven architecture** with message queues
- **Distributed caching** with Redis clusters
- **Load balancing** for high availability

### Advanced Features
- **Machine learning** integration for predictive analytics
- **IoT device integration** for real-time monitoring
- **Mobile app** with React Native
- **Multi-tenant architecture** for SaaS deployment

### DevOps Integration
- **Container orchestration** with Kubernetes
- **CI/CD pipelines** with automated testing
- **Infrastructure as Code** with Terraform
- **Monitoring stack** with Prometheus + Grafana

---

**This architecture provides a solid foundation for a scalable, maintainable, and secure manufacturing operations management system.**
