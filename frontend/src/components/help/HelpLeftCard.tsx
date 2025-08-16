import React from "react";
import {
  BookOpen,
  Play,
  Settings,
  MessageSquare,
  BarChart3,
  Users,
  Shield,
  Lightbulb,
  Phone,
  AlertCircle,
  ChevronRight,
  Home,
  Factory,
  ClipboardList,
  Newspaper,
  Calendar,
  Monitor,
  HelpCircle,
} from "lucide-react";
import { useHelpContext } from "./HelpContext";

const HelpLeftCard: React.FC = () => {
  const { selectedSection, setSelectedSection } = useHelpContext();

  // Debug logging
  console.log('HelpLeftCard - selectedSection:', selectedSection);

  const handleSectionClick = (sectionId: string) => {
    console.log('handleSectionClick called with sectionId:', sectionId);
    setSelectedSection(sectionId);
  };

  const helpSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Play className="h-5 w-5" />,
      subsections: [
        { id: "welcome", title: "Welcome to Nexus LMD" },
        { id: "first-login", title: "First Login" },
        { id: "navigation-basics", title: "Navigation Basics" },
        { id: "dashboard-overview", title: "Dashboard Overview" },
      ],
    },
    {
      id: "navigation",
      title: "Navigation Guide",
      icon: <Home className="h-5 w-5" />,
      subsections: [
        { id: "sidebar-navigation", title: "Sidebar Navigation" },
        { id: "card-expansion", title: "Card Expansion" },
        { id: "page-switching", title: "Page Switching" },
        { id: "shortcuts", title: "Keyboard Shortcuts" },
      ],
    },
    {
      id: "dashboard",
      title: "Dashboard Features",
      icon: <BarChart3 className="h-5 w-5" />,
      subsections: [
        { id: "stats-overview", title: "Statistics Overview" },
        { id: "recent-activities", title: "Recent Activities" },
        { id: "latest-innovations", title: "Latest Innovations" },
        { id: "performance-metrics", title: "Performance Metrics" },
      ],
    },
    {
      id: "communication",
      title: "Team Communication",
      icon: <MessageSquare className="h-5 w-5" />,
      subsections: [
        { id: "chat-basics", title: "Chat Basics" },
        { id: "file-sharing", title: "File Sharing" },
        { id: "video-calls", title: "Video & Audio Calls" },
        { id: "contact-management", title: "Contact Management" },
      ],
    },
    {
      id: "production",
      title: "Production Management",
      icon: <Factory className="h-5 w-5" />,
      subsections: [
        { id: "production-overview", title: "Production Overview" },
        { id: "monitoring", title: "Real-time Monitoring" },
        { id: "quality-control", title: "Quality Control" },
        { id: "maintenance", title: "Maintenance Scheduling" },
      ],
    },
    {
      id: "project-management",
      title: "Project Management",
      icon: <ClipboardList className="h-5 w-5" />,
      subsections: [
        { id: "project-creation", title: "Creating Projects" },
        { id: "task-management", title: "Task Management" },
        { id: "collaboration", title: "Team Collaboration" },
        { id: "progress-tracking", title: "Progress Tracking" },
      ],
    },
    {
      id: "activities",
      title: "Activity Tracking",
      icon: <Calendar className="h-5 w-5" />,
      subsections: [
        { id: "activity-overview", title: "Activity Overview" },
        { id: "scheduling", title: "Scheduling Tasks" },
        { id: "status-management", title: "Status Management" },
        { id: "reporting", title: "Activity Reporting" },
      ],
    },
    {
      id: "news-updates",
      title: "News & Updates",
      icon: <Newspaper className="h-5 w-5" />,
      subsections: [
        { id: "reading-news", title: "Reading News" },
        { id: "notifications", title: "Notifications" },
        { id: "announcements", title: "Company Announcements" },
        { id: "updates", title: "System Updates" },
      ],
    },
    {
      id: "system-admin",
      title: "System Administration",
      icon: <Monitor className="h-5 w-5" />,
      subsections: [
        { id: "user-management", title: "User Management" },
        { id: "permissions", title: "Permissions & Roles" },
        { id: "system-settings", title: "System Settings" },
        { id: "backup-restore", title: "Backup & Restore" },
      ],
    },
    {
      id: "account-settings",
      title: "Account & Settings",
      icon: <Settings className="h-5 w-5" />,
      subsections: [
        { id: "profile-setup", title: "Profile Setup" },
        { id: "password-security", title: "Password & Security" },
        { id: "preferences", title: "User Preferences" },
        { id: "privacy-settings", title: "Privacy Settings" },
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: <AlertCircle className="h-5 w-5" />,
      subsections: [
        { id: "common-issues", title: "Common Issues" },
        { id: "error-messages", title: "Error Messages" },
        { id: "performance-tips", title: "Performance Tips" },
        { id: "browser-compatibility", title: "Browser Compatibility" },
      ],
    },
    {
      id: "support",
      title: "Support & Contact",
      icon: <Phone className="h-5 w-5" />,
      subsections: [
        { id: "contact-support", title: "Contact Support" },
        { id: "support-tickets", title: "Support Tickets" },
        { id: "emergency-contact", title: "Emergency Contact" },
        { id: "feedback", title: "Send Feedback" },
      ],
    },
  ];

  return (
    <div className="space-y-4 p-4 h-full overflow-hidden flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-6 w-6 text-teal-600" />
          <h1 className="text-2xl font-bold text-gray-800">User Manual</h1>
        </div>
        <p className="text-sm text-gray-600">
          Complete guide to using Nexus LMD platform
        </p>
      </div>

      <div className="space-y-3 flex-1 overflow-auto">
        {helpSections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div
              className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedSection === section.id
                  ? "bg-teal-50 border-l-4 border-l-teal-500"
                  : ""
              }`}
              onClick={() => handleSectionClick(section.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      selectedSection === section.id
                        ? "bg-teal-100 text-teal-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {section.icon}
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        selectedSection === section.id
                          ? "text-teal-700"
                          : "text-gray-800"
                      }`}
                    >
                      {section.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {section.subsections.length} topics
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${
                    selectedSection === section.id
                      ? "rotate-90 text-teal-600"
                      : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            {selectedSection === section.id && (
              <div className="bg-gray-50 border-t border-gray-200">
                {section.subsections.map((subsection) => (
                  <div
                    key={subsection.id}
                    className="px-6 py-2 hover:bg-white cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSectionClick(subsection.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 hover:text-teal-600">
                        {subsection.title}
                      </span>
                      <ChevronRight className="h-3 w-3 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="h-5 w-5 text-teal-600" />
          <h3 className="font-semibold text-teal-700">Need More Help?</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <button
          className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors"
          onClick={() => handleSectionClick("contact-support")}
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default HelpLeftCard;
