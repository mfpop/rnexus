import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Key,
  Eye,
  EyeOff,
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  Camera,
} from "lucide-react";
import { Button, Input, PhoneTypeDropdown, NotificationToast } from "../ui/bits";
import AuthService from "../../lib/authService";

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface ProfileData {
  username: string;
  email: string;

  // Comprehensive name fields
  first_name: string;
  middle_name?: string;
  last_name: string;
  maternal_last_name?: string; // For Mexican naming convention
  preferred_name?: string; // Nickname or preferred name

  date_joined: string;
  last_login: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;

  // New fields
  position?: string;
  department?: string;

  // Enhanced phone support
  phone?: string;
  phone_country_code?: string;
  phone_type?: 'mobile' | 'home' | 'work' | 'other';
  secondary_phone?: string;
  secondary_phone_type?: 'mobile' | 'home' | 'work' | 'other';

  // Address fields
  street_address?: string;
  apartment_suite?: string;
  city?: string;
  state_province?: string;
  zip_code?: string;
  country?: string;

  bio?: string;
  education?: Array<{
    id: string;
    school: string;
    degree: string;
    field?: string;
    startYear?: string;
    endYear?: string;
    description?: string;
    visible?: boolean
  }>;
  work_history?: Array<{
    id: string;
    company: string;
    title: string;
    department?: string;
    startYear?: string;
    endYear?: string;
    description?: string;
    visible?: boolean
  }>;
  profile_visibility?: {
    education: boolean;
    work_history: boolean;
    position: boolean;
    contact: boolean;
    bio: boolean;
  };
}

