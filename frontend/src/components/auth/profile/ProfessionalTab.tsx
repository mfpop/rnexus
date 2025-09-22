import React from "react";
import { Lock } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_DEPARTMENTS_FOR_PROFILE, GET_ROLES_FOR_PROFILE } from "../../../graphql/userProfile";

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
  // Fetch departments and roles for dropdowns
  const { data: departmentsData, loading: departmentsLoading, error: departmentsError } = useQuery(GET_DEPARTMENTS_FOR_PROFILE);
  const { data: rolesData, loading: rolesLoading, error: rolesError } = useQuery(GET_ROLES_FOR_PROFILE);

  // Company options
  const companyOptions = [
    { value: "", label: "Select Company" },
    { value: "USA - LA", label: "USA - LA" },
    { value: "MX - Tijuana", label: "MX - Tijuana" },
    { value: "MX - Monterrey", label: "MX - Monterrey" },
  ];

  return (
    <div className="h-full flex-1 flex flex-col profile-form">
      <div className="flex-1 flex flex-col bg-white shadow-lg border border-gray-200 relative overflow-hidden">
        {/* Subtle paper texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white opacity-60"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        {/* Header */}
        <div className="p-6 border-b border-gray-200 relative z-10 min-h-[88px] flex items-center">
          <div className="flex items-center gap-3 w-full">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                Professional Information
              </h3>
              <p className="text-gray-600 text-sm">Manage your professional details and work information</p>
            </div>
            {!canEditProfileStatus && (
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-2 border border-amber-200">
                <Lock className="w-4 h-4" />
                <span className="font-medium">Admin Only</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col p-8 relative z-10">
          <div className="space-y-8">
            {/* Company Field - First */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                Company
              </label>
              <div className="relative">
                <select
                  value={profileData.company || ""}
                  onChange={(e) => handleProfileChange("company", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                  style={{
                    borderBottom: '2px solid #d1d5db'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottom = 'none';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottom = '2px solid #d1d5db';
                  }}
                  disabled={!isEditMode}
                >
                  {companyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
              </div>
            </div>

            {/* Department Field - Second */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                Department
              </label>
              <div className="relative">
                <select
                  value={profileData.department || ""}
                  onChange={(e) => handleProfileChange("department", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                  style={{
                    borderBottom: '2px solid #d1d5db'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottom = 'none';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottom = '2px solid #d1d5db';
                  }}
                  disabled={!isEditMode || departmentsLoading}
                >
                  <option value="">
                    {departmentsLoading ? "Loading departments..." : "Select Department"}
                  </option>
                  {departmentsError ? (
                    <option value="" disabled>Error loading departments</option>
                  ) : (
                    departmentsData?.allDepartments?.map((dept: any) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
              </div>
            </div>

            {/* Position Field - Third */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                Position
              </label>
              <div className="relative">
                <select
                  value={profileData.position || ""}
                  onChange={(e) => handleProfileChange("position", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 disabled:text-gray-400 disabled:placeholder-gray-400"
                  style={{
                    borderBottom: '2px solid #d1d5db'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottom = 'none';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottom = '2px solid #d1d5db';
                  }}
                  disabled={!isEditMode || rolesLoading}
                >
                  <option value="">
                    {rolesLoading ? "Loading positions..." : "Select Position"}
                  </option>
                  {rolesError ? (
                    <option value="" disabled>Error loading positions</option>
                  ) : (
                    rolesData?.allRoles?.map((role: any) => (
                      <option key={role.id} value={role.title}>
                        {role.title}
                      </option>
                    ))
                  )}
                </select>
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
