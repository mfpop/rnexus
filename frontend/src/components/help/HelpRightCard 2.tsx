import React from "react";
import { motion } from "framer-motion";
import {
  Play,
  Lightbulb,
  UserPlus,
  Home,
  BarChart3,
  Phone,
  Factory,
  Users,
  Check,
  Lock,
  Eye,
  AlertCircle,
  Info,
  TrendingUp,
  Target,
  ClipboardList,
  Mail,
  MessageSquare,
  Activity,
  Newspaper,
  Monitor,
  Settings,
  HelpCircle,
  Tag,
} from "lucide-react";
import { useHelpContext } from "./HelpContext";

const HelpRightCard: React.FC = () => {
  const { selectedSection, selectedSubsection } = useHelpContext();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
        type: "spring" as const,
        stiffness: 200,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        delay: 0.2,
      },
    },
  };

  // Scroll to top when section or subsection changes
  React.useEffect(() => {
    const container = document.querySelector(".help-content-container");
    if (container) {
      container.scrollTop = 0;
    }
  }, [selectedSection, selectedSubsection]);

  const renderHelpContent = (section: string) => {
    const helpContent: Record<string, React.JSX.Element> = {
      // Getting Started main section (fallback)
      "getting-started": (
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Default Getting Started Overview */}
          {(!selectedSubsection ||
            selectedSubsection === "getting-started") && (
            <>
              <div className="text-center mb-16">
                <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Play className="h-14 w-14 text-gray-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6 leading-tight tracking-tight">
                  Welcome to Your Learning Journey
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                  Choose a topic from the left menu to begin exploring Nexus
                  LMD. Each section contains comprehensive guides, tips, and
                  best practices to help you master the platform.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/60 p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                      <Lightbulb className="h-7 w-7 text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                      Welcome Guide
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Discover Nexus LMD's core capabilities and understand how
                    this powerful platform can transform your production
                    management.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/60 p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                      <UserPlus className="h-7 w-7 text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                      First Login
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Step-by-step guide for your first login experience, ensuring
                    a smooth onboarding process.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/60 p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                      <Home className="h-7 w-7 text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                      Navigation Basics
                    </h3>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Master the intuitive three-column layout and learn how to
                    navigate efficiently through the interface.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/60 p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                      <BarChart3 className="h-7 w-7 text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                      Dashboard Overview
                    </h3>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Understand key performance indicators, track activities, and
                    monitor metrics that matter most to your organization.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Welcome to Nexus LMD */}
          {selectedSubsection === "welcome" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center shadow-lg">
                  <Lightbulb className="h-10 w-10 text-gray-600" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4 leading-tight">
                  Welcome to Nexus LMD
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Your comprehensive production management platform
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
                {/* Chapter divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-600 font-serif font-medium">
                    Chapter 1
                  </span>
                  <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                </div>

                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6">
                  Platform Overview
                </h3>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Nexus LMD is a comprehensive platform designed to streamline
                  production management, enhance team collaboration, and provide
                  real-time insights into your operations. Built with modern
                  technology and user experience in mind.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Factory className="h-5 w-5 text-blue-600" />
                      Production Management
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500" />
                        Real-time production monitoring
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500" />
                        Quality control tracking
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500" />
                        Maintenance scheduling
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ),

      // First Login
      "first-login": (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              First Login
            </h2>
            <p className="text-gray-600">
              Step-by-step guide for accessing your Nexus LMD account
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-blue-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Access Login Page
                </h3>
              </div>
              <p className="text-gray-600 mb-3">
                Navigate to your company's Nexus LMD URL provided by your
                administrator. Bookmark this page for easy access in the future.
              </p>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <strong>Tip:</strong> The URL typically follows the format:
                  https://your-company.nexuslmd.com
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-green-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Enter Credentials
                </h3>
              </div>
              <p className="text-gray-600 mb-3">
                Use the username and password provided by your administrator.
                Usernames are typically in email format or employee ID format.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm">
                <p>
                  <strong>Username examples:</strong>
                </p>
                <p>• john.doe@company.com</p>
                <p>• employee.12345</p>
                <p>• jdoe</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-purple-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Security Setup
                </h3>
              </div>
              <p className="text-gray-600 mb-3">
                On first login, you may be prompted to change your password or
                set up additional security measures.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-purple-500" />
                  Password must be at least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-purple-500" />
                  Include uppercase, lowercase, numbers, and symbols
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-purple-500" />
                  Enable two-factor authentication if available
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-orange-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Explore Dashboard
                </h3>
              </div>
              <p className="text-gray-600 mb-3">
                After successful login, you'll see the main dashboard with your
                personalized view of the system.
              </p>
              <div className="flex items-center gap-2 text-sm text-orange-700">
                <Eye className="h-4 w-4" />
                Take a moment to familiarize yourself with the three-column
                layout
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <h4 className="font-semibold text-amber-800">Need Help?</h4>
            </div>
            <p className="text-sm text-amber-700">
              If you can't log in or forgot your credentials, contact your
              system administrator or IT support team.
            </p>
          </div>
        </div>
      ),

      // Navigation Basics
      "navigation-basics": (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
              <Home className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Navigation Basics
            </h2>
            <p className="text-gray-600">
              Master the three-column layout and interface navigation
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Three-Column Layout
            </h3>
            <p className="text-gray-600 mb-6">
              Nexus LMD uses a three-column layout for efficient information
              organization and easy navigation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <h4 className="font-semibold text-teal-700 mb-2">
                  Left Sidebar (L)
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Primary navigation with 10 main functions
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Home Dashboard</li>
                  <li>• Team Chat</li>
                  <li>• Project Management</li>
                  <li>• Production Control</li>
                  <li>• Activity Management</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 mb-2">
                  Main Content (M)
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Dynamic two-card layout:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Top Card: Summary info</li>
                  <li>• Bottom Card: Detailed content</li>
                  <li>• Cards can expand/collapse</li>
                  <li>• Responsive to screen size</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-700 mb-2">
                  Right Sidebar (R)
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Action tools and user controls:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Context-specific actions</li>
                  <li>• Quick settings</li>
                  <li>• User notifications</li>
                  <li>• Secondary navigation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),

      // Dashboard Overview
      "dashboard-overview": (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Dashboard Overview
            </h2>
            <p className="text-gray-600">
              Understanding KPIs, activities, and performance metrics
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Key Performance Indicators (KPIs)
            </h3>
            <p className="text-gray-600 mb-6">
              Your dashboard displays real-time metrics that matter most to your
              role and responsibilities.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-green-800">
                    Production Efficiency
                  </h4>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">94.2%</div>
                <div className="text-sm text-green-600">
                  +2.1% from last week
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-800">Quality Score</h4>
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">98.7%</div>
                <div className="text-sm text-blue-600">
                  +0.5% from last week
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-purple-800">
                    Active Orders
                  </h4>
                  <ClipboardList className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-sm text-purple-600">
                  +12 from yesterday
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-orange-800">
                    Team Performance
                  </h4>
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-600">92.3%</div>
                <div className="text-sm text-orange-600">
                  +1.8% from last week
                </div>
              </div>
            </div>
          </div>
        </div>
      ),

      // Team Communication Section
      communication: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Team Communication
            </h2>
            <p className="text-gray-600">
              Seamless collaboration and communication tools for your team
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Communication Hub Overview
            </h3>
            <p className="text-gray-600 mb-6">
              The Team Communication module provides comprehensive tools for
              real-time collaboration, file sharing, and team coordination
              across your organization.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-cyan-500 pl-4">
                <h4 className="font-semibold text-cyan-800 mb-3">
                  Chat Basics
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  WhatsApp-style team communication with advanced features for
                  professional collaboration.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Real-time Messaging:</strong> Instant
                    communication with team members
                  </li>
                  <li>
                    • <strong>Group Conversations:</strong> Create and manage
                    team-specific chat rooms
                  </li>
                  <li>
                    • <strong>Message Threading:</strong> Organize discussions
                    by topic or project
                  </li>
                  <li>
                    • <strong>Read Receipts:</strong> Track message delivery and
                    read status
                  </li>
                  <li>
                    • <strong>Message Search:</strong> Find specific
                    conversations or information quickly
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">
                  File Sharing
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Secure and efficient file sharing capabilities for team
                  collaboration.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Document Upload:</strong> Share files directly in
                    chat conversations
                  </li>
                  <li>
                    • <strong>File Management:</strong> Organize and categorize
                    shared documents
                  </li>
                  <li>
                    • <strong>Version Control:</strong> Track document changes
                    and updates
                  </li>
                  <li>
                    • <strong>Access Control:</strong> Manage permissions for
                    sensitive files
                  </li>
                  <li>
                    • <strong>Storage Integration:</strong> Connect with cloud
                    storage services
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">
                  Video & Audio Calls
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  High-quality communication tools for remote collaboration and
                  team meetings.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>HD Video Calls:</strong> Crystal clear video
                    communication
                  </li>
                  <li>
                    • <strong>Audio Conferencing:</strong> High-quality voice
                    calls with noise cancellation
                  </li>
                  <li>
                    • <strong>Screen Sharing:</strong> Present documents and
                    applications in real-time
                  </li>
                  <li>
                    • <strong>Meeting Recording:</strong> Capture important
                    discussions for later reference
                  </li>
                  <li>
                    • <strong>Virtual Backgrounds:</strong> Professional
                    appearance in any environment
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800 mb-3">
                  Contact Management
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Efficient organization and management of team contacts and
                  communication preferences.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">
                      Contact Organization
                    </h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Department-based grouping</li>
                      <li>• Project team associations</li>
                      <li>• Role-based categorization</li>
                      <li>• Custom contact lists</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">
                      Communication Preferences
                    </h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Preferred contact methods</li>
                      <li>• Availability schedules</li>
                      <li>• Notification settings</li>
                      <li>• Language preferences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-cyan-600" />
                <h4 className="font-semibold text-cyan-800">
                  Communication Best Practices
                </h4>
              </div>
              <ul className="text-sm text-cyan-700 space-y-1">
                <li>
                  • Use appropriate communication channels for different types
                  of messages
                </li>
                <li>
                  • Set clear expectations for response times and availability
                </li>
                <li>
                  • Organize conversations by project or topic for better
                  clarity
                </li>
                <li>
                  • Use file sharing for document collaboration instead of email
                  attachments
                </li>
                <li>
                  • Schedule regular team meetings to maintain alignment and
                  engagement
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Production Management Section
      production: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
              <Factory className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Production Management
            </h2>
            <p className="text-gray-600">
              Comprehensive manufacturing control and monitoring system
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Manufacturing Excellence Platform
            </h3>
            <p className="text-gray-600 mb-6">
              The Production Management module provides real-time monitoring,
              quality control, and operational insights to optimize your
              manufacturing processes and maximize efficiency.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-amber-500 pl-4">
                <h4 className="font-semibold text-amber-800 mb-3">
                  Production Overview
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive dashboard providing real-time visibility into
                  all manufacturing operations.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Production Status:</strong> Real-time view of all
                    production lines and equipment
                  </li>
                  <li>
                    • <strong>Output Metrics:</strong> Track production volume,
                    efficiency, and throughput
                  </li>
                  <li>
                    • <strong>Resource Utilization:</strong> Monitor machine,
                    labor, and material usage
                  </li>
                  <li>
                    • <strong>Production Planning:</strong> View scheduled
                    production and capacity planning
                  </li>
                  <li>
                    • <strong>Performance Trends:</strong> Historical data and
                    predictive analytics
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">
                  Real-time Monitoring
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Live monitoring of production processes with instant alerts
                  and notifications.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Equipment Status:</strong> Real-time monitoring of
                    machine operations
                  </li>
                  <li>
                    • <strong>Process Parameters:</strong> Track temperature,
                    pressure, speed, and other critical metrics
                  </li>
                  <li>
                    • <strong>Alert System:</strong> Instant notifications for
                    deviations and issues
                  </li>
                  <li>
                    • <strong>Remote Access:</strong> Monitor production from
                    anywhere in the facility
                  </li>
                  <li>
                    • <strong>Data Logging:</strong> Continuous recording of all
                    production parameters
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Quality Control
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive quality management system ensuring product
                  excellence and compliance.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Quality Metrics:</strong> Track defect rates,
                    rework, and customer returns
                  </li>
                  <li>
                    • <strong>Inspection Management:</strong> Automated and
                    manual quality checks
                  </li>
                  <li>
                    • <strong>Statistical Process Control:</strong> SPC charts
                    and trend analysis
                  </li>
                  <li>
                    • <strong>Root Cause Analysis:</strong> Identify and resolve
                    quality issues
                  </li>
                  <li>
                    • <strong>Compliance Tracking:</strong> Ensure adherence to
                    quality standards
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">
                  Maintenance Scheduling
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Proactive maintenance planning to minimize downtime and extend
                  equipment life.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">
                      Preventive Maintenance
                    </h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Scheduled maintenance tasks</li>
                      <li>• Equipment lifecycle tracking</li>
                      <li>• Parts inventory management</li>
                      <li>• Maintenance history records</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">
                      Predictive Maintenance
                    </h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Condition-based monitoring</li>
                      <li>• Failure prediction algorithms</li>
                      <li>• Performance degradation analysis</li>
                      <li>• Optimal maintenance timing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-amber-600" />
                <h4 className="font-semibold text-amber-800">
                  Production Optimization Tips
                </h4>
              </div>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>
                  • Monitor OEE (Overall Equipment Effectiveness) to identify
                  improvement opportunities
                </li>
                <li>
                  • Use real-time data to make immediate process adjustments
                </li>
                <li>
                  • Implement predictive maintenance to prevent unexpected
                  downtime
                </li>
                <li>
                  • Analyze quality trends to identify root causes of defects
                </li>
                <li>
                  • Regularly review production metrics to optimize resource
                  allocation
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Project Management Section
      "project-management": (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-100 to-violet-200 rounded-full flex items-center justify-center">
              <ClipboardList className="h-8 w-8 text-violet-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Project Management
            </h2>
            <p className="text-gray-600">
              Comprehensive project planning, execution, and tracking system
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Project Excellence Platform
            </h3>
            <p className="text-gray-600 mb-6">
              The Project Management module provides comprehensive tools for
              planning, executing, and monitoring projects of all sizes,
              ensuring successful delivery and team collaboration.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-violet-500 pl-4">
                <h4 className="font-semibold text-violet-800 mb-3">
                  Creating Projects
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Streamlined project creation with comprehensive planning and
                  setup capabilities.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Project Templates:</strong> Use pre-built
                    templates for common project types
                  </li>
                  <li>
                    • <strong>Project Setup Wizard:</strong> Step-by-step
                    project configuration
                  </li>
                  <li>
                    • <strong>Resource Allocation:</strong> Assign team members
                    and equipment
                  </li>
                  <li>
                    • <strong>Timeline Planning:</strong> Create detailed
                    project schedules and milestones
                  </li>
                  <li>
                    • <strong>Budget Management:</strong> Set and track project
                    costs and resources
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">
                  Task Management
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive task organization and tracking for efficient
                  project execution.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Task Creation:</strong> Break down projects into
                    manageable tasks
                  </li>
                  <li>
                    • <strong>Dependency Management:</strong> Define task
                    relationships and prerequisites
                  </li>
                  <li>
                    • <strong>Priority Setting:</strong> Assign importance
                    levels to tasks
                  </li>
                  <li>
                    • <strong>Progress Tracking:</strong> Monitor task
                    completion and status updates
                  </li>
                  <li>
                    • <strong>Time Estimation:</strong> Plan and track time
                    requirements for tasks
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Team Collaboration
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Enhanced team coordination and communication for successful
                  project delivery.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Team Assignment:</strong> Assign roles and
                    responsibilities to team members
                  </li>
                  <li>
                    • <strong>Communication Tools:</strong> Integrated chat and
                    discussion forums
                  </li>
                  <li>
                    • <strong>Document Sharing:</strong> Centralized repository
                    for project documents
                  </li>
                  <li>
                    • <strong>Meeting Management:</strong> Schedule and conduct
                    project meetings
                  </li>
                  <li>
                    • <strong>Feedback System:</strong> Collect and manage team
                    input and suggestions
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800 mb-3">
                  Progress Tracking
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Real-time monitoring and reporting of project progress and
                  performance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">
                      Progress Metrics
                    </h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Completion percentages</li>
                      <li>• Milestone achievements</li>
                      <li>• Resource utilization</li>
                      <li>• Budget tracking</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">
                      Reporting Tools
                    </h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Progress dashboards</li>
                      <li>• Custom reports</li>
                      <li>• Performance analytics</li>
                      <li>• Stakeholder updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-violet-50 border border-violet-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-violet-600" />
                <h4 className="font-semibold text-violet-800">
                  Project Management Best Practices
                </h4>
              </div>
              <ul className="text-sm text-violet-700 space-y-1">
                <li>
                  • Break down large projects into smaller, manageable tasks
                </li>
                <li>
                  • Set clear milestones and deadlines for better progress
                  tracking
                </li>
                <li>
                  • Regularly communicate with team members and stakeholders
                </li>
                <li>
                  • Use project templates to standardize processes and improve
                  efficiency
                </li>
                <li>• Monitor progress regularly and adjust plans as needed</li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Activity Management Section
      activities: (
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <motion.div
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-rose-100 via-rose-200 to-rose-300 rounded-2xl flex items-center justify-center shadow-xl"
              variants={iconVariants}
            >
              <Activity className="h-12 w-12 text-rose-600" />
            </motion.div>
            <motion.h2
              className="text-4xl font-bold text-gray-800 mb-4 tracking-tight leading-tight"
              variants={textVariants}
            >
              Activity Management
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 font-medium leading-relaxed max-w-3xl mx-auto"
              variants={textVariants}
            >
              Comprehensive manufacturing activity management and tracking
              system
            </motion.p>
          </motion.div>

          {/* Activity Management Overview Image */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/60 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Activity Management Dashboard Overview
              </h3>
              <div className="relative">
                <iframe
                  src="/help-images/activities/activity-dashboard-mockup.html"
                  className="w-full h-64 rounded-xl border-0"
                  title="Activity Management Dashboard"
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Screenshot
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center">
                The main dashboard provides an overview of all activities with
                real-time status updates and quick access to key functions.
              </p>
            </div>
          </motion.div>

          {/* Default Activity Management Overview */}
          {selectedSection === "activities" &&
            (!selectedSubsection ||
              selectedSubsection === "activity-overview") && (
              <motion.div
                className="bg-white rounded-2xl border border-gray-200/60 p-8 shadow-lg"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <motion.h3
                  className="text-2xl font-bold text-gray-800 mb-6 tracking-tight"
                  variants={textVariants}
                >
                  Getting Started with Activity Management
                </motion.h3>
                <motion.p
                  className="text-lg text-gray-600 mb-8 leading-relaxed"
                  variants={textVariants}
                >
                  The Activity Management system provides comprehensive tools
                  for managing manufacturing activities, tracking progress, and
                  optimizing workflows across your organization.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200/60 shadow-md"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <h4 className="text-lg font-bold text-blue-800 mb-4 tracking-tight">
                      Key Features
                    </h4>
                    <ul className="text-base text-blue-700 space-y-3">
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          <strong>Activity Dashboard:</strong> Real-time view of
                          all ongoing activities
                        </span>
                      </motion.li>
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          <strong>Progress Tracking:</strong> Monitor completion
                          status and milestones
                        </span>
                      </motion.li>
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          <strong>Resource Management:</strong> Track equipment
                          and personnel assignments
                        </span>
                      </motion.li>
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          <strong>Time Management:</strong> Estimated vs. actual
                          duration tracking
                        </span>
                      </motion.li>
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          <strong>Quality Control:</strong> Built-in quality and
                          safety checks
                        </span>
                      </motion.li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200/60 shadow-md"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <h4 className="text-lg font-bold text-green-800 mb-4 tracking-tight">
                      Quick Start
                    </h4>
                    <ol className="text-base text-green-700 space-y-3">
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          1
                        </span>
                        <span>
                          Navigate to the Activities page from the main menu
                        </span>
                      </motion.li>
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          2
                        </span>
                        <span>View the activity list on the left side</span>
                      </motion.li>
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          3
                        </span>
                        <span>
                          Click on any activity to see detailed information
                        </span>
                      </motion.li>
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          4
                        </span>
                        <span>
                          Use filters and sorting to find specific activities
                        </span>
                      </motion.li>
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          5
                        </span>
                        <span>
                          Monitor progress and update status as needed
                        </span>
                      </motion.li>
                    </ol>
                  </motion.div>
                </div>
              </motion.div>
            )}

          {/* Activity List View */}
          {selectedSubsection === "activity-list" && (
            <motion.div
              className="bg-white rounded-2xl border border-gray-200/60 p-8 shadow-lg"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <motion.h3
                className="text-2xl font-bold text-gray-800 mb-6 tracking-tight"
                variants={textVariants}
              >
                Activity List View
              </motion.h3>
              <motion.p
                className="text-lg text-gray-600 mb-8 leading-relaxed"
                variants={textVariants}
              >
                The left panel displays a comprehensive list of all activities
                with essential information at a glance.
              </motion.p>

              {/* Activity List View Screenshot */}
              <motion.div className="mb-8" variants={itemVariants}>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/60 p-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 text-center">
                    Activity List Panel
                  </h4>
                  <div className="relative">
                    <iframe
                      src="/help-images/activities/activity-list-view.html"
                      className="w-full h-48 rounded-lg border-0"
                      title="Activity List View"
                    />
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      Screenshot
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    The activity list shows search functionality, time-based
                    filtering tabs, and individual activity cards with status
                    indicators.
                  </p>
                </div>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-6 border-l-4 border-blue-500"
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                >
                  <h4 className="text-lg font-bold text-blue-800 mb-4 tracking-tight flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    List Features
                  </h4>
                  <ul className="text-base text-blue-700 space-y-3">
                    <motion.li
                      className="flex items-start gap-3"
                      variants={itemVariants}
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Search Bar:</strong> Find activities by title or
                        assigned person
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-3"
                      variants={itemVariants}
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Time Tabs:</strong> Filter by All, Today,
                        Upcoming, or Overdue activities
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-3"
                      variants={itemVariants}
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Activity Cards:</strong> Each activity shows
                        title, type, status, and assignee
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-3"
                      variants={itemVariants}
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Selection:</strong> Click any activity to view
                        detailed information
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-3"
                      variants={itemVariants}
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Visual Indicators:</strong> Color-coded types
                        and status badges
                      </span>
                    </motion.li>
                  </ul>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl p-6 border-l-4 border-green-500"
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                >
                  <h4 className="text-lg font-bold text-green-800 mb-4 tracking-tight flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Navigation Tips
                  </h4>
                  <ul className="text-base text-green-700 space-y-3">
                    <motion.li
                      className="flex items-start gap-3"
                      variants={itemVariants}
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Use the search function to quickly locate specific
                        activities
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-3"
                      variants={itemVariants}
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Switch between time tabs to focus on relevant activities
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-3"
                      variants={itemVariants}
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Look for color-coded activity types for quick
                        identification
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-3"
                      variants={itemVariants}
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Check status badges to understand current progress
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-3"
                      variants={itemVariants}
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Hover over activities to see additional details
                      </span>
                    </motion.li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Activity Details */}
          {selectedSubsection === "activity-details" && (
            <motion.div
              className="bg-white rounded-2xl border border-gray-200/60 p-8 shadow-lg"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <motion.h3
                className="text-2xl font-bold text-gray-800 mb-6 tracking-tight"
                variants={textVariants}
              >
                Activity Details View
              </motion.h3>
              <motion.p
                className="text-lg text-gray-600 mb-8 leading-relaxed"
                variants={textVariants}
              >
                The right panel provides comprehensive information about the
                selected activity, including progress tracking and management
                tools.
              </motion.p>

              {/* Activity Details Screenshot */}
              <motion.div className="mb-8" variants={itemVariants}>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/60 p-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 text-center">
                    Activity Details Panel
                  </h4>
                  <div className="relative">
                    <iframe
                      src="/help-images/activities/activity-details-view.html"
                      className="w-full h-48 rounded-lg border-0"
                      title="Activity Details View"
                    />
                    <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      Screenshot
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    The details panel shows activity information, progress
                    tracking, action buttons, and management tools.
                  </p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <motion.div
                    className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl p-6 border-l-4 border-purple-500"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <h4 className="text-lg font-bold text-purple-800 mb-4 tracking-tight flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      Overview Section
                    </h4>
                    <ul className="text-base text-purple-700 space-y-3">
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          <strong>Description:</strong> Detailed activity
                          description
                        </span>
                      </motion.li>
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          <strong>Progress Bar:</strong> Visual completion
                          indicator
                        </span>
                      </motion.li>
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          <strong>Tags:</strong> Type, status, and priority
                          badges
                        </span>
                      </motion.li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl p-6 border-l-4 border-orange-500"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <h4 className="text-lg font-bold text-orange-800 mb-4 tracking-tight flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      Details Section
                    </h4>
                    <ul className="text-base text-orange-700 space-y-3">
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          <strong>Timing:</strong> Start, due, and duration
                          information
                        </span>
                      </motion.li>
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          <strong>Assignment:</strong> Who is responsible and
                          when scheduled
                        </span>
                      </motion.li>
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          <strong>Status:</strong> Current activity state
                        </span>
                      </motion.li>
                      <motion.li
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          <strong>Priority:</strong> Importance level
                        </span>
                      </motion.li>
                    </ul>
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <motion.div
                    className="border-l-4 border-teal-500 pl-4"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <h4 className="font-semibold text-teal-800 mb-2">
                      Action Buttons
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • <strong>Start:</strong> Begin activity execution
                      </li>
                      <li>
                        • <strong>Pause:</strong> Temporarily halt progress
                      </li>
                      <li>
                        • <strong>Complete:</strong> Mark activity as finished
                      </li>
                      <li>
                        • <strong>Export:</strong> Download activity data
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className="border-l-4 border-indigo-500 pl-4"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <h4 className="font-semibold text-indigo-800 mb-2">
                      Information Tabs
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • <strong>Participants:</strong> Team members involved
                      </li>
                      <li>
                        • <strong>Tasks & Milestones:</strong> Breakdown of work
                      </li>
                      <li>
                        • <strong>Equipment:</strong> Required resources
                      </li>
                      <li>
                        • <strong>Notes & Files:</strong> Documentation and
                        attachments
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Filtering & Sorting */}
          {selectedSubsection === "filtering-sorting" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Filtering & Sorting Activities
              </h3>
              <p className="text-gray-600 mb-6">
                Use advanced filtering and sorting options to quickly find and
                organize activities based on your needs.
              </p>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-800 mb-3">
                    Filter Options
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">
                        Type Filter
                      </h5>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Production activities</li>
                        <li>• Maintenance tasks</li>
                        <li>• Quality inspections</li>
                        <li>• Engineering work</li>
                        <li>• Training sessions</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">
                        Status Filter
                      </h5>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Planned activities</li>
                        <li>• In-progress work</li>
                        <li>• Completed tasks</li>
                        <li>• Cancelled items</li>
                        <li>• Overdue activities</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-800 mb-3">
                    Sorting Options
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      • <strong>Start Time:</strong> Sort by when activities
                      begin
                    </li>
                    <li>
                      • <strong>Title:</strong> Alphabetical order by activity
                      name
                    </li>
                    <li>
                      • <strong>Status:</strong> Group by current state
                    </li>
                    <li>
                      • <strong>Priority:</strong> Order by importance level
                    </li>
                    <li>
                      • <strong>Assigned To:</strong> Sort by responsible person
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-purple-800 mb-3">
                    Using Filters
                  </h4>
                  <ol className="text-sm text-gray-600 space-y-2">
                    <li>
                      1. Click the "Filter" button to open the filter dropdown
                    </li>
                    <li>
                      2. Select activity type, status, or priority from the
                      dropdowns
                    </li>
                    <li>
                      3. Use the "Sort" button to change the order of activities
                    </li>
                    <li>4. Combine multiple filters for precise results</li>
                    <li>5. Click "Clear All Filters" to reset selections</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Creating Activities */}
          {selectedSubsection === "creating-activities" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Creating New Activities
              </h3>
              <p className="text-gray-600 mb-6">
                Learn how to create new activities with proper categorization
                and detailed information.
              </p>

              {/* Creating Activities Screenshot */}
              <div className="mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/60 p-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 text-center">
                    Activity Creation Form
                  </h4>
                  <div className="relative">
                    <iframe
                      src="/help-images/activities/creating-activities-form.html"
                      className="w-full h-40 rounded-lg border-0"
                      title="Creating Activities Form"
                    />
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      Screenshot
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    The creation form includes all necessary fields to set up a
                    new activity with proper categorization and planning.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-800 mb-3">
                    Activity Creation Process
                  </h4>
                  <ol className="text-sm text-gray-600 space-y-2">
                    <li>
                      1. <strong>Define Activity:</strong> Provide clear title
                      and description
                    </li>
                    <li>
                      2. <strong>Set Type:</strong> Choose appropriate
                      manufacturing category
                    </li>
                    <li>
                      3. <strong>Assign Priority:</strong> Determine importance
                      level
                    </li>
                    <li>
                      4. <strong>Schedule Timing:</strong> Set start and end
                      dates
                    </li>
                    <li>
                      5. <strong>Assign Resources:</strong> Select personnel and
                      equipment
                    </li>
                    <li>
                      6. <strong>Add Details:</strong> Include notes and
                      attachments
                    </li>
                  </ol>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-800 mb-3">
                    Required Information
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      • <strong>Title:</strong> Clear, descriptive activity name
                    </li>
                    <li>
                      • <strong>Description:</strong> Detailed explanation of
                      the work
                    </li>
                    <li>
                      • <strong>Type:</strong> Manufacturing activity category
                    </li>
                    <li>
                      • <strong>Priority:</strong> Importance level (Low,
                      Medium, High, Urgent)
                    </li>
                    <li>
                      • <strong>Timeline:</strong> Start and end dates with
                      duration estimates
                    </li>
                    <li>
                      • <strong>Assignment:</strong> Responsible person and
                      location
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-orange-800 mb-3">
                    Best Practices
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      • Use consistent naming conventions for similar activities
                    </li>
                    <li>• Provide detailed descriptions to avoid confusion</li>
                    <li>
                      • Set realistic time estimates based on historical data
                    </li>
                    <li>
                      • Assign appropriate priority levels for resource planning
                    </li>
                    <li>
                      • Include relevant equipment and material requirements
                    </li>
                    <li>
                      • Add notes for special instructions or safety
                      considerations
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Managing Activities */}
          {selectedSubsection === "managing-activities" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Managing Existing Activities
              </h3>
              <p className="text-gray-600 mb-6">
                Learn how to effectively manage and update activities throughout
                their lifecycle.
              </p>

              {/* Managing Activities Screenshot */}
              <div className="mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/60 p-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 text-center">
                    Activity Management Interface
                  </h4>
                  <div className="relative">
                    <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-dashed border-blue-300 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Settings className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-blue-600 font-medium text-sm">
                          Activity Management
                        </p>
                        <p className="text-blue-500 text-xs mt-1">
                          Status updates, progress tracking, and resource
                          management
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Screenshot
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    The management interface provides tools for updating status,
                    tracking progress, and managing resources throughout the
                    activity lifecycle.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-800 mb-3">
                    Status Management
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      • <strong>Planned:</strong> Activity is scheduled but not
                      started
                    </li>
                    <li>
                      • <strong>In Progress:</strong> Work has begun and is
                      ongoing
                    </li>
                    <li>
                      • <strong>Completed:</strong> Activity has been finished
                      successfully
                    </li>
                    <li>
                      • <strong>Cancelled:</strong> Activity was terminated
                    </li>
                    <li>
                      • <strong>Overdue:</strong> Activity missed its deadline
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-800 mb-3">
                    Progress Tracking
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      • <strong>Update Progress:</strong> Regularly update
                      completion percentage
                    </li>
                    <li>
                      • <strong>Time Tracking:</strong> Record actual time spent
                      vs. estimates
                    </li>
                    <li>
                      • <strong>Milestone Updates:</strong> Mark key milestones
                      as completed
                    </li>
                    <li>
                      • <strong>Issue Logging:</strong> Document problems and
                      resolutions
                    </li>
                    <li>
                      • <strong>Resource Adjustments:</strong> Modify
                      assignments as needed
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-purple-800 mb-3">
                    Communication
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      • <strong>Notes:</strong> Add updates and progress
                      comments
                    </li>
                    <li>
                      • <strong>Attachments:</strong> Include relevant documents
                      and photos
                    </li>
                    <li>
                      • <strong>Notifications:</strong> Alert stakeholders of
                      important changes
                    </li>
                    <li>
                      • <strong>Collaboration:</strong> Work with team members
                      on shared activities
                    </li>
                    <li>
                      • <strong>Reporting:</strong> Generate status reports for
                      management
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Activity Types */}
          {selectedSubsection === "activity-types" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Manufacturing Activity Types
              </h3>
              <p className="text-gray-600 mb-6">
                Understanding the different categories of manufacturing
                activities and their specific requirements.
              </p>

              {/* Activity Types Screenshot */}
              <div className="mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/60 p-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 text-center">
                    Activity Type Categories
                  </h4>
                  <div className="relative">
                    <div className="w-full h-40 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border-2 border-dashed border-indigo-300 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Tag className="h-6 w-6 text-indigo-600" />
                        </div>
                        <p className="text-indigo-600 font-medium text-sm">
                          Activity Categories
                        </p>
                        <p className="text-indigo-500 text-xs mt-1">
                          Color-coded activity types and their descriptions
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                      Screenshot
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    Each activity type has specific requirements, workflows, and
                    resource needs based on the manufacturing category.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Production
                    </h4>
                    <p className="text-sm text-blue-700 mb-2">
                      Core manufacturing operations
                    </p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      <li>• Assembly processes</li>
                      <li>• Production line setup</li>
                      <li>• Trial runs and testing</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">
                      Maintenance
                    </h4>
                    <p className="text-sm text-orange-700 mb-2">
                      Equipment and facility upkeep
                    </p>
                    <ul className="text-xs text-orange-600 space-y-1">
                      <li>• Preventive maintenance</li>
                      <li>• Corrective repairs</li>
                      <li>• Equipment calibration</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      Inspection & Audit
                    </h4>
                    <p className="text-sm text-yellow-700 mb-2">
                      Quality and compliance checks
                    </p>
                    <ul className="text-xs text-yellow-600 space-y-1">
                      <li>• Quality inspections</li>
                      <li>• ISO compliance audits</li>
                      <li>• Safety assessments</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      Engineering
                    </h4>
                    <p className="text-sm text-purple-700 mb-2">
                      Process and system improvements
                    </p>
                    <ul className="text-xs text-purple-600 space-y-1">
                      <li>• Tooling design</li>
                      <li>• Layout optimization</li>
                      <li>• Process changes</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-2">
                      Logistics
                    </h4>
                    <p className="text-sm text-indigo-700 mb-2">
                      Material and resource flow
                    </p>
                    <ul className="text-xs text-indigo-600 space-y-1">
                      <li>• Material handling</li>
                      <li>• Inventory management</li>
                      <li>• Warehouse operations</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Quality
                    </h4>
                    <p className="text-sm text-green-700 mb-2">
                      Quality management processes
                    </p>
                    <ul className="text-xs text-green-600 space-y-1">
                      <li>• Root cause analysis</li>
                      <li>• CAPA implementation</li>
                      <li>• FMEA studies</li>
                    </ul>
                  </div>

                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-800 mb-2">
                      Meetings
                    </h4>
                    <p className="text-sm text-teal-700 mb-2">
                      Team coordination and planning
                    </p>
                    <ul className="text-xs text-teal-600 space-y-1">
                      <li>• Daily stand-ups</li>
                      <li>• Progress reviews</li>
                      <li>• Planning calls</li>
                    </ul>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-pink-800 mb-2">
                      Training
                    </h4>
                    <p className="text-sm text-pink-700 mb-2">
                      Skill development and certification
                    </p>
                    <ul className="text-xs text-pink-600 space-y-1">
                      <li>• Safety training</li>
                      <li>• Technical skills</li>
                      <li>• Onboarding programs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Best Practices */}
          {selectedSubsection === "best-practices" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Activity Management Best Practices
              </h3>
              <p className="text-gray-600 mb-6">
                Proven strategies for effective activity management and optimal
                productivity.
              </p>

              {/* Best Practices Screenshot */}
              <div className="mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/60 p-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 text-center">
                    Best Practices Dashboard
                  </h4>
                  <div className="relative">
                    <div className="w-full h-40 bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg border-2 border-dashed border-rose-300 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-rose-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Lightbulb className="h-6 w-6 text-rose-600" />
                        </div>
                        <p className="text-rose-600 font-medium text-sm">
                          Best Practices Guide
                        </p>
                        <p className="text-rose-500 text-xs mt-1">
                          Tips, strategies, and proven methods for success
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-rose-600 text-white text-xs px-2 py-1 rounded-full">
                      Screenshot
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    Follow these proven strategies to optimize your activity
                    management workflow and improve team productivity.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-800 mb-3">
                    Planning & Organization
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      • <strong>Break Down Work:</strong> Divide large
                      activities into manageable tasks
                    </li>
                    <li>
                      • <strong>Set Realistic Deadlines:</strong> Use historical
                      data for accurate estimates
                    </li>
                    <li>
                      • <strong>Prioritize Effectively:</strong> Focus on
                      high-impact activities first
                    </li>
                    <li>
                      • <strong>Resource Planning:</strong> Ensure adequate
                      personnel and equipment
                    </li>
                    <li>
                      • <strong>Risk Assessment:</strong> Identify potential
                      issues early
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-800 mb-3">
                    Execution & Monitoring
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      • <strong>Regular Updates:</strong> Keep progress
                      information current
                    </li>
                    <li>
                      • <strong>Issue Tracking:</strong> Document and resolve
                      problems promptly
                    </li>
                    <li>
                      • <strong>Communication:</strong> Keep stakeholders
                      informed of progress
                    </li>
                    <li>
                      • <strong>Quality Checks:</strong> Maintain standards
                      throughout execution
                    </li>
                    <li>
                      • <strong>Adaptability:</strong> Adjust plans when
                      circumstances change
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-purple-800 mb-3">
                    Continuous Improvement
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      • <strong>Performance Review:</strong> Analyze completion
                      times and quality
                    </li>
                    <li>
                      • <strong>Process Optimization:</strong> Identify and
                      eliminate bottlenecks
                    </li>
                    <li>
                      • <strong>Team Feedback:</strong> Gather input from
                      activity participants
                    </li>
                    <li>
                      • <strong>Standardization:</strong> Create templates for
                      recurring activities
                    </li>
                    <li>
                      • <strong>Training:</strong> Develop team skills and
                      knowledge
                    </li>
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-5 w-5 text-rose-600" />
                    <h4 className="font-semibold text-rose-800">Pro Tips</h4>
                  </div>
                  <ul className="text-sm text-rose-700 space-y-1">
                    <li>
                      • Use consistent naming conventions for better
                      searchability
                    </li>
                    <li>
                      • Set up automated notifications for deadline reminders
                    </li>
                    <li>
                      • Regular review of completed activities for process
                      improvement
                    </li>
                    <li>• Leverage activity templates for common work types</li>
                    <li>
                      • Maintain detailed notes for future reference and
                      training
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Fallback - Show when no specific subsection is selected */}
          {selectedSubsection &&
            ![
              "activity-overview",
              "activity-list",
              "activity-details",
              "filtering-sorting",
              "creating-activities",
              "managing-activities",
              "activity-types",
              "best-practices",
            ].includes(selectedSubsection) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Activity Management
                </h3>
                <p className="text-gray-600 mb-6">
                  Select a specific topic from the left menu to learn more about
                  Activity Management features.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Available Topics:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Getting Started - Overview and key features</li>
                    <li>• Activity List View - Understanding the left panel</li>
                    <li>• Activity Details - Working with the right panel</li>
                    <li>• Filtering & Sorting - Finding specific activities</li>
                    <li>• Creating Activities - Building new activities</li>
                    <li>• Managing Activities - Updating and tracking</li>
                    <li>• Activity Types - Understanding categories</li>
                    <li>• Best Practices - Tips for success</li>
                  </ul>
                </div>
              </div>
            )}

          {/* Fallback for activities section - show overview if no specific subsection is selected */}
          {selectedSection === "activities" && !selectedSubsection && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Activity Management Overview
              </h3>
              <p className="text-gray-600 mb-6">
                Welcome to the Activity Management section. Select a specific
                topic from the left menu to learn more about managing
                manufacturing activities.
              </p>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2">
                  Available Topics:
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>
                    • <strong>Getting Started:</strong> Introduction and key
                    features
                  </li>
                  <li>
                    • <strong>Activity List View:</strong> Understanding the
                    left panel
                  </li>
                  <li>
                    • <strong>Activity Details:</strong> Working with the right
                    panel
                  </li>
                  <li>
                    • <strong>Filtering & Sorting:</strong> Finding and
                    organizing activities
                  </li>
                  <li>
                    • <strong>Creating Activities:</strong> Building new
                    activities
                  </li>
                  <li>
                    • <strong>Managing Activities:</strong> Updating and
                    tracking
                  </li>
                  <li>
                    • <strong>Activity Types:</strong> Understanding categories
                  </li>
                  <li>
                    • <strong>Best Practices:</strong> Tips for success
                  </li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      ),

      // Contact Support Section
      "contact-support": (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Contact Support
            </h2>
            <p className="text-gray-600">Get help when you need it most</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Support Channels
            </h3>
            <p className="text-gray-600 mb-6">
              Multiple ways to get assistance and resolve issues quickly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-green-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Email Support
                    </h3>
                    <p className="text-sm text-gray-600">
                      24/7 email assistance
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">
                  Send detailed descriptions of your issue for comprehensive
                  support.
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700">
                    <strong>Response Time:</strong> Within 4 hours
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-blue-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Phone Support
                    </h3>
                    <p className="text-sm text-gray-600">Direct assistance</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">
                  Speak directly with our support team for immediate help.
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700">
                    <strong>Available:</strong> Mon-Fri, 8AM-6PM EST
                  </p>
                  <p className="text-xs text-gray-500">+1 (555) 123-6398</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-purple-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Live Chat</h3>
                    <p className="text-sm text-gray-600">
                      Real-time assistance
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">
                  Get instant help through our live chat system.
                </p>
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Start Chat
                </button>
              </div>

              <div className="bg-white rounded-lg border border-red-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Emergency Support
                    </h3>
                    <p className="text-sm text-gray-600">
                      Critical issues only
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">
                  For system-critical issues requiring immediate attention.
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700">
                    <strong>Response:</strong> Within 30 minutes
                  </p>
                  <p className="text-sm font-bold text-red-600">
                    Use only for system outages or critical failures
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Before Contacting Support
              </h3>
              <p className="text-gray-600 mb-4">
                Help us help you by providing the following information:
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700">
                  <strong>Required Information:</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mt-2">
                  <li>• Your username and department</li>
                  <li>• Detailed description of the issue</li>
                  <li>• Steps that led to the problem</li>
                  <li>• Screenshots if describing a visual problem</li>
                  <li>• Browser version and operating system</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <h4 className="font-semibold text-amber-800">Need Help?</h4>
              </div>
              <p className="text-sm text-amber-700">
                Can't find what you're looking for? Our support team is here to
                help you get the most out of Nexus LMD.
              </p>
            </div>
          </div>
        </div>
      ),

      // News & Updates Section
      "news-updates": (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <Newspaper className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              News & Updates
            </h2>
            <p className="text-gray-600">
              Stay informed with the latest news and system updates
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              News & Updates Overview
            </h3>
            <p className="text-gray-600 mb-6">
              The News & Updates module keeps you informed about company
              announcements, system changes, and important information that
              affects your work.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Reading News
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Learn how to effectively browse and read news articles and
                  updates.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>News Feed:</strong> Browse all available news
                    articles in chronological order
                  </li>
                  <li>
                    • <strong>Article Selection:</strong> Click on any article
                    to view full content
                  </li>
                  <li>
                    • <strong>Content Display:</strong> Read complete articles
                    with rich formatting and media
                  </li>
                  <li>
                    • <strong>Search Function:</strong> Find specific topics or
                    articles quickly
                  </li>
                  <li>
                    • <strong>Category Filtering:</strong> Focus on news from
                    specific departments or topics
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">
                  Notifications
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Manage your notification preferences and stay updated on
                  important news.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Notification Settings:</strong> Configure how and
                    when you receive updates
                  </li>
                  <li>
                    • <strong>Priority Alerts:</strong> Get immediate
                    notifications for critical announcements
                  </li>
                  <li>
                    • <strong>Email Digests:</strong> Receive daily or weekly
                    summaries of news
                  </li>
                  <li>
                    • <strong>Mobile Notifications:</strong> Stay informed even
                    when away from your desk
                  </li>
                  <li>
                    • <strong>Custom Filters:</strong> Set up alerts for
                    specific topics or departments
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">
                  Company Announcements
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Access important company-wide communications and policy
                  updates.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Policy Updates:</strong> Stay current with company
                    policies and procedures
                  </li>
                  <li>
                    • <strong>Organizational Changes:</strong> Learn about
                    company structure and leadership updates
                  </li>
                  <li>
                    • <strong>Event Announcements:</strong> Get information
                    about company events and meetings
                  </li>
                  <li>
                    • <strong>Strategic Updates:</strong> Understand company
                    direction and goals
                  </li>
                  <li>
                    • <strong>Department News:</strong> Stay informed about
                    changes in your department
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800 mb-3">
                  System Updates
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Track platform improvements, new features, and system
                  maintenance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">
                      Feature Updates
                    </h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• New platform capabilities</li>
                      <li>• Enhanced user interface</li>
                      <li>• Improved functionality</li>
                      <li>• Integration updates</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">
                      Maintenance
                    </h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Scheduled maintenance</li>
                      <li>• Bug fixes and patches</li>
                      <li>• Performance improvements</li>
                      <li>• Security updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">
                  News & Updates Best Practices
                </h4>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Check the news feed regularly for important updates</li>
                <li>• Set up notifications for topics relevant to your role</li>
                <li>• Bookmark important announcements for future reference</li>
                <li>
                  • Share relevant news with team members who might have missed
                  it
                </li>
                <li>
                  • Provide feedback on news content to help improve
                  communication
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Navigation Section (Main section)
      navigation: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
              <Home className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Navigation Guide
            </h2>
            <p className="text-gray-600">
              Master the art of moving through the Nexus LMD platform
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Platform Navigation Structure
            </h3>
            <p className="text-gray-600 mb-6">
              Understanding how to navigate efficiently through the platform
              will significantly improve your productivity and user experience.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-indigo-500 pl-4">
                <h4 className="font-semibold text-indigo-800 mb-3">
                  Sidebar Navigation
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  The left sidebar provides access to all major platform
                  functions and serves as your primary navigation hub.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Home:</strong> Dashboard with overview and quick
                    actions
                  </li>
                  <li>
                    • <strong>Chat:</strong> Team communication and
                    collaboration tools
                  </li>
                  <li>
                    • <strong>Projects:</strong> Project management and task
                    tracking
                  </li>
                  <li>
                    • <strong>Production:</strong> Manufacturing monitoring and
                    control
                  </li>
                  <li>
                    • <strong>Activities:</strong> Work tracking and time
                    management
                  </li>
                  <li>
                    • <strong>Metrics:</strong> Performance analytics and
                    reporting
                  </li>
                  <li>
                    • <strong>News:</strong> Company updates and announcements
                  </li>
                  <li>
                    • <strong>System:</strong> Platform administration and
                    settings
                  </li>
                  <li>
                    • <strong>Settings:</strong> User preferences and account
                    management
                  </li>
                  <li>
                    • <strong>Help:</strong> Documentation and support resources
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">
                  Card Expansion
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  The main content area uses an expandable card system for
                  optimal information display and user interaction.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Expand/Collapse:</strong> Click the expand button
                    to show more content
                  </li>
                  <li>
                    • <strong>Responsive Design:</strong> Cards automatically
                    adjust to screen size
                  </li>
                  <li>
                    • <strong>Quick Actions:</strong> Access common functions
                    directly from cards
                  </li>
                  <li>
                    • <strong>Context Menus:</strong> Right-click for additional
                    options
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">
                  Page Switching
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Seamlessly move between different platform sections while
                  maintaining your current work context.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Instant Navigation:</strong> No page reloads when
                    switching sections
                  </li>
                  <li>
                    • <strong>State Preservation:</strong> Your work progress is
                    maintained
                  </li>
                  <li>
                    • <strong>Breadcrumb Trail:</strong> Always know where you
                    are in the platform
                  </li>
                  <li>
                    • <strong>Quick Return:</strong> Use browser back/forward
                    buttons
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800 mb-3">
                  Keyboard Shortcuts
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Master these keyboard shortcuts to navigate the platform more
                  efficiently.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">
                      Navigation
                    </h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>
                        •{" "}
                        <kbd className="bg-white px-1 py-0.5 rounded text-xs">
                          Alt + H
                        </kbd>{" "}
                        Go to Home
                      </li>
                      <li>
                        •{" "}
                        <kbd className="bg-white px-1 py-0.5 rounded text-xs">
                          Alt + C
                        </kbd>{" "}
                        Go to Chat
                      </li>
                      <li>
                        •{" "}
                        <kbd className="bg-white px-1 py-0.5 rounded text-xs">
                          Alt + P
                        </kbd>{" "}
                        Go to Projects
                      </li>
                      <li>
                        •{" "}
                        <kbd className="bg-white px-1 py-0.5 rounded text-xs">
                          Alt + M
                        </kbd>{" "}
                        Go to Metrics
                      </li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">
                      Actions
                    </h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>
                        •{" "}
                        <kbd className="bg-white px-1 py-0.5 rounded text-xs">
                          Ctrl + S
                        </kbd>{" "}
                        Save
                      </li>
                      <li>
                        •{" "}
                        <kbd className="bg-white px-1 py-0.5 rounded text-xs">
                          Ctrl + F
                        </kbd>{" "}
                        Search
                      </li>
                      <li>
                        •{" "}
                        <kbd className="bg-white px-1 py-0.5 rounded text-xs">
                          Esc
                        </kbd>{" "}
                        Close/Cancel
                      </li>
                      <li>
                        •{" "}
                        <kbd className="bg-white px-1 py-0.5 rounded text-xs">
                          F5
                        </kbd>{" "}
                        Refresh
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-indigo-600" />
                <h4 className="font-semibold text-indigo-800">
                  Navigation Best Practices
                </h4>
              </div>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>
                  • Use the sidebar for primary navigation between major
                  sections
                </li>
                <li>
                  • Leverage breadcrumbs to understand your current location
                </li>
                <li>• Master keyboard shortcuts for frequently used actions</li>
                <li>
                  • Use the search function to quickly find specific features
                </li>
                <li>• Bookmark frequently accessed pages for quick access</li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Dashboard Section (Main section)
      dashboard: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Dashboard Features
            </h2>
            <p className="text-gray-600">
              Comprehensive overview of dashboard capabilities and insights
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Dashboard Overview
            </h3>
            <p className="text-gray-600 mb-6">
              The Nexus LMD dashboard provides real-time insights into your
              manufacturing operations, team performance, and key metrics that
              drive business success.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-emerald-500 pl-4">
                <h4 className="font-semibold text-emerald-800 mb-3">
                  Statistics Overview
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Get a comprehensive view of your organization's performance at
                  a glance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <h5 className="font-medium text-emerald-800 mb-2">
                      Production Metrics
                    </h5>
                    <ul className="text-xs text-emerald-700 space-y-1">
                      <li>• Overall Equipment Effectiveness (OEE)</li>
                      <li>• Production throughput and capacity</li>
                      <li>• Quality metrics and defect rates</li>
                      <li>• Downtime analysis and trends</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <h5 className="font-medium text-emerald-800 mb-2">
                      Team Performance
                    </h5>
                    <ul className="text-xs text-emerald-700 space-y-1">
                      <li>• Individual and team productivity</li>
                      <li>• Task completion rates</li>
                      <li>• Training and certification status</li>
                      <li>• Safety incident tracking</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Recent Activities
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Stay informed about the latest developments and team
                  activities across your organization.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Real-time Updates:</strong> Live feed of system
                    activities and changes
                  </li>
                  <li>
                    • <strong>Activity Filtering:</strong> Focus on specific
                    departments or activity types
                  </li>
                  <li>
                    • <strong>Priority Highlighting:</strong> Important
                    activities are prominently displayed
                  </li>
                  <li>
                    • <strong>Action Items:</strong> Quick access to tasks
                    requiring attention
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">
                  Latest Innovations
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Track and celebrate continuous improvement initiatives and
                  innovative solutions.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Process Improvements:</strong> Track efficiency
                    gains and optimizations
                  </li>
                  <li>
                    • <strong>Technology Adoption:</strong> Monitor new tool and
                    system implementations
                  </li>
                  <li>
                    • <strong>Best Practices:</strong> Share successful
                    strategies across teams
                  </li>
                  <li>
                    • <strong>Innovation Metrics:</strong> Measure the impact of
                    improvement efforts
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800 mb-3">
                  Performance Metrics
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive analytics and reporting tools to drive
                  data-driven decision making.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">
                      Key Performance Indicators
                    </h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Production efficiency rates</li>
                      <li>• Quality control metrics</li>
                      <li>• Safety performance indicators</li>
                      <li>• Cost and resource utilization</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">
                      Trend Analysis
                    </h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Historical performance data</li>
                      <li>• Seasonal pattern recognition</li>
                      <li>• Predictive analytics insights</li>
                      <li>• Benchmark comparisons</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-emerald-600" />
                <h4 className="font-semibold text-emerald-800">
                  Dashboard Customization
                </h4>
              </div>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>
                  • Personalize your dashboard view based on your role and
                  responsibilities
                </li>
                <li>
                  • Set up custom alerts for specific metrics and thresholds
                </li>
                <li>• Create personalized reports and data exports</li>
                <li>
                  • Configure notification preferences for important updates
                </li>
                <li>
                  • Use dashboard widgets to focus on your most critical metrics
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // System Administration Section
      "system-admin": (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Monitor className="h-8 w-8 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              System Administration
            </h2>
            <p className="text-gray-600">
              Platform administration and system management tools
            </p>
          </div>

          <div className="space-y-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              System Administration Overview
            </h3>
            <p className="text-gray-600 mb-6">
              The System Administration module provides comprehensive tools for
              managing users, configuring system settings, and maintaining
              platform security and performance.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-gray-400 pl-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  User Management
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive tools for managing user accounts, permissions,
                  and access control.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>User Accounts:</strong> Create, modify, and
                    deactivate user accounts
                  </li>
                  <li>
                    • <strong>Role Management:</strong> Define and assign user
                    roles and permissions
                  </li>
                  <li>
                    • <strong>Access Control:</strong> Manage user access to
                    different platform modules
                  </li>
                  <li>
                    • <strong>Authentication:</strong> Configure login methods
                    and security policies
                  </li>
                  <li>
                    • <strong>User Groups:</strong> Organize users into
                    functional teams and departments
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-gray-400 pl-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  System Configuration
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Configure platform settings, integrations, and system
                  parameters.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Platform Settings:</strong> Configure system-wide
                    parameters and defaults
                  </li>
                  <li>
                    • <strong>Integration Management:</strong> Set up and manage
                    third-party integrations
                  </li>
                  <li>
                    • <strong>Workflow Configuration:</strong> Define business
                    processes and workflows
                  </li>
                  <li>
                    • <strong>Notification Settings:</strong> Configure
                    system-wide notification preferences
                  </li>
                  <li>
                    • <strong>Backup & Recovery:</strong> Manage data backup and
                    system recovery procedures
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-gray-400 pl-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Security Management
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Ensure platform security through comprehensive security
                  management tools.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Security Policies:</strong> Define and enforce
                    security policies
                  </li>
                  <li>
                    • <strong>Access Logs:</strong> Monitor and audit user
                    access and activities
                  </li>
                  <li>
                    • <strong>Data Encryption:</strong> Manage data encryption
                    and security protocols
                  </li>
                  <li>
                    • <strong>Compliance Monitoring:</strong> Ensure adherence
                    to security standards
                  </li>
                  <li>
                    • <strong>Incident Response:</strong> Manage security
                    incidents and responses
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-gray-400 pl-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Performance Monitoring
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Monitor system performance and optimize platform operations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-2">
                      System Metrics
                    </h5>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Server performance monitoring</li>
                      <li>• Database performance tracking</li>
                      <li>• Network latency monitoring</li>
                      <li>• Resource utilization tracking</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-2">
                      Optimization
                    </h5>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Performance bottleneck identification</li>
                      <li>• System optimization recommendations</li>
                      <li>• Capacity planning and scaling</li>
                      <li>• Performance testing and validation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-gray-600" />
                <h4 className="font-semibold text-gray-800">
                  Administration Best Practices
                </h4>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  • Regularly review and update user permissions and access
                  controls
                </li>
                <li>
                  • Monitor system performance and address issues proactively
                </li>
                <li>
                  • Maintain comprehensive audit logs for compliance and
                  security
                </li>
                <li>
                  • Implement regular backup and recovery testing procedures
                </li>
                <li>• Stay current with security updates and best practices</li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Settings Section
      settings: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <Settings className="h-8 w-8 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Settings & Preferences
            </h2>
            <p className="text-gray-600">
              Customize your platform experience and manage preferences
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Settings Overview
            </h3>
            <p className="text-gray-600 mb-6">
              The Settings module allows you to personalize your platform
              experience, configure notifications, and manage your account
              preferences.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-gray-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Profile Settings
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Manage your personal information and account details.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Personal Information:</strong> Update your name,
                    contact details, and profile picture
                  </li>
                  <li>
                    • <strong>Account Security:</strong> Change passwords and
                    manage two-factor authentication
                  </li>
                  <li>
                    • <strong>Preferences:</strong> Set language, timezone, and
                    display preferences
                  </li>
                  <li>
                    • <strong>Privacy Settings:</strong> Control what
                    information is visible to other users
                  </li>
                  <li>
                    • <strong>Account Status:</strong> View and manage your
                    account status and permissions
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">
                  Notification Preferences
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Configure how and when you receive notifications and alerts.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Email Notifications:</strong> Set up email alerts
                    for important events
                  </li>
                  <li>
                    • <strong>Push Notifications:</strong> Configure mobile and
                    desktop push notifications
                  </li>
                  <li>
                    • <strong>Alert Frequency:</strong> Choose how often you
                    receive updates
                  </li>
                  <li>
                    • <strong>Category Filters:</strong> Select which types of
                    notifications to receive
                  </li>
                  <li>
                    • <strong>Quiet Hours:</strong> Set times when notifications
                    are muted
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Interface Customization
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Personalize your platform interface and layout preferences.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Theme Selection:</strong> Choose between light and
                    dark themes
                  </li>
                  <li>
                    • <strong>Layout Options:</strong> Customize dashboard
                    layout and widget placement
                  </li>
                  <li>
                    • <strong>Color Schemes:</strong> Select your preferred
                    color palette
                  </li>
                  <li>
                    • <strong>Font Settings:</strong> Adjust text size and font
                    preferences
                  </li>
                  <li>
                    • <strong>Accessibility:</strong> Configure accessibility
                    features and options
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">
                  Data & Privacy
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Manage your data, privacy settings, and export options.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">
                      Data Management
                    </h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Export personal data</li>
                      <li>• Data retention settings</li>
                      <li>• Backup preferences</li>
                      <li>• Sync options</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">
                      Privacy Controls
                    </h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Visibility settings</li>
                      <li>• Activity sharing</li>
                      <li>• Third-party access</li>
                      <li>• Cookie preferences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-gray-600" />
                <h4 className="font-semibold text-gray-800">
                  Settings Best Practices
                </h4>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  • Regularly review and update your notification preferences
                </li>
                <li>• Keep your profile information current and accurate</li>
                <li>
                  • Use strong passwords and enable two-factor authentication
                </li>
                <li>
                  • Customize your interface to match your workflow preferences
                </li>
                <li>
                  • Review privacy settings to ensure they match your comfort
                  level
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Help Section
      help: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
              <HelpCircle className="h-8 w-8 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Help & Support
            </h2>
            <p className="text-gray-600">
              Get help and learn how to use the platform effectively
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Help & Support Overview
            </h3>
            <p className="text-gray-600 mb-6">
              The Help & Support module provides comprehensive documentation,
              tutorials, and support resources to help you get the most out of
              the Nexus LMD platform.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-semibold text-teal-800 mb-3">
                  Documentation
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Access comprehensive guides and documentation for all platform
                  features.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>User Guides:</strong> Step-by-step instructions
                    for common tasks
                  </li>
                  <li>
                    • <strong>Feature Documentation:</strong> Detailed
                    explanations of platform capabilities
                  </li>
                  <li>
                    • <strong>Best Practices:</strong> Tips and recommendations
                    for optimal usage
                  </li>
                  <li>
                    • <strong>FAQ Section:</strong> Answers to frequently asked
                    questions
                  </li>
                  <li>
                    • <strong>Video Tutorials:</strong> Visual guides for
                    complex features
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">
                  Learning Resources
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Enhance your skills with comprehensive learning materials and
                  training resources.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Training Modules:</strong> Structured learning
                    paths for different roles
                  </li>
                  <li>
                    • <strong>Interactive Tutorials:</strong> Hands-on learning
                    experiences
                  </li>
                  <li>
                    • <strong>Knowledge Base:</strong> Searchable repository of
                    helpful articles
                  </li>
                  <li>
                    • <strong>Webinars:</strong> Live training sessions and
                    demonstrations
                  </li>
                  <li>
                    • <strong>Certification Programs:</strong> Earn credentials
                    for platform expertise
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Support Channels
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Multiple ways to get assistance when you need help.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Live Chat:</strong> Real-time assistance from
                    support specialists
                  </li>
                  <li>
                    • <strong>Email Support:</strong> Detailed help requests and
                    responses
                  </li>
                  <li>
                    • <strong>Phone Support:</strong> Direct communication for
                    urgent issues
                  </li>
                  <li>
                    • <strong>Community Forum:</strong> Connect with other users
                    and share solutions
                  </li>
                  <li>
                    • <strong>Ticket System:</strong> Track and manage support
                    requests
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">
                  Self-Service Tools
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Tools and resources to help you solve problems independently.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">
                      Troubleshooting
                    </h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Diagnostic tools</li>
                      <li>• Error code lookup</li>
                      <li>• Common solutions</li>
                      <li>• Problem reporting</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">
                      Resources
                    </h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Downloadable guides</li>
                      <li>• Template library</li>
                      <li>• Reference materials</li>
                      <li>• Quick reference cards</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-teal-600" />
                <h4 className="font-semibold text-teal-800">
                  Getting Help Tips
                </h4>
              </div>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>
                  • Check the documentation first for common questions and
                  solutions
                </li>
                <li>
                  • Use the search function to quickly find relevant help
                  articles
                </li>
                <li>• Join the community forum to connect with other users</li>
                <li>• Provide detailed information when contacting support</li>
                <li>
                  • Take advantage of training resources to improve your skills
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Metrics Section
      metrics: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Metrics & Analytics
            </h2>
            <p className="text-gray-600">
              Comprehensive performance analytics and reporting tools
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Metrics & Analytics Overview
            </h3>
            <p className="text-gray-600 mb-6">
              The Metrics & Analytics module provides comprehensive tools for
              measuring performance, analyzing trends, and generating insights
              to drive data-driven decision making.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-pink-500 pl-4">
                <h4 className="font-semibold text-pink-800 mb-3">
                  Performance Metrics
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Track and analyze key performance indicators across all
                  aspects of your operations.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Production Metrics:</strong> OEE, throughput,
                    efficiency, and quality scores
                  </li>
                  <li>
                    • <strong>Financial Metrics:</strong> Cost analysis, ROI,
                    and budget tracking
                  </li>
                  <li>
                    • <strong>Operational Metrics:</strong> Cycle times, lead
                    times, and capacity utilization
                  </li>
                  <li>
                    • <strong>Quality Metrics:</strong> Defect rates, rework,
                    and customer satisfaction
                  </li>
                  <li>
                    • <strong>Safety Metrics:</strong> Incident rates,
                    compliance scores, and risk assessments
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">
                  Data Analysis
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Advanced analytics tools for deep insights and trend analysis.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Trend Analysis:</strong> Identify patterns and
                    trends over time
                  </li>
                  <li>
                    • <strong>Comparative Analysis:</strong> Compare performance
                    across periods and teams
                  </li>
                  <li>
                    • <strong>Root Cause Analysis:</strong> Investigate
                    performance issues and bottlenecks
                  </li>
                  <li>
                    • <strong>Predictive Analytics:</strong> Forecast future
                    performance and trends
                  </li>
                  <li>
                    • <strong>Statistical Analysis:</strong> Advanced
                    statistical methods and modeling
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Reporting Tools
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Generate comprehensive reports and visualizations for
                  stakeholders.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Custom Reports:</strong> Create tailored reports
                    for specific needs
                  </li>
                  <li>
                    • <strong>Automated Reports:</strong> Schedule regular
                    report generation and delivery
                  </li>
                  <li>
                    • <strong>Interactive Dashboards:</strong> Real-time
                    visualizations and drill-down capabilities
                  </li>
                  <li>
                    • <strong>Export Options:</strong> Multiple formats for
                    sharing and presentation
                  </li>
                  <li>
                    • <strong>Report Templates:</strong> Pre-built templates for
                    common reporting needs
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">
                  Business Intelligence
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Transform data into actionable business insights and
                  recommendations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">
                      Insights
                    </h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Performance insights</li>
                      <li>• Improvement opportunities</li>
                      <li>• Risk identification</li>
                      <li>• Best practices</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">
                      Recommendations
                    </h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Actionable suggestions</li>
                      <li>• Optimization strategies</li>
                      <li>• Resource allocation</li>
                      <li>• Strategic planning</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-pink-50 border border-pink-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-pink-600" />
                <h4 className="font-semibold text-pink-800">
                  Analytics Best Practices
                </h4>
              </div>
              <ul className="text-sm text-pink-700 space-y-1">
                <li>
                  • Focus on metrics that directly impact your business
                  objectives
                </li>
                <li>
                  • Establish baseline measurements to track improvement over
                  time
                </li>
                <li>
                  • Use visualizations to make complex data more understandable
                </li>
                <li>
                  • Regularly review and update your key performance indicators
                </li>
                <li>
                  • Share insights with stakeholders to drive collaborative
                  improvement
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Chat Section
      chat: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Team Chat</h2>
            <p className="text-gray-600">
              Real-time team communication and collaboration
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Team Chat Overview
            </h3>
            <p className="text-gray-600 mb-6">
              The Team Chat module provides comprehensive tools for real-time
              communication, file sharing, and team collaboration across your
              organization.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-cyan-500 pl-4">
                <h4 className="font-semibold text-cyan-800 mb-3">
                  Chat Basics
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  WhatsApp-style team communication with advanced features for
                  professional collaboration.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Real-time Messaging:</strong> Instant
                    communication with team members
                  </li>
                  <li>
                    • <strong>Group Conversations:</strong> Create and manage
                    team-specific chat rooms
                  </li>
                  <li>
                    • <strong>Message Threading:</strong> Organize discussions
                    by topic or project
                  </li>
                  <li>
                    • <strong>Read Receipts:</strong> Track message delivery and
                    read status
                  </li>
                  <li>
                    • <strong>Message Search:</strong> Find specific
                    conversations or information quickly
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">
                  File Sharing
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Secure and efficient file sharing capabilities for team
                  collaboration.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>Document Upload:</strong> Share files directly in
                    chat conversations
                  </li>
                  <li>
                    • <strong>File Management:</strong> Organize and categorize
                    shared documents
                  </li>
                  <li>
                    • <strong>Version Control:</strong> Track document changes
                    and updates
                  </li>
                  <li>
                    • <strong>Access Control:</strong> Manage permissions for
                    sensitive files
                  </li>
                  <li>
                    • <strong>Storage Integration:</strong> Connect with cloud
                    storage services
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">
                  Video & Audio Calls
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  High-quality communication tools for remote collaboration and
                  team meetings.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>HD Video Calls:</strong> Crystal clear video
                    communication
                  </li>
                  <li>
                    • <strong>Audio Conferencing:</strong> High-quality voice
                    calls with noise cancellation
                  </li>
                  <li>
                    • <strong>Screen Sharing:</strong> Present documents and
                    applications in real-time
                  </li>
                  <li>
                    • <strong>Meeting Recording:</strong> Capture important
                    discussions for later reference
                  </li>
                  <li>
                    • <strong>Virtual Backgrounds:</strong> Professional
                    appearance in any environment
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800 mb-3">
                  Contact Management
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Efficient organization and management of team contacts and
                  communication preferences.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">
                      Contact Organization
                    </h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Department-based grouping</li>
                      <li>• Project team associations</li>
                      <li>• Role-based categorization</li>
                      <li>• Custom contact lists</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">
                      Communication Preferences
                    </h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Preferred contact methods</li>
                      <li>• Availability schedules</li>
                      <li>• Notification settings</li>
                      <li>• Language preferences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-cyan-600" />
                <h4 className="font-semibold text-cyan-800">
                  Chat Best Practices
                </h4>
              </div>
              <ul className="text-sm text-cyan-700 space-y-1">
                <li>
                  • Use appropriate communication channels for different types
                  of messages
                </li>
                <li>
                  • Set clear expectations for response times and availability
                </li>
                <li>
                  • Organize conversations by project or topic for better
                  clarity
                </li>
                <li>
                  • Use file sharing for document collaboration instead of email
                  attachments
                </li>
                <li>
                  • Schedule regular team meetings to maintain alignment and
                  engagement
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    };

    return helpContent[section] || helpContent["getting-started"];
  };

  // Add loading state and error handling
  if (!selectedSection) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full animate-pulse"></div>
          <p className="text-gray-600">Loading help content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden flex flex-col bg-white">
      {/* Content Area */}
      <div className="flex-1 overflow-auto help-content-container">
        <div className="h-full w-full">
          <div className="bg-white h-full w-full relative">
            {/* Subtle left border */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="px-8 pt-8 pb-4">
              {selectedSection && selectedSection !== "" ? (
                <div className="space-y-6">
                  {renderHelpContent(selectedSection)}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center shadow-lg">
                      <HelpCircle className="h-10 w-10 text-gray-600" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4 leading-tight">
                      Welcome to Nexus LMD Help
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                      Select a topic from the left menu to begin exploring
                      comprehensive guides, tips, and best practices for
                      mastering the Nexus LMD platform.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpRightCard;
