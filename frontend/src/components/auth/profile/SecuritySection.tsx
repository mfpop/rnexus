// src/components/auth/profile/SecuritySection.tsx

import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { Input } from '../../ui/bits';

interface SecurityData {
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
}

interface SecuritySectionProps {
  onPasswordChange: (data: SecurityData) => Promise<void>;
  errors?: Record<string, string>;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({
  onPasswordChange,
  errors = {}
}) => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState<SecurityData>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof SecurityData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      return; // Let the parent component handle validation
    }

    setIsSubmitting(true);
    try {
      await onPasswordChange(formData);
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.current_password &&
                     formData.new_password &&
                     formData.confirm_password &&
                     formData.new_password === formData.confirm_password;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-purple-600" />
          Security Settings
        </h3>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <Input
                type={showPasswords.current ? "text" : "password"}
                value={formData.current_password || ""}
                onChange={(e) => handleInputChange("current_password", e.target.value)}
                className="w-full pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors['current_password'] && <p className="text-red-500 text-sm mt-1">{errors['current_password']}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <Input
                type={showPasswords.new ? "text" : "password"}
                value={formData.new_password || ""}
                onChange={(e) => handleInputChange("new_password", e.target.value)}
                className="w-full pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors['new_password'] && <p className="text-red-500 text-sm mt-1">{errors['new_password']}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <Input
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirm_password || ""}
                onChange={(e) => handleInputChange("confirm_password", e.target.value)}
                className="w-full pr-10"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors['confirm_password'] && <p className="text-red-500 text-sm mt-1">{errors['confirm_password']}</p>}
            {formData.new_password && formData.confirm_password && formData.new_password !== formData.confirm_password && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating Password...
                </div>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </form>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Password Requirements:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Contains at least one uppercase letter</li>
            <li>• Contains at least one lowercase letter</li>
            <li>• Contains at least one number</li>
            <li>• Contains at least one special character</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
