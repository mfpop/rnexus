import React from "react";
import { Lock } from "lucide-react";
import { Input } from "../../ui/bits";

interface ProfessionalTabProps {
  profileData: any;
  isEditMode: boolean;
  canEditProfileStatus: boolean;
  handleProfileChange: (field: string, value: any) => void;
}

const ProfessionalTab: React.FC<ProfessionalTabProps> = ({
  profileData,
  isEditMode,
  canEditProfileStatus,
  handleProfileChange,
}) => {
  return (
    <div className="h-full flex-1 flex flex-col profile-form">
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 relative overflow-hidden">
        {/* Subtle paper texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white opacity-60"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        {/* Header */}
        <div className="p-6 border-b border-gray-200 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">
              Professional Information
            </h3>
            {!canEditProfileStatus && (
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 ml-auto">
                <Lock className="w-4 h-4" />
                <span className="font-medium">Admin Only</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col p-8 relative z-10">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                  Position
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={profileData.position || ""}
                    onChange={(e) => handleProfileChange("position", e.target.value)}
                    className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none   bg-transparent transition-colors hover:border-gray-400"
                    placeholder="Enter your position"
                    disabled={!isEditMode}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                </div>
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                  Department
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={profileData.department || ""}
                    onChange={(e) => handleProfileChange("department", e.target.value)}
                    className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none   bg-transparent transition-colors hover:border-gray-400"
                    placeholder="Enter your department"
                    disabled={!isEditMode}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                </div>
              </div>
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                Company
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={profileData.company || ""}
                  onChange={(e) => handleProfileChange("company", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none   bg-transparent transition-colors hover:border-gray-400"
                  placeholder="Enter your company"
                  disabled={!isEditMode}
                />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTab;
