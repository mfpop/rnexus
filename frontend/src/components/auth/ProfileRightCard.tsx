import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  Key,
  GraduationCap,
  Briefcase,
  Lock,
} from "lucide-react";
import { Button } from "../ui/bits";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_USER_PROFILE,
  GetUserProfileData,
} from "../../graphql/userProfile";
import {
  UPDATE_USER_PROFILE,
  UPLOAD_AVATAR,
} from "../../graphql/userProfile";
import {
  GeneralTab,
  ProfessionalTab,
  EducationTab,
  ExperienceTab,
  SecurityTab,
} from "./profile";

interface ProfileData {
  username: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  maternal_last_name?: string;
  father_name?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  identity_mark?: string;
  medical_fitness?: boolean;
  character_certificate?: boolean;
  height?: number;
  bio?: string;
  avatar?: string;
  avatarUrl?: string;
  phone?: string;
  phone_country_code?: string;
  phone_type?: string;
  secondary_phone?: string;
  secondary_phone_country_code?: string;
  secondary_phone_type?: string;
  country?: string;
  state_province?: string;
  city?: string;
  zip_code?: string;
  street_address?: string;
  apartment_suite?: string;
  position?: string;
    department?: string;
  company?: string;
  education?: any[];
  work_experience?: any[];
  is_active?: boolean;
  preferred_name?: string;
  passwordSuccessMessage?: string;
  passwordErrorMessage?: string;
}

