import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button, Input } from "../ui/bits";

interface ProfileData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  last_login: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
}

interface PasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const ProfileRightCard: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    date_joined: "",
    last_login: "",
    is_active: false,
    is_staff: false,
    is_superuser: false,
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
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

  // Load profile data on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/profile/", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfileData(data.profile);
        }
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

    setIsLoading(true);
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profileData.email,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("Profile updated successfully!");
        setProfileData(data.profile);
        // Clear errors
        setErrors({});
      } else {
        setErrors({ submit: data.error || "Failed to update profile" });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
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
        "http://localhost:8000/api/profile/change-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_password: passwordData.current_password,
            new_password: passwordData.new_password,
          }),
          credentials: "include",
        },
      );

      const data = await response.json();

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Profile Settings
          </h2>
          <p className="text-gray-600">
            Manage your account information and security
          </p>
        </div>

        {/* Profile Information Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Personal Information
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <Input
                  type="text"
                  value={profileData.username}
                  disabled
                  className="bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Username cannot be changed
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      handleProfileChange("email", e.target.value)
                    }
                    variant={errors["email"] ? "error" : "default"}
                    className="pl-10"
                  />
                </div>
                {errors["email"] && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors["email"]}</span>
                  </div>
                )}
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <Input
                  type="text"
                  value={profileData.first_name}
                  onChange={(e) =>
                    handleProfileChange("first_name", e.target.value)
                  }
                  variant={errors["first_name"] ? "error" : "default"}
                />
                {errors["first_name"] && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors["first_name"]}</span>
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <Input
                  type="text"
                  value={profileData.last_name}
                  onChange={(e) =>
                    handleProfileChange("last_name", e.target.value)
                  }
                  variant={errors["last_name"] ? "error" : "default"}
                />
                {errors["last_name"] && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors["last_name"]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${profileData.is_active ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {profileData.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Status
                </label>
                <span className="text-sm text-gray-600">
                  {profileData.is_staff ? "Staff Member" : "Regular User"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Status
                </label>
                <span className="text-sm text-gray-600">
                  {profileData.is_superuser ? "Administrator" : "Regular User"}
                </span>
              </div>
            </div>

            {/* Account Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <span className="text-sm text-gray-600">
                  {formatDate(profileData.date_joined)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Login
                </label>
                <span className="text-sm text-gray-600">
                  {formatDate(profileData.last_login)}
                </span>
              </div>
            </div>

            {/* Submit Error */}
            {errors["submit"] && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors["submit"]}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Key className="h-5 w-5 text-red-500" />
            Change Password
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.current_password}
                    onChange={(e) =>
                      handlePasswordChange("current_password", e.target.value)
                    }
                    variant={
                      passwordErrors["current_password"] ? "error" : "default"
                    }
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {passwordErrors["current_password"] && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{passwordErrors["current_password"]}</span>
                  </div>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.new_password}
                    onChange={(e) =>
                      handlePasswordChange("new_password", e.target.value)
                    }
                    variant={
                      passwordErrors["new_password"] ? "error" : "default"
                    }
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                    }
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {passwordErrors["new_password"] && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{passwordErrors["new_password"]}</span>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirm_password}
                    onChange={(e) =>
                      handlePasswordChange("confirm_password", e.target.value)
                    }
                    variant={
                      passwordErrors["confirm_password"] ? "error" : "default"
                    }
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {passwordErrors["confirm_password"] && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{passwordErrors["confirm_password"]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Error */}
            {passwordErrors["submit"] && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{passwordErrors["submit"]}</span>
              </div>
            )}

            {/* Success Message */}
            {passwordSuccessMessage && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>{passwordSuccessMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPasswordLoading}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPasswordLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Changing Password...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Key className="h-5 w-5" />
                  <span>Change Password</span>
                </div>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileRightCard;
