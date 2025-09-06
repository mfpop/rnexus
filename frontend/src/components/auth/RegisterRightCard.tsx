import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Lock,
  User,
  Building,
  AlertCircle,
} from "lucide-react";
import { Button } from "../ui/bits";

/**
 * RegisterRightCard - Register page specific right card content component
 * Independent content - contains the actual registration form
 * Not related to the platform benefits in the left card
 */
const RegisterRightCard: React.FC = () => {
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData["firstName"].trim()) {
      newErrors["firstName"] = "First name is required";
    }

    if (!formData["lastName"].trim()) {
      newErrors["lastName"] = "Last name is required";
    }

    if (!formData["email"]) {
      newErrors["email"] = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData["email"])) {
      newErrors["email"] = "Please enter a valid email address";
    }

    if (!formData["company"].trim()) {
      newErrors["company"] = "Company name is required";
    }

    if (!formData["password"]) {
      newErrors["password"] = "Password is required";
    } else if (formData["password"].length < 8) {
      newErrors["password"] = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData["password"])) {
      newErrors["password"] =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData["confirmPassword"]) {
      newErrors["confirmPassword"] = "Please confirm your password";
    } else if (formData["password"] !== formData["confirmPassword"]) {
      newErrors["confirmPassword"] = "Passwords do not match";
    }

    if (!formData["agreeToTerms"]) {
      newErrors["agreeToTerms"] = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Handle successful registration here

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      });
    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!formData.password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(formData.password)) strength++;
    if (/(?=.*[A-Z])/.test(formData.password)) strength++;
    if (/(?=.*\d)/.test(formData.password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(formData.password)) strength++;

    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    const colors = [
      "",
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-green-600",
    ];

    return {
      strength,
      label: labels[strength] || "",
      color: colors[strength] || "",
    };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="p-6 h-full flex flex-col justify-center max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-gray-600">
          Join Nexus LMD and transform your manufacturing
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData["firstName"]}
                onChange={handleInputChange}
                className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm ${
                  errors["firstName"] ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="First name"
                disabled={isLoading}
              />
            </div>
            {errors["firstName"] && (
              <p className="mt-1 text-xs text-red-600">{errors["firstName"]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData["lastName"]}
                onChange={handleInputChange}
                className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm ${
                  errors["lastName"] ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Last name"
                disabled={isLoading}
              />
            </div>
            {errors["lastName"] && (
              <p className="mt-1 text-xs text-red-600">{errors["lastName"]}</p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData["email"]}
              onChange={handleInputChange}
              className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm ${
                errors["email"] ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          {errors["email"] && (
            <p className="mt-1 text-xs text-red-600">{errors["email"]}</p>
          )}
        </div>

        {/* Company Field */}
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="company"
              name="company"
              value={formData["company"]}
              onChange={handleInputChange}
              className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm ${
                errors["company"] ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Your company name"
              disabled={isLoading}
            />
          </div>
          {errors["company"] && (
            <p className="mt-1 text-xs text-red-600">{errors["company"]}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-9 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm ${
                errors["password"] ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Create a password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">
                  {passwordStrength.label}
                </span>
              </div>
            </div>
          )}

          {errors["password"] && (
            <p className="mt-1 text-xs text-red-600">{errors["password"]}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full pl-9 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm ${
                errors["confirmPassword"] ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors["confirmPassword"] && (
            <p className="mt-1 text-xs text-red-600">
              {errors["confirmPassword"]}
            </p>
          )}
        </div>

        {/* Terms Agreement */}
        <div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-600">
              I agree to the{" "}
              <a
                href="/terms"
                className="text-green-600 hover:text-green-500 font-medium"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-green-600 hover:text-green-500 font-medium"
              >
                Privacy Policy
              </a>
            </span>
          </label>
          {errors["agreeToTerms"] && (
            <p className="mt-1 text-xs text-red-600">
              {errors["agreeToTerms"]}
            </p>
          )}
        </div>

        {/* Submit Error */}
        {errors["submit"] && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{errors["submit"]}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating account...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <UserPlus className="h-5 w-5" />
              <span>Create Account</span>
            </div>
          )}
        </Button>
      </form>

      {/* Footer Links */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-600 hover:text-green-500 font-medium transition-colors"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterRightCard;
