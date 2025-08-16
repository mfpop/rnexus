import React, { useState } from "react";
import {
  Search,
  Calendar,
  CheckCircle,
  Play,
  Pause,
  AlertTriangle,
  ArrowUpDown,
} from "lucide-react";
import { SimpleProgress } from "../ui/bits/SimpleProgress";
import { Input } from "../ui/bits/Input";
import { Button } from "../ui/bits/Button";
import { SimpleSelect } from "../ui/bits/SimpleSelect";
import { useProjectsContext, Project } from "./ProjectsContext";

/**
 * ProjectsLeftCardSimple - Simple projects list for StableLayout integration
 */
const ProjectsLeftCardSimple: React.FC = () => {
  const { selectedProject, setSelectedProject } = useProjectsContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "active" | "planning" | "completed"
  >("all");
  const [sortBy, setSortBy] = useState<
    "name" | "progress" | "priority" | "deadline"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const projects: Project[] = [
    {
      id: "proj-001",
      name: "Production Line Automation",
      description: "Implementing automated production systems",
      status: "active",
      priority: "high",
      progress: 68,
      manager: "Sarah Johnson",
      team: ["Sarah Johnson", "Mike Chen", "Lisa Wilson"],
      startDate: new Date(Date.now() - 86400000 * 60),
      endDate: new Date(Date.now() + 86400000 * 30),
      budget: 500000,
      spent: 340000,
      milestones: [],
      tasks: [],
    },
    {
      id: "proj-002",
      name: "Quality Management System Upgrade",
      description: "Upgrading QMS to meet latest ISO standards",
      status: "planning",
      priority: "medium",
      progress: 15,
      manager: "John Smith",
      team: ["John Smith", "QC Team"],
      startDate: new Date(Date.now() + 86400000 * 30),
      endDate: new Date(Date.now() + 86400000 * 120),
      budget: 200000,
      spent: 30000,
      milestones: [],
      tasks: [],
    },
    {
      id: "proj-003",
      name: "Energy Efficiency Initiative",
      description: "Reducing energy consumption across all facilities",
      status: "active",
      priority: "medium",
      progress: 42,
      manager: "Emily Wilson",
      team: ["Emily Wilson", "Facilities Team"],
      startDate: new Date(Date.now() - 86400000 * 30),
      endDate: new Date(Date.now() + 86400000 * 90),
      budget: 150000,
      spent: 63000,
      milestones: [],
      tasks: [],
    },
    {
      id: "proj-004",
      name: "Safety Training Program",
      description: "Comprehensive safety training for all employees",
      status: "completed",
      priority: "high",
      progress: 100,
      manager: "Mike Davis",
      team: ["Mike Davis", "HR Team", "Safety Officers"],
      startDate: new Date(Date.now() - 86400000 * 90),
      endDate: new Date(Date.now() - 86400000 * 10),
      budget: 75000,
      spent: 74500,
      milestones: [],
      tasks: [],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4" />;
      case "planning":
        return <Calendar className="h-4 w-4" />;
      case "on-hold":
        return <Pause className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const sortedAndFilteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.manager.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || project.status === activeTab;
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "progress":
          aValue = a.progress;
          bValue = b.progress;
          break;
        case "priority":
          const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case "deadline":
          aValue = a.endDate.getTime();
          bValue = b.endDate.getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            placeholder="Search projects..."
          />
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex items-center gap-2">
          <SimpleSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-[140px]"
          >
            <option value="name">Name</option>
            <option value="progress">Progress</option>
            <option value="priority">Priority</option>
            <option value="deadline">Deadline</option>
          </SimpleSelect>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-3"
            title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {[
          { key: "all", label: "All" },
          { key: "active", label: "Active" },
          { key: "planning", label: "Planning" },
          { key: "completed", label: "Completed" },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-shrink-0 rounded-none border-b-2 ${
              activeTab === tab.key
                ? "border-blue-600 bg-blue-50"
                : "border-transparent"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto">
        {sortedAndFilteredProjects.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">
              <Search className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-gray-500">No projects found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          sortedAndFilteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
                selectedProject?.id === project.id
                  ? "bg-blue-50 border-blue-200"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-3 h-3 rounded-full mt-1 ${getPriorityColor(project.priority).replace("text-", "bg-")}`}
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(project.status)}
                        <span>
                          {project.status.charAt(0).toUpperCase() +
                            project.status.slice(1)}
                        </span>
                      </div>
                    </span>
                  </div>

                  <div className="space-y-1 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Manager:</span>
                      <span className="font-medium">{project.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                  </div>

                  <div className="mb-2">
                    <SimpleProgress
                      value={project.progress}
                      variant="default"
                      size="default"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsLeftCardSimple;
