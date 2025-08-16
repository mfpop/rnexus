import React from "react";
import {
  Shield,
  User,
  Lock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

const ProfileLeftCard: React.FC = () => {
  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Account Security
        </h3>
        <p className="text-gray-600">
          Protect your account with strong security practices
        </p>
      </div>

      {/* Security Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6 border border-green-200">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h4 className="font-semibold text-green-800">
            Security Status: Good
          </h4>
        </div>
        <p className="text-sm text-green-700">
          Your account is protected with strong security measures.
        </p>
      </div>

      {/* Security Tips */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <Lock className="h-4 w-4 text-blue-500" />
          Security Best Practices
        </h4>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Use a strong, unique password with at least 8 characters
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Never share your login credentials with anyone
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Log out when using shared or public computers
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Keep your email address up to date for account recovery
            </p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <User className="h-4 w-4 text-purple-500" />
          Account Details
        </h4>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <p className="text-sm text-gray-600">
              Profile information is visible to you only
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <p className="text-sm text-gray-600">
              Username cannot be changed after creation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <p className="text-sm text-gray-600">
              Email changes require verification
            </p>
          </div>
        </div>
      </div>

      {/* Password Guidelines */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <Lock className="h-4 w-4 text-red-500" />
          Password Requirements
        </h4>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Minimum 8 characters long</p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Include uppercase and lowercase letters
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Add numbers and special characters
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Avoid common words and patterns
            </p>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-auto">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">
              Important Notice
            </h4>
            <p className="text-sm text-yellow-700">
              After changing your password, you'll need to log in again with
              your new credentials. Make sure to remember your new password!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLeftCard;
