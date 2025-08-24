import { gql } from '@apollo/client';

// Query to get user profile data
export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    userProfile {
      id
      user {
        id
        email
        first_name
        last_name
        is_active
      }
      middle_name
      maternal_last_name
      preferred_name
      position
      department
      phone
      phone_country_code
      phone_type
      secondary_phone
      street_address
      apartment_suite
      city
      state_province
      zip_code
      country
      bio
      education
      work_history
      profile_visibility
      created_at
      updated_at
    }
  }
`;

// Mutation to update user profile
export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile(
    $email: String
    $first_name: String
    $last_name: String
    $middle_name: String
    $maternal_last_name: String
    $preferred_name: String
    $position: String
    $department: String
    $phone: String
    $phone_country_code: String
    $phone_type: String
    $secondary_phone: String
    $street_address: String
    $apartment_suite: String
    $city: String
    $state_province: String
    $zip_code: String
    $country: String
    $bio: String
    $education: String
    $work_history: String
    $profile_visibility: String
    $is_active: Boolean
  ) {
    updateUserProfile(
      email: $email
      firstName: $first_name
      lastName: $last_name
      middleName: $middle_name
      maternalLastName: $maternal_last_name
      preferredName: $preferred_name
      position: $position
      department: $department
      phone: $phone
      phoneCountryCode: $phone_country_code
      phoneType: $phone_type
      secondaryPhone: $secondary_phone
      streetAddress: $street_address
      apartmentSuite: $apartment_suite
      city: $city
      stateProvince: $state_province
      zipCode: $zip_code
      country: $country
      bio: $bio
      education: $education
      workHistory: $work_history
      profileVisibility: $profile_visibility
      isActive: $is_active
    ) {
      ok
      userProfile {
        id
        user {
          id
          email
          first_name
          last_name
          is_active
        }
        middle_name
        maternal_last_name
        preferred_name
        position
        department
        phone
        phone_country_code
        phone_type
        secondary_phone
        street_address
        apartment_suite
        city
        state_province
        zip_code
        country
        bio
        education
        work_history
        profile_visibility
        created_at
        updated_at
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

// Types for TypeScript
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

export interface UserProfile {
  id: string;
  user: User;
  middle_name?: string;
  maternal_last_name?: string;
  preferred_name?: string;
  position?: string;
  department?: string;
  phone?: string;
  phone_country_code?: string;
  phone_type?: string;
  secondary_phone?: string;
  street_address?: string;
  apartment_suite?: string;
  city?: string;
  state_province?: string;
  zip_code?: string;
  country?: string;
  bio?: string;
  education?: any;
  work_history?: any;
  profile_visibility?: any;
  created_at: string;
  updated_at: string;
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
