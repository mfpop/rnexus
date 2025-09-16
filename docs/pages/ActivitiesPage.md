# Activities Page Documentation

## Overview
The Activities Page provides comprehensive activity and task management functionality for tracking manufacturing work activities, maintenance schedules, operational tasks, and team assignments. It offers a master-detail interface for efficient activity monitoring and management with real-time updates and advanced filtering capabilities.

## Page Structure

### Route
- **URL**: `/activities`
- **Component**: `Activities.tsx`
- **Layout**: Uses `StableLayout` with two-card architecture

### Architecture
- **Left Card**: `ActivitiesLeftCardSimple` - Activity list, filtering, and search
- **Right Card**: `ActivitiesRightCard` - Selected activity detailed view
- **State Management**: `ActivitiesContext` with React Context API
- **Data Communication**: Master-detail pattern via `selectedActivity`

## Recent System Updates

### JWT Authentication Enhancement
The activities system now includes enhanced JWT authentication that resolves the "logged out on refresh" issue:
- **Secure Middleware**: Enhanced JWT middleware with conflict resolution
- **Improved Security**: Better token validation and user session management
- **Real-time Authentication**: Seamless authentication for WebSocket connections

### Enhanced Activities System
- **Comprehensive Database Models**: Full manufacturing activity tracking
- **Real-time Updates**: WebSocket-based notifications and status updates
- **Advanced Filtering**: Search, sort, and filter capabilities
- **Improved Frontend Components**: Enhanced React components with TypeScript

## Features

### Activity Management
- **Activity Overview**: Complete list of scheduled and ongoing activities
- **Real-time Status**: Live status updates and progress tracking via WebSockets
- **Priority Management**: Priority-based activity organization (low, medium, high, urgent)
- **Assignment Tracking**: Personnel and resource assignments with user management
- **Schedule Management**: Timeline and deadline monitoring with overdue detection

### Advanced Filtering & Search
- **Search Functionality**: Full-text search across titles, descriptions, and assignments
- **Type Filtering**: Filter by manufacturing activity types (Production, Maintenance, Quality, etc.)
- **Status Filtering**: Filter by activity status (planned, in-progress, completed, cancelled, overdue)
- **Priority Filtering**: Filter by priority levels
- **Tag-based Filtering**: Advanced tagging system for activity categorization
- **Time-based Tabs**: All, Today, Upcoming, and Overdue activity views

### Detailed Activity View
- **Activity Dashboard**: Comprehensive activity details and metrics
- **Progress Tracking**: Step-by-step progress monitoring
- **Resource Allocation**: Equipment and personnel assignments
- **Time Tracking**: Actual vs. estimated time recording
- **Documentation**: Activity logs, notes, and attachments

### Activity Analytics
- **Performance Metrics**: Completion rates and efficiency analysis
- **Resource Utilization**: Equipment and personnel usage statistics
- **Trend Analysis**: Historical activity performance
- **Bottleneck Identification**: Process optimization insights
- **Compliance Monitoring**: Safety and regulatory compliance tracking

## Data Structure

### Enhanced Activity Interface
```typescript
interface Activity {
  id: number
  title: string
  description: string
  type: 'Production' | 'Maintenance' | 'Inspection & Audit' | 'Engineering' | 'Logistics' | 'Quality' | 'Meetings' | 'Projects' | 'Training' | 'Admin & Systems'
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  startTime: Date
  endTime: Date
  estimatedDuration: number
  actualDuration?: number
  assignedTo: string
  assignedBy: string
  location: string
  equipment: string[]
  notes: string
  attachments: Attachment[]
  checklist: ChecklistItem[]
  relatedActivities: number[]
  tags: Tag[]
  createdAt: Date
  updatedAt: Date
}
```

### Manufacturing Activity Types
```typescript
const manufacturingActivityTypes = [
  { type: "Production", examples: ["Assembly", "Setup", "Trials"] },
  { type: "Maintenance", examples: ["Preventive", "Corrective", "Calibration"] },
  { type: "Inspection & Audit", examples: ["Quality checks", "ISO", "Safety audits"] },
  { type: "Engineering", examples: ["Tooling", "Layout", "Process changes"] },
  { type: "Logistics", examples: ["Material flow", "Inventory", "Warehouse"] },
  { type: "Quality", examples: ["RCA", "CAPA", "FMEA", "Control plans"] },
  { type: "Meetings", examples: ["Stand-ups", "Reviews", "Calls"] },
  { type: "Projects", examples: ["NPI", "Automation", "Lean/Six Sigma"] },
  { type: "Training", examples: ["Safety", "Technical", "Onboarding"] },
  { type: "Admin & Systems", examples: ["Reports", "ERP/MES", "Documentation"] }
]
```

