// src/components/auth/profile/ContactSection.tsx

import React, { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { Input } from "../../ui/bits";

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
  const [localData, setLocalData] = useState<ContactData>(data);
  const [isAutosaving] = useState(false);

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
              <div className="relative">
                <Input
                  type="tel"
                  value={localData.phone || ""}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent transition-colors hover:border-gray-400"
                  placeholder="Enter your primary phone number"
                />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
              </div>
              {errors["phone"] && (
                <p className="text-red-500 text-sm mt-2">{errors["phone"]}</p>
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
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent appearance-none transition-colors hover:border-gray-400"
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
              <div className="relative">
                <Input
                  type="tel"
                  value={localData.secondary_phone || ""}
                  onChange={(e) => handleFieldChange("secondary_phone", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent transition-colors hover:border-gray-400"
                  placeholder="Enter your secondary phone number"
                />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
              </div>
              {errors["secondary_phone"] && (
                <p className="text-red-500 text-sm mt-2">{errors["secondary_phone"]}</p>
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
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent appearance-none transition-colors hover:border-gray-400"
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
