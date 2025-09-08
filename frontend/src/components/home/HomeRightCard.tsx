import React from "react";
import {
  Activity,
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Target,
  Lightbulb,
  FolderKanban,
} from "lucide-react";

/**
 * HomeRightCard - Home page specific right card content component
 * Based on home.md specifications with exact layout and data
 * Contains Stats Grid, Recent Activities, and Latest Innovations
 */
const HomeRightCard: React.FC = () => {
  // Stats data from home.md - exact current values
  const stats = [
    {
      id: 1,
      title: "Production Efficiency",
      value: "94.2%",
      change: "+2.1%",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-teal-600",
    },
    {
      id: 2,
      title: "Quality Score",
      value: "98.7%",
      change: "+0.5%",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-teal-600",
    },
    {
      id: 3,
      title: "Active Orders",
      value: "156",
      change: "+12",
      icon: <Activity className="h-5 w-5" />,
      color: "text-teal-600",
    },
    {
      id: 4,
      title: "Team Performance",
      value: "92.3%",
      change: "+1.8%",
      icon: <Users className="h-5 w-5" />,
      color: "text-teal-600",
    },
  ];

  // Activities data - should come from GraphQL/backend
  const activities: any[] = [];

  // Innovations data from home.md - exact current content plus new project and activities cards
  const innovations = [
    {
      id: 1,
      title: "Production Flow Optimized",
      description:
        "We've streamlined task assignments and resource allocation, reducing bottlenecks and boosting throughput. Check the new Kanban board for real-time progress! Interactive workflow visualization enables quick identification of process delays. Smart priority queuing automatically adjusts task order based on urgency and dependencies. Cross-functional team coordination tools ensure seamless handoffs between departments.",
      badge: "Optimization",
      badgeColor: "bg-gray-200 text-gray-700",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      id: 2,
      title: "Team Collaboration Enhanced",
      description:
        "Collaborate seamlessly with improved team chat, shared task lists, and instant notifications—empowering everyone to solve issues faster and drive continuous improvement. Real-time document sharing with version control keeps everyone synchronized. Mobile-friendly interface allows floor workers to stay connected on the go. Integrated video calling facilitates quick problem-solving sessions across shifts.",
      badge: "Collaboration",
      badgeColor: "bg-gray-200 text-gray-700",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: 3,
      title: "Lean Manufacturing Focus",
      description:
        "Explore new lean tools: waste tracking, root cause analysis, and visual dashboards to support Kaizen initiatives and maximize plant efficiency. Digital lean board streamlines workplace organization and standardization efforts. Automated value stream mapping identifies improvement opportunities in real-time. Predictive maintenance scheduling reduces unplanned downtime and extends equipment lifespan.",
      badge: "Lean Tools",
      badgeColor: "bg-gray-200 text-gray-700",
      icon: <Target className="h-4 w-4" />,
    },
    {
      id: 4,
      title: "Smart Analytics Integration",
      description:
        "Predictive analytics platform using machine learning and IoT sensors to monitor equipment performance. Advanced pattern recognition identifies potential failures before they occur. Customizable dashboards provide real-time insights into production metrics and KPIs. Automated reporting generates actionable insights for management decision-making processes.",
      badge: "Analytics",
      badgeColor: "bg-gray-200 text-gray-700",
      icon: <Lightbulb className="h-4 w-4" />,
    },
    {
      id: 5,
      title: "Project & Activity Management",
      description:
        "Unified workspace for project tracking and activity monitoring with intelligent milestone detection and automated progress reporting. Enhanced Gantt charts with dependency visualization, critical path analysis, and smart categorization. Real-time team collaboration with integrated task assignments, deadline tracking, and workflow optimization. Mobile-first design enables updates from production floor while predictive scheduling reduces conflicts.",
      badge: "Projects & Activities",
      badgeColor: "bg-gray-200 text-gray-700",
      icon: <FolderKanban className="h-4 w-4" />,
    },
  ];

  // Status and Priority Color Functions from home.md
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gray-200 text-gray-800";
      case "in-progress":
        return "bg-gray-200 text-gray-800";
      case "scheduled":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-gray-200 text-gray-800";
      case "medium":
        return "bg-gray-200 text-gray-800";
      case "low":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div
      data-testid="home-rightcard"
      className="space-y-6 p-4 h-full w-full flex flex-col"
    >
      {/* 1. Stats Grid - Exact structure from home.md */}
      <div className="grid grid-cols-4 gap-2 mb-6 w-full">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white p-2 rounded-lg border border-gray-200 hover:shadow-md transition-shadow h-16 flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`p-1 rounded bg-gray-50 ${stat.color} flex-shrink-0`}
              >
                {React.cloneElement(stat.icon, { className: "h-4 w-4" })}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800 leading-tight whitespace-nowrap">
                  {stat.value}
                </h3>
                <p className="text-xs text-gray-600 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                  {stat.title}
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-green-600 flex-shrink-0 ml-1">
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Main Content Layout - Side by Side */}
      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* 3. Recent Activities (Left Side) */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-teal-600" />
              Recent Activities
            </h3>
          </div>
          <div className="p-3 flex-1 overflow-hidden flex flex-col justify-evenly">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* First Row - Icon and Title */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-shrink-0 p-1 rounded bg-teal-50 text-teal-600">
                    {activity.icon}
                  </div>
                  <h4 className="text-sm font-medium text-gray-800 flex-1">
                    {activity.title}
                  </h4>
                </div>
                {/* Second Row - Status Tags and Timestamp */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}
                    >
                      {activity.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full ${getPriorityColor(activity.priority)}`}
                    >
                      {activity.priority}
                    </span>
                  </div>
                  <span className="text-gray-500">{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Latest Innovations (Right Side) */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-teal-600" />
              Latest Innovations
            </h3>
          </div>
          <div className="p-2 pb-6 flex-1 overflow-hidden">
            <div className="grid gap-2">
              {innovations.map((innovation) => (
                <div
                  key={innovation.id}
                  className={`p-2 rounded-lg hover:shadow-sm transition-shadow ${innovation.id === 5 ? "mb-4" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 p-1 rounded-lg bg-teal-50 text-teal-600">
                      {innovation.icon}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-semibold text-gray-800">
                          {innovation.title}
                        </h4>
                        <span
                          className={`px-1 py-0.5 text-xs rounded-full ${innovation.badgeColor} flex-shrink-0 ml-2`}
                        >
                          {innovation.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-tight text-justify">
                        {innovation.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeRightCard;
