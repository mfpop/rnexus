import { useMemo } from "react";
import {
  Activity,
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Target,
  Lightbulb,
  FolderKanban,
  Newspaper,
  ClipboardList,
  Factory,
  MessageSquare,
  Monitor,
  Settings,
  HelpCircle,
  Phone
} from "lucide-react";
import {
  NavigationItem,
  StatCard,
  ActivityItem,
  InnovationCard
} from "./types";

/**
 * Custom hook for home page navigation data
 * Centralizes navigation configuration for better maintainability
 */
export const useHomeNavigation = (): NavigationItem[] => {
  return useMemo(() => [
    {
      id: "news",
      title: "News & Updates",
      description: "Stay informed with latest updates and announcements",
      path: "/news",
      icon: <Newspaper className="h-4 w-4" />,
      category: "information"
    },
    {
      id: "activities",
      title: "Activity Management",
      description: "Track and manage ongoing activities",
      path: "/activities",
      icon: <ClipboardList className="h-4 w-4" />,
      category: "management"
    },
    {
      id: "production",
      title: "Production Monitoring",
      description: "Monitor production metrics and performance",
      path: "/production",
      icon: <Factory className="h-4 w-4" />,
      category: "operations"
    },
    {
      id: "chat",
      title: "Chat & Communication",
      description: "Team communication and messaging",
      path: "/chat",
      icon: <MessageSquare className="h-4 w-4" />,
      category: "communication"
    },
    {
      id: "system",
      title: "System Administration",
      description: "System management and configuration",
      path: "/system",
      icon: <Monitor className="h-4 w-4" />,
      category: "administration"
    },
    {
      id: "settings",
      title: "Settings & Configuration",
      description: "Configure application preferences and options",
      path: "/settings",
      icon: <Settings className="h-4 w-4" />,
      category: "configuration"
    },
    {
      id: "help",
      title: "Help & Support",
      description: "Get help and access documentation",
      path: "/help",
      icon: <HelpCircle className="h-4 w-4" />,
      category: "support"
    },
    {
      id: "contact",
      title: "Contact",
      description: "Get in touch with our support team",
      path: "/contact",
      icon: <Phone className="h-4 w-4" />,
      category: "support"
    }
  ], []);
};

/**
 * Custom hook for home page statistics data
 * Provides reactive stats data with proper typing
 */
export const useHomeStats = (): StatCard[] => {
  return useMemo(() => [
    {
      id: 1,
      title: "Production Efficiency",
      value: "94.2%",
      change: "+2.1%",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-teal-600",
      trend: "up" as const,
      category: "production"
    },
    {
      id: 2,
      title: "Quality Score",
      value: "98.7%",
      change: "+0.5%",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-teal-600",
      trend: "up" as const,
      category: "quality"
    },
    {
      id: 3,
      title: "Active Orders",
      value: "156",
      change: "+12",
      icon: <Activity className="h-5 w-5" />,
      color: "text-teal-600",
      trend: "up" as const,
      category: "orders"
    },
    {
      id: 4,
      title: "Team Performance",
      value: "92.3%",
      change: "+1.8%",
      icon: <Users className="h-5 w-5" />,
      color: "text-teal-600",
      trend: "up" as const,
      category: "team"
    }
  ], []);
};

/**
 * Custom hook for home page activities data
 * Returns empty array - activities should come from GraphQL/backend
 */
export const useHomeActivities = (): ActivityItem[] => {
  return useMemo(() => [], []);
};

/**
 * Custom hook for home page innovations data
 * Provides latest innovations and improvements with categorization
 */
export const useHomeInnovations = (): InnovationCard[] => {
  return useMemo(() => [
    {
      id: 1,
      title: "Production Flow Optimized",
      description: "We've streamlined task assignments and resource allocation, reducing bottlenecks and boosting throughput. Check the new Kanban board for real-time progress! Interactive workflow visualization enables quick identification of process delays.",
      badge: "Optimization",
      badgeColor: "bg-blue-100 text-blue-800",
      icon: <Zap className="h-4 w-4" />,
      category: "optimization",
      status: "active" as const
    },
    {
      id: 2,
      title: "Team Collaboration Enhanced",
      description: "Collaborate seamlessly with improved team chat, shared task lists, and instant notifications—empowering everyone to solve issues faster and drive continuous improvement.",
      badge: "Collaboration",
      badgeColor: "bg-green-100 text-green-800",
      icon: <Users className="h-4 w-4" />,
      category: "collaboration",
      status: "active" as const
    },
    {
      id: 3,
      title: "Lean Manufacturing Focus",
      description: "Explore new lean tools: waste tracking, root cause analysis, and visual dashboards to support Kaizen initiatives and maximize plant efficiency.",
      badge: "Lean Tools",
      badgeColor: "bg-purple-100 text-purple-800",
      icon: <Target className="h-4 w-4" />,
      category: "lean",
      status: "active" as const
    },
    {
      id: 4,
      title: "Smart Analytics Integration",
      description: "Predictive analytics platform using machine learning and IoT sensors to monitor equipment performance. Advanced pattern recognition identifies potential failures before they occur.",
      badge: "Analytics",
      badgeColor: "bg-yellow-100 text-yellow-800",
      icon: <Lightbulb className="h-4 w-4" />,
      category: "analytics",
      status: "planned" as const
    },
    {
      id: 5,
      title: "Project & Activity Management",
      description: "Unified workspace for project tracking and activity monitoring with intelligent milestone detection and automated progress reporting.",
      badge: "Projects & Activities",
      badgeColor: "bg-indigo-100 text-indigo-800",
      icon: <FolderKanban className="h-4 w-4" />,
      category: "management",
      status: "active" as const
    }
  ], []);
};
