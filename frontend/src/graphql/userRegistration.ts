// GraphQL mutations and queries for user registration
import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $avatar: String
  ) {
    registerUser(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      avatar: $avatar
    ) {
      ok
      user {
        id
        email
        firstName
        lastName
        isActive
      }
      userProfile {
        id
        avatar
        avatarUrl
      }
      errors
    }
  }
`;
