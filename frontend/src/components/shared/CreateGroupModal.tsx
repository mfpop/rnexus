import React, { useState } from "react";
import { X, Users, Plus } from "lucide-react";
import Button from "../ui/Button";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupData: {
    name: string;
    description: string;
    members: string[];
  }) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: groupName.trim(),
        description: description.trim(),
        members: members.filter((member) => member.trim()),
      });

      // Reset form
      setGroupName("");
      setDescription("");
      setMembers([""]);
      onClose();
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMember = () => {
    setMembers([...members, ""]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 transform transition-all duration-300 ease-out scale-100 opacity-100">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-100 to-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Group
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Set up a new team group
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Group Name */}
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Group Name *
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter group name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Describe the group's purpose"
            />
          </div>

          {/* Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Group Members
            </label>
            <div className="space-y-3">
              {members.map((member, index) => (
                <div key={index} className="flex space-x-3">
                  <input
                    type="email"
                    value={member}
                    onChange={(e) => updateMember(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="member@example.com"
                  />
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 flex items-center justify-center"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addMember}
                className="flex items-center space-x-3 text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-4 py-3 rounded-xl transition-all duration-200 w-full justify-center"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">Add Member</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 py-3 text-base font-medium rounded-xl"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 py-3 text-base font-medium rounded-xl"
              disabled={!groupName.trim() || isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
