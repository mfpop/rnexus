// src/components/auth/profile/AddressSection.tsx

import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '../../ui/bits';
import { useQuery } from '@apollo/client';
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
  ZipCode
} from '../../../graphql/location';
import { useAutosave } from './ProfileAutosaveProvider';

interface AddressData {
  country?: string;
  state_province?: string;
  city?: string;
  zip_code?: string;
  street_address?: string;
  apartment_suite?: string;
}

interface AddressSectionProps {
  data: AddressData;
  onChange: (field: keyof AddressData, value: string) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  data,
  onChange,
}) => {
  const { autosaveField, isAutosaving } = useAutosave();
  const [localData, setLocalData] = useState<AddressData>(data);

  // Location data state
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [zipcodes, setZipcodes] = useState<ZipCode[]>([]);

  // GraphQL queries for location data
  const { data: countriesData, loading: countriesLoading } = useQuery<GetAllCountriesData>(GET_ALL_COUNTRIES);
  const { data: statesData, loading: statesLoading } = useQuery<GetStatesByCountryData, GetStatesByCountryVariables>(
    GET_STATES_BY_COUNTRY,
    {
      variables: { countryCode: localData.country || '' },
      skip: !localData.country
    }
  );
  const { data: citiesData, loading: citiesLoading } = useQuery<GetCitiesByStateData, GetCitiesByStateVariables>(
    GET_CITIES_BY_STATE,
    {
      variables: { stateId: localData.state_province || '' },
      skip: !localData.state_province
    }
  );
  const { data: zipcodesData, loading: zipcodesLoading } = useQuery<GetZipcodesByCityData, GetZipcodesByCityVariables>(
    GET_ZIPCODES_BY_CITY,
    {
      variables: { cityId: localData.city || '' },
      skip: !localData.city
    }
  );

  // Update local state when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Update location data from GraphQL
  useEffect(() => {
    if (countriesData?.allCountries) {
      setCountries(countriesData.allCountries);
    }
  }, [countriesData]);

  useEffect(() => {
    if (statesData?.allStates) {
      setStates(statesData.allStates);
    } else {
      setStates([]);
    }
  }, [statesData]);

  useEffect(() => {
    if (citiesData?.allCities) {
      setCities(citiesData.allCities);
    } else {
      setCities([]);
    }
  }, [citiesData]);

  useEffect(() => {
    if (zipcodesData?.allZipcodes) {
      setZipcodes(zipcodesData.allZipcodes);
    } else {
      setZipcodes([]);
    }
  }, [zipcodesData]);

  const handleFieldChange = (field: keyof AddressData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(field, value);

    // Autosave individual field
    autosaveField(field, value);
  };

  const handleCountryChange = (countryId: string) => {
    const selectedCountry = countries.find(c => c.id === countryId);
    const countryCode = selectedCountry?.code || '';

    // Reset dependent fields
    const newData = {
      ...localData,
      country: countryCode,
      state_province: '',
      city: '',
      zip_code: '',
    };

    setLocalData(newData);
    onChange('country', countryCode);
    onChange('state_province', '');
    onChange('city', '');
    onChange('zip_code', '');

    // Autosave country change
    autosaveField('country', selectedCountry?.name || '');
  };

  const handleStateChange = (stateId: string) => {
    const newData = {
      ...localData,
      state_province: stateId,
      city: '',
      zip_code: '',
    };

    setLocalData(newData);
    onChange('state_province', stateId);
    onChange('city', '');
    onChange('zip_code', '');

    // Autosave state change
    const selectedState = states.find(s => s.id === stateId);
    autosaveField('stateProvince', selectedState?.name || '');
  };

  const handleCityChange = (cityId: string) => {
    const newData = {
      ...localData,
      city: cityId,
      zip_code: '',
    };

    setLocalData(newData);
    onChange('city', cityId);
    onChange('zip_code', '');

    // Autosave city change
    const selectedCity = cities.find(c => c.id === cityId);
    autosaveField('city', selectedCity?.name || '');
  };

  const handleZipcodeChange = (zipcodeId: string) => {
    const newData = { ...localData, zip_code: zipcodeId };
    setLocalData(newData);
    onChange('zip_code', zipcodeId);

    // Autosave zip code change
    const selectedZipcode = zipcodes.find(z => z.id === zipcodeId);
    autosaveField('zipCode', selectedZipcode?.code || '');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-green-600" />
          Address Information
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <div className="relative">
                <select
                  value={countries.find(c => c.code === localData.country)?.id || ""}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  disabled={countriesLoading}
                >
                  <option value="">Select country</option>
                  {countries.map((country) => (
                    <option key={`country-${country.id}`} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
              <div className="relative">
                <select
                  value={localData.state_province || ""}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  disabled={!localData.country || statesLoading}
                >
                  <option value="">Select state/province</option>
                  {states.map((state) => (
                    <option key={`state-${state.id}`} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <div className="relative">
                <select
                  value={localData.city || ""}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  disabled={!localData.state_province || citiesLoading}
                >
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={`city-${city.id}`} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
              <div className="relative">
                <select
                  value={localData.zip_code || ""}
                  onChange={(e) => handleZipcodeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  disabled={!localData.city || zipcodesLoading}
                >
                  <option value="">Select ZIP code</option>
                  {zipcodes.map((zipcode) => (
                    <option key={`zipcode-${zipcode.id}`} value={zipcode.id}>
                      {zipcode.code}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <Input
                type="text"
                value={localData.street_address || ""}
                onChange={(e) => handleFieldChange("street_address", e.target.value)}
                className="w-full"
                placeholder="Enter street address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apartment/Suite</label>
              <Input
                type="text"
                value={localData.apartment_suite || ""}
                onChange={(e) => handleFieldChange("apartment_suite", e.target.value)}
                className="w-full"
                placeholder="Enter apartment/suite"
              />
            </div>
          </div>
        </div>

        {/* Address Summary */}
        {(localData.street_address || localData.apartment_suite) && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Address Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{localData.street_address || "No street address"}</p>
              <p>{localData.apartment_suite && `${localData.apartment_suite}, `}
                 {cities.find(c => c.id === localData.city)?.name || "No city"},
                 {states.find(s => s.id === localData.state_province)?.name || "No state"}
                 {zipcodes.find(z => z.id === localData.zip_code)?.code && ` ${zipcodes.find(z => z.id === localData.zip_code)?.code}`}
              </p>
              <p>{countries.find(c => c.code === localData.country)?.name || "No country"}</p>
            </div>
          </div>
        )}

        {/* Autosave Status */}
        {isAutosaving && (
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Saving...
          </div>
        )}
      </div>
    </div>
  );
};
