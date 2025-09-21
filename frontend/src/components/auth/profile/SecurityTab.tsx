import React, { useState } from "react";
import { Key, Eye, EyeOff } from "lucide-react";
import { Button, Input, NotificationToast } from "../../ui/bits";

interface SecurityTabProps {
  handlePasswordChange: (oldPassword: string, newPassword: string) => Promise<void>;
  passwordSuccessMessage: string;
  passwordErrorMessage: string;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
  handlePasswordChange,
  passwordSuccessMessage,
  passwordErrorMessage,
}) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return;
    }

    setIsChangingPassword(true);
    try {
      await handlePasswordChange(oldPassword, newPassword);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="h-full flex-1 flex flex-col profile-form">
      <div className="flex-1 flex flex-col bg-white shadow-lg border border-gray-200 relative overflow-hidden">
        {/* Subtle paper texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white opacity-60"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        {/* Header */}
        <div className="p-6 border-b border-gray-200 relative z-10 min-h-[88px] flex items-center">
          <div className="flex items-center gap-3 w-full">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Security Settings</h3>
              <p className="text-gray-600 text-sm">Manage your account security and privacy settings</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-8 relative z-10 min-h-0">
          <div className="flex-1 flex flex-col space-y-8">
            {/* Password Change Section */}
            <div className="flex-1 flex flex-col">
              <h4 className="text-lg font-semibold text-gray-800 mb-6">Change Password</h4>
              <form onSubmit={handlePasswordSubmit} className="flex-1 flex flex-col space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 pr-10"
                        style={{
                          borderBottom: '2px solid #d1d5db'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderBottom = 'none';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderBottom = '2px solid #d1d5db';
                        }}
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showOldPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 pr-10"
                        style={{
                          borderBottom: '2px solid #d1d5db'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderBottom = 'none';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderBottom = '2px solid #d1d5db';
                        }}
                        placeholder="Enter new password"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 h-12 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400 pr-10"
                      style={{
                        borderBottom: '2px solid #d1d5db'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderBottom = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderBottom = '2px solid #d1d5db';
                      }}
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                  </div>
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-medium transition-colors"
                    disabled={isChangingPassword || newPassword !== confirmPassword || !newPassword}
                  >
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Account Security Information */}
            <div className="flex-1 flex flex-col border-t border-gray-200 pt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-6">Account Security</h4>
              <div className="flex-1 flex flex-col justify-center space-y-4">
                <div className="flex items-center justify-between p-6 bg-gray-50 border border-gray-200">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Not configured</div>
                </div>

                <div className="flex items-center justify-between p-6 bg-gray-50 border border-gray-200">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Login Sessions</p>
                    <p className="text-sm text-gray-500">Manage your active sessions</p>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">1 active session</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toasts */}
      {passwordSuccessMessage && (
        <NotificationToast
          message={passwordSuccessMessage}
          type="success"
          isVisible={true}
          onClose={() => {}}
        />
      )}
      {passwordErrorMessage && (
        <NotificationToast
          message={passwordErrorMessage}
          type="error"
          isVisible={true}
          onClose={() => {}}
        />
      )}
    </div>
  );
};

export default SecurityTab;
