# 🏭 Organizational Hierarchy Implementation

## Overview

This document describes the implementation of a comprehensive organizational hierarchy system for Nexus LMD using GraphQL. The system supports a 4-level organizational structure typical of lean manufacturing plants.

## 🗄️ Database Structure

### Core Models

#### 1. Department Model
```python
class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
```

**Purpose**: Represents organizational departments (Production, Quality, Maintenance, etc.)

#### 2. Role Model
```python
class Role(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    reports_to = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
```

**Purpose**: Defines positions within departments with hierarchical reporting relationships

#### 3. Employee Model
```python
class Employee(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
```

**Purpose**: Links individuals to organizational roles and optionally to Django user accounts

## 🏗️ Organizational Hierarchy Levels

### Level 0: Plant Management
- **Plant Manager**: Oversees all plant operations and departments
- **Location**: Production department (but manages all departments)

### Level 1: Department Managers
- **Production Manager**: Manufacturing operations and production planning
- **Quality Manager**: Quality control and compliance processes
- **Maintenance Manager**: Equipment maintenance and facility operations
- **Logistics Manager**: Material flow and supply chain operations
- **CI Manager**: Lean initiatives and process optimization
- **HR Manager**: Human resources and organizational development
- **Safety Manager**: Workplace safety and environmental compliance
- **Engineering Manager**: Process engineering and technical support
- **IT Manager**: IT systems and digital transformation

### Level 2: Supervisors
- **Production Supervisor**: Production line operations and team leaders
- **Quality Supervisor**: Quality control technicians and inspectors
- **Maintenance Supervisor**: Maintenance technicians and equipment repairs
- **Warehouse Supervisor**: Warehouse operations and material handling

### Level 3: Individual Contributors
- **Machine Operator**: Manufacturing equipment and assembly lines
- **Quality Technician**: Quality inspections and testing
- **Maintenance Technician**: Equipment maintenance and repairs
- **Warehouse Clerk**: Inventory and material transactions
- **Process Engineer**: Process design and optimization
- **HR Generalist**: Employee relations and HR processes
- **Safety Officer**: Workplace safety and inspections
- **System Administrator**: IT infrastructure and user support

## 🔗 Relationships

### Department → Role
- One department can have multiple roles
- Each role belongs to exactly one department

### Role → Role (Self-Referential)
- `reports_to`: Points to the role this position reports to
- `subordinates`: Reverse relationship showing roles that report to this position

### Role → Employee
- One role can have multiple employees
- Each employee has exactly one role

### Employee → User (Optional)
- Employees can be linked to Django user accounts
- Allows integration with authentication and profile systems

## 🎯 GraphQL Implementation

### Schema Types

#### DepartmentType
```graphql
type Department {
  id: ID!
  name: String!
  description: String
}
```

#### RoleType
```graphql
type Role {
  id: ID!
  title: String!
  description: String
  department: Department!
  reportsTo: Role
  subordinates: [Role!]!
}
```

#### EmployeeType
```graphql
type Employee {
  id: ID!
  name: String!
  email: String!
  role: Role!
  user: User
}
```

### Available Queries

#### Basic Queries
- `allDepartments`: Get all departments
- `allRoles`: Get all roles with department information
- `allEmployees`: Get all employees with role and department details

#### Filtered Queries
- `rolesByDepartment(departmentId: ID!)`: Get roles for a specific department
- `employeesByRole(roleId: ID!)`: Get employees for a specific role

#### Hierarchical Queries
- `organizationalHierarchy`: Get complete organizational structure starting from top-level roles

#### Detail Queries
- `department(id: ID!)`: Get specific department with all roles
- `role(id: ID!)`: Get specific role with full context
- `employee(id: ID!)`: Get specific employee details

## 🚀 Usage Examples

### 1. Get Complete Organizational Structure
```graphql
query GetOrganizationalHierarchy {
  organizationalHierarchy {
    id
    title
    department {
      name
    }
    subordinates {
      id
      title
      department {
        name
      }
      subordinates {
        id
        title
        subordinates {
          id
          title
        }
      }
    }
  }
}
```

### 2. Get Roles by Department
```graphql
query GetRolesByDepartment($departmentId: ID!) {
  rolesByDepartment(departmentId: $departmentId) {
    id
    title
    description
    reportsTo {
      title
    }
    subordinates {
      id
      title
    }
  }
}
```

### 3. Get Employee Details
```graphql
query GetEmployeeDetails($id: ID!) {
  employee(id: $id) {
    name
    email
    role {
      title
      department {
        name
      }
      reportsTo {
        title
      }
    }
  }
}
```

## 🛠️ Admin Interface

