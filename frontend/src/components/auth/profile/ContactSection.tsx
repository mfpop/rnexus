// src/components/auth/profile/ContactSection.tsx

import React, { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { Input } from "../../ui/bits";
import { useAutosave } from "./ProfileAutosaveProvider";

interface ContactData {
  phone?: string;
  phone_country_code?: string;
  phone_type?: "mobile" | "home" | "work" | "other";
  secondary_phone?: string;
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
  const { autosaveField, isAutosaving } = useAutosave();
  const [localData, setLocalData] = useState<ContactData>(data);

  // Update local state when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleFieldChange = (field: keyof ContactData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(field, value);

    // Autosave individual field
    autosaveField(field, value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Phone className="w-5 h-5 mr-2 text-purple-600" />
          Contact Information
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Phone
            </label>
            <Input
              type="tel"
              value={localData.phone || ""}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              className="w-full"
              placeholder="Enter phone number"
            />
            {errors["phone"] && (
              <p className="text-red-500 text-sm mt-1">{errors["phone"]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Type
            </label>
            <select
              value={localData.phone_type || "mobile"}
              onChange={(e) => handleFieldChange("phone_type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="mobile">Mobile</option>
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Phone
            </label>
            <Input
              type="tel"
              value={localData.secondary_phone || ""}
              onChange={(e) =>
                handleFieldChange("secondary_phone", e.target.value)
              }
              className="w-full"
              placeholder="Enter secondary phone"
            />
            {errors["secondary_phone"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["secondary_phone"]}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Phone Type
            </label>
            <select
              value={localData.secondary_phone_type || "mobile"}
              onChange={(e) =>
                handleFieldChange("secondary_phone_type", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="mobile">Mobile</option>
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
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
