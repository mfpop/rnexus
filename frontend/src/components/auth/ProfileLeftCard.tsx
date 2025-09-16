import React from "react";
import {
  Shield,
  Lock,
  CheckCircle,
  Lightbulb,
  FileText,
  Download,
  EyeOff,
  TrendingUp,
  Settings,
  Bell,
  Share2,
  Heart,
  Bookmark,
} from "lucide-react";
import AuthService from "../../lib/authService";
import { computeProfileCompletion } from "../../lib/profileCompletion";

// API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const ProfileLeftCard: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [percent, setPercent] = React.useState<number>(0);
  const [details, setDetails] = React.useState({
    basicInfo: false,
    contact: false,
    address: false,
    professional: false,
    education: false,
    work: false,
    bio: false,
  });
  // Removed privacyLevel state, cards are now static
  const [showTips, setShowTips] = React.useState(true);

  const handleDownloadCV = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/profile/download-cv/`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (response.ok) {
        // Get the filename from the response headers
        const contentDisposition = response.headers.get("Content-Disposition");
        let filename = "CV.pdf";
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }

        // Create blob and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        console.error("CV download failed:", error);
        alert("Failed to download CV. Please try again.");
      }
    } catch (error) {
      console.error("CV download error:", error);
      alert("Error downloading CV. Please try again.");
    }
  };

  const loadCompletion = React.useCallback(async () => {
    if (!AuthService.isAuthenticated()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/user/profile/`, {
        headers: AuthService.getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data?.success && data?.profile) {
        const { percent, details } = computeProfileCompletion(data.profile);
        setPercent(percent);
        setDetails(details);
      }
    } catch (e: any) {
      console.error("Profile completion fetch failed:", e);
      setError("Unable to load profile completion");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCompletion();
  }, [loadCompletion]);

  React.useEffect(() => {
    const handler = () => loadCompletion();
    (window as any).addEventListener("profile-updated", handler);
    return () => {
      (window as any).removeEventListener("profile-updated", handler);
    };
  }, [loadCompletion]);

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-50 to-white flex flex-col overflow-hidden border-r border-gray-200">
      {/* Enhanced Header with Key Information */}
      <div className="p-2 border-b border-gray-200 bg-white flex-shrink-0">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {/* Profile Completion */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-2 rounded-md border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-purple-900">Completion</span>
              <div className={`w-2 h-2 rounded-full ${percent >= 80 ? 'bg-green-500' : percent >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            </div>
            <div className="text-base font-bold text-purple-900 mb-1">{loading ? "..." : `${percent}%`}</div>
            <div className="w-full bg-purple-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <div className="text-xs text-purple-700 mt-1">
              {percent >= 80 ? 'Excellent!' : percent >= 50 ? 'Good progress' : 'Keep going!'}
            </div>
          </div>

          {/* Security Status */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2 rounded-md border border-green-200 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-green-900">Security</span>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-base font-bold text-green-900 mb-1">Secure</div>
            <div className="text-xs text-green-700 mb-1">Protected</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Shield className="w-3 h-3" />
              <span>2FA Enabled</span>
            </div>
          </div>

          {/* Quick Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-md border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-blue-900">Actions</span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <button
              onClick={handleDownloadCV}
              className="text-xs font-semibold text-blue-900 hover:text-blue-700 transition-colors mb-1 flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
            <div className="text-xs text-blue-700">PDF Ready</div>
          </div>
        </div>

        {/* Profile Status Indicators */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${details.basicInfo ? "bg-green-500" : "bg-gray-300"}`}></div>
              <span className={details.basicInfo ? "text-green-700 font-medium" : "text-gray-500"}>
                Basic Info
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${details.contact ? "bg-green-500" : "bg-gray-300"}`}></div>
              <span className={details.contact ? "text-green-700 font-medium" : "text-gray-500"}>
                Contact
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${details.address ? "bg-green-500" : "bg-gray-300"}`}></div>
              <span className={details.address ? "text-green-700 font-medium" : "text-gray-500"}>
                Address
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${details.bio ? "bg-green-500" : "bg-yellow-500"}`}></div>
              <span className={details.bio ? "text-green-700 font-medium" : "text-yellow-700"}>
                Bio
              </span>
            </div>
          </div>
          {error && (
            <div className="text-red-600 font-medium text-xs bg-red-50 p-1 rounded-md border border-red-200">
              Error loading data
            </div>
          )}
        </div>
      </div>

      {/* Content - fills column height with compact sections */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 gap-2 p-2">

        {/* Quick Stats Section */}
        <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 border-b border-gray-200 flex-shrink-0">
            <h4 className="text-xs font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-indigo-600" />
              </div>
              Quick Stats
            </h4>
          </div>
          <div className="p-1">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-center py-2 bg-gray-50 rounded-md">
                <div className="text-base font-bold text-gray-900">{details.education ? '2' : '0'}</div>
                <div className="text-xs text-gray-600">Education</div>
              </div>
              <div className="text-center py-2 bg-gray-50 rounded-md">
                <div className="text-base font-bold text-gray-900">{details.work ? '3' : '0'}</div>
                <div className="text-xs text-gray-600">Experience</div>
              </div>
              <div className="text-center py-2 bg-gray-50 rounded-md">
                <div className="text-base font-bold text-gray-900">12</div>
                <div className="text-xs text-gray-600">Skills</div>
              </div>
              <div className="text-center py-2 bg-gray-50 rounded-md">
                <div className="text-base font-bold text-gray-900">5</div>
                <div className="text-xs text-gray-600">Awards</div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-gray-100 to-slate-100 px-3 py-2 border-b border-gray-200 flex-shrink-0">
            <h4 className="text-xs font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                <Lock className="h-3 w-3 text-gray-600" />
              </div>
              Privacy & Visibility
            </h4>
          </div>
          <div className="p-2">
            <p className="text-xs text-gray-600 mb-2">
              Control profile visibility with toggles.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div
                className="flex flex-col items-center p-2 rounded-md border bg-white border-gray-200"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mb-1"></div>
                <span className="text-xs font-medium text-gray-900">Public</span>
                <span className="text-xxs text-gray-500">Everyone</span>
              </div>
              <div
                className="flex flex-col items-center p-2 rounded-md border bg-white border-gray-200"
              >
                <div className="w-2 h-2 bg-yellow-500 rounded-full mb-1"></div>
                <span className="text-xs font-medium text-gray-900">Limited</span>
                <span className="text-xxs text-gray-500">Colleagues</span>
              </div>
              <div
                className="flex flex-col items-center p-2 rounded-md border bg-white border-gray-200"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mb-1"></div>
                <span className="text-xs font-medium text-gray-900">Private</span>
                <span className="text-xxs text-gray-500">Only You</span>
              </div>
            </div>
          </div>
        </div>


        {/* Quick Actions */}
        <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 border-b border-gray-200 flex-shrink-0">
            <h4 className="text-xs font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="h-3 w-3 text-blue-600" />
              </div>
              Quick Actions
            </h4>
          </div>
          <div className="p-2">
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                <Share2 className="w-4 h-4 text-gray-600" />
                <span className="text-xs text-gray-700">Share</span>
              </button>
              <button className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                <Bookmark className="w-4 h-4 text-gray-600" />
                <span className="text-xs text-gray-700">Bookmark</span>
              </button>
              <button className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                <Bell className="w-4 h-4 text-gray-600" />
                <span className="text-xs text-gray-700">Alerts</span>
              </button>
              <button className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                <Heart className="w-4 h-4 text-gray-600" />
                <span className="text-xs text-gray-700">Favs</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Tips Section (moved after Quick Actions) */}
        {showTips && (
          <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-2 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Lightbulb className="h-3 w-3 text-yellow-600" />
                  </div>
                  Profile Tips
                </h4>
                <button
                  onClick={() => setShowTips(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Hide tips"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-1 grid grid-cols-1 gap-1 sm:grid-cols-1 md:grid-cols-1">
              <div className="px-3 py-1.5 bg-white rounded-md border border-gray-200 flex flex-col justify-center min-h-[56px]">
                <p className="text-sm font-semibold text-gray-900 mb-0.5">Complete Your Education</p>
                <p className="text-xs text-gray-600 leading-tight">Add educational background to improve visibility and credibility.</p>
              </div>
              <div className="px-3 py-1.5 bg-white rounded-md border border-gray-200 flex flex-col justify-center min-h-[56px]">
                <p className="text-sm font-semibold text-gray-900 mb-0.5">Professional Bio</p>
                <p className="text-xs text-gray-600 leading-tight">Write compelling bio highlighting your expertise and achievements.</p>
              </div>
              <div className="px-3 py-1.5 bg-white rounded-md border border-gray-200 flex flex-col justify-center min-h-[56px]">
                <p className="text-sm font-semibold text-gray-900 mb-0.5">Work Experience</p>
                <p className="text-xs text-gray-600 leading-tight">Document career progression with detailed work history.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileLeftCard;
