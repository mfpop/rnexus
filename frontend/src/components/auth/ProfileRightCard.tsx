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
  lastnamem?: string;
  father_name?: string;
  birthname?: string;
  gender?: string;
  marital_status?: string;
  identity_mark?: string;
  medical_fitness?: boolean;
  character_certificate?: boolean;
  height?: number;
  bio?: string;
  short_bio?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  avatar?: string;
  avatarUrl?: string;
  phone?: string;
  primary_country_code?: string;
  phone_type?: string;
  secondary_phone?: string;
  secondary_country_code?: string;
  secondary_phone_type?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  street?: string;
  apartment?: string;
  country_code?: string;
  position?: string;
  department?: string;
  company?: string;
  employment_status?: string;
  employment_type?: string;
  start_date?: string;
  salary?: number;
  currency?: string;
  work_location?: string;
  manager?: string;
  employee_id?: string;
  work_email?: string;
  work_phone?: string;
  work_phone_type?: string;
  work_address?: string;
  work_city?: string;
  work_state?: string;
  work_zip_code?: string;
  work_country?: string;
  work_country_code?: string;
  work_schedule?: string;
  work_hours?: string;
  work_days?: string;
  work_time_zone?: string;
  work_language?: string;
  work_language_level?: string;
  work_skills?: string;
  work_certifications?: string;
  work_awards?: string;
  work_notes?: string;
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

  // Debug logging for isEditMode changes
  useEffect(() => {
    console.log("ProfileRightCard: isEditMode changed to:", isEditMode);
  }, [isEditMode]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [profileData, setProfileData] = useState<ProfileData>({} as ProfileData);

  // Show notification function
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 5000);
  };
  const [passwordSuccessMessage] = useState("");
  const [passwordErrorMessage] = useState("");

  // Pagination states
  const [currentEducationPage, setCurrentEducationPage] = useState(1);
  const [currentExperiencePage, setCurrentExperiencePage] = useState(1);

  // GraphQL queries
  const { data: profileQueryData, loading: profileLoading, error: profileError } = useQuery<GetUserProfileData>(GET_USER_PROFILE);

  // Debug logging
  const [uploadAvatarMutation] = useMutation(UPLOAD_AVATAR);
  const [updateUserProfileMutation] = useMutation(UPDATE_USER_PROFILE, {
    refetchQueries: [{ query: GET_USER_PROFILE }],
  });
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

      setProfileData((prev) => ({
        ...prev,
        // copy through primitive/camelCase properties returned by GraphQL
        ...userProfile,
        // Map user fields from nested user object
        username: userProfile.user?.username || userProfile.username,
        first_name: userProfile.user?.firstName || userProfile.firstName,
        last_name: userProfile.user?.lastName || userProfile.lastName,
        middle_name: userProfile.middleName,
        lastnamem: userProfile.lastnamem,
        email: userProfile.user?.email || userProfile.email,
        // Map personal information fields
        birthname: userProfile.birthname,
        // Map address fields
        street: userProfile.streetAddress,
        apartment: userProfile.apartmentSuite,
        city: userProfile.city,
        zipcode: userProfile.zipCode,
        country: userProfile.country,
        country_code: userProfile.countryCode,
        state: userProfile.stateProvince,
        // Map phone fields
        phone: userProfile.phone,
        primary_country_code: userProfile.primaryCountryCode,
        phone_type: userProfile.phoneType,
        secondary_phone: userProfile.secondaryPhone,
        secondary_country_code: userProfile.secondaryCountryCode,
        secondary_phone_type: userProfile.secondaryPhoneType,
        // Fix case conversion issues from GraphQL
        gender: userProfile.gender?.toLowerCase() || userProfile.gender,
        marital_status: userProfile.maritalStatus?.toLowerCase() || userProfile.marital_status,
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

  // Handle edit mode toggle - tab-specific edit functionality
  const handleEdit = () => {
    console.log("ProfileRightCard: handleEdit called, current isEditMode:", isEditMode, "activeTab:", activeTab);
    // Only enable edit mode if it's currently false
    if (!isEditMode) {
      console.log("ProfileRightCard: Setting isEditMode to true");
      setIsEditMode(true);
      showNotification('success', `Edit mode enabled for ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab`);
    } else {
      console.log("ProfileRightCard: Edit mode already enabled");
      showNotification('success', `Edit mode is already enabled for ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab`);
    }
  };

  // Handle cancel changes - tab-specific cancel functionality
  const handleCancel = () => {
    // Tab-specific cancel logic
    switch (activeTab) {
      case "general":
        // General tab - cancel edits for both personal info and biography/social links
        break;

      case "professional":
        // Professional tab - cancel edits for professional information
        break;

      case "education":
        // Education tab - cancel edits for education data
        break;

      case "experience":
        // Experience tab - cancel edits for work experience data
        break;

      case "security":
        // Security tab - cancel edits for security settings
        break;

      default:
        break;
    }

    setIsEditMode(false);
    showNotification('success', 'Changes cancelled successfully');

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

  // Handle save changes - tab-specific save functionality
  const handleSave = async () => {
    try {
      const variables: any = {};

      // Helper to pick either camelCase or snake_case values
      const pick = (camel: string, snake: string) => (profileData as any)[camel] ?? (profileData as any)[snake];

      switch (activeTab) {
        case "general":
          // Save personal information and biography/social links
          variables.firstName = pick("firstName", "first_name");
          variables.lastName = pick("lastName", "last_name");
          variables.email = pick("email", "email");
          variables.middleName = pick("middleName", "middle_name");
          variables.lastnamem = pick("lastnamem", "lastnamem");

          // Phone fields - use the correct field names from ProfileData interface
          variables.phonecc1 = profileData.primary_country_code;
          variables.phone1 = profileData.phone;
          variables.phonet1 = profileData.phone_type;
          variables.phonecc2 = profileData.secondary_country_code;
          variables.phone2 = profileData.secondary_phone;
          variables.phonet2 = profileData.secondary_phone_type;

          // Address fields - use snake_case values from local state
          variables.streetAddress = profileData.street;
          variables.apartmentSuite = profileData.apartment;
          variables.city = profileData.city;
          variables.stateProvince = profileData.state;
          variables.zipCode = profileData.zipcode;
        variables.country = profileData.country;
        variables.countryCode = profileData.country_code;

          variables.bio = pick("bio", "bio");

          // Additional personal information
          variables.birthname = pick("birthname", "birthname");
          variables.gender = pick("gender", "gender");
          variables.maritalStatus = pick("marital_status", "marital_status");
          variables.identityMark = pick("identity_mark", "identity_mark");
          variables.medicalFitness = pick("medical_fitness", "medical_fitness");
          variables.characterCertificate = pick("character_certificate", "character_certificate");
          variables.height = pick("height", "height");

          // Social media and web presence
          variables.shortBio = pick("short_bio", "short_bio");
          variables.website = pick("website", "website");
          variables.linkedin = pick("linkedin", "linkedin");
          variables.twitter = pick("twitter", "twitter");
          variables.github = pick("github", "github");
          variables.facebook = pick("facebook", "facebook");
          variables.instagram = pick("instagram", "instagram");
          break;

        case "professional":
          // Save professional information
          variables.position = pick("position", "position");
          variables.department = pick("department", "department");
          variables.employmentStatus = pick("employment_status", "employment_status");
          variables.employmentType = pick("employment_type", "employment_type");
          variables.startDate = pick("start_date", "start_date");
          variables.salary = pick("salary", "salary");
          variables.currency = pick("currency", "currency");
          variables.workLocation = pick("work_location", "work_location");
          variables.manager = pick("manager", "manager");
          variables.employeeId = pick("employee_id", "employee_id");
          variables.workEmail = pick("work_email", "work_email");
          variables.workPhone = pick("work_phone", "work_phone");
          variables.workPhoneType = pick("work_phone_type", "work_phone_type");
          variables.workAddress = pick("work_address", "work_address");
          variables.workCity = pick("work_city", "work_city");
          variables.workState = pick("work_state", "work_state");
          variables.workZipCode = pick("work_zip_code", "work_zip_code");
          variables.workCountry = pick("work_country", "work_country");
          variables.workCountryCode = pick("work_country_code", "work_country_code");
          variables.workSchedule = pick("work_schedule", "work_schedule");
          variables.workHours = pick("work_hours", "work_hours");
          variables.workDays = pick("work_days", "work_days");
          variables.workTimeZone = pick("work_time_zone", "work_time_zone");
          variables.workLanguage = pick("work_language", "work_language");
          variables.workLanguageLevel = pick("work_language_level", "work_language_level");
          variables.workSkills = pick("work_skills", "work_skills");
          variables.workCertifications = pick("work_certifications", "work_certifications");
          variables.workAwards = pick("work_awards", "work_awards");
          variables.workNotes = pick("work_notes", "work_notes");
          break;

        case "education":
          // Save education data
          if (profileData.education) {
            variables.education = JSON.stringify(profileData.education);}
          break;

        case "experience":
          // Save work experience data
          if (profileData.work_experience) {
            variables.workHistory = JSON.stringify(profileData.work_experience);}
          break;

        case "security":
          // Security tab doesn't save profile data, it handles password changes separatelyreturn;

        default:return;
      }

      const res = await updateUserProfileMutation({ variables });
      const result = res?.data?.updateUserProfile;

      if (result?.ok) {
        setIsEditMode(false);
        showNotification('success', `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} data saved successfully!`);
        window.dispatchEvent(new Event("profile-updated"));
      } else {
        showNotification('error', `Failed to save ${activeTab} data. Please try again.`);
      }
    } catch (err) {showNotification('error', `Error saving ${activeTab} data. Please try again.`);
    }
  };

  // Handle delete profile (placeholder)
  const handleDelete = () => {};

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
          } else {alert('Avatar upload failed: ' + (uploaded?.errors?.[0] || 'Unknown error'));
          }
        } catch (err) {alert('Avatar upload error: ' + (err instanceof Error ? err.message : 'Unknown error'));
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
      level: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      gpa: "",
      description: "",
    };

    setProfileData(prev => {
      const updated = {
        ...prev,
        education: [...(prev.education || []), newEducation]
      };
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
    setProfileData(prev => {
      const updated = {
        ...prev,
        education: prev.education?.map(edu =>
          edu.id === id ? { ...edu, [field]: value } : edu
        ) || []
      };
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

    setProfileData(prev => {
      const updated = {
        ...prev,
        work_experience: [...(prev.work_experience || []), newExperience]
      };
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
    setProfileData(prev => {
      const updated = {
        ...prev,
        work_experience: prev.work_experience?.map(exp =>
          exp.id === id ? { ...exp, [field]: value } : exp
        ) || []
      };
      return updated;
    });
  };

  // Handle password change
  const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
    try {
      const result = await changePasswordMutation({
        variables: {
          currentPassword: oldPassword,
          newPassword: newPassword,
        },
      });

      if (result.data?.changePassword?.ok) {
        // You can add success notification here
      } else {
        // You can add error notification here
      }
    } catch (error) {
      // Handle error
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
      default:}
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

    (window as any).profileButtonHandlers = profileButtonHandlers;return () => {
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Tab</h3>
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Profile</h3>
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Profile</h3>
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
      {/* Notification */}
      {notification.type && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {notification.type === 'success' ? '✓' : '✗'}
            </span>
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification({ type: null, message: '' })}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

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
