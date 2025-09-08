import React, { useState } from "react";
import {
  KeyRound,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Button from "../ui/Button";

/**
 * ResetPasswordRightCard - Reset password page specific right card content component
 * Independent content - contains the actual password reset form
 * Not related to the security information in the left card
 */
const ResetPasswordRightCard: React.FC = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (errors["email"]) {
      setErrors({});
    }
  };

  const validateEmail = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors["email"] = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors["email"] = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Handle successful password reset request

      setIsEmailSent(true);
    } catch (error) {
      setErrors({ submit: "Failed to send reset email. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // Navigate back to login
    window.location.href = "/login";
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      setErrors({ submit: "Failed to resend email. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="p-6 h-full flex flex-col justify-center max-w-lg mx-auto w-full">
        {/* Success State */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600">
            We've sent password reset instructions to
          </p>
          <p className="text-gray-800 font-medium mt-1">{email}</p>
        </div>

        {/* Instructions */}
        <div className="space-y-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">What's next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check your email inbox (and spam folder)</li>
              <li>• Click the reset link in the email</li>
              <li>• Follow the instructions to create a new password</li>
              <li>• The link expires in 15 minutes for security</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleResendEmail}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Resending...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-5 w-5" />
                <span>Resend Email</span>
              </div>
            )}
          </Button>

          <Button
            onClick={handleBackToLogin}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Login</span>
            </div>
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Didn't receive the email?{" "}
            <a
              href="/contact"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col justify-center max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <KeyRound className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-600">
          Enter your email to receive reset instructions
        </p>
      </div>

      {/* Reset Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                errors["email"] ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your registered email"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          {errors["email"] && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errors["email"]}</span>
            </div>
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
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Mail className="h-5 w-5" />
              <span>Send Reset Instructions</span>
            </div>
          )}
        </Button>
      </form>

      {/* Security Note */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-700 font-medium mb-1">
              Security Notice
            </p>
            <p className="text-xs text-gray-600">
              Reset links are valid for 15 minutes and can only be used once. If
              you don't receive the email, check your spam folder.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-8 text-center space-y-2">
        <button
          onClick={handleBackToLogin}
          className="text-amber-600 hover:text-amber-500 font-medium transition-colors text-sm flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Login</span>
        </button>

        <p className="text-gray-600 text-xs">
          Remember your password?{" "}
          <a
            href="/login"
            className="text-amber-600 hover:text-amber-500 font-medium transition-colors"
          >
            Sign in instead
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordRightCard;
