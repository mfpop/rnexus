// src/components/auth/profile/AddressSection.tsx

import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Input } from "../../ui/bits";

interface AddressData {
  street_address?: string;
  apartment_suite?: string;
  city?: string;
  state_province?: string;
  zip_code?: string;
  country?: string;
  country_code?: string;
}

interface AddressSectionProps {
  data: AddressData;
  onChange: (field: keyof AddressData, value: string) => void;
  errors?: Record<string, string>;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [localData, setLocalData] = useState<AddressData>(data);
  const [isAutosaving] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleFieldChange = (field: keyof AddressData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(field, value);

    // Optional autosave functionality (can be implemented later)
    // For now, we'll just update the local state
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 relative overflow-hidden">
      {/* Subtle paper texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white opacity-60"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      <div className="relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <div className="flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Address Information</h3>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Complete your address details</p>
        </div>

        <div className="space-y-8">
          {/* Street Information - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                Street Address
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={localData.street_address || ""}
                  onChange={(e) => handleFieldChange("street_address", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent transition-colors hover:border-gray-400"
                  placeholder="Enter your street address"
                />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
              </div>
              {errors["street_address"] && (
                <p className="text-red-500 text-sm mt-2">{errors["street_address"]}</p>
              )}
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                Apartment/Suite
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={localData.apartment_suite || ""}
                  onChange={(e) => handleFieldChange("apartment_suite", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent transition-colors hover:border-gray-400"
                  placeholder="Apt, Suite, Unit, etc."
                />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
              </div>
              {errors["apartment_suite"] && (
                <p className="text-red-500 text-sm mt-2">{errors["apartment_suite"]}</p>
              )}
            </div>
          </div>

          {/* Location Information - Four Columns: Country, State, City, ZIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                Country
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={localData.country || ""}
                  onChange={(e) => handleFieldChange("country", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent transition-colors hover:border-gray-400"
                  placeholder="Country"
                />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
              </div>
              {errors["country"] && (
                <p className="text-red-500 text-sm mt-2">{errors["country"]}</p>
              )}
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                State/Province
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={localData.state_province || ""}
                  onChange={(e) => handleFieldChange("state_province", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent transition-colors hover:border-gray-400"
                  placeholder="State/Province"
                />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
              </div>
              {errors["state_province"] && (
                <p className="text-red-500 text-sm mt-2">{errors["state_province"]}</p>
              )}
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                City
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={localData.city || ""}
                  onChange={(e) => handleFieldChange("city", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent transition-colors hover:border-gray-400"
                  placeholder="City"
                />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
              </div>
              {errors["city"] && (
                <p className="text-red-500 text-sm mt-2">{errors["city"]}</p>
              )}
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                ZIP Code
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={localData.zip_code || ""}
                  onChange={(e) => handleFieldChange("zip_code", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent transition-colors hover:border-gray-400"
                  placeholder="ZIP Code"
                />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
              </div>
              {errors["zip_code"] && (
                <p className="text-red-500 text-sm mt-2">{errors["zip_code"]}</p>
              )}
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
