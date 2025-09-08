import { useMemo } from "react";
import { useQuery } from "@apollo/client";
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
import { GET_ALL_ACTIVITIES } from "../../graphql/activities";

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
 * Fetches activities from GraphQL API and transforms them for display
 */
export const useHomeActivities = (): ActivityItem[] => {
  const { data, loading, error } = useQuery(GET_ALL_ACTIVITIES, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  return useMemo(() => {
    if (loading || error || !data?.allActivities) {
      return [];
    }

    // Transform GraphQL activities to ActivityItem format
    return data.allActivities.slice(0, 6).map((activity: any) => ({
      id: activity.id,
      title: activity.title,
      status: mapActivityStatus(activity.status),
      priority: mapActivityPriority(activity.priority),
      timestamp: formatTimestamp(activity.createdAt || activity.updatedAt),
      icon: getActivityIcon(activity.type),
      description: activity.description,
      assignee: activity.assignedTo,
      category: activity.type,
    }));
  }, [data, loading, error]);
};

// Helper function to map GraphQL status to ActivityItem status
const mapActivityStatus = (status: string): 'completed' | 'in-progress' | 'scheduled' | 'cancelled' => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'done':
    case 'finished':
      return 'completed';
    case 'in-progress':
    case 'in_progress':
    case 'active':
    case 'ongoing':
      return 'in-progress';
    case 'scheduled':
    case 'pending':
    case 'planned':
      return 'scheduled';
    case 'cancelled':
    case 'canceled':
    case 'abandoned':
      return 'cancelled';
    default:
      return 'scheduled';
  }
};

// Helper function to map GraphQL priority to ActivityItem priority
const mapActivityPriority = (priority: string): 'high' | 'medium' | 'low' => {
  switch (priority?.toLowerCase()) {
    case 'high':
    case 'urgent':
    case 'critical':
      return 'high';
    case 'medium':
    case 'normal':
    case 'moderate':
      return 'medium';
    case 'low':
    case 'minor':
      return 'low';
    default:
      return 'medium';
  }
};

// Helper function to format timestamp
const formatTimestamp = (timestamp: string): string => {
  if (!timestamp) return 'Just now';

  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};

// Helper function to get appropriate icon for activity type
const getActivityIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'production':
    case 'manufacturing':
      return <Factory className="h-4 w-4" />;
    case 'meeting':
    case 'conference':
      return <Users className="h-4 w-4" />;
    case 'task':
    case 'assignment':
      return <ClipboardList className="h-4 w-4" />;
    case 'maintenance':
    case 'repair':
      return <Settings className="h-4 w-4" />;
    case 'quality':
    case 'inspection':
      return <BarChart3 className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
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
