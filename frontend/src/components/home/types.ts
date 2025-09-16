// Home page types and interfaces for better type safety and maintainability
import { ReactNode } from "react";

// Navigation item interface
export interface NavigationItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: ReactNode;
  category?: string;
  isActive?: boolean;
}

// Stats card interface
export interface StatCard {
  id: number;
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  category?: string;
}

// Activity item interface
export interface ActivityItem {
  id: number;
  title: string;
  status: 'completed' | 'in-progress' | 'scheduled' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  icon: ReactNode;
  description?: string;
  assignee?: string;
  category?: string;
}

// Innovation card interface
export interface InnovationCard {
  id: number;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  icon: ReactNode;
  category?: string;
  status?: 'active' | 'planned' | 'completed';
}

// Home page configuration
export interface HomePageConfig {
  title: string;
  subtitle: string;
  refreshInterval?: number;
  maxActivities?: number;
  maxInnovations?: number;
}

// Component props interfaces
export interface StatCardProps {
  stat: StatCard;
  className?: string;
  onClick?: (stat: StatCard) => void;
}

export interface ActivityItemProps {
  activity: ActivityItem;
  className?: string;
  onClick?: (activity: ActivityItem) => void;
}

export interface InnovationCardProps {
  innovation: InnovationCard;
  className?: string;
  onClick?: (innovation: InnovationCard) => void;
}

export interface NavigationItemProps {
  item: NavigationItem;
  className?: string;
  onClick?: (item: NavigationItem) => void;
}

// Status color mappings
export const STATUS_COLORS = {
  completed: "bg-green-100 text-green-800",
  'in-progress': "bg-blue-100 text-blue-800",
  scheduled: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800"
} as const;

export const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800"
} as const;
