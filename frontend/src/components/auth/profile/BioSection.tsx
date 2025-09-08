// src/components/auth/profile/BioSection.tsx

import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { useAutosave } from "./ProfileAutosaveProvider";

interface BioData {
  bio?: string;
  short_bio?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

interface BioSectionProps {
  data: BioData;
  onChange: (field: keyof BioData, value: string) => void;
  errors?: Record<string, string>;
}

export const BioSection: React.FC<BioSectionProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const { autosaveField, isAutosaving } = useAutosave();
  const [localData, setLocalData] = useState<BioData>(data);

  // Update local state when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleFieldChange = (field: keyof BioData, value: string) => {
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
          <FileText className="w-5 h-5 mr-2 text-purple-600" />
          Biography & Social Links
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Bio
            </label>
            <textarea
              value={localData.short_bio || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleFieldChange("short_bio", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Brief description about yourself"
              rows={2}
            />
            {errors["short_bio"] && (
              <p className="text-red-500 text-sm mt-1">{errors["short_bio"]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Biography
            </label>
            <textarea
              value={localData.bio || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleFieldChange("bio", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Detailed biography"
              rows={4}
            />
            {errors["bio"] && (
              <p className="text-red-500 text-sm mt-1">{errors["bio"]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={localData.website || ""}
                onChange={(e) => handleFieldChange("website", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://yourwebsite.com"
              />
              {errors["website"] && (
                <p className="text-red-500 text-sm mt-1">{errors["website"]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={localData.linkedin || ""}
                onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/yourprofile"
              />
              {errors["linkedin"] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors["linkedin"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <input
                type="url"
                value={localData.twitter || ""}
                onChange={(e) => handleFieldChange("twitter", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://twitter.com/yourhandle"
              />
              {errors["twitter"] && (
                <p className="text-red-500 text-sm mt-1">{errors["twitter"]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub
              </label>
              <input
                type="url"
                value={localData.github || ""}
                onChange={(e) => handleFieldChange("github", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://github.com/yourusername"
              />
              {errors["github"] && (
                <p className="text-red-500 text-sm mt-1">{errors["github"]}</p>
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
