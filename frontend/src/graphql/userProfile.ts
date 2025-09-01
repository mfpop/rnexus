import { gql } from '@apollo/client';

// Query to get user profile data
export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    userProfile {
      id
      user {
        id
        email
        firstName
        lastName
        isActive
      }
      middleName
      maternalLastName
      preferredName
      position
      department
      phone
      phoneCountryCode
      phoneType
      secondaryPhone
      streetAddress
      apartmentSuite
      city
      stateProvince
      zipCode
      country
      bio
      education
      workHistory
      profileVisibility
      avatar
      avatarUrl
      createdAt
      updatedAt
    }
  }
`;

// Mutation to update user profile
export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile(
    $email: String
    $firstName: String
    $lastName: String
    $middleName: String
    $maternalLastName: String
    $preferredName: String
    $position: String
    $department: String
    $phone: String
    $phoneCountryCode: String
    $phoneType: String
    $secondaryPhone: String
    $secondaryPhoneType: String
    $streetAddress: String
    $apartmentSuite: String
    $city: String
    $stateProvince: String
    $zipCode: String
    $country: String
    $bio: String
    $education: String
    $workHistory: String
    $profileVisibility: String
    $isActive: Boolean
  ) {
    updateUserProfile(
      email: $email
      firstName: $firstName
      lastName: $lastName
      middleName: $middleName
      maternalLastName: $maternalLastName
      preferredName: $preferredName
      position: $position
      department: $department
      phone: $phone
      phoneCountryCode: $phoneCountryCode
      phoneType: $phoneType
      secondaryPhone: $secondaryPhone
      secondaryPhoneType: $secondaryPhoneType
      streetAddress: $streetAddress
      apartmentSuite: $apartmentSuite
      city: $city
      stateProvince: $stateProvince
      zipCode: $zipCode
      country: $country
      bio: $bio
      education: $education
      workHistory: $workHistory
      profileVisibility: $profileVisibility
      isActive: $isActive
    ) {
      ok
      userProfile {
        id
        user {
          id
          email
          firstName
          lastName
          isActive
        }
        middleName
        maternalLastName
        preferredName
        position
        department
        phone
        phoneCountryCode
        phoneType
        secondaryPhone
        secondaryPhoneType
        streetAddress
        apartmentSuite
        city
        stateProvince
        zipCode
        country
        bio
        education
        workHistory
        profileVisibility
        avatar
        avatarUrl
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

// Mutation to change password
export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      ok
      errors
    }
  }
`;

// Mutation to upload avatar
export const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($avatar: String!) {
    uploadAvatar(avatar: $avatar) {
      ok
      userProfile {
        id
        avatar
        avatarUrl
      }
      errors
    }
  }
`;

// Organizational structure queries
export const GET_DEPARTMENTS_FOR_PROFILE = gql`
  query GetDepartmentsForProfile {
    allDepartments {
      id
      name
      description
    }
  }
`;

export const GET_ROLES_FOR_PROFILE = gql`
  query GetRolesForProfile {
    allRoles {
      id
      title
      description
      department {
        id
        name
      }
    }
  }
`;

// Types for TypeScript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  user: User;
  middleName?: string;
  maternalLastName?: string;
  preferredName?: string;
  position?: string;
  department?: string;
  phone?: string;
  phoneCountryCode?: string;
  phoneType?: string;
  secondaryPhone?: string;
  streetAddress?: string;
  apartmentSuite?: string;
  city?: string;
  stateProvince?: string;
  zipCode?: string;
  country?: string;
  bio?: string;
  education?: any;
  workHistory?: any;
  profileVisibility?: any;
  avatar?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserProfileData {
  userProfile: UserProfile;
}

export interface UpdateUserProfileData {
  updateUserProfile: {
    ok: boolean;
    userProfile?: UserProfile;
    errors: string[];
  };
}

export interface UpdateUserProfileVariables {
  email?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  maternalLastName?: string;
  preferredName?: string;
  position?: string;
  department?: string;
  phone?: string;
  phoneCountryCode?: string;
  phoneType?: string;
  secondaryPhone?: string;
  streetAddress?: string;
  apartmentSuite?: string;
  city?: string;
  stateProvince?: string;
  zipCode?: string;
  country?: string;
  bio?: string;
  education?: string;
  workHistory?: string;
  profileVisibility?: string;
  isActive?: boolean;
}

// Organizational structure types
export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Role {
  id: string;
  title: string;
  description?: string;
  department: Department;
}

export interface GetDepartmentsForProfileData {
  allDepartments: Department[];
}

export interface GetRolesForProfileData {
  allRoles: Role[];
}

export interface ChangePasswordData {
  changePassword: {
    ok: boolean;
    errors: string[];
  };
}

export interface ChangePasswordVariables {
  currentPassword: string;
  newPassword: string;
}

export interface UploadAvatarData {
  uploadAvatar: {
    ok: boolean;
    userProfile?: {
      id: string;
      avatar?: string;
      avatarUrl?: string;
    };
    errors: string[];
  };
}

export interface UploadAvatarVariables {
  avatar: string;
}
