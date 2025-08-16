import React, { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { Button, Input } from "../ui/bits";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoginCredentials } from "../../lib/authService";
import AuthService from "../../lib/authService";

/**
 * LoginRightCard - Login page specific right card content component
 * Independent content - contains the actual login form
 * Not related to the security information in the left card
 */
const LoginRightCard: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Restore remember me preference from localStorage
  useEffect(() => {
    const savedRememberMe = AuthService.isRememberMeEnabled();
    setRememberMe(savedRememberMe);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) {
      newErrors["username"] = "Username is required";
    }

    if (!formData.password) {
      newErrors["password"] = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors["password"] = "Password must be at least 6 characters";
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
      // Use the AuthContext to login with rememberMe option
      await login(formData.username, formData.password, rememberMe);

      // Login successful, redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        submit: error instanceof Error ? error.message : "Login failed. Please check your credentials."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col justify-center max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <LogIn className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your Nexus LMD account</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Field */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              variant={errors["username"] ? "error" : "default"}
              className="w-full pl-10 pr-4 py-3"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>
          {errors["username"] && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errors["username"]}</span>
            </div>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              variant={errors["password"] ? "error" : "default"}
              className="w-full pl-12 py-3"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors["password"] && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errors["password"]}</span>
            </div>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <a
            href="/reset-password"
            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
          >
            Forgot password?
          </a>
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
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </div>
          )}
        </Button>
      </form>

      {/* Footer Links */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginRightCard;
