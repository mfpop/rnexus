import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  User,
  Lock,
  CheckCircle,
  Home,
  Lightbulb,
  FileText,
} from "lucide-react";

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ProfileLeftCard: React.FC = () => {
  const navigate = useNavigate();

  const handleReturnToDashboard = () => {
    navigate('/');
  };

  const handleDownloadCV = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/download-cv/`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        // Get the filename from the response headers
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'CV.pdf';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }

        // Create blob and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        console.error('CV download failed:', error);
        alert('Failed to download CV. Please try again.');
      }
    } catch (error) {
      console.error('CV download error:', error);
      alert('Error downloading CV. Please try again.');
    }
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Content - grows to fill available space with overflow scroll */}
      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        {/* Quick Actions */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            Quick Actions
          </h4>
          <div className="space-y-2">
            <button
              onClick={handleDownloadCV}
              className="w-full flex items-center justify-between p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Download CV</span>
              </div>
              <div className="text-xs text-gray-500">PDF</div>
            </button>
            <button
              onClick={handleReturnToDashboard}
              className="w-full flex items-center justify-between p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Home className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Return to Dashboard</span>
              </div>
            </button>
          </div>
        </div>

        {/* Security Status */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <h4 className="text-sm font-medium text-gray-900">Security Status</h4>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Good</span>
          </div>
          <p className="text-sm text-gray-600">
            Your account is protected with strong security measures.
          </p>
        </div>

        {/* Profile Completion */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <User className="h-4 w-4 text-purple-500" />
              Profile Completion
            </h4>
            <span className="text-sm font-medium text-gray-900">85%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <div className="space-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Basic information completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Contact details added</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
              <span>Add more education details</span>
            </div>
          </div>
        </div>

        {/* Profile Tips */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Profile Tips
          </h4>
          <div className="space-y-3 text-xs text-gray-600">
            <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
              <p className="font-medium text-gray-800 mb-1">Complete Your Education</p>
              <p>Add detailed information about your educational background to improve your profile visibility.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
              <p className="font-medium text-gray-800 mb-1">Professional Bio</p>
              <p>Write a compelling bio that highlights your expertise and career achievements.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
              <p className="font-medium text-gray-800 mb-1">Work Experience</p>
              <p>Document your work history with detailed descriptions to showcase your career progression.</p>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Lock className="h-4 w-4 text-gray-500" />
            Privacy & Visibility
          </h4>
          <div className="text-xs text-gray-600 space-y-2">
            <p>Control who can see your profile information using the visibility toggles in each section.</p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Visible to colleagues</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Partially visible</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLeftCard;
