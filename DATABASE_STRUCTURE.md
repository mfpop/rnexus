# Database Structure for Activities Management System

## Overview
This document outlines the optimized, normalized database structure for the Activities Management System. The database is designed to efficiently store and manage activities, tasks, milestones, checklists, and related data while maintaining data integrity and performance.

## Database Normalization
The database follows 3NF (Third Normal Form) principles:
- **1NF**: All attributes contain atomic values
- **2NF**: No partial dependencies on composite keys
- **3NF**: No transitive dependencies

## Core Tables

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
```

### 2. Projects Table
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);
```

### 3. Activities Table (Main Table)
```sql
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'planned',
    priority VARCHAR(50) DEFAULT 'medium',
    category VARCHAR(100),
    risk_level VARCHAR(50),
    cost DECIMAL(15,2),

    -- Dates
    start_date TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,

    -- Relationships
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,

    -- Metadata
    tags TEXT[], -- Array of tags
    estimated_hours INTEGER,
    actual_hours INTEGER,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_activities_owner ON activities(owner_id);
CREATE INDEX idx_activities_project ON activities(project_id);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_priority ON activities(priority);
CREATE INDEX idx_activities_dates ON activities(start_date, due_date);
CREATE INDEX idx_activities_tags ON activities USING GIN(tags);
```

