// src/components/auth/profile/AddressSectionSimple.tsx

import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Input } from "../../ui/bits";
import { useAutosave } from "./ProfileAutosaveProvider";

interface AddressData {
  country?: string;
  state_province?: string;
  city?: string;
  zip_code?: string;
  street_address?: string;
  apartment_suite?: string;
  country_code?: string;
}

interface AddressSectionProps {
  data: AddressData;
  onChange: (field: keyof AddressData, value: string) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  data,
  onChange,
}) => {
  console.log("AddressSectionSimple is rendering with data:", data);
  const { autosaveField, isAutosaving } = useAutosave();
  const [localData, setLocalData] = useState<AddressData>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleFieldChange = (field: keyof AddressData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(field, value);

    // Autosave the field
    autosaveField(field, value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <MapPin className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Address (Simple Input)</h3>
          <p className="text-sm text-gray-600">Manage your address information</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Street Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address
          </label>
          <Input
            type="text"
            value={localData.street_address || ""}
            onChange={(e) => handleFieldChange("street_address", e.target.value)}
            placeholder="Enter your street address"
            className="w-full"
          />
        </div>

        {/* Apartment/Suite */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apartment/Suite (Optional)
          </label>
          <Input
            type="text"
            value={localData.apartment_suite || ""}
            onChange={(e) => handleFieldChange("apartment_suite", e.target.value)}
            placeholder="Apt, Suite, Unit, etc."
            className="w-full"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <Input
            type="text"
            value={localData.city || ""}
            onChange={(e) => handleFieldChange("city", e.target.value)}
            placeholder="Enter your city"
            className="w-full"
          />
        </div>

        {/* State/Province */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State/Province
          </label>
          <Input
            type="text"
            value={localData.state_province || ""}
            onChange={(e) => handleFieldChange("state_province", e.target.value)}
            placeholder="Enter your state or province"
            className="w-full"
          />
        </div>

        {/* ZIP Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code
          </label>
          <Input
            type="text"
            value={localData.zip_code || ""}
            onChange={(e) => handleFieldChange("zip_code", e.target.value)}
            placeholder="Enter your ZIP code"
            className="w-full"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <Input
            type="text"
            value={localData.country || ""}
            onChange={(e) => handleFieldChange("country", e.target.value)}
            placeholder="Enter your country"
            className="w-full"
          />
        </div>

        {/* Country Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country Code (Optional)
          </label>
          <Input
            type="text"
            value={localData.country_code || ""}
            onChange={(e) => handleFieldChange("country_code", e.target.value)}
            placeholder="e.g., US, CA, MX"
            className="w-full"
          />
        </div>

        {/* Address Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Address Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{localData.street_address || "No street address"}</p>
            <p>
              {localData.apartment_suite && `${localData.apartment_suite}, `}
              {localData.city || "No city"}
              {localData.state_province && `, ${localData.state_province}`}
              {localData.zip_code && ` ${localData.zip_code}`}
            </p>
            <p>
              {localData.country || "No country"}
              {localData.country_code && ` (${localData.country_code})`}
            </p>
          </div>
        </div>

        {/* Autosave Indicator */}
        {isAutosaving && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <div className="animate-spin rounded-full h-3 w-3 border border-gray-300 border-t-gray-600"></div>
            Saving...
          </div>
        )}
      </div>
    </div>
  );
};
