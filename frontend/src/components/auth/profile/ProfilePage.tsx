// src/components/auth/profile/ProfilePage.tsx

import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  FileText,
  Briefcase,
  GraduationCap,
  Building,
  Shield,
} from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../../../graphql/userProfile";
import { ProfileAutosaveProvider } from "./ProfileAutosaveProvider";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { AddressSection } from "./AddressSection";
import { ContactSection } from "./ContactSection";
import { BioSection } from "./BioSection";
import { ProfessionalSection } from "./ProfessionalSection";
import { EducationSection } from "./EducationSection";
import { WorkExperienceSection } from "./WorkExperienceSection";
import { SecuritySection } from "./SecuritySection";

interface ProfileData {
  // Personal Info
  first_name?: string;
  last_name?: string;
  email?: string;
  date_of_birth?: string;
  gender?: string;

  // Address
  country?: string;
  state?: string;
  city?: string;
  zip_code?: string;
  address_line_1?: string;
  address_line_2?: string;

  // Contact
  phone?: string;
  phone_country_code?: string;
  phone_type?: "mobile" | "home" | "work" | "other";
  secondary_phone?: string;
  secondary_phone_type?: "mobile" | "home" | "work" | "other";

  // Bio
  bio?: string;
  short_bio?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;

  // Professional
  position?: string;
  department?: string;
  company?: string;
  industry?: string;
  years_experience?: string;
  skills?: string[];
  certifications?: string[];

  // Education & Work
  education?: any[];
  work_experience?: any[];
}

const tabs = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "address", label: "Address", icon: MapPin },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "bio", label: "Bio & Links", icon: FileText },
  { id: "professional", label: "Current Role", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Work History", icon: Building },
  { id: "security", label: "Security", icon: Shield },
];

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState<ProfileData>({});

  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (data?.userProfile) {
      setProfileData(data.userProfile);
    }
  }, [data]);

  const handlePersonalInfoChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBioChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfessionalChange = (
    field: string,
    value: string | string[],
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (field: string, value: any[]) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWorkExperienceChange = (field: string, value: any[]) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = async (passwordData: any) => {
    // Handle password change separately as it might need different mutation
    console.log("Password change requested:", passwordData);
    // Implement password change logic here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading profile: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <PersonalInfoSection
            data={{
              first_name: profileData.first_name || "",
              last_name: profileData.last_name || "",
              email: profileData.email || "",
            }}
            onChange={handlePersonalInfoChange}
          />
        );

      case "address":
        return (
          <AddressSection
            data={{
              country: profileData.country,
              state_province: profileData.state,
              city: profileData.city,
              zip_code: profileData.zip_code,
              street_address: profileData.address_line_1,
              apartment_suite: profileData.address_line_2,
            }}
            onChange={handleAddressChange}
          />
        );

      case "contact":
        return (
          <ContactSection
            data={{
              phone: profileData.phone,
              phone_country_code: profileData.phone_country_code,
              phone_type: profileData.phone_type,
              secondary_phone: profileData.secondary_phone,
              secondary_phone_type: profileData.secondary_phone_type,
            }}
            onChange={handleContactChange}
          />
        );

      case "bio":
        return (
          <BioSection
            data={{
              bio: profileData.bio,
              short_bio: profileData.short_bio,
              website: profileData.website,
              linkedin: profileData.linkedin,
              twitter: profileData.twitter,
              github: profileData.github,
            }}
            onChange={handleBioChange}
          />
        );

      case "professional":
        return (
          <ProfessionalSection
            data={{
              position: profileData.position,
              department: profileData.department,
              company: profileData.company,
              industry: profileData.industry,
              years_experience: profileData.years_experience,
              skills: profileData.skills,
              certifications: profileData.certifications,
            }}
            onChange={handleProfessionalChange}
          />
        );

      case "education":
        return (
          <EducationSection
            data={{
              education: profileData.education,
            }}
            onChange={handleEducationChange}
          />
        );

      case "experience":
        return (
          <WorkExperienceSection
            data={{
              work_experience: profileData.work_experience,
            }}
            onChange={handleWorkExperienceChange}
          />
        );

      case "security":
        return <SecuritySection onPasswordChange={handlePasswordChange} />;

      default:
        return null;
    }
  };

  return (
    <ProfileAutosaveProvider>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-50 min-h-96">{renderTabContent()}</div>
      </div>
    </ProfileAutosaveProvider>
  );
};