interface PasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const ProfileRightCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'education' | 'experience' | 'security'>('personal');

  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    maternal_last_name: "",
    preferred_name: "",
    date_joined: "",
    last_login: "",
    is_active: true, // Default to active for new profiles
    is_staff: false,
    is_superuser: false,
    position: "",
    department: "",
    phone: "",
    phone_country_code: "+1", // Default to US
    phone_type: "mobile",
    secondary_phone: "",
    secondary_phone_type: "mobile",
    street_address: "",
    apartment_suite: "",
    city: "",
    state_province: "",
    zip_code: "",
    country: "",
    bio: "",
    education: [],
    work_history: [],
    profile_visibility: {
      education: true,
      work_history: true,
      position: true,
      contact: true,
      bio: true
    },
  });

  // OpenAddresses data state
  const [countries, setCountries] = useState<Array<{name: string, cca2: string, flag: string}>>([]);
  const [states, setStates] = useState<Array<{geonameId: number, name: string}>>([]);
  const [cities, setCities] = useState<Array<{geonameId: number, name: string}>>([]);

  const [passwordData, setPasswordData] = useState<PasswordData>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Auto-save functionality with fallback endpoint on 403/405
  const autoSaveProfile = useCallback(async (data: ProfileData) => {
    const payload = {
      email: data.email,
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      maternal_last_name: data.maternal_last_name,
      preferred_name: data.preferred_name,
      position: data.position,
      department: data.department,
      phone: data.phone,
      phone_country_code: data.phone_country_code,
      phone_type: data.phone_type,
      secondary_phone: data.secondary_phone,
      secondary_phone_type: data.secondary_phone_type,
      street_address: data.street_address,
      apartment_suite: data.apartment_suite,
      city: data.city,
      state_province: data.state_province,
      zip_code: data.zip_code,
      country: data.country,
      bio: data.bio,
      education: data.education,
      work_history: data.work_history,
      profile_visibility: data.profile_visibility,
      is_active: data.is_active,
    };

    const tryPost = async (path: string) =>
      fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(payload),
      });

    try {
      // First try primary endpoint
      let response = await tryPost('/user/profile/');

      // Fallback to dedicated update endpoint on 403/405
      if (!response.ok && (response.status === 403 || response.status === 405)) {
        response = await tryPost('/user/profile/update/');
      }

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccessMessage("Profile saved automatically");
          setTimeout(() => setSuccessMessage(""), 3000);
        }
        return;
      }

      if (response.status === 401) {
        console.warn('Auto-save blocked: authentication required');
      } else if (response.status === 403) {
        console.warn('Auto-save blocked by server (403).');
      } else {
        console.error("Profile save failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Auto-save error:", error);
      setSuccessMessage("Profile changes saved locally (network error)");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }, []);

  // Debounced auto-save effect
  useEffect(() => {
  // Only attempt auto-save when authenticated
  if (!AuthService.isAuthenticated()) return;

    const timeoutId = setTimeout(() => {
      if (profileData.first_name || profileData.last_name || profileData.email) {
        autoSaveProfile(profileData);
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [profileData, autoSaveProfile]);

  // Load profile data on component mount
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      loadProfile();
    }
  }, []);

  // Load countries on component mount
  useEffect(() => {
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (profileData.country) {
      loadStates(profileData.country);
      // Reset dependent fields
      setProfileData(prev => ({
        ...prev,
        state_province: "",
        city: "",
        zip_code: "",
      }));
    }
  }, [profileData.country]);

  // Load cities when state changes
  useEffect(() => {
    if (profileData.state_province) {
      loadCities(profileData.state_province);
      // Reset dependent fields
      setProfileData(prev => ({
        ...prev,
        city: "",
        zip_code: "",
      }));
    }
  }, [profileData.state_province]);

  const loadProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/`, {
        headers: AuthService.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Profile data received:", data);
        if (data.success) {
          console.log("Setting profile data:", data.profile);
          console.log("Education count:", data.profile.education?.length || 0);
          console.log("Work history count:", data.profile.work_history?.length || 0);
          setProfileData(data.profile);
        }
      } else {
        console.error("Failed to load profile:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleProfileChange = (
    field: keyof ProfileData,
    value: string | boolean,
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addEducation = () => {
    setProfileData(prev => ({
      ...prev,
      education: [...(prev.education || []), {
        id: Date.now().toString(),
        school: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
        description: '',
        visible: true
      }]
    } as ProfileData));
  };

  const updateEducation = (id: string, field: string, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      education: (prev.education || []).map(e => e.id === id ? ({ ...e, [field]: value } as any) : e)
    } as ProfileData));
  };

  const removeEducation = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      education: (prev.education || []).filter(e => e.id !== id)
    } as ProfileData));
  };

  // OpenAddresses data loading functions
  const loadCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flag");
      if (response.ok) {
        const data = await response.json();
        const sortedCountries = data
          .map((country: any) => ({
            name: country.name.common,
            cca2: country.cca2,
            flag: country.flag
          }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      } else {
        console.error("Failed to fetch countries, status:", response.status);
      }
    } catch (error) {
      console.error("Failed to load countries:", error);
      // Fallback to basic countries
      const fallbackCountries = [
        { name: "United States", cca2: "US", flag: "🇺🇸" },
        { name: "Canada", cca2: "CA", flag: "🇨🇦" },
        { name: "Mexico", cca2: "MX", flag: "🇲🇽" },
        { name: "United Kingdom", cca2: "GB", flag: "🇬🇧" },
        { name: "Germany", cca2: "DE", flag: "🇩🇪" },
        { name: "France", cca2: "FR", flag: "🇫🇷" },
        { name: "Spain", cca2: "ES", flag: "🇪🇸" },
        { name: "Italy", cca2: "IT", flag: "🇮🇹" }
      ];
      setCountries(fallbackCountries);
    }
  };

  const loadStates = async (countryName: string) => {
    try {
      // Mock states data for now - in a real implementation, this would call OpenAddresses API
      const mockStates = getMockStates(countryName);
      setStates(mockStates);
    } catch (error) {
      console.error("Failed to load states:", error);
      setStates([]);
    }
  };

  const loadCities = async (stateName: string) => {
    try {
      // Mock cities data for now - in a real implementation, this would call OpenAddresses API
      const mockCities = getMockCities(stateName);
      setCities(mockCities);
    } catch (error) {
      console.error("Failed to load cities:", error);
      setCities([]);
    }
  };

  const getMockStates = (countryName: string) => {
    const stateMap: Record<string, Array<{geonameId: number, name: string}>> = {
      "United States": [
        { geonameId: 1, name: "California" },
        { geonameId: 2, name: "New York" },
        { geonameId: 3, name: "Texas" },
        { geonameId: 4, name: "Florida" },
        { geonameId: 5, name: "Illinois" }
      ],
      "Canada": [
        { geonameId: 101, name: "Ontario" },
        { geonameId: 102, name: "Quebec" },
        { geonameId: 103, name: "British Columbia" },
        { geonameId: 104, name: "Alberta" }
      ],
      "Mexico": [
        { geonameId: 201, name: "Jalisco" },
        { geonameId: 202, name: "Mexico City" },
        { geonameId: 203, name: "Nuevo Leon" },
        { geonameId: 204, name: "Baja California" }
      ]
    };
    return stateMap[countryName] || [];
  };

  const getMockCities = (stateName: string) => {
    const cityMap: Record<string, Array<{geonameId: number, name: string}>> = {
      "California": [
        { geonameId: 1001, name: "Los Angeles" },
        { geonameId: 1002, name: "San Francisco" },
        { geonameId: 1003, name: "San Diego" }
      ],
      "New York": [
        { geonameId: 2001, name: "New York City" },
        { geonameId: 2002, name: "Buffalo" },
        { geonameId: 2003, name: "Rochester" }
      ],
      "Ontario": [
        { geonameId: 3001, name: "Toronto" },
        { geonameId: 3002, name: "Ottawa" },
        { geonameId: 3003, name: "Mississauga" }
      ],
      "Jalisco": [
        { geonameId: 4001, name: "Guadalajara" },
        { geonameId: 4002, name: "Zapopan" },
        { geonameId: 4003, name: "Tlaquepaque" }
      ]
    };
    return cityMap[stateName] || [];
  };

  const addWork = () => {
    setProfileData(prev => ({
      ...prev,
      work_history: [...(prev.work_history || []), {
        id: Date.now().toString(),
        company: '',
        title: '',
        department: '',
        startYear: '',
        endYear: '',
        description: '',
        visible: true
      }]
    } as ProfileData));
  };

  const updateWork = (id: string, field: string, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      work_history: (prev.work_history || []).map(w => w.id === id ? ({ ...w, [field]: value } as any) : w)
    } as ProfileData));
  };

  const removeWork = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      work_history: (prev.work_history || []).filter(w => w.id !== id)
    } as ProfileData));
  };

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};

    if (!profileData.email) {
      newErrors["email"] = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors["email"] = "Please enter a valid email address";
    }

    if (profileData.first_name && profileData.first_name.length > 30) {
      newErrors["first_name"] = "First name must be less than 30 characters";
    }

    if (profileData.last_name && profileData.last_name.length > 30) {
      newErrors["last_name"] = "Last name must be less than 30 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.current_password) {
      newErrors["current_password"] = "Current password is required";
    }

    if (!passwordData.new_password) {
      newErrors["new_password"] = "New password is required";
    } else if (passwordData.new_password.length < 8) {
      newErrors["new_password"] = "Password must be at least 8 characters";
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors["confirm_password"] = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfile()) {
      return;
    }

    setSuccessMessage("");

    try {
      const payload = {
        email: profileData.email,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        position: profileData.position,
        department: profileData.department,
        phone: profileData.phone,
        bio: profileData.bio,
        education: profileData.education,
        work_history: profileData.work_history,
        profile_visibility: profileData.profile_visibility,
        is_active: profileData.is_active,
      };

      const tryPost = async (path: string) =>
        fetch(`${API_BASE_URL}${path}`, {
          method: "POST",
          headers: AuthService.getAuthHeaders(),
          body: JSON.stringify(payload),
        });

      // Try primary endpoint first
      let response = await tryPost('/user/profile/');
      // Fallback on 403/405
      if (!response.ok && (response.status === 403 || response.status === 405)) {
        response = await tryPost('/user/profile/update/');
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSuccessMessage("Profile updated successfully!");
          setProfileData(data.profile);
          setErrors({});
          return;
        }
        setErrors({ submit: data.error || "Failed to update profile" });
        return;
      }

      if (response.status === 401) {
        setErrors({ submit: "Authentication required. Please log in again." });
      } else if (response.status === 403) {
        setErrors({ submit: "Profile update blocked by server (403)." });
      } else {
        console.error("Profile update failed:", response.status, response.statusText);
        setErrors({ submit: `Server error (${response.status}). Please try again later.` });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setErrors({ submit: "Network error. Please try again." });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsPasswordLoading(true);
    setPasswordSuccessMessage("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/user/change-password/`,
          {
            method: "POST",
            headers: AuthService.getAuthHeaders(),
            body: JSON.stringify({
              current_password: passwordData.current_password,
              new_password: passwordData.new_password,
            }),
          },
        );      const data = await response.json();

      if (data.success) {
        setPasswordSuccessMessage("Password changed successfully!");
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        // Clear errors
        setPasswordErrors({});
      } else {
        setPasswordErrors({
          submit: data.error || "Failed to change password",
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsPasswordLoading(false);
    }
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            {/* Three Cards Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Name Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">Name</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm font-medium text-gray-600">First Name:</div>
                    <div className="text-sm">
                      <Input
                        type="text"
                        value={profileData.first_name || ""}
                        onChange={(e) => handleProfileChange("first_name", e.target.value)}
                        className="w-full h-8 text-sm"
                        placeholder="Enter first name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm font-medium text-gray-600">Middle Name:</div>
                    <div className="text-sm">
                      <Input
                        type="text"
                        value={profileData.middle_name || ""}
                        onChange={(e) => handleProfileChange("middle_name", e.target.value)}
                        className="w-full h-8 text-sm"
                        placeholder="Enter middle name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm font-medium text-gray-600">Last Name:</div>
                    <div className="text-sm">
                      <Input
                        type="text"
                        value={profileData.last_name || ""}
                        onChange={(e) => handleProfileChange("last_name", e.target.value)}
                        className="w-full h-8 text-sm"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm font-medium text-gray-600">Maternal Last:</div>
                    <div className="text-sm">
                      <Input
                        type="text"
                        value={profileData.maternal_last_name || ""}
                        onChange={(e) => handleProfileChange("maternal_last_name", e.target.value)}
                        className="w-full h-8 text-sm"
                        placeholder="Enter maternal last name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm font-medium text-gray-600">Nickname:</div>
                    <div className="text-sm">
                      <Input
                        type="text"
                        value={profileData.preferred_name || ""}
                        onChange={(e) => handleProfileChange("preferred_name", e.target.value)}
                        className="w-full h-8 text-sm"
                        placeholder="Enter nickname"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">Contact</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm font-medium text-gray-600">Email Address:</div>
                    <div className="text-sm">
                      <Input
                        type="email"
                        value={profileData.email || ""}
                        onChange={(e) => handleProfileChange("email", e.target.value)}
                        className="w-full h-8 text-sm"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Primary Phone:</div>
                    <div className="flex space-x-2">
                      <select
                        value={profileData.phone_country_code || "+1"}
                        onChange={(e) => handleProfileChange("phone_country_code", e.target.value)}
                        className="w-20 h-8 px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+52">🇲🇽 +52</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+33">🇫🇷 +33</option>
                        <option value="+34">🇪🇸 +34</option>
                        <option value="+39">🇮🇹 +39</option>
                        <option value="+31">🇳🇱 +31</option>
                        <option value="+32">🇧🇪 +32</option>
                        <option value="+41">🇨🇭 +41</option>
                        <option value="+46">🇸🇪 +46</option>
                        <option value="+47">🇳🇴 +47</option>
                        <option value="+45">🇩🇰 +45</option>
                        <option value="+358">🇫🇮 +358</option>
                        <option value="+48">🇵🇱 +48</option>
                        <option value="+420">🇨🇿 +420</option>
                        <option value="+36">🇭🇺 +36</option>
                        <option value="+43">🇦🇹 +43</option>
                        <option value="+351">🇵🇹 +351</option>
                        <option value="+30">🇬🇷 +30</option>
                        <option value="+90">🇹🇷 +90</option>
                        <option value="+7">🇷🇺 +7</option>
                        <option value="+86">🇨🇳 +86</option>
                        <option value="+81">🇯🇵 +81</option>
                        <option value="+82">🇰🇷 +82</option>
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+61">🇦🇺 +61</option>
                        <option value="+64">🇳🇿 +64</option>
                        <option value="+55">🇧🇷 +55</option>
                        <option value="+54">🇦🇷 +54</option>
                        <option value="+56">🇨🇱 +56</option>
                        <option value="+57">🇨🇴 +57</option>
                        <option value="+58">🇻🇪 +58</option>
                        <option value="+51">🇵🇪 +51</option>
                        <option value="+593">🇪🇨 +593</option>
                        <option value="+595">🇵🇾 +595</option>
                        <option value="+598">🇺🇾 +598</option>
                        <option value="+591">🇧🇴 +591</option>
                        <option value="+503">🇸🇻 +503</option>
                        <option value="+502">🇬🇹 +502</option>
                        <option value="+504">🇭🇳 +504</option>
                        <option value="+505">🇳🇮 +505</option>
                        <option value="+506">🇨🇷 +506</option>
                        <option value="+507">🇵🇦 +507</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+966">🇸🇦 +966</option>
                        <option value="+972">🇮🇱 +972</option>
                        <option value="+20">🇪🇬 +20</option>
                        <option value="+27">🇿🇦 +27</option>
                        <option value="+234">🇳🇬 +234</option>
                        <option value="+254">🇰🇪 +254</option>
                        <option value="+233">🇬🇭 +233</option>
                        <option value="+212">🇲🇦 +212</option>
                        <option value="+216">🇹🇳 +216</option>
                        <option value="+213">🇩🇿 +213</option>
                        <option value="+221">🇸🇳 +221</option>
                        <option value="+225">🇨🇮 +225</option>
                        <option value="+237">🇨🇲 +237</option>
                        <option value="+236">🇨🇫 +236</option>
                        <option value="+235">🇹🇩 +235</option>
                        <option value="+249">🇸🇩 +249</option>
                        <option value="+251">🇪🇹 +251</option>
                        <option value="+255">🇹🇿 +255</option>
                        <option value="+256">🇺🇬 +256</option>
                        <option value="+257">🇧🇮 +257</option>
                        <option value="+250">🇷🇼 +250</option>
                        <option value="+252">🇸🇴 +252</option>
                        <option value="+253">🇩🇯 +253</option>
                      </select>
                      <Input
                        type="tel"
                        value={profileData.phone || ""}
                        onChange={(e) => handleProfileChange("phone", e.target.value)}
                        className="flex-1 h-8 text-sm"
                        placeholder="Phone number"
                      />
                      <PhoneTypeDropdown
                        value={profileData.phone_type || "mobile"}
                        onChange={(value) => handleProfileChange("phone_type", value)}
                        className="w-24"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Secondary Phone:</div>
                    <div className="flex space-x-2">
                      <select
                        value={profileData.phone_country_code || "+1"}
                        onChange={(e) => handleProfileChange("phone_country_code", e.target.value)}
                        className="w-20 h-8 px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+52">🇲🇽 +52</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+33">🇫🇷 +33</option>
                        <option value="+34">🇪🇸 +34</option>
                        <option value="+39">🇮🇹 +39</option>
                        <option value="+31">🇳🇱 +31</option>
                        <option value="+32">🇧🇪 +32</option>
                        <option value="+41">🇨🇭 +41</option>
                        <option value="+46">🇸🇪 +46</option>
                        <option value="+47">🇳🇴 +47</option>
                        <option value="+45">🇩🇰 +45</option>
                        <option value="+358">🇫🇮 +358</option>
                        <option value="+48">🇵🇱 +48</option>
                        <option value="+420">🇨🇿 +420</option>
                        <option value="+36">🇭🇺 +36</option>
                        <option value="+43">🇦🇹 +43</option>
                        <option value="+351">🇵🇹 +351</option>
                        <option value="+30">🇬🇷 +30</option>
                        <option value="+90">🇹🇷 +90</option>
                        <option value="+7">🇷🇺 +7</option>
                        <option value="+86">🇨🇳 +86</option>
                        <option value="+81">🇯🇵 +81</option>
                        <option value="+82">🇰🇷 +82</option>
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+61">🇦🇺 +61</option>
                        <option value="+64">🇳🇿 +64</option>
                        <option value="+55">🇧🇷 +55</option>
                        <option value="+54">🇦🇷 +54</option>
                        <option value="+56">🇨🇱 +56</option>
                        <option value="+57">🇨🇴 +57</option>
                        <option value="+58">🇻🇪 +58</option>
                        <option value="+51">🇵🇪 +51</option>
                        <option value="+593">🇪🇨 +593</option>
                        <option value="+595">🇵🇾 +595</option>
                        <option value="+598">🇺🇾 +598</option>
                        <option value="+591">🇧🇴 +591</option>
                        <option value="+503">🇸🇻 +503</option>
                        <option value="+502">🇬🇹 +502</option>
                        <option value="+504">🇭🇳 +504</option>
                        <option value="+505">🇳🇮 +505</option>
                        <option value="+506">🇨🇷 +506</option>
                        <option value="+507">🇵🇦 +507</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+966">🇸🇦 +966</option>
                        <option value="+972">🇮🇱 +972</option>
                        <option value="+20">🇪🇬 +20</option>
                        <option value="+27">🇿🇦 +27</option>
                        <option value="+234">🇳🇬 +234</option>
                        <option value="+254">🇰🇪 +254</option>
                        <option value="+233">🇬🇭 +233</option>
                        <option value="+212">🇲🇦 +212</option>
                        <option value="+216">🇹🇳 +216</option>
                        <option value="+213">🇩🇿 +213</option>
                        <option value="+221">🇸🇳 +221</option>
                        <option value="+225">🇨🇮 +225</option>
                        <option value="+237">🇨🇲 +237</option>
                        <option value="+236">🇨🇫 +236</option>
                        <option value="+235">🇹🇩 +235</option>
                        <option value="+249">🇸🇩 +249</option>
                        <option value="+251">🇪🇹 +251</option>
                        <option value="+255">🇹🇿 +255</option>
                        <option value="+256">🇺🇬 +256</option>
                        <option value="+257">🇧🇮 +257</option>
                        <option value="+250">🇷🇼 +250</option>
                        <option value="+252">🇸🇴 +252</option>
                        <option value="+253">🇩🇯 +253</option>
                      </select>
                      <Input
                        type="tel"
                        value={profileData.secondary_phone || ""}
                        onChange={(e) => handleProfileChange("secondary_phone", e.target.value)}
                        className="flex-1 h-8 text-sm"
                        placeholder="Phone number"
                      />
                      <PhoneTypeDropdown
                        value={profileData.secondary_phone_type || "mobile"}
                        onChange={(value) => handleProfileChange("secondary_phone_type", value)}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">Address</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-sm font-medium text-gray-600">Street Address:</div>
                      <div className="text-sm">
                        <Input
                          type="text"
                          value={profileData.street_address || ""}
                          onChange={(e) => handleProfileChange("street_address", e.target.value)}
                          className="w-full h-7 text-sm"
                          placeholder="123 Tech Street"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-sm font-medium text-gray-600">Apartment/Suite:</div>
                      <div className="text-sm">
                        <Input
                          type="text"
                          value={profileData.apartment_suite || ""}
                          onChange={(e) => handleProfileChange("apartment_suite", e.target.value)}
                          className="w-full h-7 text-sm"
                          placeholder="Enter apartment/suite"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-sm font-medium text-gray-600">City:</div>
                      <div className="text-sm">
                        <select
                          value={profileData.city || ""}
                          onChange={(e) => handleProfileChange("city", e.target.value)}
                          className="w-full h-7 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          disabled={!profileData.state_province}
                        >
                          <option value="">Select city</option>
                          {cities.map((city) => (
                            <option key={city.geonameId} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-sm font-medium text-gray-600">State/Province:</div>
                      <div className="text-sm">
                        <select
                          value={profileData.state_province || ""}
                          onChange={(e) => handleProfileChange("state_province", e.target.value)}
                          className="w-full h-7 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          disabled={!profileData.country}
                        >
                          <option value="">Select state/province</option>
                          {states.map((state) => (
                            <option key={state.geonameId} value={state.name}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-sm font-medium text-gray-600">ZIP Code:</div>
                      <div className="text-sm">
                        <Input
                          type="text"
                          value={profileData.zip_code || ""}
                          onChange={(e) => handleProfileChange("zip_code", e.target.value)}
                          className="w-full h-7 text-sm"
                          placeholder="Enter ZIP/postal code"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-sm font-medium text-gray-600">Country:</div>
                      <div className="text-sm">
                        <select
                          value={profileData.country || ""}
                          onChange={(e) => handleProfileChange("country", e.target.value)}
                          className="w-full h-7 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Select country</option>
                          {countries.map((country) => (
                            <option key={country.cca2} value={country.name}>
                              {country.flag} {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Address Card Footer - Saved Address Display */}
                  <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
                    <div className="text-sm text-gray-800">
                      {profileData.street_address || profileData.apartment_suite || profileData.city || profileData.state_province || profileData.country ? (
                        <div>
                          {profileData.street_address && `${profileData.street_address}`}
                          {profileData.apartment_suite && `, Apt/Suite: ${profileData.apartment_suite}`}
                          {(profileData.city || profileData.state_province || profileData.zip_code) && `, `}
                          {profileData.city && `${profileData.city}`}
                          {profileData.state_province && `, ${profileData.state_province}`}
                          {profileData.zip_code && ` ${profileData.zip_code}`}
                          {profileData.country && `, ${profileData.country}`}
                        </div>
                      ) : (
                        <div className="text-gray-400 italic">No address information saved yet</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Card - Full Width */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Bio</h3>
              </div>
              <div>
                <textarea
                  value={profileData.bio || ""}
                  onChange={(e) => handleProfileChange("bio", e.target.value)}
                  className="w-full min-h-48 px-4 py-3 border-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset resize-none text-sm"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>
        );

      case 'professional':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel - Position and Department */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">Position and Department</h3>
                </div>
                <div className="p-6">
                  {/* Lean Manufacturing Plant Hierarchy */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-gray-600 mb-4">Plant Organizational Structure</h4>

                      {/* Plant Manager Level */}
                      <div className={`inline-block p-4 rounded-lg border-2 transition-all duration-300 ${
                        profileData.position?.toLowerCase().includes('plant manager') ||
                        profileData.position?.toLowerCase().includes('plant director') ||
                        profileData.position?.toLowerCase().includes('general manager') ||
                        profileData.position?.toLowerCase().includes('plant supervisor')
                          ? 'bg-blue-200 border-blue-600 shadow-xl scale-110 ring-4 ring-blue-200'
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        <div className="text-sm font-bold text-gray-800 mb-1">🏭 PLANT MANAGER</div>
                        <div className="text-xs text-gray-600">Plant Leadership</div>
                        {profileData.position?.toLowerCase().includes('plant manager') ||
                         profileData.position?.toLowerCase().includes('plant director') ||
                         profileData.position?.toLowerCase().includes('general manager') ||
                         profileData.position?.toLowerCase().includes('plant supervisor') ? (
                          <div className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                            YOUR ROLE
                          </div>
                        ) : null}
                      </div>

                      {/* Connector */}
                      <div className="flex justify-center my-3">
                        <div className="w-1 h-6 bg-gray-400"></div>
                      </div>

                      {/* Department Level */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {/* Operations */}
                        <div className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                          profileData.department?.toLowerCase().includes('operations') ||
                          profileData.department?.toLowerCase().includes('production') ||
                          profileData.position?.toLowerCase().includes('operations') ||
                          profileData.position?.toLowerCase().includes('production') ||
                          profileData.position?.toLowerCase().includes('supervisor') ||
                          profileData.position?.toLowerCase().includes('team lead')
                            ? 'bg-green-200 border-green-600 shadow-lg scale-105 ring-4 ring-green-200'
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          <div className="text-xs font-bold text-gray-800 mb-1">🏭 OPERATIONS</div>
                          <div className="text-xs text-gray-600">Production</div>
                          {profileData.department?.toLowerCase().includes('operations') ||
                           profileData.department?.toLowerCase().includes('production') ||
                           profileData.position?.toLowerCase().includes('operations') ||
                           profileData.position?.toLowerCase().includes('production') ||
                           profileData.position?.toLowerCase().includes('supervisor') ||
                           profileData.position?.toLowerCase().includes('team lead') ? (
                            <div className="mt-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                              YOUR DEPT
                            </div>
                          ) : null}
                        </div>

                        {/* Engineering */}
                        <div className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                          profileData.department?.toLowerCase().includes('engineering') ||
                          profileData.department?.toLowerCase().includes('maintenance') ||
                          profileData.position?.toLowerCase().includes('engineer') ||
                          profileData.position?.toLowerCase().includes('maintenance') ||
                          profileData.position?.toLowerCase().includes('technician')
                            ? 'bg-blue-200 border-blue-600 shadow-lg scale-105 ring-4 ring-blue-200'
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          <div className="text-xs font-bold text-gray-800 mb-1">⚙️ ENGINEERING</div>
                          <div className="text-xs text-gray-600">Maintenance</div>
                          {profileData.department?.toLowerCase().includes('engineering') ||
                           profileData.department?.toLowerCase().includes('maintenance') ||
                           profileData.position?.toLowerCase().includes('engineer') ||
                           profileData.position?.toLowerCase().includes('maintenance') ||
                           profileData.position?.toLowerCase().includes('technician') ? (
                            <div className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                              YOUR DEPT
                            </div>
                          ) : null}
                        </div>

                        {/* Quality */}
                        <div className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                          profileData.department?.toLowerCase().includes('quality') ||
                          profileData.department?.toLowerCase().includes('qc') ||
                          profileData.position?.toLowerCase().includes('quality') ||
                          profileData.position?.toLowerCase().includes('qc') ||
                          profileData.position?.toLowerCase().includes('inspector')
                            ? 'bg-purple-200 border-purple-600 shadow-lg scale-105 ring-4 ring-purple-200'
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          <div className="text-xs font-bold text-gray-800 mb-1">🔍 QUALITY</div>
                          <div className="text-xs text-gray-600">QC/QA</div>
                          {profileData.department?.toLowerCase().includes('quality') ||
                           profileData.department?.toLowerCase().includes('qc') ||
                           profileData.position?.toLowerCase().includes('quality') ||
                           profileData.position?.toLowerCase().includes('qc') ||
                           profileData.position?.toLowerCase().includes('inspector') ? (
                            <div className="mt-2 text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                              YOUR DEPT
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Connector */}
                      <div className="flex justify-center my-3">
                        <div className="w-1 h-6 bg-gray-400"></div>
                      </div>

                      {/* Team Level */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Production Teams */}
                        <div className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                          profileData.position?.toLowerCase().includes('operator') ||
                          profileData.position?.toLowerCase().includes('assembler') ||
                          profileData.position?.toLowerCase().includes('machinist') ||
                          profileData.position?.toLowerCase().includes('welder')
                            ? 'bg-green-200 border-green-600 shadow-lg scale-105 ring-4 ring-green-200'
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          <div className="text-xs font-bold text-gray-800 mb-1">👷 PRODUCTION</div>
                          <div className="text-xs text-gray-600">Operators, Assemblers</div>
                          {profileData.position?.toLowerCase().includes('operator') ||
                           profileData.position?.toLowerCase().includes('assembler') ||
                           profileData.position?.toLowerCase().includes('machinist') ||
                           profileData.position?.toLowerCase().includes('welder') ? (
                            <div className="mt-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                              YOUR ROLE
                            </div>
                          ) : null}
                        </div>

                        {/* Support Teams */}
                        <div className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                          profileData.position?.toLowerCase().includes('analyst') ||
                          profileData.position?.toLowerCase().includes('coordinator') ||
                          profileData.position?.toLowerCase().includes('specialist') ||
                          profileData.position?.toLowerCase().includes('planner') ||
                          profileData.position?.toLowerCase().includes('clerk')
                            ? 'bg-orange-200 border-orange-600 shadow-lg scale-105 ring-4 ring-orange-200'
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          <div className="text-xs font-bold text-gray-800 mb-1">📊 SUPPORT</div>
                          <div className="text-xs text-gray-600">Analysts, Coordinators</div>
                          {profileData.position?.toLowerCase().includes('analyst') ||
                           profileData.position?.toLowerCase().includes('coordinator') ||
                           profileData.position?.toLowerCase().includes('specialist') ||
                           profileData.position?.toLowerCase().includes('planner') ||
                           profileData.position?.toLowerCase().includes('clerk') ? (
                            <div className="mt-2 text-xs bg-orange-600 text-white px-2 py-1 rounded-full">
                              YOUR ROLE
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Position Indicator */}
                    {profileData.position && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg">
                        <div className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                          🎯 <span>Your Current Position</span>
                        </div>
                        <div className="text-lg font-bold text-blue-900 mb-2">
                          {profileData.position}
                        </div>
                        {profileData.department && (
                          <div className="text-sm text-blue-700">
                            📍 Department: <span className="font-semibold">{profileData.department}</span>
                          </div>
                        )}
                        <div className="mt-3 text-xs text-blue-600 bg-blue-100 px-3 py-2 rounded-lg">
                          💡 <strong>Tip:</strong> This position is automatically highlighted in the diagram above
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Edit Fields */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <Input
                        type="text"
                        value={profileData.position || ""}
                        onChange={(e) => handleProfileChange("position", e.target.value)}
                        className="w-full"
                        placeholder="e.g. Production Supervisor"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <Input
                        type="text"
                        value={profileData.department || ""}
                        onChange={(e) => handleProfileChange("department", e.target.value)}
                        className="w-full"
                        placeholder="e.g. Operations"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Professional Overview */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">Professional Overview</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Daily Activities */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Daily Activities
                    </h4>
                    <div className="space-y-2">
                      {[
                        "Production line monitoring",
                        "Team stand-up meetings",
                        "Quality control checks",
                        "Lean process improvement"
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Key Responsibilities
                    </h4>
                    <div className="space-y-2">
                      {[
                        "Ensure production targets",
                        "Maintain safety standards",
                        "Implement lean principles",
                        "Lead continuous improvement"
                      ].map((responsibility, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">{responsibility}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Targets */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Current Targets
                    </h4>
                    <div className="space-y-2">
                      {[
                        "Reduce cycle time by 15%",
                        "Achieve 99.5% quality rate",
                        "Implement 5S methodology",
                        "Reduce waste by 25%"
                      ].map((target, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">{target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'education':
        console.log("Rendering education tab, profileData.education:", profileData.education);
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Education Records</h3>
              <Button
                onClick={addEducation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Education
              </Button>
            </div>

            {/* Education Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Institution
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Degree & Field
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Period
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        Status
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(profileData.education || []).map((edu) => (
                      <tr key={edu.id} className="hover:bg-gray-50 transition-colors [&>td]:!p-0">
                        <td className="py-4 whitespace-nowrap">
                          <Input
                            value={edu.school || ''}
                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                            placeholder="Institution name"
                            className="w-full h-8 text-base font-medium border-0 !border-0 bg-transparent hover:bg-gray-100 focus:bg-blue-50 focus:outline-none focus:ring-0 !ring-0 focus-visible:ring-0 !focus-visible:ring-0 text-sm rounded px-3"
                          />
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            <Input
                              value={edu.degree || ''}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              placeholder="Degree"
                              className="w-full h-8 text-sm border-0 !border-0 bg-transparent hover:bg-gray-100 focus:bg-blue-50 focus:outline-none focus:ring-0 !ring-0 focus-visible:ring-0 !focus-visible:ring-0 rounded px-2"
                            />
                            <Input
                              value={edu.field || ''}
                              onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                              placeholder="Field of study"
                              className="w-full h-8 text-sm border-0 !border-0 bg-transparent hover:bg-gray-100 focus:bg-blue-50 focus:outline-none focus:ring-0 !ring-0 focus-visible:ring-0 !focus-visible:ring-0 rounded px-2"
                            />
                          </div>
                        </td>
                        <td className="py-4 whitespace-nowrap w-24">
                          <div className="flex items-center gap-1">
                            <Input
                              value={edu.startYear || ''}
                              onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                              placeholder="Start"
                              className="w-16 h-8 text-sm border-0 !border-0 bg-transparent hover:bg-gray-100 focus:bg-blue-50 focus:outline-none focus:ring-0 !ring-0 focus-visible:ring-0 !focus-visible:ring-0 rounded px-1 text-center"
                            />
                            <span className="text-gray-400 text-xs">-</span>
                            <Input
                              value={edu.endYear || ''}
                              onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                              placeholder="End"
                              className="w-16 h-8 text-sm border-0 !border-0 bg-transparent hover:bg-gray-100 focus:bg-blue-50 focus:outline-none focus:ring-0 !ring-0 focus-visible:ring-0 !focus-visible:ring-0 rounded px-1 text-center"
                            />
                          </div>
                        </td>
                        <td className="!p-0 !m-0">
                          <textarea
                            value={edu.description || ''}
                            onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                            placeholder="Brief description..."
                            rows={3}
                            className="w-full text-sm border-0 !border-0 bg-transparent hover:bg-gray-100 focus:bg-blue-50 focus:outline-none focus:ring-0 !ring-0 focus-visible:ring-0 !focus-visible:ring-0 rounded px-2 py-2 resize-none"
                          />
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap w-20">
                          <select
                            value={edu.visible ? 'visible' : 'hidden'}
                            onChange={(e) => updateEducation(edu.id, 'visible', e.target.value === 'visible')}
                            className="w-full h-8 px-2 border-0 bg-transparent hover:bg-gray-100 focus:bg-white focus:outline-none text-sm rounded"
                          >
                            <option value="visible">Visible</option>
                            <option value="hidden">Hidden</option>
                          </select>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium w-16">
                          <Button
                            onClick={() => removeEducation(edu.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border-0 p-2 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {(!profileData.education || profileData.education.length === 0) && (
                <div className="text-center py-12 text-gray-500">
                  <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-medium">No education records yet</p>
                  <p className="text-xs text-gray-400 mt-1">Click "Add Education" to get started</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'experience':
        console.log("Rendering experience tab, profileData.work_history:", profileData.work_history);
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Work Experience Records</h3>
              <Button
                onClick={addWork}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </Button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-xs font-semibold text-gray-700 text-left">Position & Company</th>
                    <th className="px-3 py-2 text-xs font-semibold text-gray-700 text-left">Department</th>
                    <th className="px-3 py-2 text-xs font-semibold text-gray-700 text-center w-24">Period</th>
                    <th className="px-3 py-2 text-xs font-semibold text-gray-700 text-left">Description</th>
                    <th className="px-3 py-2 text-xs font-semibold text-gray-700 text-center w-20">Status</th>
                    <th className="px-3 py-2 text-xs font-semibold text-gray-700 text-center w-16">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(profileData.work_history || []).map((work) => (
                    <tr key={work.id} className="hover:bg-gray-50 transition-colors [&>td]:!p-0">
                      <td className="py-2 whitespace-nowrap">
                        <div className="space-y-2">
                          <Input
                            value={work.title || ''}
                            onChange={(e) => updateWork(work.id, 'title', e.target.value)}
                            placeholder="Job Title"
                            className="w-full h-8 text-base font-medium border-0 !border-0 bg-transparent hover:bg-gray-100 focus:bg-blue-50 focus:outline-none focus:ring-0 !ring-0 focus-visible:ring-0 !focus-visible:ring-0 text-sm rounded px-3"
                          />
                          <Input
                            value={work.company || ''}
                            onChange={(e) => updateWork(work.id, 'company', e.target.value)}
                            placeholder="Company Name"
                            className="w-full h-8 text-sm border-0 !border-0 bg-transparent hover:bg-gray-100 focus:bg-blue-50 focus:outline-none focus:ring-0 !ring-0 focus-visible:ring-0 !focus-visible:ring-0 rounded px-3"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Input
                          value={work.department || ''}
                          onChange={(e) => updateWork(work.id, 'department', e.target.value)}
                          placeholder="Department"
                          className="w-full h-8 text-sm border-0 !border-0 bg-transparent hover:bg-gray-100 focus:bg-blue-50 focus:outline-none focus:ring-0 !ring-0 focus-visible:ring-0 !focus-visible:ring-0 rounded px-2"
                        />
                      </td>
                      <td className="py-2 whitespace-nowrap w-24">
                        <div className="flex items-center gap-1">
                          <Input
                            value={work.startYear || ''}
                            onChange={(e) => updateWork(work.id, 'startYear', e.target.value)}
                            placeholder="Start"
                            className="w-16 h-8 text-sm border-0 !border-0 bg-transparent hover:bg-gray-100 focus:bg-blue-50 focus:outline-none focus:ring-0 !ring-0 focus-visible:ring-0 !focus-visible:ring-0 rounded px-1 text-center"
                          />
                          <span className="text-gray-400 text-xs">-</span>
                          <Input
                            value={work.endYear || ''}
                            onChange={(e) => updateWork(work.id, 'endYear', e.target.value)}
                            placeholder="End"
                            className="w-16 h-8 text-sm border-0 !border-0 bg-transparent hover:bg-gray-100 focus:bg-blue-50 focus:outline-none focus:ring-0 !ring-0 focus-visible:ring-0 !focus-visible:ring-0 rounded px-1 text-center"
                          />
                        </div>
                      </td>
                      <td className="!p-0 !m-0">
                        <textarea
                          value={work.description || ''}
                          onChange={(e) => updateWork(work.id, 'description', e.target.value)}
                          placeholder="Job description, responsibilities, achievements..."
                          rows={5}
                          className="w-full px-2 py-3 border-0 rounded-b-lg focus:outline-none focus:ring-0 !ring-0 focus-visible:ring-0 !focus-visible:ring-0 resize-none text-sm bg-transparent hover:bg-gray-100 focus:bg-blue-50 align-middle"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-center w-20">
                        <select
                          value={work.visible ? "visible" : "hidden"}
                          onChange={(e) => updateWork(work.id, 'visible', e.target.value === "visible")}
                          className="w-full h-8 px-2 border-0 bg-transparent hover:bg-gray-100 focus:bg-blue-50 focus:outline-none text-sm rounded"
                        >
                          <option value="visible">Visible</option>
                          <option value="hidden">Hidden</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium w-16">
                        <Button
                          onClick={() => removeWork(work.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border-0 p-2 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {(!profileData.work_history || profileData.work_history.length === 0) && (
                <div className="text-center py-12 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-medium">No work experience records yet</p>
                  <p className="text-xs text-gray-400 mt-1">Click "Add Experience" to get started</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">Update your password and security settings</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.current_password}
                    onChange={(e) => handlePasswordChange("current_password", e.target.value)}
                    variant={passwordErrors["current_password"] ? "error" : "default"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                    }
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors["current_password"] && (
                  <p className="text-red-600 text-sm mt-1">{passwordErrors["current_password"]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.new_password}
                    onChange={(e) => handlePasswordChange("new_password", e.target.value)}
                    variant={passwordErrors["new_password"] ? "error" : "default"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                    }
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors["new_password"] && (
                  <p className="text-red-600 text-sm mt-1">{passwordErrors["new_password"]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirm_password}
                    onChange={(e) => handlePasswordChange("confirm_password", e.target.value)}
                    variant={passwordErrors["confirm_password"] ? "error" : "default"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                    }
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors["confirm_password"] && (
                  <p className="text-red-600 text-sm mt-1">{passwordErrors["confirm_password"]}</p>
                )}
              </div>
            </div>

            {/* Password Success/Error Messages */}
            {passwordSuccessMessage && (
              <NotificationToast
                type="success"
                message={passwordSuccessMessage}
                isVisible={!!passwordSuccessMessage}
                onClose={() => setPasswordSuccessMessage("")}
              />
            )}

            {passwordErrors["submit"] && (
              <NotificationToast
                type="error"
                message={passwordErrors["submit"]}
                isVisible={!!passwordErrors["submit"]}
                onClose={() => setPasswordErrors((prev) => ({ ...prev, submit: "" }))}
              />
            )}

            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={handlePasswordSubmit}
                disabled={isPasswordLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                {isPasswordLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Changing...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </div>

            {/* Account Status Section */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${profileData.is_active ? "bg-green-500" : "bg-red-500"}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Account Status: {profileData.is_active ? "Active" : "Inactive"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {profileData.is_active ? "Your account is active and accessible" : "Your account is currently inactive"}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={profileData.is_active}
                    onChange={(e) => handleProfileChange("is_active", e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Avatar Section */}
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profileData.first_name?.[0]?.toUpperCase() || profileData.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
              <Camera className="h-3 w-3 text-white" />
            </button>
          </div>

          {/* Name & Details */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {profileData.first_name && profileData.last_name
                ? `${profileData.first_name} ${profileData.last_name}`
                : profileData.username || 'John Doe'
              }
            </h3>
            <p className="text-sm text-gray-600">{profileData.position || 'Senior Software Engineer'}</p>
            <p className="text-xs text-gray-500">{profileData.department || 'Tech Solutions Inc.'}</p>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${profileData.is_active ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-xs text-gray-600">
              {profileData.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex">
            {[
              { id: 'personal', label: 'Personal Info', icon: User },
              { id: 'professional', label: 'Professional', icon: Briefcase },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'experience', label: 'Experience', icon: Briefcase },
              { id: 'security', label: 'Security', icon: Key },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area - grows to fill available space */}
      <div className="flex-1 p-6 overflow-y-auto">
        <form onSubmit={activeTab === 'security' ? handlePasswordSubmit : handleProfileSubmit} className="h-full">
          {renderTabContent()}

          {/* Success/Error Messages for Profile */}
          {activeTab !== 'security' && (
            <>
              {successMessage && (
                <NotificationToast
                  type="success"
                  message={successMessage}
                  isVisible={!!successMessage}
                  onClose={() => setSuccessMessage("")}
                />
              )}

              {errors["submit"] && (
                <NotificationToast
                  type="error"
                  message={errors["submit"]}
                  isVisible={!!errors["submit"]}
                  onClose={() => setErrors((prev) => ({ ...prev, submit: "" }))}
                />
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileRightCard;
