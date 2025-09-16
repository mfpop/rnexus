import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle, Key, AlertCircle } from "lucide-react";
import { AuthForm, FormField } from "../components/ui/AuthForm";

/**
 * ForgotPassword - Enhanced password reset page with improved UX
 */
const ForgotPassword: React.FC = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Define form fields with validation
  const formFields: FormField[] = [
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email address",
      required: true,
      icon: <Mail className="h-5 w-5 text-teal-400" />,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        custom: (value: string) => {
          if (value && !value.includes("@")) {
            return "Please enter a valid email address";
          }
          return null;
        },
      },
    },
  ];

  const handleSubmit = async (formData: { [key: string]: string | File }) => {
    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call - replace with actual password reset logic
      console.log("Password reset request for:", formData['email']);

      // Simulate successful email sending
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsEmailSent(true);
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors({
        submit: error instanceof Error
          ? error.message
          : "Failed to send password reset email. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const footerContent = (
    <div className="space-y-4">
      {/* Submit Error */}
      {errors["submit"] && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{errors["submit"]}</span>
        </div>
      )}

      {/* Help Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
            <Key className="h-3 w-3 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-teal-600">Need Help?</h3>
        </div>
        <p className="text-sm text-gray-600">
          If you don't receive the reset email within a few minutes:
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
            Check your spam/junk folder
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
            Verify the email address is correct
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
            Contact our support team for assistance
          </li>
        </ul>
      </div>

      {/* Back to Login Link */}
      <div className="text-center pt-4">
        <Link
          to="/login"
          className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );

  // Success state - email sent
  if (isEmailSent) {
    return (
      <div className="flex items-center justify-center min-h-full py-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check your email
            </h2>
            <p className="text-gray-600">
              We've sent a password reset link to your email address.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <button
              onClick={() => setIsEmailSent(false)}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
            >
              Try again
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-full py-16">
      <div className="w-full max-w-md space-y-10">
        {/* Secure Login Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 border-2 border-blue-200">
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <AuthForm
          fields={formFields}
          onSubmit={handleSubmit}
          submitButtonText="Send Reset Link"
          submitButtonIcon={<Key className="h-5 w-5" />}
          isLoading={isLoading}
          footer={footerContent}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
