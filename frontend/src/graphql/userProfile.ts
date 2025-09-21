import { gql } from "@apollo/client";

// Query to get user profile data
export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    userProfile {
      id
      user {
        id
        username
        email
        firstName
        lastName
        isActive
        dateJoined
        lastLogin
      }
      # Enhanced name fields
      middleName
      lastnamem
      preferredName
      fatherName

      # Personal information
      birthname
      gender
      maritalStatus
      identityMark
      medicalFitness
      characterCertificate
      height

      # Professional information
      position
      department
      company
      employmentStatus
      employmentType
      startDate
      salary
      currency
      workLocation
      manager
      employeeId
      workEmail
      workPhone
      workPhoneType
      workAddress
      workCity
      workState
      workZipCode
      workCountry
      workCountryCode
      workSchedule
      workHours
      workDays
      workTimeZone
      workLanguage
      workLanguageLevel
      workSkills
      workCertifications
      workAwards
      workNotes

      # Phone information
      phonecc1
      phone1
      phonet1
      phonecc2
      phone2
      phonet2

      # Address information
      streetAddress
      apartmentSuite
      city
      stateProvince
      zipCode
      country
      countryCode

      # Biography and social media
      bio
      shortBio
      website
      linkedin
      twitter
      github
      facebook
      instagram

      # Extended data
      education
      workHistory
      profileVisibility
      avatar
      avatarUrl
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
    $lastnamem: String
    $preferredName: String
    $position: String
    $department: String
    $phonecc1: String
    $phone1: String
    $phonet1: String
    $phonecc2: String
    $phone2: String
    $phonet2: String
    $streetAddress: String
    $apartmentSuite: String
    $city: String
    $stateProvince: String
    $zipCode: String
    $country: String
    $countryCode: String
    $bio: String
    $shortBio: String
    $website: String
    $linkedin: String
    $twitter: String
    $github: String
    $facebook: String
    $instagram: String
    $education: String
    $workHistory: String
    $profileVisibility: String
    $isActive: Boolean
    $birthname: Date
    $gender: String
    $maritalStatus: String
    $identityMark: String
    $medicalFitness: Boolean
    $characterCertificate: Boolean
    $height: Float
  ) {
    updateUserProfile(
      email: $email
      firstName: $firstName
      lastName: $lastName
      middleName: $middleName
      lastnamem: $lastnamem
      preferredName: $preferredName
      position: $position
      department: $department
      phonecc1: $phonecc1
      phone1: $phone1
      phonet1: $phonet1
      phonecc2: $phonecc2
      phone2: $phone2
      phonet2: $phonet2
      streetAddress: $streetAddress
      apartmentSuite: $apartmentSuite
      city: $city
      stateProvince: $stateProvince
      zipCode: $zipCode
      country: $country
      countryCode: $countryCode
      bio: $bio
      shortBio: $shortBio
      website: $website
      linkedin: $linkedin
      twitter: $twitter
      github: $github
      facebook: $facebook
      instagram: $instagram
      education: $education
      workHistory: $workHistory
      profileVisibility: $profileVisibility
      isActive: $isActive
      birthname: $birthname
      gender: $gender
      maritalStatus: $maritalStatus
      identityMark: $identityMark
      medicalFitness: $medicalFitness
      characterCertificate: $characterCertificate
      height: $height
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
        lastnamem
        preferredName
        position
        department
        phonecc1
        phone1
        phonet1
        phonecc2
        phone2
        phonet2
        streetAddress
        apartmentSuite
        city
        stateProvince
        zipCode
        country
        bio
        shortBio
        website
        linkedin
        twitter
        github
        facebook
        instagram
        education
        workHistory
        profileVisibility
        avatar
        avatarUrl
      }
      errors
    }
  }
`;

// Mutation to change password
export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
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
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  dateJoined: string;
  lastLogin?: string;
}

export interface UserProfile {
  id: string;
  user: User;
  // Enhanced name fields
  middleName?: string;
  lastnamem?: string;
  preferredName?: string;
  fatherName?: string;

  // Personal information
  birthname?: string;
  gender?: string;
  maritalStatus?: string;
  identityMark?: string;
  medicalFitness?: boolean;
  characterCertificate?: boolean;
  height?: number;

  // Professional information
  position?: string;
  department?: string;
  company?: string;
  employmentStatus?: string;
  employmentType?: string;
  startDate?: string;
  salary?: number;
  currency?: string;
  workLocation?: string;
  manager?: string;
  employeeId?: string;
  workEmail?: string;
  workPhone?: string;
  workPhoneType?: string;
  workAddress?: string;
  workCity?: string;
  workState?: string;
  workZipCode?: string;
  workCountry?: string;
  workCountryCode?: string;
  workSchedule?: string;
  workHours?: string;
  workDays?: string;
  workTimeZone?: string;
  workLanguage?: string;
  workLanguageLevel?: string;
  workSkills?: string;
  workCertifications?: string;
  workAwards?: string;
  workNotes?: string;

  // Phone information
  phonecc1?: string;
  phone1?: string;
  phonet1?: string;
  phonecc2?: string;
  phone2?: string;
  phonet2?: string;

  // Address information
  streetAddress?: string;
  apartmentSuite?: string;
  city?: string;
  stateProvince?: string;
  zipCode?: string;
  country?: string;
  countryCode?: string;

  // Biography and social media
  bio?: string;
  shortBio?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  instagram?: string;

  // Extended data
  education?: any;
  workHistory?: any;
  profileVisibility?: any;
  avatar?: string;
  avatarUrl?: string;
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
  lastnamem?: string;
  preferredName?: string;
  position?: string;
  department?: string;
  phonecc1?: string;
  phone1?: string;
  phonet1?: string;
  phonecc2?: string;
  phone2?: string;
  phonet2?: string;
  streetAddress?: string;
  apartmentSuite?: string;
  city?: string;
  stateProvince?: string;
  zipCode?: string;
  country?: string;
  countryCode?: string;
  bio?: string;
  shortBio?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  education?: string;
  workHistory?: string;
  profileVisibility?: string;
  isActive?: boolean;
  birthname?: string;
  gender?: string;
  maritalStatus?: string;
  identityMark?: string;
  medicalFitness?: boolean;
  characterCertificate?: boolean;
  height?: number;
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
