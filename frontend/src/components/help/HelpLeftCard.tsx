import React from "react";
import {
  Play,
  Home,
  BarChart3,
  MessageSquare,
  Factory,
  ClipboardList,
  Calendar,
  Newspaper,
  Monitor,
  User,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { useHelpContext } from "./HelpContext";

const HelpLeftCard: React.FC = () => {
  const {
    selectedSection,
    selectedSubsection,
    setSelectedSection,
    setSelectedSubsection,
  } = useHelpContext();

  const handleSectionClick = (sectionId: string) => {
    // Toggle section: if already selected, collapse it; otherwise, expand it
    if (selectedSection === sectionId) {
      setSelectedSection(""); // Collapse the section
      setSelectedSubsection(""); // Clear subsection selection
    } else {
      setSelectedSection(sectionId); // Expand the section
      // Reset to first subsection when expanding
      const section = helpSections.find((s) => s.id === sectionId);
      if (section && section.subsections && section.subsections.length > 0) {
        const firstSubsection = section.subsections[0];
        if (firstSubsection) {
          setSelectedSubsection(firstSubsection.id);
        }
      }
    }
  };

  const handleSubsectionClick = (subsectionId: string) => {
    setSelectedSubsection(subsectionId);
  };

  const helpSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Play className="h-4 w-4" />,
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
      icon: <Home className="h-4 w-4" />,
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
      icon: <BarChart3 className="h-4 w-4" />,
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
      icon: <MessageSquare className="h-4 w-4" />,
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
      icon: <Factory className="h-4 w-4" />,
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
      icon: <ClipboardList className="h-4 w-4" />,
      subsections: [
        { id: "project-creation", title: "Creating Projects" },
        { id: "task-management", title: "Task Management" },
        { id: "collaboration", title: "Team Collaboration" },
        { id: "progress-tracking", title: "Progress Tracking" },
      ],
    },
    {
      id: "activities",
      title: "Activity Management",
      icon: <Calendar className="h-4 w-4" />,
      subsections: [
        { id: "activity-overview", title: "Getting Started" },
        { id: "activity-list", title: "Activity List View" },
        { id: "activity-details", title: "Activity Details" },
        { id: "filtering-sorting", title: "Filtering & Sorting" },
        { id: "creating-activities", title: "Creating Activities" },
        { id: "managing-activities", title: "Managing Activities" },
        { id: "activity-types", title: "Activity Types" },
        { id: "best-practices", title: "Best Practices" },
      ],
    },
    {
      id: "news-updates",
      title: "News & Updates",
      icon: <Newspaper className="h-4 w-4" />,
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
      icon: <Monitor className="h-4 w-4" />,
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
      icon: <User className="h-4 w-4" />,
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
      icon: <HelpCircle className="h-4 w-4" />,
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
      icon: <HelpCircle className="h-4 w-4" />,
      subsections: [
        { id: "contact-support", title: "Contact Support" },
        { id: "support-tickets", title: "Support Tickets" },
        { id: "emergency-contact", title: "Emergency Contact" },
        { id: "feedback", title: "Send Feedback" },
      ],
    },
  ];

  return (
    <div className="h-full overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Table of Contents */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-2">
          {helpSections.map((section, index) => (
            <div key={section.id} className="group">
              {/* Chapter Header */}
              <div
                className={`relative cursor-pointer transition-all duration-300 ease-out transform ${
                  selectedSection === section.id
                    ? "bg-gradient-to-r from-gray-100 to-gray-200 shadow-sm"
                    : "hover:bg-white/80 hover:shadow-md hover:scale-[1.02]"
                }`}
                onClick={() => handleSectionClick(section.id)}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Chapter Number */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ease-out transform ${
                      selectedSection === section.id
                        ? "bg-gradient-to-br from-gray-600 to-gray-700 text-white shadow-lg"
                        : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 hover:scale-110 hover:shadow-md border border-gray-200"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Chapter Title */}
                  <div className="flex-1">
                    <h3
                      className={`text-base font-semibold tracking-tight ${
                        selectedSection === section.id
                          ? "text-gray-900"
                          : "text-gray-700 group-hover:text-gray-800"
                      }`}
                    >
                      {section.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                      {section.subsections.length} topics
                    </p>
                  </div>

                  {/* Expand Icon */}
                  <ChevronRight
                    className={`h-4 w-4 transition-all duration-300 ease-out transform ${
                      selectedSection === section.id
                        ? "rotate-90 text-gray-600 scale-110"
                        : "text-gray-400 hover:text-gray-600 hover:scale-110"
                    }`}
                  />
                </div>
              </div>

              {/* Subtopics */}
              {selectedSection === section.id && selectedSection !== "" && (
                <div className="ml-12 space-y-2 mt-3">
                  {section.subsections.map((subsection, subIndex) => (
                    <div
                      key={subsection.id}
                      className={`relative cursor-pointer transition-all duration-300 ease-out transform rounded-lg ${
                        selectedSubsection === subsection.id
                          ? "bg-white shadow-md"
                          : "hover:bg-white/90 hover:shadow-sm hover:scale-[1.01]"
                      }`}
                      onClick={() => handleSubsectionClick(subsection.id)}
                    >
                      <div className="flex items-center gap-4 px-5 py-3">
                        {/* Subtopic Number */}
                        <span
                          className={`text-xs font-mono font-semibold tracking-wide transition-all duration-300 ease-out ${
                            selectedSubsection === subsection.id
                              ? "text-gray-700"
                              : "text-gray-500 hover:text-gray-600"
                          }`}
                        >
                          {index + 1}.{subIndex + 1}
                        </span>

                        {/* Subtopic Title */}
                        <span
                          className={`text-sm font-medium leading-relaxed transition-all duration-300 ease-out ${
                            selectedSubsection === subsection.id
                              ? "text-gray-900"
                              : "text-gray-600 hover:text-gray-700"
                          }`}
                        >
                          {subsection.title}
                        </span>

                        {/* Page indicator */}
                        <div className="ml-auto">
                          <div
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-out transform ${
                              selectedSubsection === subsection.id
                                ? "bg-gray-600 scale-125 shadow-sm"
                                : "bg-gray-300 hover:bg-gray-400 hover:scale-125"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpLeftCard;