### Tag System
```typescript
interface Tag {
  id: number
  name: string
  description: string
  color: string
  category: string
  purpose: string
}

// Sample tags for manufacturing activities
const sampleTags = [
  { value: "Kaizen", label: "Kaizen", color: "bg-green-100 text-green-700", purpose: "Continuous improvement initiative" },
  { value: "RCA", label: "RCA", color: "bg-blue-100 text-blue-700", purpose: "Root cause analysis required" },
  { value: "CAPA", label: "CAPA", color: "bg-purple-100 text-purple-700", purpose: "Corrective/preventive action" },
  { value: "Blocked", label: "Blocked", color: "bg-red-100 text-red-700", purpose: "Activity is waiting on input or dependency" },
  { value: "Recurring", label: "Recurring", color: "bg-indigo-100 text-indigo-700", purpose: "Happens regularly (daily, weekly, etc.)" },
  { value: "Training", label: "Training", color: "bg-emerald-100 text-emerald-700", purpose: "Involves skill-building or onboarding" },
  { value: "Audit", label: "Audit", color: "bg-yellow-100 text-yellow-700", purpose: "Related to compliance or certification" },
  { value: "Gemba", label: "Gemba", color: "bg-orange-100 text-orange-700", purpose: "Requires shop floor observation" },
  { value: "5S", label: "5S", color: "bg-teal-100 text-teal-700", purpose: "Workplace organization or cleanup" },
  { value: "Documentation", label: "Documentation", color: "bg-gray-100 text-gray-700", purpose: "Involves updating or creating documents" }
]
```

### Supporting Interfaces
```typescript
interface Attachment {
  id: number
  name: string
  type: string
  size: number
  uploadedAt: Date
  url: string
}

interface ChecklistItem {
  id: number
  description: string
  completed: boolean
  completedAt?: Date
  completedBy?: string
  required: boolean
}

interface ActivityLog {
  id: number
  activityId: number
  timestamp: Date
  action: string
  performedBy: string
  notes?: string
}
```

## Context Management

### Enhanced ActivitiesContext
```typescript
interface ActivitiesContextType {
  activities: Activity[]
  selectedActivity: Activity | null
  setSelectedActivity: (activity: Activity | null) => void
  loading: boolean
  error: string | null
  fetchActivities: () => Promise<void>
  refreshActivities: () => Promise<void>
}

const ActivitiesContext = createContext<ActivitiesContextType>({
  activities: [],
  selectedActivity: null,
  setSelectedActivity: () => {},
  loading: false,
  error: null,
  fetchActivities: async () => {},
  refreshActivities: async () => {}
})
```

## Components Hierarchy

```
StableLayout
├── ActivitiesProvider
│   ├── MainContainerTemplate
│   │   ├── ActivitiesLeftCardSimple (leftContent)
│   │   │   ├── Search Bar
│   │   │   ├── Filter & Sort Controls
│   │   │   ├── Time-based Tabs
│   │   │   └── Activities List
│   │   └── Activities -> ActivitiesRightCard (rightContent)
│   │       ├── Activity Details
│   │       ├── Status Management
│   │       ├── Time Tracking
│   │       └── Documentation
```

## Enhanced User Interactions

### Left Card Actions
1. **Activity Selection**: Click any activity to view detailed information
2. **Advanced Search**: Full-text search with real-time filtering
3. **Multi-level Filtering**:
   - Type filtering (Production, Maintenance, Quality, etc.)
   - Status filtering (planned, in-progress, completed, cancelled, overdue)
   - Priority filtering (low, medium, high, urgent)
   - Tag-based filtering with purpose descriptions
4. **Smart Sorting**: Sort by start time, title, status, priority, or assigned personnel
5. **Time-based Views**: All, Today, Upcoming, and Overdue activity tabs
6. **Real-time Updates**: Live status synchronization via WebSockets

