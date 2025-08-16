import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { Mail, CheckCircle, Key, HelpCircle, Shield } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
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
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <Button
              onClick={() => setIsSubmitted(false)}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
            >
              Try again
            </Button>

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
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            Secure Login
          </h2>
          <p className="text-gray-600">
            Enter your credentials to access your workspace
          </p>
        </div>

        {/* Email Input Section */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors bg-white"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Send Password Reset Link Button */}
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 text-lg flex items-center justify-center gap-2"
        >
          <Key className="h-5 w-5" />
          {isLoading ? "Sending..." : "Send Password Reset Link"}
        </Button>

        {/* Need Help Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
              <HelpCircle className="h-3 w-3 text-white" />
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
    </div>
  );
};

export default ForgotPassword;
