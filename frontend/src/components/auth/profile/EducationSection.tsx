// src/components/auth/profile/EducationSection.tsx

import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { Input } from '../../ui/bits';
import { useAutosave } from './ProfileAutosaveProvider';

interface EducationItem {
  id?: string;
  institution?: string;
  degree?: string;
  field_of_study?: string;
  start_year?: string;
  end_year?: string;
  gpa?: string;
  description?: string;
}

interface EducationData {
  education?: EducationItem[];
}

interface EducationSectionProps {
  data: EducationData;
  onChange: (field: keyof EducationData, value: EducationItem[]) => void;
  errors?: Record<string, string>;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  data,
  onChange
}) => {
  const { autosaveField, isAutosaving } = useAutosave();
  const [localData, setLocalData] = useState<EducationData>(data);

  // Update local state when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleEducationChange = (education: EducationItem[]) => {
    const newData = { ...localData, education };
    setLocalData(newData);
    onChange('education', education);
    autosaveField('education', education);
  };

  const addEducation = () => {
    const newEducation = [...(localData.education || []), {
      institution: '',
      degree: '',
      field_of_study: '',
      start_year: '',
      end_year: '',
      gpa: '',
      description: ''
    }];
    handleEducationChange(newEducation);
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: string) => {
    const education = [...(localData.education || [])];
    education[index] = { ...education[index], [field]: value };
    handleEducationChange(education);
  };

  const removeEducation = (index: number) => {
    const education = [...(localData.education || [])];
    education.splice(index, 1);
    handleEducationChange(education);
  };

  const education = localData.education || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
            Education
          </h3>
          <button
            onClick={addEducation}
            className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        </div>
      </div>
      <div className="p-4">
        {education.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No education added yet</p>
            <button
              onClick={addEducation}
              className="mt-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              Add your first education
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">Education #{index + 1}</h4>
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                    <Input
                      type="text"
                      value={edu.institution || ""}
                      onChange={(e) => updateEducation(index, "institution", e.target.value)}
                      className="w-full"
                      placeholder="University or College name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                    <Input
                      type="text"
                      value={edu.degree || ""}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      className="w-full"
                      placeholder="Bachelor's, Master's, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                    <Input
                      type="text"
                      value={edu.field_of_study || ""}
                      onChange={(e) => updateEducation(index, "field_of_study", e.target.value)}
                      className="w-full"
                      placeholder="Computer Science, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                    <Input
                      type="text"
                      value={edu.gpa || ""}
                      onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                      className="w-full"
                      placeholder="3.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Year</label>
                    <Input
                      type="number"
                      value={edu.start_year || ""}
                      onChange={(e) => updateEducation(index, "start_year", e.target.value)}
                      className="w-full"
                      placeholder="2020"
                      min="1900"
                      max={new Date().getFullYear() + 10}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Year</label>
                    <Input
                      type="number"
                      value={edu.end_year || ""}
                      onChange={(e) => updateEducation(index, "end_year", e.target.value)}
                      className="w-full"
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear() + 10}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={edu.description || ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateEducation(index, "description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Additional details about your education"
                    rows={2}
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
