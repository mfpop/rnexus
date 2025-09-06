// src/components/auth/profile/WorkExperienceSection.tsx

import React, { useState, useEffect } from 'react';
import { Building, Plus, Trash2 } from 'lucide-react';
import { Input } from '../../ui/bits';
import { useAutosave } from './ProfileAutosaveProvider';

interface WorkExperienceItem {
  id?: string;
  company?: string;
  position?: string;
  start_date?: string;
  end_date?: string;
  current?: boolean;
  description?: string;
  location?: string;
}

interface WorkExperienceData {
  work_experience?: WorkExperienceItem[];
}

interface WorkExperienceSectionProps {
  data: WorkExperienceData;
  onChange: (field: keyof WorkExperienceData, value: WorkExperienceItem[]) => void;
}

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  data,
  onChange
}) => {
  const { autosaveField, isAutosaving } = useAutosave();
  const [localData, setLocalData] = useState<WorkExperienceData>(data);

  // Update local state when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleWorkExperienceChange = (workExperience: WorkExperienceItem[]) => {
    const newData = { ...localData, work_experience: workExperience };
    setLocalData(newData);
    onChange('work_experience', workExperience);
    autosaveField('work_experience', workExperience);
  };

  const addWorkExperience = () => {
    const newWorkExperience = [...(localData.work_experience || []), {
      company: '',
      position: '',
      start_date: '',
      end_date: '',
      current: false,
      description: '',
      location: ''
    }];
    handleWorkExperienceChange(newWorkExperience);
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperienceItem, value: string | boolean) => {
    const workExperience = [...(localData.work_experience || [])];
    workExperience[index] = { ...workExperience[index], [field]: value };
    handleWorkExperienceChange(workExperience);
  };

  const removeWorkExperience = (index: number) => {
    const workExperience = [...(localData.work_experience || [])];
    workExperience.splice(index, 1);
    handleWorkExperienceChange(workExperience);
  };

  const workExperience = localData.work_experience || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Building className="w-5 h-5 mr-2 text-purple-600" />
            Work Experience
          </h3>
          <button
            onClick={addWorkExperience}
            className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>
      </div>
      <div className="p-4">
        {workExperience.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No work experience added yet</p>
            <button
              onClick={addWorkExperience}
              className="mt-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              Add your first work experience
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {workExperience.map((work, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">Experience #{index + 1}</h4>
                  <button
                    onClick={() => removeWorkExperience(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <Input
                      type="text"
                      value={work.company || ""}
                      onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                      className="w-full"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <Input
                      type="text"
                      value={work.position || ""}
                      onChange={(e) => updateWorkExperience(index, "position", e.target.value)}
                      className="w-full"
                      placeholder="Job title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Input
                      type="text"
                      value={work.location || ""}
                      onChange={(e) => updateWorkExperience(index, "location", e.target.value)}
                      className="w-full"
                      placeholder="City, State/Country"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`current-${index}`}
                      checked={work.current || false}
                      onChange={(e) => updateWorkExperience(index, "current", e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor={`current-${index}`} className="text-sm font-medium text-gray-700">
                      Current Position
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <Input
                      type="month"
                      value={work.start_date || ""}
                      onChange={(e) => updateWorkExperience(index, "start_date", e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <Input
                      type={work.current ? "text" : "month"}
                      value={work.current ? "Present" : (work.end_date || "")}
                      onChange={(e) => updateWorkExperience(index, "end_date", e.target.value)}
                      className="w-full"
                      disabled={work.current}
                      placeholder={work.current ? "Present" : ""}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={work.description || ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateWorkExperience(index, "description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Describe your responsibilities and achievements"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Autosave Status */}
        {isAutosaving && (
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Saving...
          </div>
        )}
      </div>
    </div>
  );
};
