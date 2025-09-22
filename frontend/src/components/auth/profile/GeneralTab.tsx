import React, { useState, useEffect } from "react";
import { Input } from "../../ui/bits";
import { AvatarUpload } from "./AvatarUpload";
import { BioSection } from "./BioSection";
import { validatePhoneNumber, validateCountryCode, formatPhoneNumberAsTyped, getAvailableCountryCodes } from "../../../lib/phoneValidation";
import { useQuery } from "@apollo/client";
import { GET_COUNTRIES, GET_STATES, GET_CITIES, GET_ZIPCODES, Country, State, City, ZipCode } from "../../../lib/locationService";

interface GeneralTabProps {
  profileData: any;
  isEditMode: boolean;
  handleProfileChange: (field: string, value: any) => void;
  handleAvatarChange: (file: File | null) => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({
  profileData,
  isEditMode,
  handleProfileChange,
  handleAvatarChange,
}) => {
  // Phone validation state
  const [phoneErrors, setPhoneErrors] = useState<{
    phone1?: string;
    phone2?: string;
    phonecc1?: string;
    phonecc2?: string;
  }>({});

  // Location data state
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [zipcodes, setZipcodes] = useState<ZipCode[]>([]);

  // Available country codes
  const countryCodes = getAvailableCountryCodes();

  // GraphQL queries for location data
  const { data: countriesData, loading: countriesLoading } = useQuery(GET_COUNTRIES, {
    fetchPolicy: 'cache-first'
  });

  const { data: statesData, loading: statesLoading } = useQuery(GET_STATES, {
    variables: { countryCode: profileData.country_code },
    skip: !profileData.country_code,
    fetchPolicy: 'cache-first'
  });

  const { data: citiesData, loading: citiesLoading } = useQuery(GET_CITIES, {
    variables: { stateName: profileData.state },
    skip: !profileData.state,
    fetchPolicy: 'cache-first'
  });

  const { data: zipcodesData, loading: zipcodesLoading } = useQuery(GET_ZIPCODES, {
    variables: { cityName: profileData.city },
    skip: !profileData.city,
    fetchPolicy: 'cache-first'
  });

  // Handle phone number change with validation
  const handlePhoneChange = (field: string, value: string, countryCodeField: string) => {
    handleProfileChange(field, value);

    // Clear previous error
    setPhoneErrors(prev => ({ ...prev, [field]: undefined }));

    // Validate if both phone and country code are present
    const countryCode = profileData[countryCodeField] || '';
    if (value && countryCode) {
      const validation = validatePhoneNumber(value, countryCode);
      if (!validation.isValid) {
        setPhoneErrors(prev => ({ ...prev, [field]: validation.error }));
      }
    }
  };

  // Handle country code change with validation
  const handleCountryCodeChange = (field: string, value: string, phoneField: string) => {
    handleProfileChange(field, value);

    // Clear previous error
    setPhoneErrors(prev => ({ ...prev, [field]: undefined }));

    // Validate country code format
    const validation = validateCountryCode(value);
    if (!validation.isValid) {
      setPhoneErrors(prev => ({ ...prev, [field]: validation.error }));
      return;
    }

    // Validate phone number if present
    const phoneNumber = profileData[phoneField] || '';
    if (phoneNumber) {
      const phoneValidation = validatePhoneNumber(phoneNumber, value);
      if (!phoneValidation.isValid) {
        setPhoneErrors(prev => ({ ...prev, [phoneField]: phoneValidation.error }));
      }
    }
  };

  // Format phone number as user types
  const handlePhoneInput = (field: string, value: string, countryCodeField: string) => {
    const countryCode = profileData[countryCodeField] || '';
    const formatted = formatPhoneNumberAsTyped(value, countryCode);
    handlePhoneChange(field, formatted, countryCodeField);
  };

  // Update location data from GraphQL queries
  useEffect(() => {
    if (countriesData?.allCountries) {
      setCountries(countriesData.allCountries);
    }
  }, [countriesData]);

  useEffect(() => {
    if (statesData?.allStates) {
      setStates(statesData.allStates);
    } else if (!profileData.country_code) {
      setStates([]);
    }
  }, [statesData, profileData.country_code]);

  useEffect(() => {
    if (citiesData?.allCities) {
      setCities(citiesData.allCities);
    } else if (!profileData.state) {
      setCities([]);
    }
  }, [citiesData, profileData.state]);

  useEffect(() => {
    if (zipcodesData?.allZipcodes) {
      setZipcodes(zipcodesData.allZipcodes);
    } else if (!profileData.city) {
      setZipcodes([]);
    }
  }, [zipcodesData, profileData.city]);

  // Handle country selection
  const handleCountryChange = (countryName: string) => {
    const selectedCountry = countries.find(c => c.name === countryName);
    if (selectedCountry) {
      handleProfileChange("country", selectedCountry.name);
      handleProfileChange("country_code", selectedCountry.code);
      handleProfileChange("state", "");
      handleProfileChange("city", "");
      handleProfileChange("zipcode", "");
    }
  };

  // Handle state selection
  const handleStateChange = (stateName: string) => {
    const selectedState = states.find(s => s.name === stateName);
    if (selectedState) {
      handleProfileChange("state", selectedState.name);
      handleProfileChange("city", "");
      handleProfileChange("zipcode", "");
    }
  };

  // Handle city selection
  const handleCityChange = (cityName: string) => {
    const selectedCity = cities.find(c => c.name === cityName);
    if (selectedCity) {
      handleProfileChange("city", selectedCity.name);
      handleProfileChange("zipcode", "");
    }
  };

  // Handle zipcode selection
  const handleZipCodeChange = (zipcodeValue: string) => {
    const selectedZipCode = zipcodes.find(z => z.code === zipcodeValue);
    if (selectedZipCode) {
      handleProfileChange("zipcode", selectedZipCode.code);
    }
  };

  return (
    <div className="h-full w-full overflow-hidden profile-form font-sans">
      <div className="h-full w-full">
        {/* Two Column Layout - Personal Information and Biography Cards */}
        <div className="h-full flex gap-4">
          {/* Left Column - Personal Information Card (65%) */}
          <div className="h-full w-[65%] bg-white shadow-lg border border-gray-200 relative overflow-hidden flex flex-col">
            {/* Subtle paper texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white opacity-60"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            <div className="relative z-10 flex-1 flex flex-col">
              {/* Header with Title and Subtitle (no edit/cancel/save buttons) */}
              <div className="p-6 border-b border-gray-200 relative z-10 min-h-[88px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 font-sans">
                      Personal Information <span className="text-sm font-normal text-gray-600">({profileData.username})</span>
                    </h3>
                    <p className="text-gray-600 text-sm">Complete your personal details, address, and contact information</p>
                  </div>
                </div>
              </div>

              {/* Content Layout - Grid with Avatar and Full-Width Sections */}
              <div className="flex-1 overflow-y-auto min-h-0 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Left Column - Avatar Photo (1/5 width) */}
                  <div className="lg:col-span-1">
                    <div className="flex flex-col items-center">
                      <div className="mb-4">
                        <AvatarUpload
                          currentAvatar={profileData.avatar}
                          onAvatarChange={handleAvatarChange}
                          disabled={!isEditMode}
                        />
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        {isEditMode
                          ? (profileData.avatar ? "Click to change" : "Click to upload your photo")
                          : "Profile Photo"
                        }
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Personal Details (4/5 width) */}
                  <div className="lg:col-span-4">
                    {/* Personal Information - Two Rows */}
                    <div className="space-y-4">
                      {/* First Row - Names */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors font-sans">
                            First Name (Nombres)
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={profileData.first_name || ""}
                              onChange={(e) => handleProfileChange("first_name", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base font-normal font-sans focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              placeholder="Enter your first name"
                              disabled={!isEditMode}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors font-sans">
                            Last Name (Paterno)
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={profileData.last_name || ""}
                              onChange={(e) => handleProfileChange("last_name", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base font-normal font-sans focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              placeholder="Enter your last name"
                              disabled={!isEditMode}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors font-sans">
                            Last Name (Materno)
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={profileData.lastnamem || ""}
                              onChange={(e) => handleProfileChange("lastnamem", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base font-normal font-sans focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              placeholder="Enter your maternal last name"
                              disabled={!isEditMode}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200"></div>
                          </div>
                        </div>
                      </div>

                      {/* Second Row - Date of Birth, Gender, Marital Status */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors font-sans">
                            Date of Birth
                          </label>
                          <div className="relative">
                            <Input
                              type="date"
                              value={profileData.birthname || ""}
                              onChange={(e) => handleProfileChange("birthname", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base font-normal font-sans focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              disabled={!isEditMode}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors font-sans">
                            Gender
                          </label>
                          <div className="relative">
                            <select
                              value={profileData.gender || ""}
                              onChange={(e) => handleProfileChange("gender", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none bg-transparent transition-colors hover:border-gray-400 appearance-none disabled:text-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              disabled={!isEditMode}
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                              <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors font-sans">
                            Marital Status
                          </label>
                          <div className="relative">
                            <select
                              value={profileData.marital_status || ""}
                              onChange={(e) => handleProfileChange("marital_status", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none bg-transparent transition-colors hover:border-gray-400 appearance-none disabled:text-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              disabled={!isEditMode}
                            >
                              <option value="">Select Status</option>
                              <option value="single">Single</option>
                              <option value="married">Married</option>
                              <option value="divorced">Divorced</option>
                              <option value="widowed">Widowed</option>
                              <option value="separated">Separated</option>
                            </select>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information - Full Width (Outside Grid) */}
                <div className="mt-8 space-y-4">
                      <h4 className="text-xl font-bold text-gray-900 mb-4 font-sans">Address Information</h4>

                      {/* Street Address and Apartment/Suite on same line */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors font-sans">
                            Street Address
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={profileData.street || ""}
                              onChange={(e) => handleProfileChange("street", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base font-normal font-sans focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              placeholder="Enter your street address"
                              disabled={!isEditMode}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors font-sans">
                            Apartment/Suite
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={profileData.apartment || ""}
                              onChange={(e) => handleProfileChange("apartment", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base font-normal font-sans focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              placeholder="Apt, Suite, Unit, etc."
                              disabled={!isEditMode}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                          </div>
                        </div>
                      </div>

                      {/* Location Information - Full Width */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors font-sans">
                              Country
                            </label>
                            <div className="relative">
                              <select
                                value={profileData.country || ""}
                                onChange={(e) => handleCountryChange(e.target.value)}
                                className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base font-normal font-sans focus:outline-none bg-transparent transition-colors hover:border-gray-400 appearance-none disabled:text-gray-400"
                                style={{
                                  borderBottom: '2px solid #d1d5db'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderBottom = 'none';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderBottom = '2px solid #d1d5db';
                                }}
                                disabled={!isEditMode || countriesLoading}
                              >
                                <option value="">{countriesLoading ? "Loading..." : "Select Country"}</option>
                                {countries.map((country) => (
                                  <option key={country.id} value={country.name}>
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                            </div>
                          </div>

                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors font-sans">
                              State/Province
                            </label>
                            <div className="relative">
                              <select
                                value={profileData.state || ""}
                                onChange={(e) => handleStateChange(e.target.value)}
                                className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base font-normal font-sans focus:outline-none bg-transparent transition-colors hover:border-gray-400 appearance-none disabled:text-gray-400"
                                style={{
                                  borderBottom: '2px solid #d1d5db'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderBottom = 'none';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderBottom = '2px solid #d1d5db';
                                }}
                                disabled={!isEditMode || statesLoading || !profileData.country_code}
                              >
                                <option value="">{statesLoading ? "Loading..." : "Select State"}</option>
                                {states.map((state) => (
                                  <option key={state.id} value={state.name}>
                                    {state.name}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                            </div>
                          </div>

                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors font-sans">
                              City
                            </label>
                            <div className="relative">
                              <select
                                value={profileData.city || ""}
                                onChange={(e) => handleCityChange(e.target.value)}
                                className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base font-normal font-sans focus:outline-none bg-transparent transition-colors hover:border-gray-400 appearance-none disabled:text-gray-400"
                                style={{
                                  borderBottom: '2px solid #d1d5db'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderBottom = 'none';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderBottom = '2px solid #d1d5db';
                                }}
                                disabled={!isEditMode || citiesLoading || !profileData.state}
                              >
                                <option value="">{citiesLoading ? "Loading..." : "Select City"}</option>
                                {cities.map((city) => (
                                  <option key={city.id} value={city.name}>
                                    {city.name}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                            </div>
                          </div>

                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors font-sans">
                              ZIP Code
                            </label>
                            <div className="relative">
                              <select
                                value={profileData.zipcode || ""}
                                onChange={(e) => handleZipCodeChange(e.target.value)}
                                className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base font-normal font-sans focus:outline-none bg-transparent transition-colors hover:border-gray-400 appearance-none disabled:text-gray-400"
                                style={{
                                  borderBottom: '2px solid #d1d5db'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderBottom = 'none';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderBottom = '2px solid #d1d5db';
                                }}
                                disabled={!isEditMode || zipcodesLoading || !profileData.city}
                              >
                                <option value="">{zipcodesLoading ? "Loading..." : "Select ZIP Code"}</option>
                                {zipcodes.map((zipcode) => (
                                  <option key={zipcode.id} value={zipcode.code}>
                                    {zipcode.code}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                </div>

                {/* Contact Information - Full Width (Outside Grid) */}
                <div className="mt-8 space-y-4">
                      <h4 className="text-xl font-bold text-gray-900 mb-4 font-sans">Contact Information</h4>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2 font-sans">
                            Primary Phone
                          </label>
                          <div className="flex gap-2">
                            {/* Country Code Field */}
                            <div className="group relative w-20">
                              <select
                                value={profileData.phonecc1 || ""}
                                onChange={(e) => handleCountryCodeChange("phonecc1", e.target.value, "phone1")}
                                className={`w-full border-0 border-b-2 rounded-none px-0 py-3 h-12 text-base font-normal font-sans focus:outline-none bg-transparent transition-colors hover:border-gray-400 text-center appearance-none disabled:text-gray-400 ${
                                  phoneErrors.phonecc1 ? 'border-red-500' : 'border-gray-300'
                                }`}
                                style={{
                                  borderBottom: phoneErrors.phonecc1 ? '2px solid #ef4444' : '2px solid #d1d5db'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderBottom = 'none';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderBottom = phoneErrors.phonecc1 ? '2px solid #ef4444' : '2px solid #d1d5db';
                                }}
                                disabled={!isEditMode}
                              >
                                <option value="">+1</option>
                                {countryCodes.map((country) => (
                                  <option key={country.code} value={country.code}>
                                    {country.flag} {country.code}
                                  </option>
                                ))}
                              </select>
                              <div className={`absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200 ${
                                phoneErrors.phonecc1 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                              }`}></div>
                            </div>
                            {/* Phone Number Field */}
                            <div className="group relative flex-1">
                              <Input
                                type="tel"
                                value={profileData.phone1 || ""}
                                onChange={(e) => handlePhoneInput("phone1", e.target.value, "phonecc1")}
                                className={`w-full border-0 border-b-2 rounded-none px-0 py-3 h-12 text-base font-normal font-sans focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400 ${
                                  phoneErrors.phone1 ? 'border-red-500' : 'border-gray-300'
                                }`}
                                style={{
                                  borderBottom: phoneErrors.phone1 ? '2px solid #ef4444' : '2px solid #d1d5db'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderBottom = 'none';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderBottom = phoneErrors.phone1 ? '2px solid #ef4444' : '2px solid #d1d5db';
                                }}
                                placeholder="Enter your phone number"
                                disabled={!isEditMode}
                              />
                              <div className={`absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200 ${
                                phoneErrors.phone1 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                              }`}></div>
                            </div>
                          </div>
                          {/* Error messages */}
                          {(phoneErrors.phonecc1 || phoneErrors.phone1) && (
                            <div className="mt-1 text-sm text-red-600">
                              {phoneErrors.phonecc1 || phoneErrors.phone1}
                            </div>
                          )}
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors font-sans">
                            Primary Phone Type
                          </label>
                          <div className="relative">
                            <select
                              value={profileData.phonet1 || ""}
                              onChange={(e) => handleProfileChange("phonet1", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none bg-transparent transition-colors hover:border-gray-400 appearance-none disabled:text-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              disabled={!isEditMode}
                            >
                              <option value="">Select Type</option>
                              <option value="mobile">Mobile</option>
                              <option value="home">Home</option>
                              <option value="work">Work</option>
                              <option value="other">Other</option>
                            </select>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200"></div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2 font-sans">
                            Secondary Phone
                          </label>
                          <div className="flex gap-2">
                            {/* Country Code Field */}
                            <div className="group relative w-20">
                              <select
                                value={profileData.phonecc2 || ""}
                                onChange={(e) => handleCountryCodeChange("phonecc2", e.target.value, "phone2")}
                                className={`w-full border-0 border-b-2 rounded-none px-0 py-3 h-12 text-base font-normal font-sans focus:outline-none bg-transparent transition-colors hover:border-gray-400 text-center appearance-none disabled:text-gray-400 ${
                                  phoneErrors.phonecc2 ? 'border-red-500' : 'border-gray-300'
                                }`}
                                style={{
                                  borderBottom: phoneErrors.phonecc2 ? '2px solid #ef4444' : '2px solid #d1d5db'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderBottom = 'none';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderBottom = phoneErrors.phonecc2 ? '2px solid #ef4444' : '2px solid #d1d5db';
                                }}
                                disabled={!isEditMode}
                              >
                                <option value="">+1</option>
                                {countryCodes.map((country) => (
                                  <option key={country.code} value={country.code}>
                                    {country.flag} {country.code}
                                  </option>
                                ))}
                              </select>
                              <div className={`absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200 ${
                                phoneErrors.phonecc2 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                              }`}></div>
                            </div>
                            {/* Phone Number Field */}
                            <div className="group relative flex-1">
                              <Input
                                type="tel"
                                value={profileData.phone2 || ""}
                                onChange={(e) => handlePhoneInput("phone2", e.target.value, "phonecc2")}
                                className={`w-full border-0 border-b-2 rounded-none px-0 py-3 h-12 text-base font-normal font-sans focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400 ${
                                  phoneErrors.phone2 ? 'border-red-500' : 'border-gray-300'
                                }`}
                                style={{
                                  borderBottom: phoneErrors.phone2 ? '2px solid #ef4444' : '2px solid #d1d5db'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderBottom = 'none';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderBottom = phoneErrors.phone2 ? '2px solid #ef4444' : '2px solid #d1d5db';
                                }}
                                placeholder="Enter secondary phone number"
                                disabled={!isEditMode}
                              />
                              <div className={`absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200 ${
                                phoneErrors.phone2 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                              }`}></div>
                            </div>
                          </div>
                          {/* Error messages */}
                          {(phoneErrors.phonecc2 || phoneErrors.phone2) && (
                            <div className="mt-1 text-sm text-red-600">
                              {phoneErrors.phonecc2 || phoneErrors.phone2}
                            </div>
                          )}
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors font-sans">
                            Secondary Phone Type
                          </label>
                          <div className="relative">
                            <select
                              value={profileData.phonet2 || ""}
                              onChange={(e) => handleProfileChange("phonet2", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none bg-transparent transition-colors hover:border-gray-400 appearance-none disabled:text-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              disabled={!isEditMode}
                            >
                              <option value="">Select Type</option>
                              <option value="mobile">Mobile</option>
                              <option value="home">Home</option>
                              <option value="work">Work</option>
                              <option value="other">Other</option>
                            </select>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200"></div>
                          </div>
                        </div>
                      </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Biography Card (35%) */}
          <div className="h-full w-[35%] bg-white shadow-lg border border-gray-200 relative overflow-hidden flex flex-col">
            {/* Subtle paper texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white opacity-60"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            <div className="relative z-10 flex-1 flex flex-col">
              {/* Header for Biography Section */}
              <div className="p-6 border-b border-gray-200 relative z-10 min-h-[88px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 font-sans">Biography & Social Links</h3>
                    <p className="text-gray-600 text-sm">Share your story and connect with others</p>
                  </div>
                </div>
              </div>

              {/* Content with no scroll - compact layout */}
              <div className="flex-1 min-h-0 p-6">
                <BioSection
                  data={{
                    bio: profileData.bio,
                    short_bio: profileData.short_bio,
                    website: profileData.website,
                    linkedin: profileData.linkedin,
                    twitter: profileData.twitter,
                    github: profileData.github,
                    facebook: profileData.facebook,
                    instagram: profileData.instagram,
                  }}
                  onChange={(field, value) => handleProfileChange(field, value)}
                  isEditMode={isEditMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
