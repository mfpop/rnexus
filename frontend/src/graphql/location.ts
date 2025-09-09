import { gql } from "@apollo/client";

// Query to get all countries
export const GET_ALL_COUNTRIES = gql`
  query GetAllCountries {
    allCountries {
      id
      name
      code
  phoneCode
      isActive
    }
  }
`;

// Query to get states by country
export const GET_STATES_BY_COUNTRY = gql`
  query GetStatesByCountry($countryCode: String!) {
    allStates(countryCode: $countryCode) {
      id
      name
      code
      country {
        id
        name
        code
      }
      isActive
    }
  }
`;

// Query to get cities by state (corrected back to stateId)
export const GET_CITIES_BY_STATE = gql`
  query GetCitiesByState($stateId: ID!) {
    allCities(stateId: $stateId) {
      id
      name
      state {
        id
        name
        code
        country {
          id
          name
          code
        }
      }
      isActive
    }
  }
`;

// Query to get zip codes by city (corrected back to cityId)
export const GET_ZIPCODES_BY_CITY = gql`
  query GetZipcodesByCity($cityId: ID!) {
    allZipcodes(cityId: $cityId) {
      id
      code
      city {
        id
        name
        state {
          id
          name
          code
          country {
            id
            name
            code
          }
        }
      }
      isActive
    }
  }
`;

// Query to get zip codes by state
export const GET_ZIPCODES_BY_STATE = gql`
  query GetZipcodesByState($stateCode: String!) {
    allZipcodes(stateCode: $stateCode) {
      id
      code
      city {
        id
        name
      }
      state {
        id
        name
        code
        country {
          id
          name
          code
        }
      }
      isActive
    }
  }
`;

// Query to search zip codes by code
export const SEARCH_ZIPCODES = gql`
  query SearchZipcodes($code: String!) {
    allZipcodes(code: $code) {
      id
      code
      city {
        id
        name
        state {
          id
          name
          code
          country {
            id
            name
            code
          }
        }
      }
      isActive
    }
  }
`;

// Types for the GraphQL responses
export interface Country {
  id: string;
  name: string;
  code: string;
  phoneCode: string;
  isActive: boolean;
}

export interface State {
  id: string;
  name: string;
  code: string;
  country: Country;
  isActive: boolean;
}

export interface City {
  id: string;
  name: string;
  state: State;
  isActive: boolean;
}

export interface ZipCode {
  id: string;
  code: string;
  city: City;
  isActive: boolean;
}

export interface GetAllCountriesData {
  allCountries: Country[];
}

export interface GetStatesByCountryData {
  allStates: State[];
}

export interface GetCitiesByStateData {
  allCities: City[];
}

export interface GetZipcodesByCityData {
  allZipcodes: ZipCode[];
}

export interface GetZipcodesByStateData {
  allZipcodes: ZipCode[];
}

export interface SearchZipcodesData {
  allZipcodes: ZipCode[];
}

export interface GetStatesByCountryVariables {
  countryCode: string;
}

export interface GetCitiesByStateVariables {
  stateId: string;
}

export interface GetZipcodesByCityVariables {
  cityId: string;
}

export interface GetZipcodesByStateVariables {
  stateCode: string;
}

export interface SearchZipcodesVariables {
  code: string;
}
