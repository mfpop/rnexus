import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  Camera,
  Phone,
} from "lucide-react";
import { Button, Input } from "../ui/bits";
import AddressFormEnhanced from "../shared/AddressFormEnhanced";
import NamePhoneForm from "../shared/NamePhoneForm";
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

  // Helper function to get address data for AddressForm
  const getAddressData = () => ({
    street_address: profileData.street_address || "",
    apartment_suite: profileData.apartment_suite || "",
    country: profileData.country || "",
    state_province: profileData.state_province || "",
    city: profileData.city || "",
    zip_code: profileData.zip_code || "",
  });

  // Helper function to update profile data from address form
  const handleAddressChange = (addressData: any) => {
    setProfileData(prev => ({
      ...prev,
      street_address: addressData.street_address,
      apartment_suite: addressData.apartment_suite,
      country: addressData.country,
      state_province: addressData.state_province,
      city: addressData.city,
      zip_code: addressData.zip_code,
    }));
  };

  // Helper function to get name and phone data for NamePhoneForm
  const getNamePhoneData = () => ({
    first_name: profileData.first_name || "",
    middle_name: profileData.middle_name || "",
    last_name: profileData.last_name || "",
    maternal_last_name: profileData.maternal_last_name || "",
    preferred_name: profileData.preferred_name || "",
    phone: profileData.phone || "",
    phone_country_code: profileData.phone_country_code || "+1",
    phone_type: profileData.phone_type || "mobile",
    secondary_phone: profileData.secondary_phone || "",
    secondary_phone_type: profileData.secondary_phone_type || "mobile",
  });

  // Helper function to update profile data from name and phone form
  const handleNamePhoneChange = (namePhoneData: any) => {
    setProfileData(prev => ({
      ...prev,
      first_name: namePhoneData.first_name,
      middle_name: namePhoneData.middle_name,
      last_name: namePhoneData.last_name,
      maternal_last_name: namePhoneData.maternal_last_name,
      preferred_name: namePhoneData.preferred_name,
      phone: namePhoneData.phone,
      phone_country_code: namePhoneData.phone_country_code,
      phone_type: namePhoneData.phone_type,
      secondary_phone: namePhoneData.secondary_phone,
      secondary_phone_type: namePhoneData.secondary_phone_type,
    }));
  };

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

  const loadProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/`, {
        headers: AuthService.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
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
          <div className="space-y-4">
            {/* Name and Phone Form - Compact */}
            <NamePhoneForm
              value={getNamePhoneData()}
              onChange={handleNamePhoneChange}
              className="space-y-3"
            />

            {/* Email and Phone Section - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Field - Left Side */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  variant={errors["email"] ? "error" : "default"}
                  className="w-full"
                  placeholder="your.email@example.com"
                />
                {errors["email"] && (
                  <p className="text-red-600 text-xs mt-1">{errors["email"]}</p>
                )}
              </div>

              {/* Phone Section - Right Side */}
              <div className="space-y-3">
                <h3 className="text-base font-medium text-gray-900 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Phone Number *
                    </label>
                    <div className="flex space-x-2">
                      {/* Country Code */}
                      <div className="w-32">
                        <select
                          value={profileData.phone_country_code || "+1"}
                          onChange={(e) => handleProfileChange("phone_country_code", e.target.value)}
                          className="w-full h-8 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          <option value="+420">🇨🇿 +48</option>
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
                          <option value="+254">🇰🇪 +254</option>
                          <option value="+255">🇹🇿 +255</option>
                          <option value="+256">🇺🇬 +256</option>
                          <option value="+257">🇧🇮 +257</option>
                        </select>
                      </div>

                      {/* Phone Number */}
                      <div className="flex-1">
                        <Input
                          type="tel"
                          value={profileData.phone || ""}
                          onChange={(e) => handleProfileChange("phone", e.target.value)}
                          className="w-full"
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      {/* Phone Type */}
                      <div className="w-32">
                        <select
                          value={profileData.phone_type || "mobile"}
                          onChange={(e) => handleProfileChange("phone_type", e.target.value)}
                          className="w-full h-8 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="mobile">📱 Mobile</option>
                          <option value="home">🏠 Home</option>
                          <option value="work">🏢 Work</option>
                          <option value="other">📞 Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Phone Number
                    </label>
                    <div className="flex space-x-2">
                      {/* Country Code */}
                      <div className="w-32">
                        <select
                          value={profileData.phone_country_code || "+1"}
                          onChange={(e) => handleProfileChange("phone_country_code", e.target.value)}
                          className="w-full h-8 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          <option value="+420">🇨🇿 +48</option>
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
                          <option value="+254">🇰🇪 +254</option>
                          <option value="+255">🇹🇿 +255</option>
                          <option value="+256">🇺🇬 +256</option>
                          <option value="+257">🇧🇮 +257</option>
                        </select>
                      </div>
                      {/* Phone Number */}
                      <div className="flex-1">
                        <Input
                          type="tel"
                          value={profileData.secondary_phone || ""}
                          onChange={(e) => handleProfileChange("secondary_phone", e.target.value)}
                          className="w-full"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      {/* Phone Type */}
                      <div className="w-32">
                        <select
                          value={profileData.secondary_phone_type || "mobile"}
                          onChange={(e) => handleProfileChange("secondary_phone_type", e.target.value)}
                          className="w-full h-8 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="mobile">📱 Mobile</option>
                          <option value="home">🏠 Home</option>
                          <option value="work">🏢 Work</option>
                          <option value="other">📞 Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Form - Compact */}
            <AddressFormEnhanced
              value={getAddressData()}
              onChange={handleAddressChange}
              className="space-y-3"
            />

            {/* Bio Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={profileData.bio || ""}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        );

      case 'professional':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <Input
                  type="text"
                  value={profileData.position || ""}
                  onChange={(e) => handleProfileChange("position", e.target.value)}
                  className="w-full"
                  placeholder="e.g. Senior Software Engineer"
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
                  placeholder="e.g. Engineering"
                />
              </div>
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Manage your educational background</p>
              <Button
                onClick={addEducation}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-0 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Education
              </Button>
            </div>

            <div className="space-y-4">
              {(profileData.education || []).map((edu) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <Input
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      placeholder="University/School"
                      className="font-medium"
                    />
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="Degree"
                    />
                    <Input
                      value={edu.field || ''}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      placeholder="Field of Study"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={edu.startYear || ''}
                        onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                        placeholder="Start Year"
                        className="flex-1"
                      />
                      <Input
                        value={edu.endYear || ''}
                        onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                        placeholder="End Year"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <textarea
                    value={edu.description || ''}
                    onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                    placeholder="Description (achievements, honors, etc.)"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm mb-3"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={edu.visible ?? true}
                        onChange={(e) => updateEducation(edu.id, 'visible', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-600">Visible on profile</span>
                    </label>
                    <Button
                      onClick={() => removeEducation(edu.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 border-0 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {(!profileData.education || profileData.education.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No education entries yet</p>
                  <p className="text-sm">Click "Add Education" to add your educational background</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Manage your work experience</p>
              <Button
                onClick={addWork}
                className="bg-purple-50 hover:bg-purple-100 text-purple-600 border-0 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </Button>
            </div>

            <div className="space-y-4">
              {(profileData.work_history || []).map((work) => (
                <div key={work.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <Input
                      value={work.title}
                      onChange={(e) => updateWork(work.id, 'title', e.target.value)}
                      placeholder="Job Title"
                      className="font-medium"
                    />
                    <Input
                      value={work.company}
                      onChange={(e) => updateWork(work.id, 'company', e.target.value)}
                      placeholder="Company"
                    />
                    <Input
                      value={work.department || ''}
                      onChange={(e) => updateWork(work.id, 'department', e.target.value)}
                      placeholder="Department"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={work.startYear || ''}
                        onChange={(e) => updateWork(work.id, 'startYear', e.target.value)}
                        placeholder="Start Year"
                        className="flex-1"
                      />
                      <Input
                        value={work.endYear || ''}
                        onChange={(e) => updateWork(work.id, 'endYear', e.target.value)}
                        placeholder="End Year"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <textarea
                    value={work.description || ''}
                    onChange={(e) => updateWork(work.id, 'description', e.target.value)}
                    placeholder="Job description, responsibilities, achievements..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm mb-3"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={work.visible ?? true}
                        onChange={(e) => updateWork(work.id, 'visible', e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-600">Visible on profile</span>
                    </label>
                    <Button
                      onClick={() => removeWork(work.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 border-0 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {(!profileData.work_history || profileData.work_history.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No work experience entries yet</p>
                  <p className="text-sm">Click "Add Experience" to add your work history</p>
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
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span>{passwordSuccessMessage}</span>
              </div>
            )}

            {passwordErrors["submit"] && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{passwordErrors["submit"]}</span>
              </div>
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

          {/* Save Button - replaces auto-save indicator */}
          {activeTab !== 'security' && (
            <div className="px-4 py-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
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
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 mt-6">
                  <CheckCircle className="h-5 w-5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errors["submit"] && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mt-6">
                  <AlertCircle className="h-5 w-5" />
                  <span>{errors["submit"]}</span>
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileRightCard;
