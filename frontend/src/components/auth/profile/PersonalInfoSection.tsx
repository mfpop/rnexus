// src/components/auth/profile/PersonalInfoSection.tsx

import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Input } from '../../ui/bits';
import { useAutosave } from './ProfileAutosaveProvider';

interface PersonalInfoData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  maternal_last_name?: string;
  preferred_name?: string;
  email: string;
}

interface PersonalInfoSectionProps {
  data: PersonalInfoData;
  onChange: (field: keyof PersonalInfoData, value: string) => void;
  errors?: Record<string, string>;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  data,
  onChange,
  errors = {}
}) => {
  const { autosaveField, isAutosaving } = useAutosave();
  const [localData, setLocalData] = useState<PersonalInfoData>(data);

  // Update local state when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleFieldChange = (field: keyof PersonalInfoData, value: string) => {
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
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Personal Information
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={localData.first_name}
                onChange={(e) => handleFieldChange("first_name", e.target.value)}
                className="w-full"
                placeholder="Enter first name"
              />
              {errors['first_name'] && <p className="text-red-500 text-sm mt-1">{errors['first_name']}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
              <Input
                type="text"
                value={localData.middle_name || ""}
                onChange={(e) => handleFieldChange("middle_name", e.target.value)}
                className="w-full"
                placeholder="Enter middle name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={localData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                className="w-full"
                placeholder="Enter email address"
              />
              {errors['email'] && <p className="text-red-500 text-sm mt-1">{errors['email']}</p>}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={localData.last_name}
                onChange={(e) => handleFieldChange("last_name", e.target.value)}
                className="w-full"
                placeholder="Enter last name"
              />
              {errors['last_name'] && <p className="text-red-500 text-sm mt-1">{errors['last_name']}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Name</label>
              <Input
                type="text"
                value={localData.preferred_name || ""}
                onChange={(e) => handleFieldChange("preferred_name", e.target.value)}
                className="w-full"
                placeholder="Enter preferred name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maternal Last Name</label>
              <Input
                type="text"
                value={localData.maternal_last_name || ""}
                onChange={(e) => handleFieldChange("maternal_last_name", e.target.value)}
                className="w-full"
                placeholder="Enter maternal last name"
              />
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
