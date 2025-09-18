import React from "react";
import { Input } from "../../ui/bits";
import { AvatarUpload } from "./AvatarUpload";
import { BioSection } from "./BioSection";

interface GeneralTabProps {
  profileData: any;
  isEditMode: boolean;
  handleProfileChange: (field: string, value: any) => void;
  handleAvatarChange: (file: File | null) => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({
  profileData,
  isEditMode,
  handleProfileChange,
  handleAvatarChange,
}) => {

  return (
    <div className="h-full w-full overflow-hidden profile-form">
      <div className="h-full w-full">
        {/* Two Column Layout - Personal Information and Biography Cards */}
        <div className="h-full flex gap-4">
          {/* Left Column - Personal Information Card (65%) */}
          <div className="h-full w-[65%] bg-white rounded-xl shadow-lg border border-gray-200 p-6 relative overflow-hidden flex flex-col">
            {/* Subtle paper texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white opacity-60"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            <div className="relative z-10 flex-1 flex flex-col">
              {/* Header with Title and Subtitle (no edit/cancel/save buttons) */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                  <p className="text-gray-600 text-sm">Complete your personal details, address, and contact information</p>
                </div>
              </div>

              {/* Content Layout - Grid with Avatar and Full-Width Sections */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Left Column - Avatar Photo (1/5 width) */}
                  <div className="lg:col-span-1">
                    <div className="flex flex-col items-center">
                      <div className="mb-4">
                        <AvatarUpload
                          currentAvatar={profileData.avatar}
                          onAvatarChange={handleAvatarChange}
                          disabled={!isEditMode}
                        />
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        {isEditMode
                          ? (profileData.avatar ? "Click to change" : "Click to upload your photo")
                          : "Profile Photo"
                        }
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Personal Details (4/5 width) */}
                  <div className="lg:col-span-4">
                    {/* Personal Information - Two Rows */}
                    <div className="space-y-4">
                      {/* First Row - Names */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                            First Name (Nombres)
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={profileData.first_name || ""}
                              onChange={(e) => handleProfileChange("first_name", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              placeholder="Enter your first name"
                              disabled={!isEditMode}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                            Last Name (Paterno)
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={profileData.last_name || ""}
                              onChange={(e) => handleProfileChange("last_name", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              placeholder="Enter your last name"
                              disabled={!isEditMode}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                            Last Name (Materno)
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={profileData.maternal_last_name || ""}
                              onChange={(e) => handleProfileChange("maternal_last_name", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              placeholder="Enter your maternal last name"
                              disabled={!isEditMode}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200"></div>
                          </div>
                        </div>
                      </div>

                      {/* Second Row - Date of Birth, Gender, Marital Status */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                            Date of Birth
                          </label>
                          <div className="relative">
                            <Input
                              type="date"
                              value={profileData.date_of_birth || ""}
                              onChange={(e) => handleProfileChange("date_of_birth", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
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
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                            Gender
                          </label>
                          <div className="relative">
                            <select
                              value={profileData.gender || ""}
                              onChange={(e) => handleProfileChange("gender", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none bg-transparent transition-colors hover:border-gray-400 appearance-none"
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
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                              <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                            Marital Status
                          </label>
                          <div className="relative">
                            <select
                              value={profileData.marital_status || ""}
                              onChange={(e) => handleProfileChange("marital_status", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none bg-transparent transition-colors hover:border-gray-400 appearance-none"
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
                              <option value="">Select Status</option>
                              <option value="single">Single</option>
                              <option value="married">Married</option>
                              <option value="divorced">Divorced</option>
                              <option value="widowed">Widowed</option>
                              <option value="separated">Separated</option>
                            </select>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information - Full Width (Outside Grid) */}
                <div className="mt-8 space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h4>

                      {/* Street Address and Apartment/Suite on same line */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                            Street Address
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={profileData.street_address || ""}
                              onChange={(e) => handleProfileChange("street_address", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              placeholder="Enter your street address"
                              disabled={!isEditMode}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                            Apartment/Suite
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={profileData.apartment_suite || ""}
                              onChange={(e) => handleProfileChange("apartment_suite", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              placeholder="Apt, Suite, Unit, etc."
                              disabled={!isEditMode}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                          </div>
                        </div>
                      </div>

                      {/* Location Information - Full Width */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                              Country
                            </label>
                            <div className="relative">
                              <Input
                                type="text"
                                value={profileData.country || ""}
                                onChange={(e) => handleProfileChange("country", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                                placeholder="Country"
                                disabled={!isEditMode}
                              />
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                            </div>
                          </div>

                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                              State/Province
                            </label>
                            <div className="relative">
                              <Input
                                type="text"
                                value={profileData.state_province || ""}
                                onChange={(e) => handleProfileChange("state_province", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                                placeholder="State/Province"
                                disabled={!isEditMode}
                              />
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                            </div>
                          </div>

                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                              City
                            </label>
                            <div className="relative">
                              <Input
                                type="text"
                                value={profileData.city || ""}
                                onChange={(e) => handleProfileChange("city", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                                placeholder="City"
                                disabled={!isEditMode}
                              />
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                            </div>
                          </div>

                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                              ZIP Code
                            </label>
                            <div className="relative">
                              <Input
                                type="text"
                                value={profileData.zip_code || ""}
                                onChange={(e) => handleProfileChange("zip_code", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                                placeholder="ZIP Code"
                                disabled={!isEditMode}
                              />
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                </div>

                {/* Contact Information - Full Width (Outside Grid) */}
                <div className="mt-8 space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h4>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                            Primary Phone
                          </label>
                          <div className="relative">
                            <Input
                              type="tel"
                              value={profileData.phone || ""}
                              onChange={(e) => handleProfileChange("phone", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              placeholder="Enter your phone number"
                              disabled={!isEditMode}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                            Secondary Phone
                          </label>
                          <div className="relative">
                            <Input
                              type="tel"
                              value={profileData.secondary_phone || ""}
                              onChange={(e) => handleProfileChange("secondary_phone", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                              style={{
                                borderBottom: '2px solid #d1d5db'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderBottom = 'none';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderBottom = '2px solid #d1d5db';
                              }}
                              placeholder="Enter secondary phone number"
                              disabled={!isEditMode}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                            Primary Phone Type
                          </label>
                          <div className="relative">
                            <select
                              value={profileData.phone_type || ""}
                              onChange={(e) => handleProfileChange("phone_type", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none bg-transparent transition-colors hover:border-gray-400 appearance-none"
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
                              <option value="">Select Type</option>
                              <option value="mobile">Mobile</option>
                              <option value="home">Home</option>
                              <option value="work">Work</option>
                              <option value="other">Other</option>
                            </select>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors">
                            Secondary Phone Type
                          </label>
                          <div className="relative">
                            <select
                              value={profileData.secondary_phone_type || ""}
                              onChange={(e) => handleProfileChange("secondary_phone_type", e.target.value)}
                              className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none bg-transparent transition-colors hover:border-gray-400 appearance-none"
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
                              <option value="">Select Type</option>
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
              </div>
            </div>
          </div>

          {/* Right Column - Biography Card (35%) */}
          <div className="h-full w-[35%] bg-white rounded-xl shadow-lg border border-gray-200 p-6 relative overflow-hidden flex flex-col">
            {/* Subtle paper texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white opacity-60"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            {/* Header for Biography Section */}
            <div className="relative z-10 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Biography & Social Links</h3>
                  <p className="text-gray-600 text-xs">Share your story and connect with others</p>
                </div>
              </div>
            </div>

            {/* Content with no scroll - compact layout */}
            <div className="relative z-10 flex-1 min-h-0">
              <BioSection
                data={{
                  bio: profileData.bio,
                  short_bio: profileData.short_bio,
                  website: profileData.website,
                  linkedin: profileData.linkedin,
                  twitter: profileData.twitter,
                  github: profileData.github,
                  facebook: profileData.facebook,
                  instagram: profileData.instagram,
                }}
                onChange={(field, value) => handleProfileChange(field, value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
