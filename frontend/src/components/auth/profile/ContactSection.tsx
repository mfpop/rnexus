// src/components/auth/profile/ContactSection.tsx

import React, { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { Input } from "../../ui/bits";
import { validatePhoneNumber, validateCountryCode, formatPhoneNumberAsTyped, getAvailableCountryCodes } from "../../../lib/phoneValidation";

interface ContactData {
  phone?: string;
  phone_country_code?: string;
  phone_type?: "mobile" | "home" | "work" | "other";
  secondary_phone?: string;
  secondary_phone_country_code?: string;
  secondary_phone_type?: "mobile" | "home" | "work" | "other";
}

interface ContactSectionProps {
  data: ContactData;
  onChange: (field: keyof ContactData, value: string) => void;
  errors?: Record<string, string>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [localData, setLocalData] = useState<ContactData>(data);
  const [isAutosaving] = useState(false);
  const [phoneErrors, setPhoneErrors] = useState<{
    phone?: string;
    phone_country_code?: string;
    secondary_phone?: string;
    secondary_phone_country_code?: string;
  }>({});

  // Available country codes
  const countryCodes = getAvailableCountryCodes();

  // Update local state when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleFieldChange = (field: keyof ContactData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(field, value);

    // Optional autosave functionality (can be implemented later)
    // For now, we'll just update the local state
  };

  // Handle phone number change with validation
  const handlePhoneChange = (field: string, value: string, countryCodeField: string) => {
    handleFieldChange(field as keyof ContactData, value);

    // Clear previous error
    setPhoneErrors(prev => ({ ...prev, [field]: undefined }));

    // Validate if both phone and country code are present
    const countryCode = localData[countryCodeField as keyof ContactData] || '';
    if (value && countryCode) {
      const validation = validatePhoneNumber(value, countryCode as string);
      if (!validation.isValid) {
        setPhoneErrors(prev => ({ ...prev, [field]: validation.error }));
      }
    }
  };

  // Handle country code change with validation
  const handleCountryCodeChange = (field: string, value: string, phoneField: string) => {
    handleFieldChange(field as keyof ContactData, value);

    // Clear previous error
    setPhoneErrors(prev => ({ ...prev, [field]: undefined }));

    // Validate country code format
    const validation = validateCountryCode(value);
    if (!validation.isValid) {
      setPhoneErrors(prev => ({ ...prev, [field]: validation.error }));
      return;
    }

    // Validate phone number if present
    const phoneNumber = localData[phoneField as keyof ContactData] || '';
    if (phoneNumber) {
      const phoneValidation = validatePhoneNumber(phoneNumber as string, value);
      if (!phoneValidation.isValid) {
        setPhoneErrors(prev => ({ ...prev, [phoneField]: phoneValidation.error }));
      }
    }
  };

  // Format phone number as user types
  const handlePhoneInput = (field: string, value: string, countryCodeField: string) => {
    const countryCode = localData[countryCodeField as keyof ContactData] || '';
    const formatted = formatPhoneNumberAsTyped(value, countryCode as string);
    handlePhoneChange(field, formatted, countryCodeField);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 relative overflow-hidden profile-form">
      {/* Subtle paper texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white opacity-60"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      <div className="relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <div className="flex items-center">
              <Phone className="w-6 h-6 mr-3 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Contact Information</h3>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Add your contact details</p>
        </div>

        <div className="space-y-8">
          {/* Primary Phone and Type - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                Primary Phone
              </label>
              <div className="flex gap-2">
                {/* Country Code Field */}
                <div className="group relative w-20">
                  <select
                    value={localData.phone_country_code || ""}
                    onChange={(e) => handleCountryCodeChange("phone_country_code", e.target.value, "phone")}
                    className={`w-full border-0 border-b-2 rounded-none px-0 py-3 h-12 text-base focus:outline-none bg-transparent transition-colors hover:border-gray-400 text-center appearance-none ${
                      phoneErrors.phone_country_code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{
                      borderBottom: phoneErrors.phone_country_code ? '2px solid #ef4444' : '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = phoneErrors.phone_country_code ? '2px solid #ef4444' : '2px solid #d1d5db';
                    }}
                  >
                    <option value="">+1</option>
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200 ${
                    phoneErrors.phone_country_code ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}></div>
                </div>
                {/* Phone Number Field */}
                <div className="group relative flex-1">
                  <Input
                    type="tel"
                    value={localData.phone || ""}
                    onChange={(e) => handlePhoneInput("phone", e.target.value, "phone_country_code")}
                    className={`w-full border-0 border-b-2 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 ${
                      phoneErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{
                      borderBottom: phoneErrors.phone ? '2px solid #ef4444' : '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = phoneErrors.phone ? '2px solid #ef4444' : '2px solid #d1d5db';
                    }}
                    placeholder="Enter your phone number"
                  />
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200 ${
                    phoneErrors.phone ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}></div>
                </div>
              </div>
              {/* Error messages */}
              {(phoneErrors.phone_country_code || phoneErrors.phone || errors["phone"]) && (
                <div className="mt-1 text-sm text-red-600">
                  {phoneErrors.phone_country_code || phoneErrors.phone || errors["phone"]}
                </div>
              )}
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                Phone Type
              </label>
              <div className="relative">
                <select
                  value={localData.phone_type || "mobile"}
                  onChange={(e) => handleFieldChange("phone_type", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus-visible:ring-0 bg-transparent appearance-none transition-colors hover:border-gray-400"
                >
                  <option value="mobile">Mobile</option>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
              </div>
            </div>
          </div>

          {/* Secondary Phone and Type - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                Secondary Phone
              </label>
              <div className="flex gap-2">
                {/* Country Code Field */}
                <div className="group relative w-20">
                  <select
                    value={localData.secondary_phone_country_code || ""}
                    onChange={(e) => handleCountryCodeChange("secondary_phone_country_code", e.target.value, "secondary_phone")}
                    className={`w-full border-0 border-b-2 rounded-none px-0 py-3 h-12 text-base focus:outline-none bg-transparent transition-colors hover:border-gray-400 text-center appearance-none ${
                      phoneErrors.secondary_phone_country_code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{
                      borderBottom: phoneErrors.secondary_phone_country_code ? '2px solid #ef4444' : '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = phoneErrors.secondary_phone_country_code ? '2px solid #ef4444' : '2px solid #d1d5db';
                    }}
                  >
                    <option value="">+1</option>
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200 ${
                    phoneErrors.secondary_phone_country_code ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}></div>
                </div>
                {/* Phone Number Field */}
                <div className="group relative flex-1">
                  <Input
                    type="tel"
                    value={localData.secondary_phone || ""}
                    onChange={(e) => handlePhoneInput("secondary_phone", e.target.value, "secondary_phone_country_code")}
                    className={`w-full border-0 border-b-2 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 ${
                      phoneErrors.secondary_phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{
                      borderBottom: phoneErrors.secondary_phone ? '2px solid #ef4444' : '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = phoneErrors.secondary_phone ? '2px solid #ef4444' : '2px solid #d1d5db';
                    }}
                    placeholder="Enter secondary phone number"
                  />
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200 ${
                    phoneErrors.secondary_phone ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}></div>
                </div>
              </div>
              {/* Error messages */}
              {(phoneErrors.secondary_phone_country_code || phoneErrors.secondary_phone || errors["secondary_phone"]) && (
                <div className="mt-1 text-sm text-red-600">
                  {phoneErrors.secondary_phone_country_code || phoneErrors.secondary_phone || errors["secondary_phone"]}
                </div>
              )}
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                Secondary Phone Type
              </label>
              <div className="relative">
                <select
                  value={localData.secondary_phone_type || "mobile"}
                  onChange={(e) => handleFieldChange("secondary_phone_type", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus-visible:ring-0 bg-transparent appearance-none transition-colors hover:border-gray-400"
                >
                  <option value="mobile">Mobile</option>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
              </div>
            </div>
          </div>
        </div>

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
