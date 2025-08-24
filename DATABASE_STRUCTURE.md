# Nexus Database Structure

## 🗄️ Database Overview

The Nexus system uses PostgreSQL as its primary database, with Django ORM for data modeling and management. The database is designed to support comprehensive manufacturing operations management with real-time updates and user collaboration.

## 🏗️ Core Models

### User Management

#### User Model
```python
class User(AbstractUser):
    """Extended user model with role-based permissions"""
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('staff', 'Staff Member'),
        ('user', 'Regular User'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'auth_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
```

#### UserProfile Model
```python
class UserProfile(models.Model):
    """Extended user profile information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    department = models.CharField(max_length=100, blank=True)
    position = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)

    class Meta:
        db_table = 'api_userprofile'
```

### Activities System

#### Activity Model
```python
class Activity(models.Model):
    """Core manufacturing activity model"""
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('overdue', 'Overdue'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    TYPE_CHOICES = [
        ('Production', 'Production'),
        ('Maintenance', 'Maintenance'),
        ('Inspection & Audit', 'Inspection & Audit'),
        ('Engineering', 'Engineering'),
        ('Logistics', 'Logistics'),
        ('Quality', 'Quality'),
        ('Meetings', 'Meetings'),
        ('Projects', 'Projects'),
        ('Training', 'Training'),
        ('Admin & Systems', 'Admin & Systems'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_activities')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_activities')

    tags = models.ManyToManyField('Tag', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'api_activity'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['type']),
            models.Index(fields=['assigned_to']),
            models.Index(fields=['start_time']),
            models.Index(fields=['priority']),
        ]
```

#### ActivityStatus Model
```python
class ActivityStatus(models.Model):
    """Activity status tracking and history"""
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20, choices=Activity.STATUS_CHOICES)
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    changed_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'api_activitystatus'
        ordering = ['-changed_at']
```

#### ActivityPriority Model
```python
class ActivityPriority(models.Model):
    """Activity priority tracking and history"""
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='priority_history')
    priority = models.CharField(max_length=20, choices=Activity.PRIORITY_CHOICES)
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    changed_at = models.DateTimeField(auto_now_add=True)
    reason = models.TextField(blank=True)

    class Meta:
        db_table = 'api_activitypriority'
        ordering = ['-changed_at']
```

### Tag System

#### Tag Model
```python
class Tag(models.Model):
    """Flexible tagging system for activities and other entities"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    category = models.CharField(max_length=50, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'api_tag'
        ordering = ['name']
```

### Project Management

#### Project Model
```python
class Project(models.Model):
    """Project management and organization"""
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('active', 'Active'),
        ('on-hold', 'On Hold'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')

    start_date = models.DateField()
    end_date = models.DateField()

    manager = models.ForeignKey(User, on_delete=models.CASCADE, related_name='managed_projects')
    team_members = models.ManyToManyField(User, related_name='project_assignments')

    activities = models.ManyToManyField(Activity, blank=True, related_name='projects')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'api_project'
        ordering = ['-created_at']
```

### Real-time Updates System

#### Update Model
```python
class Update(models.Model):
    """System updates and notifications"""
    TYPE_CHOICES = [
        ('announcement', 'Announcement'),
        ('alert', 'Alert'),
        ('maintenance', 'Maintenance'),
        ('update', 'System Update'),
        ('news', 'News'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')

    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    target_users = models.ManyToManyField(User, blank=True, related_name='targeted_updates')

    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'api_update'
        ordering = ['-created_at']
```

#### UpdateAttachment Model
```python
class UpdateAttachment(models.Model):
    """File attachments for updates"""
    update = models.ForeignKey(Update, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='update_attachments/')
    filename = models.CharField(max_length=255)
    file_size = models.IntegerField()
    mime_type = models.CharField(max_length=100)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'api_updateattachment'
```

#### UpdateMedia Model
```python
class UpdateMedia(models.Model):
    """Media content for updates (images, videos)"""
    update = models.ForeignKey(Update, on_delete=models.CASCADE, related_name='media')
    media_file = models.FileField(upload_to='update_media/')
    media_type = models.CharField(max_length=20)  # image, video, audio
    caption = models.TextField(blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'api_updatemedia'
```

