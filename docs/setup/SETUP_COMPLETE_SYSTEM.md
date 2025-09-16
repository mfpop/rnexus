This document has moved to docs/SETUP_COMPLETE_SYSTEM.md

## 📋 Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (recommended) or SQLite
- Git

## 🗄️ Database Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Database
Edit `backend/core/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # or sqlite3
        'NAME': 'nexus_activities',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Add REST Framework to INSTALLED_APPS
INSTALLED_APPS = [
    # ... existing apps
    'rest_framework',
    'corsheaders',
    'channels',
]

# Add CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Channels configuration for WebSocket
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
        # For production, use Redis:
        # 'BACKEND': 'channels_redis.core.RedisChannelLayer',
        # 'CONFIG': {
        #     "hosts": [('127.0.0.1', 6379)],
        # },
    },
}
```

### 3. Run Database Migrations
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Sample Data
```bash
python setup_database.py
```

This will create:
- Admin user (admin/admin123)
- Sample user (mihai/password123)
- Sample project and activity
- Sample tasks, milestones, and checklists

## 🔌 API Setup

### 1. Start Django Server
```bash
cd backend
python manage.py runserver
```

### 2. Test API Endpoints
```bash
# Get all activities
curl http://localhost:8000/api/activities/

# Get specific activity
curl http://localhost:8000/api/activities/{activity_id}/

# Create new task
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task description","activity":"{activity_id}"}'
```

## 🌐 WebSocket Setup

### 1. Update ASGI Configuration
Edit `backend/core/asgi.py`:
```python
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from api.routing import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
```

### 2. Create WebSocket Routing
Create `backend/api/routing.py`:
```python
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/activities/$', consumers.ActivitiesConsumer.as_asgi()),
]
```

### 3. Test WebSocket Connection
```javascript
// In browser console
const ws = new WebSocket('ws://localhost:8000/ws/activities/');
ws.onopen = () => console.log('Connected to WebSocket');
ws.onmessage = (event) => console.log('Message:', JSON.parse(event.data));
```

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Create `.env.local`:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000/ws/activities
```

### 3. Start Frontend
```bash
npm run dev
```

## 🔄 Real-Time Updates

### 1. WebSocket Integration
The system automatically:
- Connects to WebSocket on component mount
- Subscribes to activity updates
- Receives real-time notifications for:
  - Task updates
  - Milestone changes
  - Checklist modifications
  - New comments
  - Time log updates

### 2. API Integration
All CRUD operations now use real API calls:
- ✅ Create tasks, milestones, checklists
- ✅ Update existing items
- ✅ Delete items
- ✅ Real-time data persistence

## 🧪 Testing the System

### 1. Database Verification
```bash
cd backend
python manage.py shell

# Check models
from api.models import Activity, Task, Milestone
print(f"Activities: {Activity.objects.count()}")
print(f"Tasks: {Task.objects.count()}")
print(f"Milestones: {Milestone.objects.count()}")
```

### 2. API Testing
```bash
# Test authentication
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"mihai","password":"password123"}'

# Use token for authenticated requests
curl -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/activities/
```

### 3. Frontend Testing
1. Open http://localhost:3000
2. Navigate to Activities page
3. Try creating/editing/deleting tasks
4. Check browser console for API calls
5. Verify WebSocket connection

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection
```bash
# Check database status
python manage.py dbshell

# Reset database (WARNING: destroys all data)
python manage.py flush
```

#### 2. API Errors
```bash
# Check Django logs
python manage.py runserver --verbosity=2

# Test specific endpoint
python manage.py shell
from api.models import Activity
Activity.objects.first()
```

#### 3. WebSocket Issues
```bash
# Check channels status
python manage.py shell
from channels.layers import get_channel_layer
channel_layer = get_channel_layer()
print(channel_layer)
```

#### 4. Frontend Issues
```bash
# Clear cache
npm run build
npm run dev

# Check API calls in browser dev tools
# Verify WebSocket connection in console
```

## 📊 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Django API    │    │   Database      │
│   (React)       │◄──►│   (DRF)         │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   WebSocket     │    │   Real-time     │
│   Service       │    │   Updates       │
└─────────────────┘    └─────────────────┘
```

## 🔐 Security Features

- **Authentication**: JWT tokens for API access
- **Authorization**: User-based permissions
- **CORS**: Configured for development/production
- **Input Validation**: Django model validation
- **SQL Injection Protection**: Django ORM

## 📈 Performance Optimizations

- **Database Indexes**: Optimized for common queries
- **Caching**: Redis support for production
- **Pagination**: API pagination for large datasets
- **Lazy Loading**: Frontend lazy loading for components

## 🚀 Production Deployment

### 1. Environment Variables
```env
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://localhost:6379
```

### 2. Static Files
```bash
python manage.py collectstatic
python manage.py runserver --insecure
```

### 3. WebSocket Production
```python
# Use Redis for production
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [os.environ.get('REDIS_URL', 'redis://localhost:6379')],
        },
    },
}
```

## 📝 API Documentation

### Endpoints Overview
- `GET /api/activities/` - List all activities
- `POST /api/activities/` - Create new activity
- `GET /api/activities/{id}/` - Get specific activity
- `PUT /api/activities/{id}/` - Update activity
- `DELETE /api/activities/{id}/` - Delete activity

### WebSocket Events
- `activity_updated` - Activity modified
- `task_updated` - Task modified
- `milestone_updated` - Milestone modified
- `checklist_updated` - Checklist modified

## 🎯 Next Steps

1. **Customize Models**: Add your specific fields
2. **Extend API**: Add more endpoints as needed
3. **Enhance Frontend**: Add more UI components
4. **Add Tests**: Unit and integration tests
5. **Monitoring**: Add logging and metrics
6. **Deployment**: Deploy to production environment

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Django and React documentation
3. Check browser console and Django logs
4. Verify database connectivity

---

**🎉 Congratulations!** You now have a fully functional, real-time Activities Management System with database persistence, API integration, and WebSocket updates.
