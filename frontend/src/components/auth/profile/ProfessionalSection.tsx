// src/components/auth/profile/ProfessionalSection.tsx

import React, { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";
import { Input } from "../../ui/bits";
import { useAutosave } from "./ProfileAutosaveProvider";

interface ProfessionalData {
  position?: string;
  department?: string;
  company?: string;
  industry?: string;
  years_experience?: string;
  skills?: string[];
  certifications?: string[];
}

interface ProfessionalSectionProps {
  data: ProfessionalData;
  onChange: (field: keyof ProfessionalData, value: string | string[]) => void;
  errors?: Record<string, string>;
}

export const ProfessionalSection: React.FC<ProfessionalSectionProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const { autosaveField, isAutosaving } = useAutosave();
  const [localData, setLocalData] = useState<ProfessionalData>(data);

  // Update local state when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleFieldChange = (field: keyof ProfessionalData, value: string) => {
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
          <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
          Professional Information
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <Input
              type="text"
              value={localData.position || ""}
              onChange={(e) => handleFieldChange("position", e.target.value)}
              className="w-full"
              placeholder="Your current position"
            />
            {errors["position"] && (
              <p className="text-red-500 text-sm mt-1">{errors["position"]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <Input
              type="text"
              value={localData.department || ""}
              onChange={(e) => handleFieldChange("department", e.target.value)}
              className="w-full"
              placeholder="Your department"
            />
            {errors["department"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["department"]}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <Input
              type="text"
              value={localData.company || ""}
              onChange={(e) => handleFieldChange("company", e.target.value)}
              className="w-full"
              placeholder="Company name"
            />
            {errors["company"] && (
              <p className="text-red-500 text-sm mt-1">{errors["company"]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <Input
              type="text"
              value={localData.industry || ""}
              onChange={(e) => handleFieldChange("industry", e.target.value)}
              className="w-full"
              placeholder="Industry sector"
            />
            {errors["industry"] && (
              <p className="text-red-500 text-sm mt-1">{errors["industry"]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            <Input
              type="number"
              value={localData.years_experience || ""}
              onChange={(e) =>
                handleFieldChange("years_experience", e.target.value)
              }
              className="w-full"
              placeholder="Years of experience"
              min="0"
            />
            {errors["years_experience"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["years_experience"]}
              </p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills
          </label>
          <textarea
            value={localData.skills?.join(", ") || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              const skills = e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s);
              const newData = { ...localData, skills };
              setLocalData(newData);
              onChange("skills", skills);
              autosaveField("skills", skills);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="Enter skills separated by commas"
            rows={2}
          />
          {errors["skills"] && (
            <p className="text-red-500 text-sm mt-1">{errors["skills"]}</p>
          )}
        </div>

        {/* Certifications */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certifications
          </label>
          <textarea
            value={localData.certifications?.join(", ") || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              const certifications = e.target.value
                .split(",")
                .map((c) => c.trim())
                .filter((c) => c);
              const newData = { ...localData, certifications };
              setLocalData(newData);
              onChange("certifications", certifications);
              autosaveField("certifications", certifications);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="Enter certifications separated by commas"
            rows={2}
          />
          {errors["certifications"] && (
            <p className="text-red-500 text-sm mt-1">
              {errors["certifications"]}
            </p>
          )}
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