### Right Card Actions
1. **View Details**: Complete activity information display
2. **Update Status**: Change activity status with audit trail
3. **Time Tracking**: Record actual time spent vs. estimated
4. **Checklist Management**: Complete checklist items with validation
5. **Add Notes**: Document activity progress and issues
6. **Upload Attachments**: Add supporting documents and files
7. **Schedule Updates**: Modify timing and assignments
8. **Related Activities**: View and manage related tasks
9. **Tag Management**: Add/remove activity tags for categorization

## Activity Workflow

### Enhanced Activity Lifecycle
1. **Planning**: Activity creation with type categorization and tagging
2. **Assignment**: Personnel and resource allocation with role-based permissions
3. **Scheduling**: Timeline establishment with conflict detection
4. **Execution**: Real-time monitoring and progress tracking
5. **Completion**: Final verification and documentation
6. **Review**: Performance analysis and lessons learned
7. **Continuous Improvement**: Tag-based categorization for process optimization

### Status Transitions
- **planned** → **in-progress**: Activity initiation with validation
- **in-progress** → **completed**: Successful completion with documentation
- **in-progress** → **overdue**: Automatic overdue detection and alerts
- **planned/in-progress** → **cancelled**: Activity cancellation with reason tracking
- **completed** → **reviewed**: Post-completion analysis and improvement

## Real-time Features

### WebSocket Integration
- **Live Status Updates**: Real-time activity status synchronization
- **Instant Notifications**: Immediate alert delivery for status changes
- **Collaborative Updates**: Multi-user real-time collaboration
- **Automatic Refresh**: Periodic data refresh without page reload
- **Conflict Resolution**: Multi-user editing conflict management

### Performance Optimizations
- **Efficient Filtering**: Optimized search and filter algorithms
- **Lazy Loading**: Progressive loading of activity data
- **Caching**: Intelligent caching of frequently accessed data
- **Responsive Updates**: Minimal UI updates for better performance

## Sample Data & Population

### Database Population
The system includes comprehensive data population scripts:
```bash
# Populate activities with sample data
python manage.py populate_activities

# Populate all system data
python manage.py populate_all
```

### Sample Activities
The page includes comprehensive sample data featuring:
- **Diverse Activity Types**: All 10 manufacturing activity categories
- **Various Statuses**: Complete lifecycle representation
- **Priority Levels**: All priority levels with realistic examples
- **Time Estimates**: Realistic scheduling and duration data
- **User Assignments**: Multiple user assignments and roles
- **Equipment Associations**: Equipment and location details
- **Comprehensive Tags**: Purpose-driven tagging system
- **Checklists**: Detailed activity checklists and validation

## Styling & UX

### Enhanced Visual Design
- **Type Color Coding**: Distinct colors for each activity type
- **Status Indicators**: Clear visual status representation with color coding
- **Priority Badges**: Urgent, high, medium, low priority markers
- **Progress Bars**: Visual completion progress indicators
- **Timeline Graphics**: Activity scheduling visualization
- **Tag System**: Color-coded tags with purpose descriptions
- **Responsive Layout**: Mobile-first design for field workers

### User Experience Improvements
- **Responsive Design**: Optimal viewing on all devices
- **Interactive Elements**: Hover effects and click feedback
- **Real-time Updates**: Live activity status synchronization
- **Mobile Optimization**: Touch-friendly interface for field workers
- **Accessibility**: ARIA labels and keyboard navigation
- **Smart Filtering**: Context-aware filter suggestions
- **Quick Actions**: One-click status updates and assignments

## Integration Points

### Enterprise Systems
- **CMMS Integration**: Computerized Maintenance Management System
- **ERP Systems**: Enterprise resource planning connectivity
- **WMS Integration**: Warehouse management system
- **SCADA Systems**: Supervisory control and data acquisition
- **Quality Systems**: Quality management system integration
- **JWT Authentication**: Secure API access with token management

### Notification Systems
- **Email Notifications**: Activity assignments and updates
- **SMS Alerts**: Urgent activity notifications
- **Push Notifications**: Mobile app notifications
- **Dashboard Alerts**: In-app notification system
- **Escalation Procedures**: Automated escalation workflows
- **WebSocket Notifications**: Real-time status updates

## Reporting & Analytics

### Standard Reports
- **Activity Completion Reports**: Performance summaries with filtering
- **Resource Utilization**: Personnel and equipment usage analytics
- **Compliance Reports**: Regulatory compliance tracking
- **Efficiency Analysis**: Time and resource efficiency metrics
- **Trend Analysis**: Historical performance trends
- **Tag-based Analytics**: Category and purpose-based reporting