### Department Admin
- **List Display**: Name, Description, Role Count
- **Search**: By name and description
- **Ordering**: Alphabetical by name

### Role Admin
- **List Display**: Title, Department, Reports To, Employee Count, Hierarchy Level
- **Filters**: By department and reporting structure
- **Autocomplete**: Department and reporting relationships
- **Ordering**: By department then title

### Employee Admin
- **List Display**: Name, Email, Role, Department, Supervisor, User Account Link
- **Filters**: By department and role
- **Autocomplete**: Role and user selection
- **Ordering**: Alphabetical by name

## 📊 Sample Data

The system includes a comprehensive sample data population script that creates:

- **9 Departments**: Covering all major manufacturing functions
- **22 Roles**: Complete organizational hierarchy
- **10 Sample Employees**: Key management positions

### Running Sample Data Population
```bash
cd backend
source .venv/bin/activate
python populate_organizational_structure.py
```

## 🔧 Technical Features

### 1. Hierarchy Management
- **Automatic Level Calculation**: `get_hierarchy_level()` method
- **Reporting Relationships**: Self-referential foreign keys
- **Subordinate Tracking**: Reverse relationship queries

### 2. Data Integrity
- **Unique Constraints**: Department names, employee emails
- **Referential Integrity**: Proper foreign key relationships
- **Cascade Deletion**: Maintains data consistency

### 3. Performance Optimization
- **Database Indexing**: On frequently queried fields
- **Efficient Queries**: Optimized GraphQL resolvers
- **Lazy Loading**: Related fields loaded on demand

## 🎨 Frontend Integration

### Test Component
A comprehensive test component (`OrganizationalStructureTest.tsx`) demonstrates:

- **Tabbed Interface**: Departments, Roles, Employees, Hierarchy
- **Data Visualization**: Clean, organized display of organizational structure
- **GraphQL Integration**: Real-time data fetching and display
- **Responsive Design**: Works on all device sizes

### GraphQL Client Setup
```typescript
import { useQuery } from '@apollo/client';
import { GET_ORGANIZATIONAL_HIERARCHY } from '../graphql/organizationalStructure';

const { data, loading, error } = useQuery(GET_ORGANIZATIONAL_HIERARCHY);
```

## 🚀 Future Enhancements

### 1. Role-Based Access Control
- **Permission System**: Based on organizational hierarchy
- **Access Control**: Limit data visibility by role level
- **Audit Logging**: Track organizational changes

### 2. Advanced Analytics
- **Span of Control**: Analyze management ratios
- **Succession Planning**: Identify key positions and successors
- **Performance Metrics**: Link organizational structure to KPIs

### 3. Integration Features
- **HR System Integration**: Sync with external HR platforms
- **Workflow Automation**: Approvals based on organizational structure
- **Notification System**: Alerts based on reporting relationships

## 📝 Migration Notes

### Database Changes
- **New Tables**: `departments`, `roles`, `employees`
- **Modified Tables**: `items` (added timestamps)
- **Relationships**: Foreign key constraints and indexes

### Backward Compatibility
- **Existing Data**: Preserved and enhanced
- **API Changes**: No breaking changes to existing endpoints
- **User Experience**: Enhanced with new organizational features

## 🎯 Benefits

### 1. **Organizational Clarity**
- Clear reporting relationships
- Visual hierarchy representation
- Department and role definitions

### 2. **Data Consistency**
- Centralized organizational data
- Referential integrity
- Standardized role definitions

### 3. **Flexibility**
- Easy role modifications
- Scalable structure
- GraphQL query flexibility

### 4. **Integration Ready**
- Django admin interface
- GraphQL API
- User account linking

## 🔍 Troubleshooting

### Common Issues

#### 1. Migration Errors
```bash
# If you encounter migration issues:
python manage.py makemigrations --empty api
python manage.py migrate
```

#### 2. GraphQL Schema Issues
```bash
# Regenerate GraphQL schema:
python manage.py graphql_schema --schema api.schema.schema --out schema.graphql
```

#### 3. Sample Data Population
```bash
# Ensure virtual environment is activated:
source .venv/bin/activate
python populate_organizational_structure.py
```

## 📚 Additional Resources

- **Django Models**: `backend/api/models.py`
- **GraphQL Schema**: `backend/api/schema.py`
- **Admin Interface**: `backend/api/admin.py`
- **Sample Data**: `backend/populate_organizational_structure.py`
- **Frontend Test**: `frontend/src/components/test/OrganizationalStructureTest.tsx`
- **GraphQL Queries**: `frontend/src/graphql/organizationalStructure.ts`

---

**Implementation Date**: August 2024
**Version**: 1.0.0
**Status**: ✅ Complete and Tested
