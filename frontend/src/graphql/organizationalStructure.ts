import { gql } from "@apollo/client";

// Query to get all departments
export const GET_ALL_DEPARTMENTS = gql`
  query GetAllDepartments {
    allDepartments {
      id
      name
      description
    }
  }
`;

// Query to get all roles with department information
export const GET_ALL_ROLES = gql`
  query GetAllRoles {
    allRoles {
      id
      title
      description
      department {
        id
        name
        description
      }
      reportsTo {
        id
        title
        department {
          name
        }
      }
      subordinates {
        id
        title
        department {
          name
        }
      }
    }
  }
`;

// Query to get roles by department
export const GET_ROLES_BY_DEPARTMENT = gql`
  query GetRolesByDepartment($departmentId: ID!) {
    rolesByDepartment(departmentId: $departmentId) {
      id
      title
      description
      reportsTo {
        id
        title
        department {
          name
        }
      }
      subordinates {
        id
        title
      }
    }
  }
`;

// Query to get all employees with role and department information
export const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees {
    allEmployees {
      id
      name
      email
      role {
        id
        title
        description
        department {
          id
          name
          description
        }
        reportsTo {
          id
          title
          department {
            name
          }
        }
      }
      user {
        id
        username
        email
        firstName
        lastName
      }
    }
  }
`;

// Query to get employees by role
export const GET_EMPLOYEES_BY_ROLE = gql`
  query GetEmployeesByRole($roleId: ID!) {
    employeesByRole(roleId: $roleId) {
      id
      name
      email
      role {
        id
        title
        department {
          name
        }
      }
    }
  }
`;

// Query to get the complete organizational hierarchy
export const GET_ORGANIZATIONAL_HIERARCHY = gql`
  query GetOrganizationalHierarchy {
    organizationalHierarchy {
      id
      title
      description
      department {
        id
        name
        description
      }
      subordinates {
        id
        title
        description
        department {
          id
          name
        }
        subordinates {
          id
          title
          description
          department {
            id
            name
          }
          subordinates {
            id
            title
            description
            department {
              id
              name
            }
          }
        }
      }
    }
  }
`;

// Query to get a specific department with all its roles
export const GET_DEPARTMENT_DETAILS = gql`
  query GetDepartmentDetails($id: ID!) {
    department(id: $id) {
      id
      name
      description
      roles {
        id
        title
        description
        reportsTo {
          id
          title
        }
        subordinates {
          id
          title
        }
        employees {
          id
          name
          email
        }
      }
    }
  }
`;

// Query to get a specific role with full context
export const GET_ROLE_DETAILS = gql`
  query GetRoleDetails($id: ID!) {
    role(id: $id) {
      id
      title
      description
      department {
        id
        name
        description
      }
      reportsTo {
        id
        title
        description
        department {
          name
        }
      }
      subordinates {
        id
        title
        description
        department {
          name
        }
        employees {
          id
          name
          email
        }
      }
      employees {
        id
        name
        email
        user {
          id
          username
          email
        }
      }
    }
  }
`;