const ProfileRightCard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({} as ProfileData);
  const [passwordSuccessMessage] = useState("");
  const [passwordErrorMessage] = useState("");

  // Pagination states
  const [currentEducationPage, setCurrentEducationPage] = useState(1);
  const [currentExperiencePage, setCurrentExperiencePage] = useState(1);

  // GraphQL queries
  const { data: profileQueryData, loading: profileLoading, error: profileError } = useQuery<GetUserProfileData>(GET_USER_PROFILE);
  const [uploadAvatarMutation] = useMutation(UPLOAD_AVATAR);
  const [updateUserProfileMutation] = useMutation(UPDATE_USER_PROFILE);

  // Tab configuration
  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "professional", label: "Professional", icon: Briefcase, adminOnly: true },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "security", label: "Security", icon: Key },
  ];

  // Check if user can edit profile status
  const canEditProfileStatus = Boolean(user?.is_staff || user?.is_superuser);

  // Initialize profile data
  useEffect(() => {
    if (profileQueryData?.userProfile) {
      const userProfile = profileQueryData.userProfile as unknown as ProfileData;
      // Handle avatar field - use avatarUrl if available, otherwise avatar
      const avatarUrl = userProfile.avatarUrl || userProfile.avatar || (userProfile as any).avatarUrl;
      console.log('Avatar URL from GraphQL:', avatarUrl);
      console.log('Raw userProfile avatar field:', userProfile.avatar);
      console.log('Raw userProfile avatarUrl field:', userProfile.avatarUrl);

      let fullAvatarUrl = null;
      if (avatarUrl) {
        if (avatarUrl.startsWith('http')) {
          fullAvatarUrl = avatarUrl;
        } else if (avatarUrl.startsWith('data:')) {
          // Data URL (base64)
          fullAvatarUrl = avatarUrl;
        } else {
          // Relative path from backend
          const path = avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`;
          fullAvatarUrl = `http://localhost:8000${path}`;
        }
      }
      console.log('Full avatar URL passed to AvatarUpload:', fullAvatarUrl);

      setProfileData({
        ...userProfile,
        avatar: fullAvatarUrl,
        avatarUrl: fullAvatarUrl, // Set both fields for consistency
        education: Array.isArray(userProfile.education) ? userProfile.education : [],
        work_experience: Array.isArray(userProfile.work_experience) ? userProfile.work_experience : [],
      });
    }
  }, [profileQueryData]);

  // Handle profile changes
  const handleProfileChange = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle edit mode toggle
  const handleEdit = () => {
    setIsEditMode(true);
  };

  // Handle cancel changes
  const handleCancel = () => {
    setIsEditMode(false);
    // Reset profile data to original state
    if (profileQueryData?.userProfile) {
      const userProfile = profileQueryData.userProfile as unknown as ProfileData;
      const avatarUrl = userProfile.avatarUrl || userProfile.avatar || (userProfile as any).avatarUrl;

      let fullAvatarUrl = null;
      if (avatarUrl) {
        if (avatarUrl.startsWith('http')) {
          fullAvatarUrl = avatarUrl;
        } else if (avatarUrl.startsWith('data:')) {
          fullAvatarUrl = avatarUrl;
        } else {
          const path = avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`;
          fullAvatarUrl = `http://localhost:8000${path}`;
        }
      }

      setProfileData({
        ...userProfile,
        avatar: fullAvatarUrl,
        avatarUrl: fullAvatarUrl,
        education: Array.isArray(userProfile.education) ? userProfile.education : [],
        work_experience: Array.isArray(userProfile.work_experience) ? userProfile.work_experience : [],
      });
    }
  };

  // Handle save changes
  const handleSave = async () => {
    try {
      const variables: any = {};

      // Helper to pick either camelCase or snake_case values
      const pick = (camel: string, snake: string) => (profileData as any)[camel] ?? (profileData as any)[snake];

      variables.firstName = pick("firstName", "first_name");
      variables.lastName = pick("lastName", "last_name");
      variables.email = pick("email", "email");
      variables.middleName = pick("middleName", "middle_name");
      variables.maternalLastName = pick("maternalLastName", "maternal_last_name");
      variables.preferredName = pick("preferredName", "preferred_name");
      variables.position = pick("position", "position");
      variables.department = pick("department", "department");
      variables.phone = pick("phone", "phone");
      variables.phoneCountryCode = pick("phoneCountryCode", "phone_country_code");
      variables.phoneType = pick("phoneType", "phone_type");
      variables.secondaryPhone = pick("secondaryPhone", "secondary_phone");
      variables.secondaryPhoneType = pick("secondaryPhoneType", "secondary_phone_type");
      variables.streetAddress = pick("streetAddress", "street_address");
      variables.apartmentSuite = pick("apartmentSuite", "apartment_suite");
      variables.city = pick("city", "city");
      variables.stateProvince = pick("stateProvince", "state_province");
      variables.zipCode = pick("zipCode", "zip_code");
      variables.country = pick("country", "country");
      variables.countryCode = pick("countryCode", "country_code");
      variables.bio = pick("bio", "bio");

      // JSON fields should be stringified when provided
      if (profileData.education) variables.education = JSON.stringify(profileData.education);
      if (profileData.work_experience) variables.workHistory = JSON.stringify(profileData.work_experience);
      const visibility = (profileData as any).profileVisibility ?? (profileData as any).profile_visibility;
      if (visibility) variables.profileVisibility = JSON.stringify(visibility);

      const res = await updateUserProfileMutation({ variables });
      const result = res?.data?.updateUserProfile;
      if (result?.ok && result?.userProfile) {
        // Update local state with returned profile (may use camelCase keys)
        setProfileData((prev) => ({ ...prev, ...result.userProfile }));
        window.dispatchEvent(new Event("profile-updated"));
        setIsEditMode(false);
      } else {
        console.error("Profile save failed:", result?.errors);
      }
    } catch (err) {
      console.error("Profile save error:", err);
    }
  };

  // Handle delete profile (placeholder)
  const handleDelete = () => {
    console.log("Profile deletion not implemented yet");
  };

  // Handle refresh profile
  const handleRefresh = () => {
    // Reset to original data
    if (profileQueryData?.userProfile) {
      const userProfile = profileQueryData.userProfile as unknown as ProfileData;
      const avatarUrl = userProfile.avatarUrl || userProfile.avatar || (userProfile as any).avatarUrl;

      let fullAvatarUrl = null;
      if (avatarUrl) {
        if (avatarUrl.startsWith('http')) {
          fullAvatarUrl = avatarUrl;
        } else if (avatarUrl.startsWith('data:')) {
          fullAvatarUrl = avatarUrl;
        } else {
          const path = avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`;
          fullAvatarUrl = `http://localhost:8000${path}`;
        }
      }

      setProfileData({
        ...userProfile,
        avatar: fullAvatarUrl,
        avatarUrl: fullAvatarUrl,
        education: Array.isArray(userProfile.education) ? userProfile.education : [],
        work_experience: Array.isArray(userProfile.work_experience) ? userProfile.work_experience : [],
      });
      setIsEditMode(false);
    }
  };

  // Handle avatar changes
  const handleAvatarChange = (file: File | null) => {
    console.log('ProfileRightCard handleAvatarChange called with file:', file?.name);
    if (file) {
      // Show a preview immediately
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        console.log('FileReader loaded, dataUrl length:', dataUrl.length);
        setProfileData((prev) => ({ ...prev, avatar: dataUrl }));

        try {
          console.log('Calling uploadAvatarMutation...');
          // Call GraphQL mutation to upload avatar (expects base64/data URL string)
          const res = await uploadAvatarMutation({ variables: { avatar: dataUrl } });
          console.log('Upload response:', res);
          const uploaded = res?.data?.uploadAvatar;
          if (uploaded?.ok && uploaded?.userProfile) {
            // Process the returned avatar URL
            const returnedAvatarUrl = uploaded.userProfile.avatarUrl || uploaded.userProfile.avatar;
            let processedAvatarUrl = null;

            if (returnedAvatarUrl) {
              if (returnedAvatarUrl.startsWith('http')) {
                processedAvatarUrl = returnedAvatarUrl;
              } else if (returnedAvatarUrl.startsWith('data:')) {
                processedAvatarUrl = returnedAvatarUrl;
              } else {
                const path = returnedAvatarUrl.startsWith('/') ? returnedAvatarUrl : `/${returnedAvatarUrl}`;
                processedAvatarUrl = `http://localhost:8000${path}`;
              }
            }

            // Update both avatar fields
            setProfileData((prev) => ({
              ...prev,
              ...uploaded.userProfile,
              avatar: processedAvatarUrl,
              avatarUrl: processedAvatarUrl
            }));
            // Notify other parts of the app that profile changed
            window.dispatchEvent(new Event("profile-updated"));
            console.log('Avatar upload successful, profile updated');
          } else {
            console.error("Avatar upload failed:", uploaded?.errors);
            alert('Avatar upload failed: ' + (uploaded?.errors?.[0] || 'Unknown error'));
          }
        } catch (err) {
          console.error("Avatar upload error:", err);
          alert('Avatar upload error: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
      };
      reader.readAsDataURL(file);
    } else {
      // User removed avatar locally. If you want to delete on server, a separate mutation is needed.
      setProfileData((prev) => ({ ...prev, avatar: undefined }));
    }
  };


  // Handle education changes
  const handleAddEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      gpa: "",
      description: "",
    };
    setProfileData(prev => ({
          ...prev,
      education: [...(prev.education || []), newEducation]
    }));
  };

  const handleRemoveEducation = (id: string) => {
    setProfileData(prev => ({
          ...prev,
      education: prev.education?.filter(edu => edu.id !== id) || []
    }));
  };

  const handleUpdateEducation = (id: string, field: string, value: string) => {
    setProfileData(prev => ({
          ...prev,
      education: prev.education?.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ) || []
    }));
  };

  // Handle experience changes
  const handleAddExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      current: false,
      description: "",
      location: "",
    };
    setProfileData(prev => ({
      ...prev,
      work_experience: [...(prev.work_experience || []), newExperience]
    }));
  };

  const handleRemoveExperience = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      work_experience: prev.work_experience?.filter(exp => exp.id !== id) || []
    }));
  };

  const handleUpdateExperience = (id: string, field: string, value: string | boolean) => {
    setProfileData(prev => ({
            ...prev,
      work_experience: prev.work_experience?.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ) || []
    }));
  };

  // Handle password change
  const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
    // This would be implemented with the actual password change mutation
    console.log("Password change:", { oldPassword, newPassword });
  };

  // Pagination handlers
  const handleEducationPageChange = (page: number) => {
    setCurrentEducationPage(page);
  };

  const handleExperiencePageChange = (page: number) => {
    setCurrentExperiencePage(page);
  };

  // Calculate pagination
  const educationPerPage = 3;
  const experiencePerPage = 3;
  const educationArray = Array.isArray(profileData.education) ? profileData.education : [];
  const experienceArray = Array.isArray(profileData.work_experience) ? profileData.work_experience : [];
  const totalEducationPages = Math.ceil(educationArray.length / educationPerPage);
  const totalExperiencePages = Math.ceil(experienceArray.length / experiencePerPage);

  // Expose button handlers to window object for StableLayout
  useEffect(() => {
    const profileButtonHandlers = {
      save: handleSave,
      cancel: handleCancel,
      edit: handleEdit,
      delete: handleDelete,
      refresh: handleRefresh,
      isEditMode,
    };

    (window as any).profileButtonHandlers = profileButtonHandlers;
    console.log("Profile button handlers exposed:", {
      isEditMode,
    });

    return () => {
      delete (window as any).profileButtonHandlers;
    };
  }, [handleSave, handleCancel, handleEdit, handleDelete, handleRefresh, isEditMode]);

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <GeneralTab
            profileData={profileData}
            isEditMode={isEditMode}
            handleProfileChange={handleProfileChange}
            handleAvatarChange={handleAvatarChange}
          />
        );

      case "professional":
        return (
          <ProfessionalTab
            profileData={profileData}
            isEditMode={isEditMode}
            canEditProfileStatus={canEditProfileStatus}
            handleProfileChange={handleProfileChange}
          />
        );

      case "education":
        return (
          <EducationTab
            profileData={profileData}
            isEditMode={isEditMode}
            handleAddEducation={handleAddEducation}
            handleRemoveEducation={handleRemoveEducation}
            handleUpdateEducation={handleUpdateEducation}
            currentEducationPage={currentEducationPage}
            totalEducationPages={totalEducationPages}
            handleEducationPageChange={handleEducationPageChange}
          />
        );

      case "experience":
        return (
          <ExperienceTab
            profileData={profileData}
            isEditMode={isEditMode}
            handleAddExperience={handleAddExperience}
            handleRemoveExperience={handleRemoveExperience}
            handleUpdateExperience={handleUpdateExperience}
            currentExperiencePage={currentExperiencePage}
            totalExperiencePages={totalExperiencePages}
            handleExperiencePageChange={handleExperiencePageChange}
          />
        );

      case "security":
        return (
          <SecurityTab
            handlePasswordChange={handlePasswordChange}
            passwordSuccessMessage={passwordSuccessMessage}
            passwordErrorMessage={passwordErrorMessage}
          />
        );

      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Tab</h3>
              <p className="text-gray-600">Choose a section above to view and edit your profile information</p>
            </div>
          </div>
        );
    }
  };

  // Loading state
  if (profileLoading) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-sm mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Profile</h3>
          <p className="text-gray-600">Please wait while we fetch your information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (profileError) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
          <p className="text-red-600 mb-6">
            {profileError.message}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:shadow-md px-6 py-2.5 rounded-lg transition-all duration-200"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-50 to-white flex flex-col overflow-hidden">
      {/* Tab Navigation - Projects Page Style */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                   activeTab === tab.id
                     ? "text-gray-700 border-gray-700 bg-gray-50"
                     : "text-gray-600 hover:text-gray-800 border-transparent"
                 }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.adminOnly && (
                  <Lock className="w-3 h-3 text-amber-500 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content - Enhanced with Paper Form Styling */}
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
        <div className="h-full overflow-y-auto">
          <div className="p-2">
            <div className="h-full w-full">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfileRightCard;
