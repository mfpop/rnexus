import React from "react";
import { Input } from "../ui/bits";
import { useQuery } from "@apollo/client";
import {
  GET_ALL_COUNTRIES,
  GET_STATES_BY_COUNTRY,
  GET_CITIES_BY_STATE,
  GET_ZIPCODES_BY_CITY,
  GetAllCountriesData,
  GetStatesByCountryData,
  GetCitiesByStateData,
  GetZipcodesByCityData,
  GetStatesByCountryVariables,
  GetCitiesByStateVariables,
  GetZipcodesByCityVariables,
  Country,
  State,
  City,
  ZipCode,
} from "../../graphql/location";

interface AddressData {
  country: string;
  state: string;
  city: string;
  zipcode: string;
  street: string;
  apartment: string;
}

interface AddressCardProps {
  addressData: AddressData;
  onAddressChange: (field: keyof AddressData, value: string) => void;
  errors?: Record<string, string>;
}

const AddressCard: React.FC<AddressCardProps> = ({
  addressData,
  onAddressChange,
  errors = {},
}) => {
  // Location data queries
  const { data: countriesData, loading: countriesLoading } =
    useQuery<GetAllCountriesData>(GET_ALL_COUNTRIES);
  const { data: statesData, loading: statesLoading } = useQuery<
    GetStatesByCountryData,
    GetStatesByCountryVariables
  >(GET_STATES_BY_COUNTRY, {
    variables: { countryCode: addressData.country },
    skip: !addressData.country,
  });
  const { data: citiesData, loading: citiesLoading } = useQuery<
    GetCitiesByStateData,
    GetCitiesByStateVariables
  >(GET_CITIES_BY_STATE, {
    variables: { stateId: addressData.state },
    skip: !addressData.state,
  });
  const { data: zipcodesData, loading: zipcodesLoading } = useQuery<
    GetZipcodesByCityData,
    GetZipcodesByCityVariables
  >(GET_ZIPCODES_BY_CITY, {
    variables: { cityId: addressData.city },
    skip: !addressData.city,
  });

  // Extract data from queries
  const countries: Country[] = countriesData?.allCountries || [];
  const states: State[] = statesData?.allStates || [];
  const cities: City[] = citiesData?.allCities || [];
  const zipcodes: ZipCode[] = zipcodesData?.allZipcodes || [];

  // Handle country change
  const handleCountryChange = (countryId: string) => {
    const selectedCountry = countries.find((c: Country) => c.id === countryId);
    onAddressChange("country", selectedCountry?.code || "");
    // Reset dependent fields
    onAddressChange("state", "");
    onAddressChange("city", "");
    onAddressChange("zipcode", "");
  };

  // Handle state change
  const handleStateChange = (stateId: string) => {
    onAddressChange("state", stateId);
    // Reset dependent fields
    onAddressChange("city", "");
    onAddressChange("zipcode", "");
  };

  // Handle city change
  const handleCityChange = (cityId: string) => {
    onAddressChange("city", cityId);
    // Reset dependent field
    onAddressChange("zipcode", "");
  };

  // Handle zip code change
  const handleZipCodeChange = (zipcodeId: string) => {
    onAddressChange("zipcode", zipcodeId);
  };

  // Handle text input changes
  const handleTextChange =
    (field: keyof AddressData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onAddressChange(field, e.target.value);
    };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Address Information
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Enter your complete address details
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Country Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={addressData.country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={countriesLoading}
          >
            <option value="">Select country</option>
            {countries.map((country: Country) => (
              <option key={`country-${country.id}`} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          {countriesLoading && (
            <p className="text-xs text-gray-500 mt-1">Loading countries...</p>
          )}
          {errors["country"] && (
            <p className="text-red-500 text-xs mt-1">{errors["country"]}</p>
          )}
        </div>

        {/* State/Province Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State/Province <span className="text-red-500">*</span>
          </label>
          <select
            value={addressData.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={!addressData.country || statesLoading}
          >
            <option value="">Select state/province</option>
            {states.map((state: State) => (
              <option key={`state-${state.id}`} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
          {statesLoading && (
            <p className="text-xs text-gray-500 mt-1">Loading states...</p>
          )}
          {!addressData.country && (
            <p className="text-xs text-gray-500 mt-1">
              Please select a country first
            </p>
          )}
          {errors["state"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["state"]}
            </p>
          )}
        </div>

        {/* City Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <select
            value={addressData.city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={!addressData.state || citiesLoading}
          >
            <option value="">Select city</option>
            {cities.map((city: City) => (
              <option key={`city-${city.id}`} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          {citiesLoading && (
            <p className="text-xs text-gray-500 mt-1">Loading cities...</p>
          )}
          {!addressData.state && (
            <p className="text-xs text-gray-500 mt-1">
              Please select a state/province first
            </p>
          )}
          {errors["city"] && (
            <p className="text-red-500 text-xs mt-1">{errors["city"]}</p>
          )}
        </div>

        {/* ZIP Code Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <select
            value={addressData.zipcode}
            onChange={(e) => handleZipCodeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={!addressData.city || zipcodesLoading}
          >
            <option value="">Select ZIP code</option>
            {zipcodes.map((zipcode: ZipCode) => (
              <option key={`zipcode-${zipcode.id}`} value={zipcode.id}>
                {zipcode.code}
              </option>
            ))}
          </select>
          {zipcodesLoading && (
            <p className="text-xs text-gray-500 mt-1">Loading ZIP codes...</p>
          )}
          {!addressData.city && (
            <p className="text-xs text-gray-500 mt-1">
              Please select a city first
            </p>
          )}
          {errors["zipcode"] && (
            <p className="text-red-500 text-xs mt-1">{errors["zipcode"]}</p>
          )}
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={addressData.street}
            onChange={handleTextChange("street")}
            className="w-full"
            placeholder="Enter street address"
          />
          {errors["street"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["street"]}
            </p>
          )}
        </div>

        {/* Apartment/Suite */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apartment/Suite
          </label>
          <Input
            type="text"
            value={addressData.apartment}
            onChange={handleTextChange("apartment")}
            className="w-full"
            placeholder="Enter apartment/suite (optional)"
          />
          {errors["apartment"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["apartment"]}
            </p>
          )}
        </div>

        {/* Address Summary */}
        {(addressData.street || addressData.apartment) && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Address Summary:
            </h4>
            <div className="text-sm text-gray-600">
              {addressData.street && (
                <div>{addressData.street}</div>
              )}
              {addressData.apartment && (
                <div>{addressData.apartment}</div>
              )}
              {cities.find((c: City) => c.id === addressData.city)?.name && (
                <div>
                  {cities.find((c: City) => c.id === addressData.city)?.name}
                  {states.find(
                    (s: State) => s.id === addressData.state,
                  )?.name &&
                    `, ${states.find((s: State) => s.id === addressData.state)?.name}`}
                  {countries.find(
                    (c: Country) => c.code === addressData.country,
                  )?.name &&
                    `, ${countries.find((c: Country) => c.code === addressData.country)?.name}`}
                  {zipcodes.find((z: ZipCode) => z.id === addressData.zipcode)
                    ?.code &&
                    ` ${zipcodes.find((z: ZipCode) => z.id === addressData.zipcode)?.code}`}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
