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
    <div className="flex flex-col space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Key className="w-5 h-5 mr-2 text-blue-600" />
            Security Settings
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {/* Password Change Section */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Change Password</h4>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full h-[38px] pr-10"
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
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-[38px] pr-10"
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
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-[38px] pr-10"
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
                  </div>
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                    disabled={isChangingPassword || newPassword !== confirmPassword || !newPassword}
                  >
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Account Security Information */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Account Security</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security</p>
                  </div>
                  <div className="text-sm text-gray-500">Not configured</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Login Sessions</p>
                    <p className="text-xs text-gray-500">Manage your active sessions</p>
                  </div>
                  <div className="text-sm text-gray-500">1 active session</div>
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
