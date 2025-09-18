import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  Key,
  GraduationCap,
  Briefcase,
  Lock,
  ChevronLeft,
  ChevronRight,
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
  CHANGE_PASSWORD,
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
  profileVisibility?: any;
  is_active?: boolean;
  preferred_name?: string;
  passwordSuccessMessage?: string;
  passwordErrorMessage?: string;
}

// Helpers to normalize JSON-like fields that may arrive as strings
const toArray = (val: any) => {
  if (!val) return [] as any[];
  if (Array.isArray(val)) return val;
  try {
    const parsed = typeof val === "string" ? JSON.parse(val) : val;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as any[];
  }
};

const toObject = (val: any) => {
  if (!val) return {} as Record<string, any>;
  if (typeof val === "object" && !Array.isArray(val)) return val;
  try {
    const parsed = typeof val === "string" ? JSON.parse(val) : val;
    return typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {} as Record<string, any>;
  }
};

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
  const [changePasswordMutation] = useMutation(CHANGE_PASSWORD);

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
      const userProfile = profileQueryData.userProfile as any;
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

      setProfileData((prev) => ({
        ...prev,
        // copy through primitive/camelCase properties returned by GraphQL
        ...userProfile,
        avatar: fullAvatarUrl,
        avatarUrl: fullAvatarUrl, // Set both fields for consistency
        // Normalize arrays and map camelCase workHistory to local work_experience
        education: toArray(userProfile.education),
        work_experience: toArray(userProfile.work_experience ?? userProfile.workHistory),
        // Normalize profile visibility to camelCase key in local state
        profileVisibility: toObject(userProfile.profileVisibility ?? userProfile.profile_visibility),
      }));
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
      const userProfile = profileQueryData.userProfile as any;
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

      setProfileData((prev) => ({
        ...prev,
        ...userProfile,
        avatar: fullAvatarUrl,
        avatarUrl: fullAvatarUrl,
        education: toArray(userProfile.education),
        work_experience: toArray(userProfile.work_experience ?? userProfile.workHistory),
        profileVisibility: toObject(userProfile.profileVisibility ?? userProfile.profile_visibility),
      }));
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

      // Additional personal information
      variables.dateOfBirth = pick("date_of_birth", "date_of_birth");
      variables.gender = pick("gender", "gender");
      variables.maritalStatus = pick("marital_status", "marital_status");

      // Social media and web presence
      variables.shortBio = pick("short_bio", "short_bio");
      variables.website = pick("website", "website");
      variables.linkedin = pick("linkedin", "linkedin");
      variables.twitter = pick("twitter", "twitter");
      variables.github = pick("github", "github");
      variables.facebook = pick("facebook", "facebook");
      variables.instagram = pick("instagram", "instagram");

      // JSON fields: send as JSON strings (GraphQL expects String)
      if (profileData.education) {
        variables.education = JSON.stringify(profileData.education);
        console.log("Saving education data (stringified):", variables.education);
      }
      if (profileData.work_experience) {
        variables.workHistory = JSON.stringify(profileData.work_experience);
        console.log("Saving work experience data (stringified):", variables.workHistory);
      }
      const visibility = (profileData as any).profileVisibility ?? (profileData as any).profile_visibility;
      if (visibility) variables.profileVisibility = JSON.stringify(visibility);

      console.log("Mutation variables being sent:", variables);
      const res = await updateUserProfileMutation({ variables });
      const result = res?.data?.updateUserProfile;
      console.log("Mutation result:", result);
      if (result?.ok && result?.userProfile) {
        // Preserve avatar data when updating profile
        const currentAvatar = profileData.avatar;
        const currentAvatarUrl = profileData.avatarUrl;

        // Update local state with returned profile (may use camelCase keys)
        setProfileData((prev) => ({
          ...prev,
          ...result.userProfile,
          // Preserve avatar fields to prevent them from being overwritten
          avatar: currentAvatar,
          avatarUrl: currentAvatarUrl
        }));
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

      // Normalize as above

      setProfileData({
        ...userProfile,
        avatar: fullAvatarUrl,
        avatarUrl: fullAvatarUrl,
        education: toArray((userProfile as any).education ?? (userProfile as any).education),
        work_experience: toArray((userProfile as any).work_experience ?? (userProfile as any).workHistory),
        profileVisibility: toObject((userProfile as any).profile_visibility ?? (userProfile as any).profileVisibility),
      });
      setIsEditMode(false);
    }
  };

  // Handle avatar changes
  const handleAvatarChange = (file: File | null) => {
    if (file) {
      // Show a preview immediately
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setProfileData((prev) => ({ ...prev, avatar: dataUrl }));

        try {
          // Call GraphQL mutation to upload avatar (expects base64/data URL string)
          const res = await uploadAvatarMutation({ variables: { avatar: dataUrl } });
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
    console.log("Adding new education:", newEducation);
    setProfileData(prev => {
      const updated = {
        ...prev,
        education: [...(prev.education || []), newEducation]
      };
      console.log("Updated education array:", updated.education);
      return updated;
    });
  };

  const handleRemoveEducation = (id: string) => {
    setProfileData(prev => ({
          ...prev,
      education: prev.education?.filter(edu => edu.id !== id) || []
    }));
  };

  const handleUpdateEducation = (id: string, field: string, value: string) => {
    console.log("Updating education:", { id, field, value });
    setProfileData(prev => {
      const updated = {
        ...prev,
        education: prev.education?.map(edu =>
          edu.id === id ? { ...edu, [field]: value } : edu
        ) || []
      };
      console.log("Updated education data:", updated.education);
      return updated;
    });
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
    console.log("Adding new experience:", newExperience);
    setProfileData(prev => {
      const updated = {
        ...prev,
        work_experience: [...(prev.work_experience || []), newExperience]
      };
      console.log("Updated experience array:", updated.work_experience);
      return updated;
    });
  };

  const handleRemoveExperience = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      work_experience: prev.work_experience?.filter(exp => exp.id !== id) || []
    }));
  };

  const handleUpdateExperience = (id: string, field: string, value: string | boolean) => {
    console.log("Updating experience:", { id, field, value });
    setProfileData(prev => {
      const updated = {
        ...prev,
        work_experience: prev.work_experience?.map(exp =>
          exp.id === id ? { ...exp, [field]: value } : exp
        ) || []
      };
      console.log("Updated experience data:", updated.work_experience);
      return updated;
    });
  };

  // Handle password change
  const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
    try {
      console.log("Password change requested:", { oldPassword, newPassword });
      const result = await changePasswordMutation({
        variables: {
          currentPassword: oldPassword,
          newPassword: newPassword,
        },
      });

      if (result.data?.changePassword?.ok) {
        console.log("Password changed successfully");
        // You can add success notification here
      } else {
        console.error("Password change failed:", result.data?.changePassword?.errors);
        // You can add error notification here
      }
    } catch (error) {
      console.error("Password change error:", error);
    }
  };

  // Pagination handlers
  const handleEducationPageChange = (page: number) => {
    setCurrentEducationPage(page);
  };

  const handleExperiencePageChange = (page: number) => {
    setCurrentExperiencePage(page);
  };

  // Context-aware add handler for right sidebar
  const handleAdd = () => {
    switch (activeTab) {
      case "education":
        handleAddEducation();
        break;
      case "experience":
        handleAddExperience();
        break;
      default:
        console.log("Add action not available for this tab:", activeTab);
    }
  };

  // Context-aware delete handler for right sidebar
  const handleContextDelete = () => {
    switch (activeTab) {
      case "education":
        // For education, we'd need to know which one to delete
        // This could be enhanced to delete the last one or show a selection
        const educationToDelete = educationArray[educationArray.length - 1];
        if (educationToDelete) {
          handleRemoveEducation(educationToDelete.id);
        }
        break;
      case "experience":
        // Similar for experience
        const experienceToDelete = experienceArray[experienceArray.length - 1];
        if (experienceToDelete) {
          handleRemoveExperience(experienceToDelete.id);
        }
        break;
      default:
        handleDelete();
    }
  };

  // Calculate pagination
  const educationPerPage = 1;
  const experiencePerPage = 1;
  const educationArray = Array.isArray(profileData.education) ? profileData.education : [];
  const experienceArray = Array.isArray(profileData.work_experience) ? profileData.work_experience : [];
  const totalEducationPages = Math.ceil(educationArray.length / educationPerPage);
  const totalExperiencePages = Math.ceil(experienceArray.length / experiencePerPage);

  // Expose button handlers to window object for StableLayout
  useEffect(() => {
    const profileButtonHandlers = {
      add: handleAdd,
      save: handleSave,
      cancel: handleCancel,
      edit: handleEdit,
      delete: handleContextDelete,
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
  }, [handleAdd, handleSave, handleCancel, handleEdit, handleContextDelete, handleRefresh, isEditMode, activeTab]);

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
            handleUpdateEducation={handleUpdateEducation}
            currentEducationPage={currentEducationPage}
            totalEducationPages={totalEducationPages}
            handleEducationPageChange={handleEducationPageChange}
          />
        );

      case "experience":
        return (
          <ExperienceTab
            workExperiences={profileData.work_experience || []}
            isEditMode={isEditMode}
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
        <div className="flex items-center justify-between">
          {/* Tab buttons */}
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

          {/* Pagination controls on the right side */}
          {((activeTab === "education" && educationArray.length > 1) ||
            (activeTab === "experience" && experienceArray.length > 1)) && (
            <div className="flex items-center gap-2 px-4 py-2">
              <span className="text-sm text-gray-600">
                {activeTab === "education" ? "Education" : "Experience"} Record
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (activeTab === "education" && currentEducationPage > 1) {
                      handleEducationPageChange(currentEducationPage - 1);
                    } else if (activeTab === "experience" && currentExperiencePage > 1) {
                      handleExperiencePageChange(currentExperiencePage - 1);
                    }
                  }}
                  disabled={
                    (activeTab === "education" && currentEducationPage === 1) ||
                    (activeTab === "experience" && currentExperiencePage === 1)
                  }
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-700 px-2 min-w-[3rem] text-center">
                  {activeTab === "education" ? currentEducationPage : currentExperiencePage}/
                  {activeTab === "education" ? totalEducationPages : totalExperiencePages}
                </span>
                <button
                  onClick={() => {
                    if (activeTab === "education" && currentEducationPage < totalEducationPages) {
                      handleEducationPageChange(currentEducationPage + 1);
                    } else if (activeTab === "experience" && currentExperiencePage < totalExperiencePages) {
                      handleExperiencePageChange(currentExperiencePage + 1);
                    }
                  }}
                  disabled={
                    (activeTab === "education" && currentEducationPage === totalEducationPages) ||
                    (activeTab === "experience" && currentExperiencePage === totalExperiencePages)
                  }
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content - Enhanced with Paper Form Styling */}
      <div className="flex-1 h-0 min-h-0 flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-white">
        <div className="flex-1 h-0 min-h-0 overflow-y-auto">
          <div className="flex-1 h-full w-full flex flex-col">
            {renderTabContent()}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfileRightCard;
