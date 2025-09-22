// src/components/auth/profile/BioSection.tsx

import React, { useState, useEffect } from "react";
import { Globe, Linkedin, Twitter, Github, Facebook, Instagram } from "lucide-react";
import { useAutosave } from "./ProfileAutosaveProvider";

interface BioData {
  bio?: string;
  short_bio?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
}

interface BioSectionProps {
  data: BioData;
  onChange: (field: keyof BioData, value: string) => void;
  errors?: Record<string, string>;
  isEditMode?: boolean;
}

export const BioSection: React.FC<BioSectionProps> = ({
  data,
  onChange,
  errors = {},
  isEditMode = false,
}) => {
  const { autosaveField } = useAutosave();
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
    <div className="flex flex-col h-full profile-form">
      {/* Biography Section - Takes most of the available vertical space */}
      <div className="group flex-1 flex flex-col min-h-[400px] mb-0">
        <h3 className="text-lg font-bold text-gray-900 font-sans mb-2">Biography</h3>
        <div className="relative flex-1 min-h-0">
          <textarea
            value={localData.bio || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleFieldChange("bio", e.target.value)
            }
            className="w-full h-full min-h-[400px] border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 resize-none disabled:text-gray-400 disabled:placeholder-gray-400"
            style={{
              borderBottom: '2px solid #d1d5db'
            }}
            onFocus={(e) => {
              e.target.style.borderBottom = 'none';
            }}
            onBlur={(e) => {
              e.target.style.borderBottom = '2px solid #d1d5db';
            }}
            placeholder="Tell us your story, experiences, and what makes you unique..."
            disabled={!isEditMode}
          />
        </div>
        {errors["bio"] && (
          <p className="text-red-500 text-sm mt-1">{errors["bio"]}</p>
        )}
      </div>

      {/* Social Links Section - Compact at bottom */}
      <div className="space-y-4">
        {/* Social Links Title */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-900 font-sans">Social Links</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Website */}
          <div className="group">
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-0 top-1/2 transform -translate-y-1/2 text-green-600" />
              <input
                type="url"
                value={localData.website || ""}
                onChange={(e) => handleFieldChange("website", e.target.value)}
                className="w-full border-0 border-b-2 border-gray-300 rounded-none pl-6 pr-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                disabled={!isEditMode}
                style={{
                  borderBottom: '2px solid #d1d5db'
                }}
                onFocus={(e) => {
                  e.target.style.borderBottom = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottom = '2px solid #d1d5db';
                }}
                placeholder="Website URL"
              />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
            </div>
            {errors["website"] && (
              <p className="text-red-500 text-sm mt-1">{errors["website"]}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div className="group">
            <div className="relative">
              <Linkedin className="w-4 h-4 absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-600" />
              <input
                type="url"
                value={localData.linkedin || ""}
                onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                className="w-full border-0 border-b-2 border-gray-300 rounded-none pl-6 pr-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                disabled={!isEditMode}
                style={{
                  borderBottom: '2px solid #d1d5db'
                }}
                onFocus={(e) => {
                  e.target.style.borderBottom = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottom = '2px solid #d1d5db';
                }}
                placeholder="LinkedIn URL"
              />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
            </div>
            {errors["linkedin"] && (
              <p className="text-red-500 text-sm mt-1">{errors["linkedin"]}</p>
            )}
          </div>

          {/* Twitter */}
          <div className="group">
            <div className="relative">
              <Twitter className="w-4 h-4 absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <input
                type="url"
                value={localData.twitter || ""}
                onChange={(e) => handleFieldChange("twitter", e.target.value)}
                className="w-full border-0 border-b-2 border-gray-300 rounded-none pl-6 pr-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                disabled={!isEditMode}
                style={{
                  borderBottom: '2px solid #d1d5db'
                }}
                onFocus={(e) => {
                  e.target.style.borderBottom = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottom = '2px solid #d1d5db';
                }}
                placeholder="Twitter URL"
              />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
            </div>
            {errors["twitter"] && (
              <p className="text-red-500 text-sm mt-1">{errors["twitter"]}</p>
            )}
          </div>

          {/* GitHub */}
          <div className="group">
            <div className="relative">
              <Github className="w-4 h-4 absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-700" />
              <input
                type="url"
                value={localData.github || ""}
                onChange={(e) => handleFieldChange("github", e.target.value)}
                className="w-full border-0 border-b-2 border-gray-300 rounded-none pl-6 pr-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                disabled={!isEditMode}
                style={{
                  borderBottom: '2px solid #d1d5db'
                }}
                onFocus={(e) => {
                  e.target.style.borderBottom = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottom = '2px solid #d1d5db';
                }}
                placeholder="GitHub URL"
              />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
            </div>
            {errors["github"] && (
              <p className="text-red-500 text-sm mt-1">{errors["github"]}</p>
            )}
          </div>

          {/* Facebook */}
          <div className="group">
            <div className="relative">
              <Facebook className="w-4 h-4 absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-600" />
              <input
                type="url"
                value={localData.facebook || ""}
                onChange={(e) => handleFieldChange("facebook", e.target.value)}
                className="w-full border-0 border-b-2 border-gray-300 rounded-none pl-6 pr-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                disabled={!isEditMode}
                style={{
                  borderBottom: '2px solid #d1d5db'
                }}
                onFocus={(e) => {
                  e.target.style.borderBottom = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottom = '2px solid #d1d5db';
                }}
                placeholder="Facebook URL"
              />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
            </div>
            {errors["facebook"] && (
              <p className="text-red-500 text-sm mt-1">{errors["facebook"]}</p>
            )}
          </div>

          {/* Instagram */}
          <div className="group">
            <div className="relative">
              <Instagram className="w-4 h-4 absolute left-0 top-1/2 transform -translate-y-1/2 text-pink-600" />
              <input
                type="url"
                value={localData.instagram || ""}
                onChange={(e) => handleFieldChange("instagram", e.target.value)}
                className="w-full border-0 border-b-2 border-gray-300 rounded-none pl-6 pr-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                disabled={!isEditMode}
                style={{
                  borderBottom: '2px solid #d1d5db'
                }}
                onFocus={(e) => {
                  e.target.style.borderBottom = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottom = '2px solid #d1d5db';
                }}
                placeholder="Instagram URL"
              />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
            </div>
            {errors["instagram"] && (
              <p className="text-red-500 text-sm mt-1">{errors["instagram"]}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BioSection;
