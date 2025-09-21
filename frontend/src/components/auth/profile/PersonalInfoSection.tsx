// src/components/auth/profile/PersonalInfoSection.tsx

import React, { useState, useEffect } from "react";
import { User, Camera, Edit } from "lucide-react";
import { Input } from "../../ui/bits";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/Avatar";
import { useAutosave } from "./ProfileAutosaveProvider";

interface PersonalInfoData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  maternal_last_name?: string;
  preferred_name?: string;
  father_name?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  identity_mark?: string;
  medical_fitness?: boolean;
  character_certificate?: boolean;
  height?: number;
  email: string;
  avatar?: string;
  avatar_url?: string;
}

interface PersonalInfoSectionProps {
  data: PersonalInfoData;
  onChange: (field: keyof PersonalInfoData, value: string) => void;
  errors?: Record<string, string>;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  data,
  onChange,
  errors = {},
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

  const getInitials = () => {
    const first = localData.first_name?.charAt(0) || "";
    const last = localData.last_name?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm profile-form">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Personal Information
        </h3>
        <p className="text-xs text-gray-600 mt-1">
          Your basic profile information and contact details
        </p>
      </div>

      <div className="p-4">
        {/* Resume/CV Style Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Avatar Section */}
          <div className="flex flex-col items-center lg:items-start space-y-3">
            <div className="relative">
              <Avatar className="w-24 h-24 border-3 border-white shadow-lg">
                <AvatarImage
                  src={localData.avatar_url || localData.avatar}
                  alt={`${localData.first_name} ${localData.last_name}`}
                />
                <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>

              {/* Avatar Edit Button */}
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                <Camera className="w-3 h-3" />
              </button>
            </div>

            {/* Avatar Info */}
            <div className="text-center lg:text-left">
              <h4 className="font-semibold text-gray-900 text-base">
                {localData.first_name} {localData.last_name}
              </h4>
              {localData.preferred_name && (
                <p className="text-xs text-gray-600">"{localData.preferred_name}"</p>
              )}
              <p className="text-xs text-gray-500 mt-1">{localData.email}</p>
            </div>
          </div>

          {/* Right Side - Form Fields */}
          <div className="flex-1 space-y-4">
            {/* Name Section */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center">
                <Edit className="w-3 h-3 mr-1" />
                Full Name
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={localData.first_name}
                    onChange={(e) => handleFieldChange("first_name", e.target.value)}
                    className="w-full h-8 text-sm border-gray-300 focus:ring-blue-500 focus-visible:ring-0"
                    style={{
                      borderBottom: '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = '2px solid #d1d5db';
                    }}
                    placeholder="Enter first name"
                  />
                  {errors["first_name"] && (
                    <p className="text-red-500 text-xs mt-1">{errors["first_name"]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={localData.last_name}
                    onChange={(e) => handleFieldChange("last_name", e.target.value)}
                    className="w-full h-8 text-sm border-gray-300 focus:ring-blue-500 focus-visible:ring-0"
                    style={{
                      borderBottom: '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = '2px solid #d1d5db';
                    }}
                    placeholder="Enter last name"
                  />
                  {errors["last_name"] && (
                    <p className="text-red-500 text-xs mt-1">{errors["last_name"]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <Input
                    type="text"
                    value={localData.middle_name || ""}
                    onChange={(e) => handleFieldChange("middle_name", e.target.value)}
                    className="w-full h-8 text-sm border-gray-300 focus:ring-blue-500 focus-visible:ring-0"
                    style={{
                      borderBottom: '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = '2px solid #d1d5db';
                    }}
                    placeholder="Enter middle name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Maternal Last Name
                  </label>
                  <Input
                    type="text"
                    value={localData.maternal_last_name || ""}
                    onChange={(e) => handleFieldChange("maternal_last_name", e.target.value)}
                    className="w-full h-8 text-sm border-gray-300 focus:ring-blue-500 focus-visible:ring-0"
                    style={{
                      borderBottom: '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = '2px solid #d1d5db';
                    }}
                    placeholder="Enter maternal last name"
                  />
                </div>
              </div>
            </div>

            {/* Personal Details Section */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center">
                <User className="w-3 h-3 mr-1" />
                Personal Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Father's Name
                  </label>
                  <Input
                    type="text"
                    value={localData.father_name || ""}
                    onChange={(e) => handleFieldChange("father_name", e.target.value)}
                    className="w-full h-8 text-sm border-gray-300 focus:ring-blue-500 focus-visible:ring-0"
                    style={{
                      borderBottom: '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = '2px solid #d1d5db';
                    }}
                    placeholder="Enter father's name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={localData.date_of_birth || ""}
                    onChange={(e) => handleFieldChange("date_of_birth", e.target.value)}
                    className="w-full h-8 text-sm border-gray-300 focus:ring-blue-500 focus-visible:ring-0"
                    style={{
                      borderBottom: '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = '2px solid #d1d5db';
                    }}
                    placeholder="mm/dd/yyyy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={localData.gender || ""}
                    onChange={(e) => handleFieldChange("gender", e.target.value)}
                    className="w-full h-8 text-sm border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-blue-500 focus-visible:ring-0 bg-transparent"
                    style={{
                      borderBottom: '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = '2px solid #d1d5db';
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Marital Status
                  </label>
                  <select
                    value={localData.marital_status || ""}
                    onChange={(e) => handleFieldChange("marital_status", e.target.value)}
                    className="w-full h-8 text-sm border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-blue-500 focus-visible:ring-0 bg-transparent"
                    style={{
                      borderBottom: '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = '2px solid #d1d5db';
                    }}
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="separated">Separated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Identity Mark
                  </label>
                  <Input
                    type="text"
                    value={localData.identity_mark || ""}
                    onChange={(e) => handleFieldChange("identity_mark", e.target.value)}
                    className="w-full h-8 text-sm border-gray-300 focus:ring-blue-500 focus-visible:ring-0"
                    style={{
                      borderBottom: '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = '2px solid #d1d5db';
                    }}
                    placeholder="Enter identity mark"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <Input
                    type="number"
                    value={localData.height || ""}
                    onChange={(e) => handleFieldChange("height", e.target.value)}
                    className="w-full h-8 text-sm border-gray-300 focus:ring-blue-500 focus-visible:ring-0"
                    style={{
                      borderBottom: '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = '2px solid #d1d5db';
                    }}
                    placeholder="Enter height in cm"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="medical_fitness"
                    checked={localData.medical_fitness || false}
                    onChange={(e) => handleFieldChange("medical_fitness", e.target.checked.toString())}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="medical_fitness" className="ml-2 text-xs font-medium text-gray-700">
                    Medical Fitness Certificate
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="character_certificate"
                    checked={localData.character_certificate || false}
                    onChange={(e) => handleFieldChange("character_certificate", e.target.checked.toString())}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="character_certificate" className="ml-2 text-xs font-medium text-gray-700">
                    Character Certificate
                  </label>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center">
                <User className="w-3 h-3 mr-1" />
                Contact Information
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Preferred Name
                  </label>
                  <Input
                    type="text"
                    value={localData.preferred_name || ""}
                    onChange={(e) => handleFieldChange("preferred_name", e.target.value)}
                    className="w-full h-8 text-sm border-gray-300 focus:ring-blue-500 focus-visible:ring-0"
                    style={{
                      borderBottom: '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = '2px solid #d1d5db';
                    }}
                    placeholder="How you prefer to be called"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={localData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="w-full h-8 text-sm border-gray-300 focus:ring-blue-500 focus-visible:ring-0"
                    style={{
                      borderBottom: '2px solid #d1d5db'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = '2px solid #d1d5db';
                    }}
                    placeholder="Enter email address"
                  />
                  {errors["email"] && (
                    <p className="text-red-500 text-xs mt-1">{errors["email"]}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Autosave Status */}
        {isAutosaving && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            Saving changes...
          </div>
        )}
      </div>
    </div>
  );
};