### 4. Tasks Table
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(50) DEFAULT 'medium',
    completed BOOLEAN DEFAULT false,

    -- Dates
    start_date TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,

    -- Relationships
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    depends_on_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,

    -- Time tracking
    estimated_hours INTEGER,
    actual_hours INTEGER,

    -- Metadata
    tags TEXT[],

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_tasks_activity ON tasks(activity_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_dates ON tasks(start_date, due_date);
CREATE INDEX idx_tasks_dependencies ON tasks(depends_on_task_id);
```

### 5. Milestones Table
```sql
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    completed BOOLEAN DEFAULT false,

    -- Dates
    due_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,

    -- Relationships
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Metadata
    tags TEXT[],

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_milestones_activity ON milestones(activity_id);
CREATE INDEX idx_milestones_assignee ON milestones(assignee_id);
CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_milestones_completed ON milestones(completed);
CREATE INDEX idx_milestones_due_date ON milestones(due_date);
```

### 6. Checklists Table
```sql
CREATE TABLE checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Relationships
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Metadata
    tags TEXT[],

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_checklists_activity ON checklists(activity_id);
CREATE INDEX idx_checklists_assignee ON checklists(assignee_id);
```

### 7. Checklist Items Table
```sql
CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_date TIMESTAMP WITH TIME ZONE,

    -- Relationships
    checklist_id UUID REFERENCES checklists(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Order
    sort_order INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_checklist_items_checklist ON checklist_items(checklist_id);
CREATE INDEX idx_checklist_items_assignee ON checklist_items(assignee_id);
CREATE INDEX idx_checklist_items_completed ON checklist_items(completed);
CREATE INDEX idx_checklist_items_order ON checklist_items(checklist_id, sort_order);
```

### 8. Time Logs Table
```sql
CREATE TABLE time_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT,

    -- Time tracking
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,

    -- Relationships
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_time_logs_activity ON time_logs(activity_id);
CREATE INDEX idx_time_logs_task ON time_logs(task_id);
CREATE INDEX idx_time_logs_user ON time_logs(user_id);
CREATE INDEX idx_time_logs_dates ON time_logs(start_time, end_time);
```

### 9. Attachments Table
```sql
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),

    -- Relationships
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    uploaded_by_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Metadata
    description TEXT,

    -- Timestamps
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_attachments_activity ON attachments(activity_id);
CREATE INDEX idx_attachments_task ON attachments(task_id);
CREATE INDEX idx_attachments_user ON attachments(uploaded_by_id);
CREATE INDEX idx_attachments_type ON attachments(mime_type);
```

### 10. Comments Table
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,

    -- Relationships
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_comments_activity ON comments(activity_id);
CREATE INDEX idx_comments_task ON comments(task_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_comments_created ON comments(created_at);
```

## Junction Tables for Many-to-Many Relationships

### 11. Project Team Members
```sql
CREATE TABLE project_team_members (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (project_id, user_id)
);

-- Indexes
CREATE INDEX idx_project_team_members_project ON project_team_members(project_id);
CREATE INDEX idx_project_team_members_user ON project_team_members(user_id);
CREATE INDEX idx_project_team_members_role ON project_team_members(role);
```

### 12. Activity Participants
```sql
CREATE TABLE activity_participants (
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100) DEFAULT 'participant',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (activity_id, user_id)
);

-- Indexes
CREATE INDEX idx_activity_participants_activity ON activity_participants(activity_id);
CREATE INDEX idx_activity_participants_user ON activity_participants(user_id);
CREATE INDEX idx_activity_participants_role ON activity_participants(role);
```

## Database Constraints and Triggers

### Foreign Key Constraints
All foreign key relationships are properly defined with appropriate ON DELETE actions:
- **CASCADE**: For child records that should be deleted when parent is deleted
- **SET NULL**: For optional relationships that should be cleared
- **RESTRICT**: For critical relationships that should prevent deletion

### Unique Constraints
```sql
-- Ensure unique usernames and emails
ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE (username);
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

-- Ensure unique project names per owner
ALTER TABLE projects ADD CONSTRAINT unique_project_name_per_owner UNIQUE (owner_id, name);
```

### Check Constraints
```sql
-- Valid status values
ALTER TABLE activities ADD CONSTRAINT check_activity_status
    CHECK (status IN ('planned', 'in-progress', 'completed', 'cancelled', 'overdue', 'on-hold', 'pending-approval'));

ALTER TABLE tasks ADD CONSTRAINT check_task_status
    CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled', 'overdue'));

-- Valid priority values
ALTER TABLE activities ADD CONSTRAINT check_activity_priority
    CHECK (priority IN ('low', 'medium', 'high', 'urgent', 'critical'));

-- Valid risk levels
ALTER TABLE activities ADD CONSTRAINT check_risk_level
    CHECK (risk_level IN ('low', 'medium', 'high', 'critical'));
```

## Performance Optimizations

### Composite Indexes
```sql
-- Activity queries by status and dates
CREATE INDEX idx_activities_status_dates ON activities(status, start_date, due_date);

-- Task queries by activity and status
CREATE INDEX idx_tasks_activity_status ON tasks(activity_id, status, completed);

-- Time tracking queries
CREATE INDEX idx_time_logs_user_dates ON time_logs(user_id, start_time, end_time);
```

### Partial Indexes
```sql
-- Only index active users
CREATE INDEX idx_users_active_partial ON users(id, username, email) WHERE is_active = true;

-- Only index incomplete tasks
CREATE INDEX idx_tasks_incomplete ON tasks(id, title, due_date) WHERE completed = false;

-- Only index overdue activities
CREATE INDEX idx_activities_overdue ON activities(id, title, owner_id) WHERE due_date < CURRENT_TIMESTAMP AND status != 'completed';
```

## Data Integrity Features

### Automatic Timestamps
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... apply to all other tables
```

### Soft Delete Support
```sql
-- Add deleted_at column to main tables
ALTER TABLE activities ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE tasks ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE milestones ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for soft delete queries
CREATE INDEX idx_activities_deleted ON activities(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_deleted ON tasks(deleted_at) WHERE deleted_at IS NULL;
```

## API Integration Points

### RESTful Endpoints
The database structure supports the following API endpoints:
- `/api/activities` - CRUD operations for activities
- `/api/activities/{id}/tasks` - Task management
- `/api/activities/{id}/milestones` - Milestone management
- `/api/activities/{id}/checklists` - Checklist management
- `/api/activities/{id}/time-logs` - Time tracking
- `/api/activities/{id}/attachments` - File management
- `/api/activities/{id}/comments` - Comment system

### GraphQL Schema
The normalized structure easily maps to GraphQL types:
```graphql
type Activity {
  id: ID!
  title: String!
  description: String
  type: String!
  status: String!
  priority: String!
  tasks: [Task!]!
  milestones: [Milestone!]!
  checklists: [Checklist!]!
  timeLogs: [TimeLog!]!
  attachments: [Attachment!]!
  comments: [Comment!]!
}
```

## Security Considerations

### Row Level Security (RLS)
```sql
-- Enable RLS on sensitive tables
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;

-- Policies for user access
CREATE POLICY user_activities ON activities FOR ALL USING (owner_id = current_user_id());
CREATE POLICY user_tasks ON tasks FOR ALL USING (assignee_id = current_user_id());
```

### Data Encryption
- Sensitive fields (passwords, API keys) are encrypted at rest
- Database connections use TLS encryption
- Audit logging for all data modifications

## Backup and Recovery

### Automated Backups
- Daily full backups with point-in-time recovery
- Transaction log backups every 15 minutes
- Automated backup verification and testing

### Disaster Recovery
- Cross-region replication for critical data
- Automated failover procedures
- Regular disaster recovery testing

## Monitoring and Maintenance

### Performance Monitoring
- Query performance tracking
- Index usage monitoring
- Slow query analysis
- Connection pool monitoring

### Maintenance Tasks
- Regular VACUUM and ANALYZE operations
- Index maintenance and optimization
- Statistics updates
- Log rotation and cleanup

## Conclusion

This database structure provides:
- **Optimal Performance**: Proper indexing and normalization
- **Data Integrity**: Constraints, triggers, and validation
- **Scalability**: Efficient query patterns and relationships
- **Security**: Row-level security and encryption
- **Maintainability**: Clear structure and documentation
- **Flexibility**: Easy to extend and modify

The structure follows database best practices and is designed to handle high-volume activity management while maintaining performance and data integrity.
