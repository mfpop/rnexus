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
  private static readonly SEARCH_URL = "https://nominatim.openstreetmap.org";

  /**
   * Search for addresses and ZIP codes by city and state
   */
  static async searchAddresses(
    city: string,
    state: string,
    country: string = "US",
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
            coordinates:
              item.lat && item.lon
                ? ([parseFloat(item.lon), parseFloat(item.lat)] as [
                    number,
                    number,
                  ])
                : undefined,
          }))
          .slice(0, 10); // Limit to 10 results
      }

      return [];
    } catch (error) {
      console.error("OpenStreetMap search failed:", error);
      return [];
    }
  }

  /**
   * Get ZIP codes for a specific city and state
   */
  static async getZipCodes(
    city: string,
    state: string,
    country: string = "US",
  ): Promise<string[]> {
    try {
      const addresses = await this.searchAddresses(city, state, country);
      const zipCodes = addresses
        .map((addr) => addr.postcode)
        .filter((zip, index, arr) => arr.indexOf(zip) === index); // Remove duplicates

      return zipCodes;
    } catch (error) {
      console.error("Failed to get ZIP codes:", error);
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
    country: string = "US",
  ): Promise<boolean> {
    try {
      const validZipCodes = await this.getZipCodes(city, state, country);
      return validZipCodes.includes(zipCode);
    } catch (error) {
      console.error("ZIP code validation failed:", error);
      return false;
    }
  }

  /**
   * Get address suggestions for autocomplete
   */
  static async getAddressSuggestions(
    query: string,
    limit: number = 5,
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
            display:
              `${item.address?.street || ""} ${item.address?.city || ""}, ${item.address?.state || ""} ${item.address?.postcode || ""}`.trim(),
            postcode: item.address.postcode,
            city: item.address?.city || "",
            state: item.address?.state || "",
            country: item.address?.country || "",
            coordinates:
              item.lat && item.lon
                ? ([parseFloat(item.lon), parseFloat(item.lat)] as [
                    number,
                    number,
                  ])
                : undefined,
          }));
      }

      return [];
    } catch (error) {
      console.error("Address suggestions failed:", error);
      return [];
    }
  }

  /**
   * Fallback ZIP code data for common cities
   */
  static getFallbackZipCodes(city: string, state: string): string[] {
    const fallbackData: Record<string, Record<string, string[]>> = {
      California: {
        "Los Angeles": [
          "90001", "90002", "90003", "90004", "90005", "90006", "90007", "90008", "90010", "90011",
          "90012", "90013", "90014", "90015", "90016", "90017", "90018", "90019", "90020", "90021",
          "90022", "90023", "90024", "90025", "90026", "90027", "90028", "90029", "90031", "90032",
          "90033", "90034", "90035", "90036", "90037", "90038", "90039", "90040", "90041", "90042",
          "90043", "90044", "90045", "90046", "90047", "90048", "90049", "90056", "90057", "90058",
          "90059", "90061", "90062", "90063", "90064", "90065", "90066", "90067", "90068", "90069",
          "90071", "90072", "90073", "90074", "90075", "90076", "90077", "90078", "90079", "90080",
          "90081", "90082", "90083", "90084", "90086", "90087", "90088", "90089", "90091", "90093",
          "90094", "90095", "90096", "90099", "90189", "90230", "90232", "90247", "90248", "90290",
          "90291", "90292", "90293", "90294", "90295", "90296", "90301", "90302", "90303", "90304"
        ],
        "San Francisco": [
          "94102", "94103", "94104", "94105", "94107", "94108", "94109", "94110", "94111", "94112",
          "94114", "94115", "94116", "94117", "94118", "94119", "94120", "94121", "94122", "94123",
          "94124", "94125", "94126", "94127", "94128", "94129", "94130", "94131", "94132", "94133",
          "94134", "94137", "94139", "94140", "94141", "94142", "94143", "94144", "94145", "94146",
          "94147", "94151", "94158", "94159", "94160", "94161", "94163", "94164", "94172", "94177",
          "94188", "94199"
        ],
        "San Diego": [
          "92101", "92102", "92103", "92104", "92105", "92106", "92107", "92108", "92109", "92110",
          "92111", "92112", "92113", "92114", "92115", "92116", "92117", "92118", "92119", "92120",
          "92121", "92122", "92123", "92124", "92126", "92127", "92128", "92129", "92130", "92131",
          "92132", "92134", "92135", "92136", "92137", "92138", "92139", "92140", "92142", "92143",
          "92145", "92147", "92149", "92150", "92152", "92153", "92154", "92155", "92158", "92159",
          "92160", "92161", "92162", "92163", "92164", "92165", "92166", "92167", "92168", "92169",
          "92170", "92171", "92172", "92173", "92174", "92175", "92176", "92177", "92178", "92179",
          "92182", "92186", "92187", "92190", "92191", "92192", "92193", "92195", "92196", "92197",
          "92198", "92199"
        ],
        Sacramento: [
          "95811", "95814", "95815", "95816", "95817", "95818", "95819", "95820", "95821", "95822",
          "95823", "95824", "95825", "95826", "95827", "95828", "95829", "95830", "95831", "95832",
          "95833", "95834", "95835", "95837", "95838", "95841", "95842", "95843", "95851", "95852",
          "95853", "95860", "95864", "95865", "95866", "95867", "95894", "95899"
        ],
        Fresno: [
          "93650", "93701", "93702", "93703", "93704", "93705", "93706", "93707", "93708", "93709",
          "93710", "93711", "93712", "93714", "93715", "93716", "93717", "93718", "93720", "93721",
          "93722", "93723", "93724", "93725", "93726", "93727", "93728", "93729", "93730", "93737",
          "93740", "93741", "93744", "93745", "93747", "93750", "93755", "93760", "93761", "93764",
          "93765", "93771", "93772", "93773", "93774", "93775", "93776", "93777", "93778", "93779",
          "93786", "93790", "93791", "93792", "93793", "93794", "93844", "93888", "93896", "93899"
        ],
        Oakland: [
          "94601", "94602", "94603", "94605", "94606", "94607", "94608", "94609", "94610", "94611",
          "94612", "94613", "94614", "94615", "94617", "94618", "94619", "94620", "94621", "94622",
          "94623", "94624", "94649", "94659", "94660", "94661", "94666", "94701", "94702", "94703",
          "94704", "94705", "94706", "94707", "94708", "94709", "94710", "94712", "94720"
        ],
        "Long Beach": [
          "90801", "90802", "90803", "90804", "90805", "90806", "90807", "90808", "90810", "90813",
          "90814", "90815", "90822", "90831", "90832", "90833", "90834", "90835", "90840", "90842",
          "90844", "90846", "90847", "90848", "90853", "90899"
        ],
        Anaheim: [
          "90620", "92801", "92802", "92803", "92804", "92805", "92806", "92807", "92808", "92809",
          "92812", "92814", "92815", "92816", "92817", "92825", "92850", "92899"
        ]
      },
      "Baja California": {
        Tijuana: [
          "22000", "22010", "22014", "22015", "22016", "22017", "22018", "22020", "22024", "22025",
          "22026", "22027", "22030", "22034", "22035", "22036", "22040", "22044", "22045", "22046",
          "22050", "22054", "22055", "22056", "22060", "22064", "22065", "22066", "22070", "22074",
          "22075", "22076", "22080", "22084", "22085", "22086", "22090", "22094", "22095", "22096",
          "22100", "22104", "22105", "22106", "22110", "22114", "22115", "22116", "22120", "22124",
          "22125", "22126", "22130", "22134", "22135", "22136", "22140", "22144", "22145", "22146",
          "22150", "22154", "22155", "22156", "22160", "22164", "22165", "22166", "22170", "22174",
          "22175", "22176", "22180", "22184", "22185", "22186", "22190", "22194", "22195", "22196",
          "22200", "22204", "22205", "22206", "22210", "22214", "22215", "22216", "22220", "22224",
          "22225", "22226", "22230", "22234", "22235", "22236", "22240", "22244", "22245", "22246"
        ],
        Mexicali: [
          "21000", "21010", "21020", "21030", "21040", "21050", "21060", "21070", "21080", "21090",
          "21100", "21110", "21120", "21130", "21140", "21150", "21160", "21170", "21180", "21190",
          "21200", "21210", "21220", "21230", "21240", "21250", "21260", "21270", "21280", "21290",
          "21300", "21310", "21320", "21330", "21340", "21350", "21360", "21370", "21380", "21390",
          "21400", "21410", "21420", "21430", "21440", "21450", "21460", "21470", "21480", "21490"
        ],
        Ensenada: [
          "22800", "22810", "22820", "22830", "22840", "22850", "22860", "22870", "22880", "22890",
          "22900", "22910", "22920", "22930", "22940", "22950", "22960", "22970", "22980", "22990"
        ],
        Tecate: [
          "21400", "21410", "21420", "21430", "21440", "21450", "21460", "21470", "21480", "21490"
        ],
        Rosarito: [
          "22700", "22710", "22720", "22730", "22740", "22750", "22760", "22770", "22780", "22790"
        ]
      },
      "New York": {
        "New York City": [
          "10001",
          "10002",
          "10003",
          "10004",
          "10005",
          "10006",
          "10007",
          "10008",
          "10009",
          "10010",
        ],
        Buffalo: [
          "14201",
          "14202",
          "14203",
          "14204",
          "14205",
          "14206",
          "14207",
          "14208",
          "14209",
          "14210",
        ],
        Rochester: [
          "14602",
          "14603",
          "14604",
          "14605",
          "14606",
          "14607",
          "14608",
          "14609",
          "14610",
          "14611",
        ],
      },
      Texas: {
        Houston: [
          "77001",
          "77002",
          "77003",
          "77004",
          "77005",
          "77006",
          "77007",
          "77008",
          "77009",
          "77010",
        ],
        Dallas: [
          "75201",
          "75202",
          "75203",
          "75204",
          "75205",
          "75206",
          "75207",
          "75208",
          "75209",
          "75210",
        ],
        Austin: [
          "73301",
          "73344",
          "73347",
          "73355",
          "73356",
          "73357",
          "73358",
          "73359",
          "73360",
          "73361",
        ],
      },
      Florida: {
        Miami: [
          "33101",
          "33102",
          "33103",
          "33104",
          "33105",
          "33106",
          "33107",
          "33108",
          "33109",
          "33110",
        ],
        Orlando: [
          "32801",
          "32802",
          "32803",
          "32804",
          "32805",
          "32806",
          "32807",
          "32808",
          "32809",
          "32810",
        ],
        Tampa: [
          "33601",
          "33602",
          "33603",
          "33604",
          "33605",
          "33606",
          "33607",
          "33608",
          "33609",
          "33610",
        ],
      },
    };

    return fallbackData[state]?.[city] || [];
  }
}

export default OpenAddressesService;