### Custom Analytics
- **Predictive Analytics**: Activity duration predictions
- **Bottleneck Analysis**: Process efficiency optimization
- **Resource Optimization**: Optimal resource allocation
- **Performance Benchmarking**: Industry comparisons
- **Cost Analysis**: Activity cost tracking and optimization
- **Real-time Dashboards**: Live performance monitoring

## Security & Compliance

### Enhanced Access Control
- **JWT Authentication**: Secure token-based authentication
- **Role-based Permissions**: Activity visibility and editing rights
- **Field-level Security**: Sensitive information protection
- **Audit Trails**: Complete activity change logging
- **Data Encryption**: Secure data transmission and storage
- **Session Management**: Secure user session handling
- **API Security**: Protected API endpoints with authentication

### Compliance Features
- **Regulatory Tracking**: Industry regulation compliance
- **Documentation Requirements**: Mandatory documentation enforcement
- **Approval Workflows**: Multi-level activity approval
- **Signature Capture**: Digital signature collection
- **Certification Tracking**: Personnel certification validation
- **Data Retention**: Configurable data retention policies

## Future Enhancements

### Advanced Features
- **AI Activity Scheduling**: Machine learning optimization
- **Predictive Maintenance**: IoT sensor integration
- **Augmented Reality**: AR-guided activity execution
- **Voice Commands**: Voice-activated activity updates
- **Advanced Analytics**: Machine learning insights
- **Workflow Automation**: Automated activity creation and assignment
- **Mobile App**: Native mobile application for field workers

### Integration Enhancements
- **IoT Integration**: Sensor data integration for predictive activities
- **Blockchain**: Immutable activity logging for compliance
- **AI Assistants**: Intelligent activity recommendations
- **Advanced Reporting**: Dynamic dashboard creation
- **API Ecosystem**: Third-party tool integration
- **Cloud Integration**: Multi-cloud deployment support

## Related Files

### Frontend Components
- `frontend/src/pages/Activities.tsx` - Main page component
- `frontend/src/components/activities/ActivitiesContext.tsx` - Enhanced state management
- `frontend/src/components/activities/ActivitiesLeftCardSimple.tsx` - Advanced activity list with filtering
- `frontend/src/components/activities/ActivitiesRightCard.tsx` - Comprehensive activity details
- `frontend/src/components/activities/CreateActivityModal.tsx` - Activity creation interface
- `frontend/src/components/activities/index.ts` - Module exports

### Backend Implementation
- `backend/api/models.py` - Enhanced Activity model with relationships
- `backend/api/views.py` - Activity API endpoints with JWT authentication
- `backend/api/serializers.py` - Activity data serialization
- `backend/api/middleware.py` - JWT authentication middleware
- `backend/api/management/commands/populate_activities.py` - Sample data population

### API Endpoints
- `GET /api/activities/` - List all activities with filtering
- `POST /api/activities/` - Create new activity
- `GET /api/activities/{id}/` - Get activity details
- `PUT /api/activities/{id}/` - Update activity
- `DELETE /api/activities/{id}/` - Delete activity
- `GET /api/activities/types/` - Get activity type definitions
- `GET /api/activities/statuses/` - Get status definitions

## Technical Notes

### Performance Optimizations
- **Database Indexing**: Optimized queries with proper database indexes
- **Caching Strategy**: Redis-based caching for frequently accessed data
- **Lazy Loading**: Progressive loading of activity data
- **Efficient Filtering**: Optimized search and filter algorithms
- **Real-time Updates**: WebSocket-based live updates

### Scalability Features
- **Database Optimization**: Efficient database queries and relationships
- **API Performance**: Optimized API endpoints with pagination
- **Frontend Optimization**: Code splitting and lazy loading
- **Mobile Support**: Responsive design for all device types
- **Offline Capability**: Limited offline functionality for field workers

### Security Implementation
- **JWT Authentication**: Secure token-based authentication system
- **API Protection**: Protected endpoints with role-based access control
- **Data Validation**: Comprehensive input validation and sanitization
- **Audit Logging**: Complete activity change tracking
- **Session Security**: Secure session management and timeout

---

**This enhanced Activities Page documentation reflects the current implementation with JWT authentication, comprehensive filtering, real-time updates, and advanced manufacturing activity management capabilities.**