### Chat System

#### ChatMessage Model
```python
class ChatMessage(models.Model):
    """Real-time chat messages between users"""
    MESSAGE_TYPES = [
        ('text', 'Text'),
        ('file', 'File'),
        ('image', 'Image'),
        ('system', 'System Message'),
    ]

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')

    content = models.TextField()
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='text')

    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'api_chatmessage'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['sender', 'receiver']),
            models.Index(fields=['created_at']),
        ]
```

### System Messages

#### SystemMessage Model
```python
class SystemMessage(models.Model):
    """System-generated messages and notifications"""
    MESSAGE_TYPES = [
        ('info', 'Information'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('success', 'Success'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='info')

    target_users = models.ManyToManyField(User, blank=True, related_name='system_messages')
    is_broadcast = models.BooleanField(default=False)

    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'api_systemmessage'
        ordering = ['-created_at']
```

## 🔗 Database Relationships

### One-to-One Relationships
- **User ↔ UserProfile**: Extended user information
- **Activity ↔ ActivityStatus**: Current status tracking
- **Activity ↔ ActivityPriority**: Current priority tracking

### One-to-Many Relationships
- **User → Activities**: User can create multiple activities
- **User → Assigned Activities**: User can be assigned to multiple activities
- **User → Projects**: User can manage multiple projects
- **User → Updates**: User can create multiple updates
- **User → Chat Messages**: User can send multiple messages

### Many-to-Many Relationships
- **Users ↔ Projects**: Team members can work on multiple projects
- **Activities ↔ Tags**: Activities can have multiple tags
- **Activities ↔ Projects**: Activities can belong to multiple projects
- **Updates ↔ Users**: Updates can target multiple users
- **System Messages ↔ Users**: Messages can target multiple users

## 📊 Database Indexes

### Performance Indexes
```sql
-- User indexes
CREATE INDEX idx_user_email ON auth_user(email);
CREATE INDEX idx_user_role ON auth_user(role);
CREATE INDEX idx_user_is_active ON auth_user(is_active);

-- Activity indexes
CREATE INDEX idx_activity_status ON api_activity(status);
CREATE INDEX idx_activity_type ON api_activity(type);
CREATE INDEX idx_activity_assigned_to ON api_activity(assigned_to_id);
CREATE INDEX idx_activity_start_time ON api_activity(start_time);
CREATE INDEX idx_activity_priority ON api_activity(priority);
CREATE INDEX idx_activity_created_by ON api_activity(created_by_id);

-- Project indexes
CREATE INDEX idx_project_status ON api_project(status);
CREATE INDEX idx_project_manager ON api_project(manager_id);
CREATE INDEX idx_project_start_date ON api_project(start_date);

-- Update indexes
CREATE INDEX idx_update_type ON api_update(type);
CREATE INDEX idx_update_priority ON api_update(priority);
CREATE INDEX idx_update_created_by ON api_update(created_by_id);
CREATE INDEX idx_update_published ON api_update(is_published, published_at);

-- Chat indexes
CREATE INDEX idx_chat_sender_receiver ON api_chatmessage(sender_id, receiver_id);
CREATE INDEX idx_chat_created_at ON api_chatmessage(created_at);
CREATE INDEX idx_chat_is_read ON api_chatmessage(is_read);
```

### Composite Indexes
```sql
-- Activity status and priority for filtering
CREATE INDEX idx_activity_status_priority ON api_activity(status, priority);

-- Activity type and status for reporting
CREATE INDEX idx_activity_type_status ON api_activity(type, status);

-- Update type and priority for notifications
CREATE INDEX idx_update_type_priority ON api_update(type, priority);

-- Project status and dates for timeline views
CREATE INDEX idx_project_status_dates ON api_project(status, start_date, end_date);
```

## 🗃️ Data Population

### Sample Data Scripts
The system includes comprehensive data population scripts:

#### Management Commands
```bash
# Populate all data
python manage.py populate_all

# Populate specific data types
python manage.py populate_users
python manage.py populate_activities
python manage.py populate_projects
python manage.py populate_updates
python manage.py populate_chats
python manage.py populate_system_messages
python manage.py populate_tags
```

