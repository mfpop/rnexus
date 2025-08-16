import React from "react";
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
  FileText,
  Video,
  Activity,
  Newspaper,
  Monitor,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useHelpContext } from "./HelpContext";

const HelpRightCard: React.FC = () => {
  const { selectedSection } = useHelpContext();
  const renderHelpContent = (section: string) => {
    console.log('renderHelpContent called with section:', section);

    const helpContent: Record<string, React.JSX.Element> = {
      // Getting Started main section (fallback)
      "getting-started": (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
              <Play className="h-8 w-8 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Getting Started
            </h2>
            <p className="text-gray-600">
              Choose a topic from the left menu to begin your journey
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Welcome Guide</h3>
              </div>
              <p className="text-sm text-gray-600">
                Learn about Nexus LMD and its core capabilities
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">First Login</h3>
              </div>
              <p className="text-sm text-gray-600">
                Step-by-step guide for your first login experience
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">
                  Navigation Basics
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Master the three-column layout and interface
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800">
                  Dashboard Overview
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Understand KPIs, activities, and metrics
              </p>
            </div>
          </div>
        </div>
      ),

      // Welcome to Nexus LMD
      welcome: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
              <Lightbulb className="h-8 w-8 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to Nexus LMD
            </h2>
            <p className="text-gray-600">
              Your comprehensive production management platform
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Platform Overview
            </h3>
            <p className="text-gray-600 mb-6">
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
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    Performance analytics
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Team Collaboration
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    WhatsApp-style team communication
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    Project management tools
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    Activity tracking
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    News and updates system
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200 p-6">
            <h4 className="font-semibold text-teal-700 mb-2">
              Ready to Get Started?
            </h4>
            <p className="text-sm text-gray-600">
              Explore the other getting started topics to learn how to navigate
              the platform and make the most of its features.
            </p>
          </div>
        </div>
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
                  <li>• Activity Tracking</li>
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
      "communication": (
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
              The Team Communication module provides comprehensive tools for real-time collaboration, file sharing, and team coordination across your organization.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-cyan-500 pl-4">
                <h4 className="font-semibold text-cyan-800 mb-3">Chat Basics</h4>
                <p className="text-sm text-gray-600 mb-3">
                  WhatsApp-style team communication with advanced features for professional collaboration.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Real-time Messaging:</strong> Instant communication with team members</li>
                  <li>• <strong>Group Conversations:</strong> Create and manage team-specific chat rooms</li>
                  <li>• <strong>Message Threading:</strong> Organize discussions by topic or project</li>
                  <li>• <strong>Read Receipts:</strong> Track message delivery and read status</li>
                  <li>• <strong>Message Search:</strong> Find specific conversations or information quickly</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">File Sharing</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Secure and efficient file sharing capabilities for team collaboration.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Document Upload:</strong> Share files directly in chat conversations</li>
                  <li>• <strong>File Management:</strong> Organize and categorize shared documents</li>
                  <li>• <strong>Version Control:</strong> Track document changes and updates</li>
                  <li>• <strong>Access Control:</strong> Manage permissions for sensitive files</li>
                  <li>• <strong>Storage Integration:</strong> Connect with cloud storage services</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">Video & Audio Calls</h4>
                <p className="text-sm text-gray-600 mb-3">
                  High-quality communication tools for remote collaboration and team meetings.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>HD Video Calls:</strong> Crystal clear video communication</li>
                  <li>• <strong>Audio Conferencing:</strong> High-quality voice calls with noise cancellation</li>
                  <li>• <strong>Screen Sharing:</strong> Present documents and applications in real-time</li>
                  <li>• <strong>Meeting Recording:</strong> Capture important discussions for later reference</li>
                  <li>• <strong>Virtual Backgrounds:</strong> Professional appearance in any environment</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800 mb-3">Contact Management</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Efficient organization and management of team contacts and communication preferences.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">Contact Organization</h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Department-based grouping</li>
                      <li>• Project team associations</li>
                      <li>• Role-based categorization</li>
                      <li>• Custom contact lists</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">Communication Preferences</h5>
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
                <h4 className="font-semibold text-cyan-800">Communication Best Practices</h4>
              </div>
              <ul className="text-sm text-cyan-700 space-y-1">
                <li>• Use appropriate communication channels for different types of messages</li>
                <li>• Set clear expectations for response times and availability</li>
                <li>• Organize conversations by project or topic for better clarity</li>
                <li>• Use file sharing for document collaboration instead of email attachments</li>
                <li>• Schedule regular team meetings to maintain alignment and engagement</li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Production Management Section
      "production": (
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
              The Production Management module provides real-time monitoring, quality control, and operational insights to optimize your manufacturing processes and maximize efficiency.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-amber-500 pl-4">
                <h4 className="font-semibold text-amber-800 mb-3">Production Overview</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive dashboard providing real-time visibility into all manufacturing operations.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Production Status:</strong> Real-time view of all production lines and equipment</li>
                  <li>• <strong>Output Metrics:</strong> Track production volume, efficiency, and throughput</li>
                  <li>• <strong>Resource Utilization:</strong> Monitor machine, labor, and material usage</li>
                  <li>• <strong>Production Planning:</strong> View scheduled production and capacity planning</li>
                  <li>• <strong>Performance Trends:</strong> Historical data and predictive analytics</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">Real-time Monitoring</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Live monitoring of production processes with instant alerts and notifications.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Equipment Status:</strong> Real-time monitoring of machine operations</li>
                  <li>• <strong>Process Parameters:</strong> Track temperature, pressure, speed, and other critical metrics</li>
                  <li>• <strong>Alert System:</strong> Instant notifications for deviations and issues</li>
                  <li>• <strong>Remote Access:</strong> Monitor production from anywhere in the facility</li>
                  <li>• <strong>Data Logging:</strong> Continuous recording of all production parameters</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">Quality Control</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive quality management system ensuring product excellence and compliance.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Quality Metrics:</strong> Track defect rates, rework, and customer returns</li>
                  <li>• <strong>Inspection Management:</strong> Automated and manual quality checks</li>
                  <li>• <strong>Statistical Process Control:</strong> SPC charts and trend analysis</li>
                  <li>• <strong>Root Cause Analysis:</strong> Identify and resolve quality issues</li>
                  <li>• <strong>Compliance Tracking:</strong> Ensure adherence to quality standards</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">Maintenance Scheduling</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Proactive maintenance planning to minimize downtime and extend equipment life.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Preventive Maintenance</h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Scheduled maintenance tasks</li>
                      <li>• Equipment lifecycle tracking</li>
                      <li>• Parts inventory management</li>
                      <li>• Maintenance history records</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Predictive Maintenance</h5>
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
                <h4 className="font-semibold text-amber-800">Production Optimization Tips</h4>
              </div>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Monitor OEE (Overall Equipment Effectiveness) to identify improvement opportunities</li>
                <li>• Use real-time data to make immediate process adjustments</li>
                <li>• Implement predictive maintenance to prevent unexpected downtime</li>
                <li>• Analyze quality trends to identify root causes of defects</li>
                <li>• Regularly review production metrics to optimize resource allocation</li>
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
              The Project Management module provides comprehensive tools for planning, executing, and monitoring projects of all sizes, ensuring successful delivery and team collaboration.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-violet-500 pl-4">
                <h4 className="font-semibold text-violet-800 mb-3">Creating Projects</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Streamlined project creation with comprehensive planning and setup capabilities.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Project Templates:</strong> Use pre-built templates for common project types</li>
                  <li>• <strong>Project Setup Wizard:</strong> Step-by-step project configuration</li>
                  <li>• <strong>Resource Allocation:</strong> Assign team members and equipment</li>
                  <li>• <strong>Timeline Planning:</strong> Create detailed project schedules and milestones</li>
                  <li>• <strong>Budget Management:</strong> Set and track project costs and resources</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">Task Management</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive task organization and tracking for efficient project execution.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Task Creation:</strong> Break down projects into manageable tasks</li>
                  <li>• <strong>Dependency Management:</strong> Define task relationships and prerequisites</li>
                  <li>• <strong>Priority Setting:</strong> Assign importance levels to tasks</li>
                  <li>• <strong>Progress Tracking:</strong> Monitor task completion and status updates</li>
                  <li>• <strong>Time Estimation:</strong> Plan and track time requirements for tasks</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">Team Collaboration</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Enhanced team coordination and communication for successful project delivery.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Team Assignment:</strong> Assign roles and responsibilities to team members</li>
                  <li>• <strong>Communication Tools:</strong> Integrated chat and discussion forums</li>
                  <li>• <strong>Document Sharing:</strong> Centralized repository for project documents</li>
                  <li>• <strong>Meeting Management:</strong> Schedule and conduct project meetings</li>
                  <li>• <strong>Feedback System:</strong> Collect and manage team input and suggestions</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800 mb-3">Progress Tracking</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Real-time monitoring and reporting of project progress and performance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">Progress Metrics</h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Completion percentages</li>
                      <li>• Milestone achievements</li>
                      <li>• Resource utilization</li>
                      <li>• Budget tracking</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">Reporting Tools</h5>
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
                <h4 className="font-semibold text-violet-800">Project Management Best Practices</h4>
              </div>
              <ul className="text-sm text-violet-700 space-y-1">
                <li>• Break down large projects into smaller, manageable tasks</li>
                <li>• Set clear milestones and deadlines for better progress tracking</li>
                <li>• Regularly communicate with team members and stakeholders</li>
                <li>• Use project templates to standardize processes and improve efficiency</li>
                <li>• Monitor progress regularly and adjust plans as needed</li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Activity Tracking Section
      "activities": (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center">
              <Activity className="h-8 w-8 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Activity Tracking
            </h2>
            <p className="text-gray-600">
              Comprehensive work tracking and time management system
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Work Activity Management
            </h3>
            <p className="text-gray-600 mb-6">
              The Activity Tracking module provides comprehensive tools for monitoring work activities, managing time, and tracking productivity across your organization.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-rose-500 pl-4">
                <h4 className="font-semibold text-rose-800 mb-3">Activity Overview</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive dashboard providing real-time visibility into all work activities and productivity metrics.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Activity Dashboard:</strong> Real-time view of all ongoing work activities</li>
                  <li>• <strong>Productivity Metrics:</strong> Track individual and team performance</li>
                  <li>• <strong>Time Tracking:</strong> Monitor time spent on different tasks and projects</li>
                  <li>• <strong>Activity Categories:</strong> Organize work by type, priority, and department</li>
                  <li>• <strong>Performance Trends:</strong> Historical data and productivity analysis</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">Work Monitoring</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Real-time monitoring of work activities with instant updates and progress tracking.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Live Updates:</strong> Real-time activity feeds and status changes</li>
                  <li>• <strong>Progress Tracking:</strong> Monitor task completion and milestone achievements</li>
                  <li>• <strong>Bottleneck Identification:</strong> Identify and resolve workflow obstacles</li>
                  <li>• <strong>Resource Allocation:</strong> Optimize team member assignments and workload</li>
                  <li>• <strong>Performance Alerts:</strong> Notifications for productivity issues or delays</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">Quality Control</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive quality management system ensuring work excellence and compliance.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Quality Metrics:</strong> Track work quality, accuracy, and customer satisfaction</li>
                  <li>• <strong>Review Processes:</strong> Automated and manual quality checks</li>
                  <li>• <strong>Performance Standards:</strong> Define and monitor quality benchmarks</li>
                  <li>• <strong>Continuous Improvement:</strong> Identify and implement process enhancements</li>
                  <li>• <strong>Compliance Tracking:</strong> Ensure adherence to quality standards and regulations</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">Maintenance Scheduling</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Proactive maintenance planning to minimize downtime and extend equipment life.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Preventive Maintenance</h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Scheduled maintenance tasks</li>
                      <li>• Equipment lifecycle tracking</li>
                      <li>• Parts inventory management</li>
                      <li>• Maintenance history records</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Predictive Maintenance</h5>
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

            <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-rose-600" />
                <h4 className="font-semibold text-rose-800">Activity Tracking Best Practices</h4>
              </div>
              <ul className="text-sm text-rose-700 space-y-1">
                <li>• Log activities in real-time for accurate tracking and reporting</li>
                <li>• Use consistent categorization for better data analysis and insights</li>
                <li>• Set realistic time estimates and track actual time spent</li>
                <li>• Regularly review productivity metrics to identify improvement opportunities</li>
                <li>• Encourage team members to provide detailed activity descriptions</li>
              </ul>
            </div>
          </div>
        </div>
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
            <p className="text-gray-600">
              Get help when you need it most
            </p>
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
                    <h3 className="font-semibold text-gray-800">Email Support</h3>
                    <p className="text-sm text-gray-600">24/7 email assistance</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">
                  Send detailed descriptions of your issue for comprehensive support.
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
                    <h3 className="font-semibold text-gray-800">Phone Support</h3>
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
                    <p className="text-sm text-gray-600">Real-time assistance</p>
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
                    <p className="text-sm text-gray-600">Critical issues only</p>
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
                Can't find what you're looking for? Our support team is here to help you get the most out of Nexus LMD.
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
              The News & Updates module keeps you informed about company announcements, system changes, and important information that affects your work.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">Reading News</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Learn how to effectively browse and read news articles and updates.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>News Feed:</strong> Browse all available news articles in chronological order</li>
                  <li>• <strong>Article Selection:</strong> Click on any article to view full content</li>
                  <li>• <strong>Content Display:</strong> Read complete articles with rich formatting and media</li>
                  <li>• <strong>Search Function:</strong> Find specific topics or articles quickly</li>
                  <li>• <strong>Category Filtering:</strong> Focus on news from specific departments or topics</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">Notifications</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Manage your notification preferences and stay updated on important news.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Notification Settings:</strong> Configure how and when you receive updates</li>
                  <li>• <strong>Priority Alerts:</strong> Get immediate notifications for critical announcements</li>
                  <li>• <strong>Email Digests:</strong> Receive daily or weekly summaries of news</li>
                  <li>• <strong>Mobile Notifications:</strong> Stay informed even when away from your desk</li>
                  <li>• <strong>Custom Filters:</strong> Set up alerts for specific topics or departments</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">Company Announcements</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Access important company-wide communications and policy updates.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Policy Updates:</strong> Stay current with company policies and procedures</li>
                  <li>• <strong>Organizational Changes:</strong> Learn about company structure and leadership updates</li>
                  <li>• <strong>Event Announcements:</strong> Get information about company events and meetings</li>
                  <li>• <strong>Strategic Updates:</strong> Understand company direction and goals</li>
                  <li>• <strong>Department News:</strong> Stay informed about changes in your department</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800 mb-3">System Updates</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Track platform improvements, new features, and system maintenance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">Feature Updates</h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• New platform capabilities</li>
                      <li>• Enhanced user interface</li>
                      <li>• Improved functionality</li>
                      <li>• Integration updates</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">Maintenance</h5>
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
                <h4 className="font-semibold text-blue-800">News & Updates Best Practices</h4>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Check the news feed regularly for important updates</li>
                <li>• Set up notifications for topics relevant to your role</li>
                <li>• Bookmark important announcements for future reference</li>
                <li>• Share relevant news with team members who might have missed it</li>
                <li>• Provide feedback on news content to help improve communication</li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Navigation Section (Main section)
      "navigation": (
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
              Understanding how to navigate efficiently through the platform will significantly improve your productivity and user experience.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-indigo-500 pl-4">
                <h4 className="font-semibold text-indigo-800 mb-3">Sidebar Navigation</h4>
                <p className="text-sm text-gray-600 mb-3">
                  The left sidebar provides access to all major platform functions and serves as your primary navigation hub.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Home:</strong> Dashboard with overview and quick actions</li>
                  <li>• <strong>Chat:</strong> Team communication and collaboration tools</li>
                  <li>• <strong>Projects:</strong> Project management and task tracking</li>
                  <li>• <strong>Production:</strong> Manufacturing monitoring and control</li>
                  <li>• <strong>Activities:</strong> Work tracking and time management</li>
                  <li>• <strong>Metrics:</strong> Performance analytics and reporting</li>
                  <li>• <strong>News:</strong> Company updates and announcements</li>
                  <li>• <strong>System:</strong> Platform administration and settings</li>
                  <li>• <strong>Settings:</strong> User preferences and account management</li>
                  <li>• <strong>Help:</strong> Documentation and support resources</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">Card Expansion</h4>
                <p className="text-sm text-gray-600 mb-3">
                  The main content area uses an expandable card system for optimal information display and user interaction.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Expand/Collapse:</strong> Click the expand button to show more content</li>
                  <li>• <strong>Responsive Design:</strong> Cards automatically adjust to screen size</li>
                  <li>• <strong>Quick Actions:</strong> Access common functions directly from cards</li>
                  <li>• <strong>Context Menus:</strong> Right-click for additional options</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">Page Switching</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Seamlessly move between different platform sections while maintaining your current work context.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Instant Navigation:</strong> No page reloads when switching sections</li>
                  <li>• <strong>State Preservation:</strong> Your work progress is maintained</li>
                  <li>• <strong>Breadcrumb Trail:</strong> Always know where you are in the platform</li>
                  <li>• <strong>Quick Return:</strong> Use browser back/forward buttons</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800 mb-3">Keyboard Shortcuts</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Master these keyboard shortcuts to navigate the platform more efficiently.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">Navigation</h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• <kbd className="bg-white px-1 py-0.5 rounded text-xs">Alt + H</kbd> Go to Home</li>
                      <li>• <kbd className="bg-white px-1 py-0.5 rounded text-xs">Alt + C</kbd> Go to Chat</li>
                      <li>• <kbd className="bg-white px-1 py-0.5 rounded text-xs">Alt + P</kbd> Go to Projects</li>
                      <li>• <kbd className="bg-white px-1 py-0.5 rounded text-xs">Alt + M</kbd> Go to Metrics</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">Actions</h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• <kbd className="bg-white px-1 py-0.5 rounded text-xs">Ctrl + S</kbd> Save</li>
                      <li>• <kbd className="bg-white px-1 py-0.5 rounded text-xs">Ctrl + F</kbd> Search</li>
                      <li>• <kbd className="bg-white px-1 py-0.5 rounded text-xs">Esc</kbd> Close/Cancel</li>
                      <li>• <kbd className="bg-white px-1 py-0.5 rounded text-xs">F5</kbd> Refresh</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-indigo-600" />
                <h4 className="font-semibold text-indigo-800">Navigation Best Practices</h4>
              </div>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>• Use the sidebar for primary navigation between major sections</li>
                <li>• Leverage breadcrumbs to understand your current location</li>
                <li>• Master keyboard shortcuts for frequently used actions</li>
                <li>• Use the search function to quickly find specific features</li>
                <li>• Bookmark frequently accessed pages for quick access</li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Dashboard Section (Main section)
      "dashboard": (
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
              The Nexus LMD dashboard provides real-time insights into your manufacturing operations, team performance, and key metrics that drive business success.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-emerald-500 pl-4">
                <h4 className="font-semibold text-emerald-800 mb-3">Statistics Overview</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Get a comprehensive view of your organization's performance at a glance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <h5 className="font-medium text-emerald-800 mb-2">Production Metrics</h5>
                    <ul className="text-xs text-emerald-700 space-y-1">
                      <li>• Overall Equipment Effectiveness (OEE)</li>
                      <li>• Production throughput and capacity</li>
                      <li>• Quality metrics and defect rates</li>
                      <li>• Downtime analysis and trends</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <h5 className="font-medium text-emerald-800 mb-2">Team Performance</h5>
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
                <h4 className="font-semibold text-blue-800 mb-3">Recent Activities</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Stay informed about the latest developments and team activities across your organization.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Real-time Updates:</strong> Live feed of system activities and changes</li>
                  <li>• <strong>Activity Filtering:</strong> Focus on specific departments or activity types</li>
                  <li>• <strong>Priority Highlighting:</strong> Important activities are prominently displayed</li>
                  <li>• <strong>Action Items:</strong> Quick access to tasks requiring attention</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">Latest Innovations</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Track and celebrate continuous improvement initiatives and innovative solutions.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Process Improvements:</strong> Track efficiency gains and optimizations</li>
                  <li>• <strong>Technology Adoption:</strong> Monitor new tool and system implementations</li>
                  <li>• <strong>Best Practices:</strong> Share successful strategies across teams</li>
                  <li>• <strong>Innovation Metrics:</strong> Measure the impact of improvement efforts</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800 mb-3">Performance Metrics</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive analytics and reporting tools to drive data-driven decision making.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">Key Performance Indicators</h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Production efficiency rates</li>
                      <li>• Quality control metrics</li>
                      <li>• Safety performance indicators</li>
                      <li>• Cost and resource utilization</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">Trend Analysis</h5>
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
                <h4 className="font-semibold text-emerald-800">Dashboard Customization</h4>
              </div>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Personalize your dashboard view based on your role and responsibilities</li>
                <li>• Set up custom alerts for specific metrics and thresholds</li>
                <li>• Create personalized reports and data exports</li>
                <li>• Configure notification preferences for important updates</li>
                <li>• Use dashboard widgets to focus on your most critical metrics</li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // System Administration Section
      "system-admin": (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
              <Monitor className="h-8 w-8 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              System Administration
            </h2>
            <p className="text-gray-600">
              Platform administration and system management tools
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              System Administration Overview
            </h3>
            <p className="text-gray-600 mb-6">
              The System Administration module provides comprehensive tools for managing users, configuring system settings, and maintaining platform security and performance.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-slate-500 pl-4">
                <h4 className="font-semibold text-slate-800 mb-3">User Management</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive tools for managing user accounts, permissions, and access control.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>User Accounts:</strong> Create, modify, and deactivate user accounts</li>
                  <li>• <strong>Role Management:</strong> Define and assign user roles and permissions</li>
                  <li>• <strong>Access Control:</strong> Manage user access to different platform modules</li>
                  <li>• <strong>Authentication:</strong> Configure login methods and security policies</li>
                  <li>• <strong>User Groups:</strong> Organize users into functional teams and departments</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">System Configuration</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Configure platform settings, integrations, and system parameters.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Platform Settings:</strong> Configure system-wide parameters and defaults</li>
                  <li>• <strong>Integration Management:</strong> Set up and manage third-party integrations</li>
                  <li>• <strong>Workflow Configuration:</strong> Define business processes and workflows</li>
                  <li>• <strong>Notification Settings:</strong> Configure system-wide notification preferences</li>
                  <li>• <strong>Backup & Recovery:</strong> Manage data backup and system recovery procedures</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">Security Management</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Ensure platform security through comprehensive security management tools.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Security Policies:</strong> Define and enforce security policies</li>
                  <li>• <strong>Access Logs:</strong> Monitor and audit user access and activities</li>
                  <li>• <strong>Data Encryption:</strong> Manage data encryption and security protocols</li>
                  <li>• <strong>Compliance Monitoring:</strong> Ensure adherence to security standards</li>
                  <li>• <strong>Incident Response:</strong> Manage security incidents and responses</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">Performance Monitoring</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Monitor system performance and optimize platform operations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">System Metrics</h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Server performance monitoring</li>
                      <li>• Database performance tracking</li>
                      <li>• Network latency monitoring</li>
                      <li>• Resource utilization tracking</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Optimization</h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Performance bottleneck identification</li>
                      <li>• System optimization recommendations</li>
                      <li>• Capacity planning and scaling</li>
                      <li>• Performance testing and validation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-slate-600" />
                <h4 className="font-semibold text-slate-800">Administration Best Practices</h4>
              </div>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Regularly review and update user permissions and access controls</li>
                <li>• Monitor system performance and address issues proactively</li>
                <li>• Maintain comprehensive audit logs for compliance and security</li>
                <li>• Implement regular backup and recovery testing procedures</li>
                <li>• Stay current with security updates and best practices</li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Settings Section
      "settings": (
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
              The Settings module allows you to personalize your platform experience, configure notifications, and manage your account preferences.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-gray-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-3">Profile Settings</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Manage your personal information and account details.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Personal Information:</strong> Update your name, contact details, and profile picture</li>
                  <li>• <strong>Account Security:</strong> Change passwords and manage two-factor authentication</li>
                  <li>• <strong>Preferences:</strong> Set language, timezone, and display preferences</li>
                  <li>• <strong>Privacy Settings:</strong> Control what information is visible to other users</li>
                  <li>• <strong>Account Status:</strong> View and manage your account status and permissions</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">Notification Preferences</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Configure how and when you receive notifications and alerts.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Email Notifications:</strong> Set up email alerts for important events</li>
                  <li>• <strong>Push Notifications:</strong> Configure mobile and desktop push notifications</li>
                  <li>• <strong>Alert Frequency:</strong> Choose how often you receive updates</li>
                  <li>• <strong>Category Filters:</strong> Select which types of notifications to receive</li>
                  <li>• <strong>Quiet Hours:</strong> Set times when notifications are muted</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">Interface Customization</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Personalize your platform interface and layout preferences.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Theme Selection:</strong> Choose between light and dark themes</li>
                  <li>• <strong>Layout Options:</strong> Customize dashboard layout and widget placement</li>
                  <li>• <strong>Color Schemes:</strong> Select your preferred color palette</li>
                  <li>• <strong>Font Settings:</strong> Adjust text size and font preferences</li>
                  <li>• <strong>Accessibility:</strong> Configure accessibility features and options</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">Data & Privacy</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Manage your data, privacy settings, and export options.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Data Management</h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Export personal data</li>
                      <li>• Data retention settings</li>
                      <li>• Backup preferences</li>
                      <li>• Sync options</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Privacy Controls</h5>
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
                <h4 className="font-semibold text-gray-800">Settings Best Practices</h4>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Regularly review and update your notification preferences</li>
                <li>• Keep your profile information current and accurate</li>
                <li>• Use strong passwords and enable two-factor authentication</li>
                <li>• Customize your interface to match your workflow preferences</li>
                <li>• Review privacy settings to ensure they match your comfort level</li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Help Section
      "help": (
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
              The Help & Support module provides comprehensive documentation, tutorials, and support resources to help you get the most out of the Nexus LMD platform.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-semibold text-teal-800 mb-3">Documentation</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Access comprehensive guides and documentation for all platform features.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>User Guides:</strong> Step-by-step instructions for common tasks</li>
                  <li>• <strong>Feature Documentation:</strong> Detailed explanations of platform capabilities</li>
                  <li>• <strong>Best Practices:</strong> Tips and recommendations for optimal usage</li>
                  <li>• <strong>FAQ Section:</strong> Answers to frequently asked questions</li>
                  <li>• <strong>Video Tutorials:</strong> Visual guides for complex features</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">Learning Resources</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Enhance your skills with comprehensive learning materials and training resources.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Training Modules:</strong> Structured learning paths for different roles</li>
                  <li>• <strong>Interactive Tutorials:</strong> Hands-on learning experiences</li>
                  <li>• <strong>Knowledge Base:</strong> Searchable repository of helpful articles</li>
                  <li>• <strong>Webinars:</strong> Live training sessions and demonstrations</li>
                  <li>• <strong>Certification Programs:</strong> Earn credentials for platform expertise</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">Support Channels</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Multiple ways to get assistance when you need help.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Live Chat:</strong> Real-time assistance from support specialists</li>
                  <li>• <strong>Email Support:</strong> Detailed help requests and responses</li>
                  <li>• <strong>Phone Support:</strong> Direct communication for urgent issues</li>
                  <li>• <strong>Community Forum:</strong> Connect with other users and share solutions</li>
                  <li>• <strong>Ticket System:</strong> Track and manage support requests</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">Self-Service Tools</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Tools and resources to help you solve problems independently.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Troubleshooting</h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Diagnostic tools</li>
                      <li>• Error code lookup</li>
                      <li>• Common solutions</li>
                      <li>• Problem reporting</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Resources</h5>
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
                <h4 className="font-semibold text-teal-800">Getting Help Tips</h4>
              </div>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• Check the documentation first for common questions and solutions</li>
                <li>• Use the search function to quickly find relevant help articles</li>
                <li>• Join the community forum to connect with other users</li>
                <li>• Provide detailed information when contacting support</li>
                <li>• Take advantage of training resources to improve your skills</li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Metrics Section
      "metrics": (
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
              The Metrics & Analytics module provides comprehensive tools for measuring performance, analyzing trends, and generating insights to drive data-driven decision making.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-pink-500 pl-4">
                <h4 className="font-semibold text-pink-800 mb-3">Performance Metrics</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Track and analyze key performance indicators across all aspects of your operations.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Production Metrics:</strong> OEE, throughput, efficiency, and quality scores</li>
                  <li>• <strong>Financial Metrics:</strong> Cost analysis, ROI, and budget tracking</li>
                  <li>• <strong>Operational Metrics:</strong> Cycle times, lead times, and capacity utilization</li>
                  <li>• <strong>Quality Metrics:</strong> Defect rates, rework, and customer satisfaction</li>
                  <li>• <strong>Safety Metrics:</strong> Incident rates, compliance scores, and risk assessments</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">Data Analysis</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Advanced analytics tools for deep insights and trend analysis.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Trend Analysis:</strong> Identify patterns and trends over time</li>
                  <li>• <strong>Comparative Analysis:</strong> Compare performance across periods and teams</li>
                  <li>• <strong>Root Cause Analysis:</strong> Investigate performance issues and bottlenecks</li>
                  <li>• <strong>Predictive Analytics:</strong> Forecast future performance and trends</li>
                  <li>• <strong>Statistical Analysis:</strong> Advanced statistical methods and modeling</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-3">Reporting Tools</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Generate comprehensive reports and visualizations for stakeholders.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Custom Reports:</strong> Create tailored reports for specific needs</li>
                  <li>• <strong>Automated Reports:</strong> Schedule regular report generation and delivery</li>
                  <li>• <strong>Interactive Dashboards:</strong> Real-time visualizations and drill-down capabilities</li>
                  <li>• <strong>Export Options:</strong> Multiple formats for sharing and presentation</li>
                  <li>• <strong>Report Templates:</strong> Pre-built templates for common reporting needs</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">Business Intelligence</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Transform data into actionable business insights and recommendations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Insights</h5>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Performance insights</li>
                      <li>• Improvement opportunities</li>
                      <li>• Risk identification</li>
                      <li>• Best practices</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Recommendations</h5>
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
                <h4 className="font-semibold text-pink-800">Analytics Best Practices</h4>
              </div>
              <ul className="text-sm text-pink-700 space-y-1">
                <li>• Focus on metrics that directly impact your business objectives</li>
                <li>• Establish baseline measurements to track improvement over time</li>
                <li>• Use visualizations to make complex data more understandable</li>
                <li>• Regularly review and update your key performance indicators</li>
                <li>• Share insights with stakeholders to drive collaborative improvement</li>
              </ul>
            </div>
          </div>
        </div>
      ),

      // Chat Section
      "chat": (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Team Chat
            </h2>
            <p className="text-gray-600">
              Real-time team communication and collaboration
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Team Chat Overview
            </h3>
            <p className="text-gray-600 mb-6">
              The Team Chat module provides comprehensive tools for real-time communication, file sharing, and team collaboration across your organization.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-cyan-500 pl-4">
                <h4 className="font-semibold text-cyan-800 mb-3">Chat Basics</h4>
                <p className="text-sm text-gray-600 mb-3">
                  WhatsApp-style team communication with advanced features for professional collaboration.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Real-time Messaging:</strong> Instant communication with team members</li>
                  <li>• <strong>Group Conversations:</strong> Create and manage team-specific chat rooms</li>
                  <li>• <strong>Message Threading:</strong> Organize discussions by topic or project</li>
                  <li>• <strong>Read Receipts:</strong> Track message delivery and read status</li>
                  <li>• <strong>Message Search:</strong> Find specific conversations or information quickly</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-3">File Sharing</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Secure and efficient file sharing capabilities for team collaboration.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Document Upload:</strong> Share files directly in chat conversations</li>
                  <li>• <strong>File Management:</strong> Organize and categorize shared documents</li>
                  <li>• <strong>Version Control:</strong> Track document changes and updates</li>
                  <li>• <strong>Access Control:</strong> Manage permissions for sensitive files</li>
                  <li>• <strong>Storage Integration:</strong> Connect with cloud storage services</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-3">Video & Audio Calls</h4>
                <p className="text-sm text-gray-600 mb-3">
                  High-quality communication tools for remote collaboration and team meetings.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>HD Video Calls:</strong> Crystal clear video communication</li>
                  <li>• <strong>Audio Conferencing:</strong> High-quality voice calls with noise cancellation</li>
                  <li>• <strong>Screen Sharing:</strong> Present documents and applications in real-time</li>
                  <li>• <strong>Meeting Recording:</strong> Capture important discussions for later reference</li>
                  <li>• <strong>Virtual Backgrounds:</strong> Professional appearance in any environment</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800 mb-3">Contact Management</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Efficient organization and management of team contacts and communication preferences.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">Contact Organization</h5>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Department-based grouping</li>
                      <li>• Project team associations</li>
                      <li>• Role-based categorization</li>
                      <li>• Custom contact lists</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">Communication Preferences</h5>
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
                <h4 className="font-semibold text-cyan-800">Chat Best Practices</h4>
              </div>
              <ul className="text-sm text-cyan-700 space-y-1">
                <li>• Use appropriate communication channels for different types of messages</li>
                <li>• Set clear expectations for response times and availability</li>
                <li>• Organize conversations by project or topic for better clarity</li>
                <li>• Use file sharing for document collaboration instead of email attachments</li>
                <li>• Schedule regular team meetings to maintain alignment and engagement</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    };

    return helpContent[section] || helpContent["getting-started"];
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        {renderHelpContent(selectedSection)}
      </div>
    </div>
  );
};

export default HelpRightCard;
