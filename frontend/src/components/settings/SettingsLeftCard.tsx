import React from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Wifi,
  Clock,
  Key,
  Monitor,
  ChevronRight,
} from "lucide-react";
import { useSettingsContext } from "./SettingsContext";

const SettingsLeftCard: React.FC = () => {
  const { selectedSection, setSelectedSection } = useSettingsContext();

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
  };

  const settingsSections = [
    {
      id: "general",
      title: "General Settings",
      icon: <Settings className="h-5 w-5" />,
      description: "Basic application preferences",
    },
    {
      id: "account",
      title: "Account & Profile",
      icon: <User className="h-5 w-5" />,
      description: "Personal information and profile settings",
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: <Shield className="h-5 w-5" />,
      description: "Password, authentication, and privacy controls",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      description: "Email and push notification preferences",
    },
    {
      id: "appearance",
      title: "Appearance & Theme",
      icon: <Palette className="h-5 w-5" />,
      description: "Interface theme and display settings",
    },
    {
      id: "localization",
      title: "Language & Region",
      icon: <Globe className="h-5 w-5" />,
      description: "Language, timezone, and regional settings",
    },
    {
      id: "database",
      title: "Database Settings",
      icon: <Database className="h-5 w-5" />,
      description: "Database connections and configurations",
    },
    {
      id: "network",
      title: "Network & API",
      icon: <Wifi className="h-5 w-5" />,
      description: "Network settings and API configurations",
    },
    {
      id: "system",
      title: "System Preferences",
      icon: <Monitor className="h-5 w-5" />,
      description: "Performance and system-level settings",
    },
    {
      id: "integrations",
      title: "Integrations",
      icon: <Key className="h-5 w-5" />,
      description: "System integrations and configurations",
    },
  ];

  return (
    <div className="space-y-4 p-4 h-full overflow-hidden flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
        </div>
        <p className="text-sm text-gray-600">
          Configure your application preferences and system settings
        </p>
      </div>

      <div className="space-y-3 flex-1 overflow-auto">
        {settingsSections.map((section) => (
          <div
            key={section.id}
            className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all ${
              selectedSection === section.id
                ? "ring-2 ring-blue-500 bg-blue-50"
                : ""
            }`}
            onClick={() => handleSectionClick(section.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    selectedSection === section.id
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {section.icon}
                </div>
                <div>
                  <h3
                    className={`font-semibold ${
                      selectedSection === section.id
                        ? "text-blue-700"
                        : "text-gray-800"
                    }`}
                  >
                    {section.title}
                  </h3>
                  <p className="text-xs text-gray-500">{section.description}</p>
                </div>
              </div>
              <ChevronRight
                className={`h-4 w-4 ${
                  selectedSection === section.id
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-700">Auto-Save</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Your settings are automatically saved as you make changes.
        </p>
        <div className="flex items-center gap-2 text-xs text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>All changes saved</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsLeftCard;