#### Sample Data Structure
```python
# Sample activity data
SAMPLE_ACTIVITIES = [
    {
        'title': 'Production Line Setup',
        'type': 'Production',
        'status': 'planned',
        'priority': 'high',
        'description': 'Setup production line for new product launch',
        'start_time': '2025-08-24 08:00:00',
        'end_time': '2025-08-24 16:00:00',
    },
    {
        'title': 'Equipment Maintenance',
        'type': 'Maintenance',
        'status': 'in-progress',
        'priority': 'medium',
        'description': 'Routine maintenance on production equipment',
        'start_time': '2025-08-23 14:00:00',
        'end_time': '2025-08-23 18:00:00',
    }
]

# Sample tag data
SAMPLE_TAGS = [
    {'name': 'Kaizen', 'description': 'Continuous improvement initiative'},
    {'name': 'RCA', 'description': 'Root cause analysis required'},
    {'name': 'CAPA', 'description': 'Corrective/preventive action'},
    {'name': 'Blocked', 'description': 'Activity is waiting on input or dependency'},
    {'name': 'Recurring', 'description': 'Happens regularly (daily, weekly, etc.)'},
]
```

## 🔄 Database Migrations

### Migration History
```bash
# View migration status
python manage.py showmigrations

# Apply migrations
python manage.py migrate

# Create new migrations
python manage.py makemigrations

# Rollback migrations
python manage.py migrate api 0008  # Rollback to migration 0008
```

### Key Migrations
- **0001_initial**: Core user and basic models
- **0002_systemmessage**: System message functionality
- **0003_chat_message_caption**: Enhanced chat system
- **0004_update_models**: Real-time update system
- **0005_remove_old_indexes**: Cleanup old database indexes
- **0006_updatecomment_updatelike**: Social features for updates
- **0007_tag**: Tagging system
- **0008_rename_indexes**: Index optimization
- **0009_activity_models**: Comprehensive activities system

## 🛡️ Data Security

### Access Control
- **Row-level security** with Django ORM
- **User-based filtering** for data access
- **Role-based permissions** for administrative functions
- **Audit logging** for sensitive operations

### Data Validation
- **Model validation** with Django validators
- **Custom field validation** for business logic
- **Database constraints** for data integrity
- **Input sanitization** for security

### Backup and Recovery
```bash
# Database backup
pg_dump -h localhost -U nexus_user nexus_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Database restore
psql -h localhost -U nexus_user nexus_db < backup_file.sql

# Automated backup script
python manage.py backup_database
```

## 📈 Performance Optimization

### Query Optimization
```python
# Use select_related for foreign keys
activities = Activity.objects.select_related('assigned_to', 'created_by').all()

# Use prefetch_related for many-to-many
activities = Activity.objects.prefetch_related('tags', 'projects').all()

# Use only() for specific fields
activities = Activity.objects.only('id', 'title', 'status', 'assigned_to__username').all()

# Use defer() to exclude heavy fields
activities = Activity.objects.defer('description', 'content').all()
```

### Caching Strategy
```python
# Model-level caching
from django.core.cache import cache

def get_activity(activity_id):
    cache_key = f'activity_{activity_id}'
    activity = cache.get(cache_key)
    if not activity:
        activity = Activity.objects.get(id=activity_id)
        cache.set(cache_key, activity, timeout=3600)  # 1 hour
    return activity

# Query result caching
def get_activities_by_status(status):
    cache_key = f'activities_status_{status}'
    activities = cache.get(cache_key)
    if not activities:
        activities = list(Activity.objects.filter(status=status))
        cache.set(cache_key, activities, timeout=1800)  # 30 minutes
    return activities
```

## 🔮 Future Database Plans

### Planned Enhancements
- **Time-series data** for performance metrics
- **Geospatial data** for location-based features
- **Document storage** for file management
- **Audit trails** for compliance tracking
- **Data archiving** for historical analysis

### Scalability Improvements
- **Database partitioning** for large datasets
- **Read replicas** for query performance
- **Connection pooling** for high concurrency
- **Data compression** for storage optimization
- **Automated maintenance** for database health

---

**This database structure provides a robust foundation for the Nexus manufacturing operations management system with comprehensive data modeling, performance optimization, and security features.**
