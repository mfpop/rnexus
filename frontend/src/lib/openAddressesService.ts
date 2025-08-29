/**
 * OpenAddresses Service
 * Handles ZIP code lookups and address validation using OpenAddresses API
 */

export interface OpenAddressesResult {
  features: Array<{
    properties: {
      housenumber?: string;
      street?: string;
      city?: string;
      state?: string;
      postcode?: string;
      country?: string;
    };
    geometry: {
      coordinates: [number, number];
    };
  }>;
}

export interface AddressSuggestion {
  display: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
  coordinates?: [number, number];
}

export class OpenAddressesService {
  private static readonly SEARCH_URL = 'https://nominatim.openstreetmap.org';

  /**
   * Search for addresses and ZIP codes by city and state
   */
  static async searchAddresses(
    city: string,
    state: string,
    country: string = 'US'
  ): Promise<AddressSuggestion[]> {
    try {
      // Use OpenStreetMap Nominatim API as a fallback
      const searchUrl = `${this.SEARCH_URL}/search?q=${encodeURIComponent(`${city}, ${state}, ${country}`)}&format=json&limit=10&addressdetails=1`;

      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`Search API failed: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        return data
          .filter((item: any) => item.address?.postcode)
          .map((item: any) => ({
            display: `${item.address?.city || city}, ${item.address?.state || state} ${item.address?.postcode}`,
            postcode: item.address.postcode,
            city: item.address?.city || city,
            state: item.address?.state || state,
            country: item.address?.country || country,
            coordinates: item.lat && item.lon ? [parseFloat(item.lon), parseFloat(item.lat)] as [number, number] : undefined
          }))
          .slice(0, 10); // Limit to 10 results
      }

      return [];
    } catch (error) {
      console.error('OpenStreetMap search failed:', error);
      return [];
    }
  }

  /**
   * Get ZIP codes for a specific city and state
   */
  static async getZipCodes(
    city: string,
    state: string,
    country: string = 'US'
  ): Promise<string[]> {
    try {
      const addresses = await this.searchAddresses(city, state, country);
      const zipCodes = addresses
        .map(addr => addr.postcode)
        .filter((zip, index, arr) => arr.indexOf(zip) === index); // Remove duplicates

      return zipCodes;
    } catch (error) {
      console.error('Failed to get ZIP codes:', error);
      return [];
    }
  }

  /**
   * Validate a ZIP code for a city and state
   */
  static async validateZipCode(
    zipCode: string,
    city: string,
    state: string,
    country: string = 'US'
  ): Promise<boolean> {
    try {
      const validZipCodes = await this.getZipCodes(city, state, country);
      return validZipCodes.includes(zipCode);
    } catch (error) {
      console.error('ZIP code validation failed:', error);
      return false;
    }
  }

  /**
   * Get address suggestions for autocomplete
   */
  static async getAddressSuggestions(
    query: string,
    limit: number = 5
  ): Promise<AddressSuggestion[]> {
    try {
      const searchUrl = `${this.SEARCH_URL}/search?q=${encodeURIComponent(query)}&format=json&limit=${limit}&addressdetails=1`;

      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`Search API failed: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        return data
          .filter((item: any) => item.address?.postcode)
          .map((item: any) => ({
            display: `${item.address?.street || ''} ${item.address?.city || ''}, ${item.address?.state || ''} ${item.address?.postcode || ''}`.trim(),
            postcode: item.address.postcode,
            city: item.address?.city || '',
            state: item.address?.state || '',
            country: item.address?.country || '',
            coordinates: item.lat && item.lon ? [parseFloat(item.lon), parseFloat(item.lat)] as [number, number] : undefined
          }));
      }

      return [];
    } catch (error) {
      console.error('Address suggestions failed:', error);
      return [];
    }
  }

  /**
   * Fallback ZIP code data for common cities
   */
  static getFallbackZipCodes(city: string, state: string): string[] {
    const fallbackData: Record<string, Record<string, string[]>> = {
      'California': {
        'Los Angeles': ['90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90010', '90011'],
        'San Francisco': ['94102', '94103', '94104', '94105', '94107', '94108', '94109', '94110', '94111', '94112'],
        'San Diego': ['92101', '92102', '92103', '92104', '92105', '92106', '92107', '92108', '92109', '92110'],
        'Sacramento': ['95811', '95814', '95815', '95816', '95817', '95818', '95819', '95820', '95821', '95822'],
        'Fresno': ['93701', '93702', '93703', '93704', '93705', '93706', '93707', '93708', '93709', '93710']
      },
      'New York': {
        'New York City': ['10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008', '10009', '10010'],
        'Buffalo': ['14201', '14202', '14203', '14204', '14205', '14206', '14207', '14208', '14209', '14210'],
        'Rochester': ['14602', '14603', '14604', '14605', '14606', '14607', '14608', '14609', '14610', '14611']
      },
      'Texas': {
        'Houston': ['77001', '77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009', '77010'],
        'Dallas': ['75201', '75202', '75203', '75204', '75205', '75206', '75207', '75208', '75209', '75210'],
        'Austin': ['73301', '73344', '73347', '73355', '73356', '73357', '73358', '73359', '73360', '73361']
      },
      'Florida': {
        'Miami': ['33101', '33102', '33103', '33104', '33105', '33106', '33107', '33108', '33109', '33110'],
        'Orlando': ['32801', '32802', '32803', '32804', '32805', '32806', '32807', '32808', '32809', '32810'],
        'Tampa': ['33601', '33602', '33603', '33604', '33605', '33606', '33607', '33608', '33609', '33610']
      }
    };

    return fallbackData[state]?.[city] || [];
  }
}

export default OpenAddressesService;
