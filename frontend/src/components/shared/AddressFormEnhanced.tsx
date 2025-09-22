import React, { useState, useEffect } from "react";
import { MapPin, Globe, Building, Mail, AlertCircle } from "lucide-react";
import { Input } from "../ui/bits";

interface Country {
  name: string;
  cca2: string;
  cca3: string;
  flag: string;
}

interface StateProvince {
  geonameId: number;
  name: string;
  adminName1: string;
}

interface CityTown {
  geonameId: number;
  name: string;
  adminName1: string;
  adminName2: string;
}

interface AddressFormData {
  street: string;
  apartment: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
}

interface AddressFormProps {
  value: AddressFormData;
  onChange: (data: AddressFormData) => void;
  className?: string;
}

const AddressFormEnhanced: React.FC<AddressFormProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<StateProvince[]>([]);
  const [cities, setCities] = useState<CityTown[]>([]);
  const [loading, setLoading] = useState({
    countries: false,
    states: false,
    cities: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load countries on component mount
  useEffect(() => {
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (value.country) {
      loadStates(value.country);
      // Reset dependent fields
      onChange({
        ...value,
        state: "",
        city: "",
        zipcode: "",
      });
    }
  }, [value.country]);

  // Load cities when state changes
  useEffect(() => {
    if (value.state) {
      loadCities(value.state);
      // Reset dependent fields
      onChange({
        ...value,
        city: "",
        zipcode: "",
      });
    }
  }, [value.state]);

  const loadCountries = async () => {
    setLoading((prev) => ({ ...prev, countries: true }));
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      if (response.ok) {
        const data = await response.json();
        const sortedCountries = data
          .map((country: any) => ({
            name: country.name.common,
            cca2: country.cca2,
            cca3: country.cca3,
            flag: country.flag,
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
        // Clear any existing country errors when countries load successfully
        if (errors["countries"]) {
          setErrors((prev) => ({ ...prev, countries: "" }));
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to load countries:", error);
      // Only show error if we don't have fallback countries
      const fallbackCountries = getFallbackCountries();
      if (fallbackCountries.length === 0) {
        setErrors((prev) => ({
          ...prev,
          countries: "Failed to load countries. Please refresh the page.",
        }));
      } else {
        // Use fallback countries silently without showing error
        setCountries(fallbackCountries);
      }
    } finally {
      setLoading((prev) => ({ ...prev, countries: false }));
    }
  };

  const loadStates = async (countryName: string) => {
    setLoading((prev) => ({ ...prev, states: true }));
    try {
      // Use enhanced mock data
      const mockStates = getEnhancedStates(countryName);
      setStates(mockStates);
    } catch (error) {
      console.error("Failed to load states:", error);
      const mockStates = getEnhancedStates(countryName);
      setStates(mockStates);
    } finally {
      setLoading((prev) => ({ ...prev, states: false }));
    }
  };

  const loadCities = async (stateName: string) => {
    setLoading((prev) => ({ ...prev, cities: true }));
    try {
      // Use enhanced mock data
      const mockCities = getEnhancedCities(stateName);
      setCities(mockCities);
    } catch (error) {
      console.error("Failed to load cities:", error);
      const mockCities = getEnhancedCities(stateName);
      setCities(mockCities);
    } finally {
      setLoading((prev) => ({ ...prev, cities: false }));
    }
  };

  // Enhanced mock data
  const getEnhancedStates = (countryName: string): StateProvince[] => {
    const stateMap: Record<string, StateProvince[]> = {
      "United States": [
        { geonameId: 1, name: "Alabama", adminName1: "AL" },
        { geonameId: 2, name: "Alaska", adminName1: "AK" },
        { geonameId: 3, name: "Arizona", adminName1: "AZ" },
        { geonameId: 4, name: "Arkansas", adminName1: "AR" },
        { geonameId: 5, name: "California", adminName1: "CA" },
        { geonameId: 6, name: "Colorado", adminName1: "CO" },
        { geonameId: 7, name: "Connecticut", adminName1: "CT" },
        { geonameId: 8, name: "Delaware", adminName1: "DE" },
        { geonameId: 9, name: "Florida", adminName1: "FL" },
        { geonameId: 10, name: "Georgia", adminName1: "GA" },
        { geonameId: 11, name: "Hawaii", adminName1: "HI" },
        { geonameId: 12, name: "Idaho", adminName1: "ID" },
        { geonameId: 13, name: "Illinois", adminName1: "IL" },
        { geonameId: 14, name: "Indiana", adminName1: "IN" },
        { geonameId: 15, name: "Iowa", adminName1: "IA" },
        { geonameId: 16, name: "Kansas", adminName1: "KS" },
        { geonameId: 17, name: "Kentucky", adminName1: "KY" },
        { geonameId: 18, name: "Louisiana", adminName1: "LA" },
        { geonameId: 19, name: "Maine", adminName1: "ME" },
        { geonameId: 20, name: "Maryland", adminName1: "MD" },
        { geonameId: 21, name: "Massachusetts", adminName1: "MA" },
        { geonameId: 22, name: "Michigan", adminName1: "MI" },
        { geonameId: 23, name: "Minnesota", adminName1: "MN" },
        { geonameId: 24, name: "Mississippi", adminName1: "MS" },
        { geonameId: 25, name: "Missouri", adminName1: "MO" },
        { geonameId: 26, name: "Montana", adminName1: "MT" },
        { geonameId: 27, name: "Nebraska", adminName1: "NE" },
        { geonameId: 28, name: "Nevada", adminName1: "NV" },
        { geonameId: 29, name: "New Hampshire", adminName1: "NH" },
        { geonameId: 30, name: "New Jersey", adminName1: "NJ" },
        { geonameId: 31, name: "New Mexico", adminName1: "NM" },
        { geonameId: 32, name: "New York", adminName1: "NY" },
        { geonameId: 33, name: "North Carolina", adminName1: "NC" },
        { geonameId: 34, name: "North Dakota", adminName1: "ND" },
        { geonameId: 35, name: "Ohio", adminName1: "OH" },
        { geonameId: 36, name: "Oklahoma", adminName1: "OK" },
        { geonameId: 37, name: "Oregon", adminName1: "OR" },
        { geonameId: 38, name: "Pennsylvania", adminName1: "PA" },
        { geonameId: 39, name: "Rhode Island", adminName1: "RI" },
        { geonameId: 40, name: "South Carolina", adminName1: "SC" },
        { geonameId: 41, name: "South Dakota", adminName1: "SD" },
        { geonameId: 42, name: "Tennessee", adminName1: "TN" },
        { geonameId: 43, name: "Texas", adminName1: "TX" },
        { geonameId: 44, name: "Utah", adminName1: "UT" },
        { geonameId: 45, name: "Vermont", adminName1: "VT" },
        { geonameId: 46, name: "Virginia", adminName1: "VA" },
        { geonameId: 47, name: "Washington", adminName1: "WA" },
        { geonameId: 48, name: "West Virginia", adminName1: "WV" },
        { geonameId: 49, name: "Wisconsin", adminName1: "WI" },
        { geonameId: 50, name: "Wyoming", adminName1: "WY" },
      ],
      Mexico: [
        { geonameId: 51, name: "Aguascalientes", adminName1: "AGS" },
        { geonameId: 52, name: "Baja California", adminName1: "BC" },
        { geonameId: 53, name: "Baja California Sur", adminName1: "BCS" },
        { geonameId: 54, name: "Campeche", adminName1: "CAMP" },
        { geonameId: 55, name: "Chiapas", adminName1: "CHIS" },
        { geonameId: 56, name: "Chihuahua", adminName1: "CHIH" },
        { geonameId: 57, name: "Ciudad de México", adminName1: "CDMX" },
        { geonameId: 58, name: "Coahuila", adminName1: "COAH" },
        { geonameId: 59, name: "Colima", adminName1: "COL" },
        { geonameId: 60, name: "Durango", adminName1: "DGO" },
        { geonameId: 61, name: "Estado de México", adminName1: "MEX" },
        { geonameId: 62, name: "Guanajuato", adminName1: "GTO" },
        { geonameId: 63, name: "Guerrero", adminName1: "GRO" },
        { geonameId: 64, name: "Hidalgo", adminName1: "HGO" },
        { geonameId: 65, name: "Jalisco", adminName1: "JAL" },
        { geonameId: 66, name: "Michoacán", adminName1: "MICH" },
        { geonameId: 67, name: "Morelos", adminName1: "MOR" },
        { geonameId: 68, name: "Nayarit", adminName1: "NAY" },
        { geonameId: 69, name: "Nuevo León", adminName1: "NL" },
        { geonameId: 70, name: "Oaxaca", adminName1: "OAX" },
        { geonameId: 71, name: "Puebla", adminName1: "PUE" },
        { geonameId: 72, name: "Querétaro", adminName1: "QRO" },
        { geonameId: 73, name: "Quintana Roo", adminName1: "QR" },
        { geonameId: 74, name: "San Luis Potosí", adminName1: "SLP" },
        { geonameId: 75, name: "Sinaloa", adminName1: "SIN" },
        { geonameId: 76, name: "Sonora", adminName1: "SON" },
        { geonameId: 77, name: "Tabasco", adminName1: "TAB" },
        { geonameId: 78, name: "Tamaulipas", adminName1: "TAMPS" },
        { geonameId: 79, name: "Tlaxcala", adminName1: "TLAX" },
        { geonameId: 80, name: "Veracruz", adminName1: "VER" },
        { geonameId: 81, name: "Yucatán", adminName1: "YUC" },
        { geonameId: 82, name: "Zacatecas", adminName1: "ZAC" },
      ],
    };

    return stateMap[countryName] || [];
  };

  const getEnhancedCities = (stateName: string): CityTown[] => {
    const cityMap: Record<string, CityTown[]> = {
      California: [
        {
          geonameId: 101,
          name: "Los Angeles",
          adminName1: "CA",
          adminName2: "Los Angeles County",
        },
        {
          geonameId: 102,
          name: "San Francisco",
          adminName1: "CA",
          adminName2: "San Francisco County",
        },
        {
          geonameId: 103,
          name: "San Diego",
          adminName1: "CA",
          adminName2: "San Diego County",
        },
        {
          geonameId: 104,
          name: "Sacramento",
          adminName1: "CA",
          adminName2: "Sacramento County",
        },
        {
          geonameId: 105,
          name: "Oakland",
          adminName1: "CA",
          adminName2: "Alameda County",
        },
      ],
      Texas: [
        {
          geonameId: 201,
          name: "Houston",
          adminName1: "TX",
          adminName2: "Harris County",
        },
        {
          geonameId: 202,
          name: "Austin",
          adminName1: "TX",
          adminName2: "Travis County",
        },
        {
          geonameId: 203,
          name: "Dallas",
          adminName1: "TX",
          adminName2: "Dallas County",
        },
        {
          geonameId: 204,
          name: "San Antonio",
          adminName1: "TX",
          adminName2: "Bexar County",
        },
        {
          geonameId: 205,
          name: "Fort Worth",
          adminName1: "TX",
          adminName2: "Tarrant County",
        },
      ],
      "Ciudad de México": [
        {
          geonameId: 301,
          name: "Cuauhtémoc",
          adminName1: "CDMX",
          adminName2: "Cuauhtémoc",
        },
        {
          geonameId: 302,
          name: "Miguel Hidalgo",
          adminName1: "CDMX",
          adminName2: "Miguel Hidalgo",
        },
        {
          geonameId: 303,
          name: "Coyoacán",
          adminName1: "CDMX",
          adminName2: "Coyoacán",
        },
        {
          geonameId: 304,
          name: "Álvaro Obregón",
          adminName1: "CDMX",
          adminName2: "Álvaro Obregón",
        },
        {
          geonameId: 305,
          name: "Tlalpan",
          adminName1: "CDMX",
          adminName2: "Tlalpan",
        },
      ],
      Jalisco: [
        {
          geonameId: 401,
          name: "Guadalajara",
          adminName1: "JAL",
          adminName2: "Guadalajara",
        },
        {
          geonameId: 402,
          name: "Zapopan",
          adminName1: "JAL",
          adminName2: "Zapopan",
        },
        {
          geonameId: 403,
          name: "San Pedro Tlaquepaque",
          adminName1: "JAL",
          adminName2: "San Pedro Tlaquepaque",
        },
        {
          geonameId: 404,
          name: "Tlaquepaque",
          adminName1: "JAL",
          adminName2: "Tlaquepaque",
        },
        {
          geonameId: 405,
          name: "Tonalá",
          adminName1: "JAL",
          adminName2: "Tonalá",
        },
      ],
    };

    return cityMap[stateName] || [];
  };

  const getFallbackCountries = (): Country[] => [
    { name: "United States", cca2: "US", cca3: "USA", flag: "🇺🇸" },
    { name: "Mexico", cca2: "MX", cca3: "MEX", flag: "🇲🇽" },
    { name: "Canada", cca2: "CA", cca3: "CAN", flag: "🇨🇦" },
    { name: "United Kingdom", cca2: "GB", cca3: "GBR", flag: "🇬🇧" },
    { name: "Germany", cca2: "DE", cca3: "DEU", flag: "🇩🇪" },
    { name: "France", cca2: "FR", cca3: "FRA", flag: "🇫🇷" },
    { name: "Spain", cca2: "ES", cca3: "ESP", flag: "🇪🇸" },
    { name: "Italy", cca2: "IT", cca3: "ITA", flag: "🇮🇹" },
  ];

  const validateZipCode = (zipCode: string, country: string) => {
    if (!zipCode) return "";

    const patterns: Record<string, RegExp> = {
      "United States": /^\d{5}(-\d{4})?$/,
      Canada: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
      Mexico: /^\d{5}$/,
      "United Kingdom": /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
      Germany: /^\d{5}$/,
      France: /^\d{5}$/,
      Spain: /^\d{5}$/,
      Italy: /^\d{5}$/,
      Australia: /^\d{4}$/,
      Japan: /^\d{3}-\d{4}$/,
      India: /^\d{6}$/,
    };

    const pattern = patterns[country];
    if (pattern && !pattern.test(zipCode)) {
      return `Invalid postal code format for ${country}`;
    }

    return "";
  };

  const handleFieldChange = (
    field: keyof AddressFormData,
    fieldValue: string,
  ) => {
    const newValue = { ...value, [field]: fieldValue };
    onChange(newValue);

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Validate zip code
    if (field === "zipcode") {
      const zipError = validateZipCode(fieldValue, value.country);
      if (zipError) {
        setErrors((prev) => ({ ...prev, zipcode: zipError }));
      }
    }
  };

  const getZipCodePlaceholder = (country: string) => {
    const placeholders: Record<string, string> = {
      "United States": "12345 or 12345-6789",
      Canada: "A1A 1A1",
      Mexico: "12345",
      "United Kingdom": "SW1A 1AA",
      Germany: "12345",
      France: "12345",
      Spain: "12345",
      Italy: "12345",
      Australia: "1234",
      Japan: "123-4567",
      India: "123456",
    };
    return placeholders[country] || "Enter postal code";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Street Address, Apartment, and ZIP Code - Same Line */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Street Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-2" />
            Street Address
          </label>
          <Input
            type="text"
            value={value.street}
            onChange={(e) =>
              handleFieldChange("street", e.target.value)
            }
            className="w-full"
            placeholder="123 Main Street"
          />
        </div>

        {/* Apartment/Suite */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="inline w-4 h-4 mr-2" />
            Apartment, Suite, etc.
          </label>
          <Input
            type="text"
            value={value.apartment}
            onChange={(e) =>
              handleFieldChange("apartment", e.target.value)
            }
            className="w-full"
            placeholder="Apt 4B, Suite 100, etc."
          />
        </div>

        {/* ZIP/Postal Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline w-4 h-4 mr-2" />
            ZIP / Postal Code
          </label>
          <Input
            type="text"
            value={value.zipcode}
            onChange={(e) => handleFieldChange("zipcode", e.target.value)}
            className={`w-full ${errors["zipcode"] ? "border-red-500" : ""}`}
            placeholder={getZipCodePlaceholder(value.country)}
          />
          {errors["zipcode"] && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors["zipcode"]}
            </p>
          )}
        </div>
      </div>

      {/* Country, State, and City - Same Line */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Country Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="inline w-4 h-4 mr-2" />
            Country
          </label>
          <div className="relative">
            <select
              value={value.country}
              onChange={(e) => handleFieldChange("country", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading.countries}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.cca2} value={country.name}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
            {loading.countries && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          {errors["countries"] && (
            <p className="text-sm text-red-500 mt-1">{errors["countries"]}</p>
          )}
        </div>

        {/* State/Province Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="inline w-4 h-4 mr-2" />
            State / Province
          </label>
          <div className="relative">
            <select
              value={value.state}
              onChange={(e) =>
                handleFieldChange("state", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!value.country || loading.states}
            >
              <option value="">Select a state/province</option>
              {states.map((state) => (
                <option key={state.geonameId} value={state.name}>
                  {state.name} {state.adminName1 && `(${state.adminName1})`}
                </option>
              ))}
            </select>
            {loading.states && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          {errors["states"] && (
            <p className="text-sm text-red-500 mt-1">{errors["states"]}</p>
          )}
        </div>

        {/* City Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="inline w-4 h-4 mr-2" />
            City / Town
          </label>
          <div className="relative">
            <select
              value={value.city}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!value.state || loading.cities}
            >
              <option value="">Select a city/town</option>
              {cities.map((city) => (
                <option key={city.geonameId} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {loading.cities && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          {errors["cities"] && (
            <p className="text-sm text-red-500 mt-1">{errors["cities"]}</p>
          )}
        </div>
      </div>

      {/* Address Preview - Compact */}
      {(value.street ||
        value.city ||
        value.state ||
        value.country) && (
        <div className="p-2 bg-gray-50 rounded border border-gray-200">
          <p className="text-xs text-gray-600">
            {value.street && (
              <>
                {value.street}
                {value.apartment && `, ${value.apartment}`}
                {value.zipcode && `, ${value.zipcode}`}
                {value.city && ", "}
              </>
            )}
            {value.city && value.city}
            {value.state && value.city && ", "}
            {value.state && value.state}
            {value.country && `, ${value.country}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressFormEnhanced;
