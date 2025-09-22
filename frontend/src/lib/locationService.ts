import { gql } from '@apollo/client';

// GraphQL queries for location data
export const GET_COUNTRIES = gql`
  query GetCountries {
    allCountries {
      id
      name
      code
    }
  }
`;

export const GET_STATES = gql`
  query GetStates($countryCode: String) {
    allStates(countryCode: $countryCode) {
      id
      name
      code
      country {
        code
      }
    }
  }
`;

export const GET_CITIES = gql`
  query GetCities($stateName: String, $countryCode: String) {
    allCities(stateName: $stateName, countryCode: $countryCode) {
      id
      name
      state {
        id
        name
        code
      }
      country {
        code
      }
    }
  }
`;

export const GET_ZIPCODES = gql`
  query GetZipCodes($cityName: String, $stateName: String) {
    allZipcodes(cityName: $cityName, stateName: $stateName) {
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
      }
      country {
        code
      }
    }
  }
`;

// Types for location data
export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface State {
  id: string;
  name: string;
  code: string;
  country: {
    code: string;
  };
}

export interface City {
  id: string;
  name: string;
  state: {
    id: string;
    name: string;
    code: string;
  };
  country: {
    code: string;
  };
}

export interface ZipCode {
  id: string;
  code: string;
  city: {
    id: string;
    name: string;
  };
  state: {
    id: string;
    name: string;
    code: string;
  };
  country: {
    code: string;
  };
}

// Location data service class
export class LocationService {
  private countries: Country[] = [];

  // Cache for storing loaded data
  private countryCache = new Map<string, Country[]>();
  private stateCache = new Map<string, State[]>();
  private cityCache = new Map<string, City[]>();
  private zipcodeCache = new Map<string, ZipCode[]>();

  // Get countries
  async getCountries(client: any): Promise<Country[]> {
    if (this.countries.length > 0) {
      return this.countries;
    }

    try {
      const result = await client.query({
        query: GET_COUNTRIES,
        fetchPolicy: 'cache-first'
      });

      this.countries = result.data?.allCountries || [];
      return this.countries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  }

  // Get states by country code
  async getStates(client: any, countryCode?: string): Promise<State[]> {
    const cacheKey = countryCode || 'all';

    if (this.stateCache.has(cacheKey)) {
      return this.stateCache.get(cacheKey)!;
    }

    try {
      const result = await client.query({
        query: GET_STATES,
        variables: { countryCode },
        fetchPolicy: 'cache-first'
      });

      const states = result.data?.allStates || [];
      this.stateCache.set(cacheKey, states);
      return states;
    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
    }
  }

  // Get cities by state ID or country code
  async getCities(client: any, stateId?: string, countryCode?: string): Promise<City[]> {
    const cacheKey = `${stateId || 'none'}-${countryCode || 'none'}`;

    if (this.cityCache.has(cacheKey)) {
      return this.cityCache.get(cacheKey)!;
    }

    try {
      const result = await client.query({
        query: GET_CITIES,
        variables: { stateId, countryCode },
        fetchPolicy: 'cache-first'
      });

      const cities = result.data?.allCities || [];
      this.cityCache.set(cacheKey, cities);
      return cities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  }

  // Get zipcodes by city ID or state ID
  async getZipCodes(client: any, cityId?: string, stateId?: string): Promise<ZipCode[]> {
    const cacheKey = `${cityId || 'none'}-${stateId || 'none'}`;

    if (this.zipcodeCache.has(cacheKey)) {
      return this.zipcodeCache.get(cacheKey)!;
    }

    try {
      const result = await client.query({
        query: GET_ZIPCODES,
        variables: { cityId, stateId },
        fetchPolicy: 'cache-first'
      });

      const zipcodes = result.data?.allZipcodes || [];
      this.zipcodeCache.set(cacheKey, zipcodes);
      return zipcodes;
    } catch (error) {
      console.error('Error fetching zipcodes:', error);
      return [];
    }
  }

  // Clear caches when needed
  clearCache() {
    this.countryCache.clear();
    this.stateCache.clear();
    this.cityCache.clear();
    this.zipcodeCache.clear();
  }
}

// Export a singleton instance
export const locationService = new LocationService();
