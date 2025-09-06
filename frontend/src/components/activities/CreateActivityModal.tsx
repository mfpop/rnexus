import React, { useState } from "react";
import {
  X,
  User,
  Target,
  CheckSquare,
  Plus,
  Trash2,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { useActivities, Activity } from "./ActivitiesContext";
import { activitiesApi } from "../../lib/activitiesApi";

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  due_date: Date;
  completed: boolean;
}

interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  assignee?: { id: string; username: string; email: string };
}

interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { refreshActivities } = useActivities();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  type: "Projects",
    priority: "medium" as Activity["priority"],
    start_date: new Date(),
    due_date: new Date(Date.now() + 3600000), // 1 hour from now
    owner: { id: "user-001", username: "mihai", email: "mihai@nexus.com" },
    project: undefined,
    production_reference: undefined,
    tags: [""],
    category: "",
    cost: 0,
  risk_level: "low",
    completion_criteria: [""],
    milestones: [],
    checklists: [],
    time_logs: [],
    notes: "",
    created_by: { id: "user-001", username: "mihai", email: "mihai@nexus.com" },
  });

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [activeTab, setActiveTab] = useState<"basic" | "advanced" | "milestones" | "checklists">("basic");

  // Map to the Activity.type union defined in ActivitiesContext
  const activityTypes: { value: Activity["type"]; label: string; icon: React.ReactNode }[] = [
    { value: "Projects", label: "Standalone", icon: <Target className="h-4 w-4" /> },
    { value: "Projects", label: "Project Related", icon: <User className="h-4 w-4" /> },
    { value: "Production", label: "Production Related", icon: <AlertTriangle className="h-4 w-4" /> },
  ];

  const priorityLevels: { value: Activity["priority"]; label: string; color: string }[] = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-800" },
    { value: "high", label: "High", color: "bg-amber-100 text-amber-800" },
    { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
  ];

  // risk levels are application-defined strings; use a generic string type here
  const riskLevels: { value: string; label: string; color: string }[] = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item: string, i: number) =>
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), ""]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: "",
      description: "",
      due_date: new Date(),
      completed: false,
    };
    setMilestones([...milestones, newMilestone]);
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    const updatedMilestones = [...milestones];
    // ensure we keep a valid Milestone shape when updating a single field
    updatedMilestones[index] = ({ ...updatedMilestones[index], [field]: value } as Milestone);
    setMilestones(updatedMilestones);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const addChecklist = () => {
    const newChecklist: Checklist = {
      id: `checklist-${Date.now()}`,
      title: "",
      items: [{ id: `item-${Date.now()}`, description: "", completed: false }],
    };
    setChecklists([...checklists, newChecklist]);
  };

  const updateChecklist = (checklistIndex: number, field: keyof Checklist, value: any) => {
    const updatedChecklists = [...checklists];
    updatedChecklists[checklistIndex] = ({ ...updatedChecklists[checklistIndex], [field]: value } as Checklist);
    setChecklists(updatedChecklists);
  };

  const addChecklistItem = (checklistIndex: number) => {
    const updatedChecklists = [...checklists];
    const checklist = updatedChecklists[checklistIndex];
    if (!checklist) return;
    if (!checklist.items) checklist.items = [];
    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      description: "",
      completed: false,
    };
    checklist.items.push(newItem);
    setChecklists(updatedChecklists);
  };

  const updateChecklistItem = (checklistIndex: number, itemIndex: number, field: keyof ChecklistItem, value: any) => {
    const updatedChecklists = [...checklists];
    const checklist = updatedChecklists[checklistIndex];
    if (!checklist || !checklist.items) return;
    checklist.items[itemIndex] = ({ ...checklist.items[itemIndex], [field]: value } as ChecklistItem);
    setChecklists(updatedChecklists);
  };

  const removeChecklistItem = (checklistIndex: number, itemIndex: number) => {
    const updatedChecklists = [...checklists];
    const checklist = updatedChecklists[checklistIndex];
    if (!checklist || !checklist.items) return;
    checklist.items = checklist.items.filter((_, i) => i !== itemIndex);
    setChecklists(updatedChecklists);
  };

  const removeChecklist = (index: number) => {
    setChecklists(checklists.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty values from arrays
    const cleanFormData = {
      ...formData,
      tags: formData.tags.filter(item => item.trim() !== ""),
      completion_criteria: formData.completion_criteria.filter(item => item.trim() !== ""),
    };

    // Filter out empty milestones and checklists
    const cleanMilestones = milestones.filter(m => m.title.trim() !== "" && m.description.trim() !== "");
    const cleanChecklists = checklists.filter(c => c.title.trim() !== "" && c.items.some(item => item.description.trim() !== ""));

    // The ActivitiesContext Activity type is narrower than the UI payload.
    // Create a backend-friendly payload and call the API directly, then refresh context.
    const newActivity: any = {
      title: cleanFormData.title,
      description: cleanFormData.description,
      type: cleanFormData.type,
      status: "planned",
      priority: cleanFormData.priority,
      startTime: cleanFormData.start_date,
      endTime: cleanFormData.due_date,
      assignedTo: cleanFormData.owner?.id,
      assignedBy: cleanFormData.created_by?.id,
      location: cleanFormData.production_reference || cleanFormData.project,
      notes: cleanFormData.notes,
      tags: cleanFormData.tags,
      cost: cleanFormData.cost,
      risk_level: cleanFormData.risk_level,
      milestones: cleanMilestones,
      checklists: cleanChecklists,
      time_logs: [],
      attachments: [],
    };

    // create via API and refresh context
    try {
      await activitiesApi.createActivity(newActivity as any);
      // refreshActivities may be provided by context; call defensively
      if (typeof refreshActivities === "function") {
        await refreshActivities();
      }
    } catch (err) {
      console.error('Failed to create activity', err);
    }

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "standalone",
      priority: "medium",
      start_date: new Date(),
      due_date: new Date(Date.now() + 3600000),
      owner: { id: "user-001", username: "mihai", email: "mihai@nexus.com" },
      project: undefined,
      production_reference: undefined,
      tags: [""],
      category: "",
      cost: 0,
      risk_level: "low",
      completion_criteria: [""],
      milestones: [],
      checklists: [],
          time_logs: [],
    notes: "",
    created_by: { id: "user-001", username: "mihai", email: "mihai@nexus.com" },
  });
    setMilestones([]);
    setChecklists([]);
    setActiveTab("basic");
  };

  if (!isOpen) return null;

  return (
    <div data-testid="create-activity-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Activity</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { key: "basic", label: "Basic Info", icon: <User className="h-4 w-4" /> },
            { key: "advanced", label: "Advanced", icon: <Settings className="h-4 w-4" /> },
            { key: "milestones", label: "Milestones", icon: <Target className="h-4 w-4" /> },
            { key: "checklists", label: "Checklists", icon: <CheckSquare className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.key
                  ? "text-blue-600 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 border-transparent"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === "basic" && (
              <div className="space-y-6">
                {/* Title and Description */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter activity title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe the activity"
                    />
                  </div>
                </div>

                {/* Type and Priority */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {activityTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <select
                      required
                      value={formData.priority}
                      onChange={(e) => handleInputChange("priority", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {priorityLevels.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.start_date.toISOString().slice(0, 16)}
                      onChange={(e) => handleInputChange("start_date", new Date(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.due_date.toISOString().slice(0, 16)}
                      onChange={(e) => handleInputChange("due_date", new Date(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>







                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ""}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional notes"
                  />
                </div>
              </div>
            )}

            {activeTab === "advanced" && (
              <div className="space-y-6">
                {/* Category and Cost */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter category"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Cost ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => handleInputChange("cost", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Risk Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Level
                  </label>
                  <select
                                          value={formData.risk_level}
                      onChange={(e) => handleInputChange("risk_level", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {riskLevels.map((risk) => (
                      <option key={risk.value} value={risk.value}>
                        {risk.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleArrayInputChange("tags", index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter tag"
                      />
                      {formData.tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem("tags", index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("tags")}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-4 w-4" />
                    Add Tag
                  </button>
                </div>



                {/* Completion Criteria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Completion Criteria
                  </label>
                  {formData.completion_criteria.map((criteria, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={criteria}
                        onChange={(e) => handleArrayInputChange("completion_criteria", index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter completion criteria"
                      />
                      {formData.completion_criteria.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem("completion_criteria", index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("completion_criteria")}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-4 w-4" />
                    Add Criteria
                  </button>
                </div>
              </div>
            )}

            {activeTab === "milestones" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Milestones</h3>
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Milestone
                  </button>
                </div>

                {milestones.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No milestones defined</p>
                    <p className="text-sm">Add milestones to track progress</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <div key={milestone.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">Milestone {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeMilestone(index)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(index, "title", e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Milestone title"
                          />
                          <textarea
                            value={milestone.description}
                            onChange={(e) => updateMilestone(index, "description", e.target.value)}
                            rows={2}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Milestone description"
                          />
                          <input
                            type="datetime-local"
                            value={milestone.due_date.toISOString().slice(0, 16)}
                            onChange={(e) => updateMilestone(index, "due_date", new Date(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "checklists" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Checklists</h3>
                  <button
                    type="button"
                    onClick={addChecklist}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Checklist
                  </button>
                </div>

                {checklists.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No checklists defined</p>
                    <p className="text-sm">Add checklists to track tasks</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {checklists.map((checklist, checklistIndex) => (
                      <div key={checklist.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <input
                            type="text"
                            value={checklist.title}
                            onChange={(e) => updateChecklist(checklistIndex, "title", e.target.value)}
                            className="text-lg font-medium text-gray-900 bg-transparent border-none focus:ring-0 px-0 py-0"
                            placeholder="Checklist title"
                          />
                          <button
                            type="button"
                            onClick={() => removeChecklist(checklistIndex)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="space-y-2">
                          {checklist.items.map((item, itemIndex) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={(e) => updateChecklistItem(checklistIndex, itemIndex, "completed", e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateChecklistItem(checklistIndex, itemIndex, "description", e.target.value)}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Item description"
                              />
                              <input
                                type="text"
                                value={item.assignee?.username || ""}
                                onChange={(e) => updateChecklistItem(checklistIndex, itemIndex, "assignee", { id: "user-001", username: e.target.value, email: "user@example.com" })}
                                className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Assigned to"
                              />
                              {checklist.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeChecklistItem(checklistIndex, itemIndex)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => addChecklistItem(checklistIndex)}
                          className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Plus className="h-4 w-4" />
                          Add Item
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset Form
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateActivityModal;
