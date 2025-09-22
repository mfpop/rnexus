import React from "react";
import { GraduationCap } from "lucide-react";
import { Input } from "../../ui/bits";

// Education level options
const EDUCATION_LEVELS = [
  { value: "", label: "Select Level of Study" },
  { value: "Primary Education", label: "Primary Education" },
  { value: "Secondary Education", label: "Secondary Education" },
  { value: "High School", label: "High School / Preparatoria" },
  { value: "Vocational", label: "Vocational / Technical Training" },
  { value: "Associate", label: "Associate Degree" },
  { value: "Bachelor", label: "Bachelor's Degree" },
  { value: "Master", label: "Master's Degree" },
  { value: "Doctorate", label: "Doctorate / PhD" },
  { value: "Postdoctoral", label: "Postdoctoral" },
  { value: "Other", label: "Other" },
];

interface Education {
  id: string;
  institution: string;
  degree: string;
  level: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  gpa: string;
  description: string;
}

interface EducationTabProps {
  profileData: any;
  isEditMode: boolean;
  handleUpdateEducation: (id: string, field: string, value: string) => void;
  currentEducationPage: number;
  totalEducationPages: number;
  handleEducationPageChange: (page: number) => void;
}

const EducationTab: React.FC<EducationTabProps> = ({
  profileData,
  isEditMode,
  handleUpdateEducation,
  currentEducationPage,
  totalEducationPages: _totalEducationPages,
  handleEducationPageChange: _handleEducationPageChange,
}) => {
  const educationPerPage = 1;
  const startIndex = (currentEducationPage - 1) * educationPerPage;
  const endIndex = startIndex + educationPerPage;
  const educationArray = Array.isArray(profileData.education) ? profileData.education : [];
  const currentEducation = educationArray.slice(startIndex, endIndex);

  return (
  <div className="h-full flex-1 flex flex-col min-h-0 profile-form">
      <div className="flex-1 flex flex-col min-h-0 bg-white shadow-lg border border-gray-200 relative overflow-hidden">
        {/* Subtle paper texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white opacity-60"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        {/* Header */}
        <div className="p-6 border-b border-gray-200 relative z-10 min-h-[88px] flex items-center">
          <div className="flex items-center gap-3 w-full">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Education History</h3>
              <p className="text-gray-600 text-sm">Track your educational background and achievements</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-8 relative z-10 min-h-0">
          {currentEducation.length === 0 ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 flex flex-col justify-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 text-center">No Education Records</h4>
                <p className="text-gray-600 mb-6 text-center">Use the \"Add Record\" button in the right sidebar to add your education history</p>
              </div>
            </div>
          ) : (
            <div className={`flex-1 flex flex-col min-h-0 ${currentEducation.length === 1 ? '' : 'space-y-8'}`}>
              {currentEducation.map((edu: Education) => (
                <div
                  key={edu.id}
                  className={`bg-white border border-gray-200 p-6 shadow-sm relative overflow-hidden flex flex-col flex-1 min-h-0 ${currentEducation.length === 1 ? 'h-full' : ''}`}
                  style={currentEducation.length === 1 ? { minHeight: 0, height: '100%' } : {}}
                >
                  {/* Subtle paper texture for each education card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/20 to-white opacity-40"></div>

                  <div className="relative z-10 flex flex-col min-h-0 h-full">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                          Institution
                        </label>
                        <div className="relative">
                            <Input
                            type="text"
                            value={edu.institution || ""}
                            onChange={(e) =>
                              handleUpdateEducation(edu.id, "institution", e.target.value)
                            }
                            className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                            style={{
                              borderBottom: '2px solid #d1d5db'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderBottom = 'none';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderBottom = '2px solid #d1d5db';
                            }}
                            placeholder="University/School name"
                            disabled={!isEditMode}
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                          Degree
                        </label>
                        <div className="relative">
                            <Input
                            type="text"
                            value={edu.degree || ""}
                            onChange={(e) =>
                              handleUpdateEducation(edu.id, "degree", e.target.value)
                            }
                            className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                            style={{
                              borderBottom: '2px solid #d1d5db'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderBottom = 'none';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderBottom = '2px solid #d1d5db';
                            }}
                            placeholder="Bachelor's, Master's, etc."
                            disabled={!isEditMode}
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                          Level of Study
                        </label>
                        <div className="relative">
                          <select
                            value={edu.level || ""}
                            onChange={(e) =>
                              handleUpdateEducation(edu.id, "level", e.target.value)
                            }
                            className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 bg-transparent transition-colors hover:border-gray-400 appearance-none cursor-pointer"
                            style={{
                              borderBottom: '2px solid #d1d5db'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderBottom = '2px solid #3b82f6';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderBottom = '2px solid #d1d5db';
                            }}
                            disabled={!isEditMode}
                          >
                            {EDUCATION_LEVELS.map((level) => (
                              <option key={level.value} value={level.value}>
                                {level.label}
                              </option>
                            ))}
                          </select>
                          {/* Custom arrow icon for select */}
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                          Field of Study
                        </label>
                        <div className="relative">
                            <Input
                            type="text"
                            value={edu.field_of_study || ""}
                            onChange={(e) =>
                              handleUpdateEducation(edu.id, "field_of_study", e.target.value)
                            }
                            className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                            style={{
                              borderBottom: '2px solid #d1d5db'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderBottom = 'none';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderBottom = '2px solid #d1d5db';
                            }}
                            placeholder="Computer Science, Business, etc."
                            disabled={!isEditMode}
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                          GPA
                        </label>
                        <div className="relative">
                            <Input
                            type="text"
                            value={edu.gpa || ""}
                            onChange={(e) =>
                              handleUpdateEducation(edu.id, "gpa", e.target.value)
                            }
                            className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                            style={{
                              borderBottom: '2px solid #d1d5db'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderBottom = 'none';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderBottom = '2px solid #d1d5db';
                            }}
                            placeholder="3.5, 4.0, etc."
                            disabled={!isEditMode}
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                          Start Date
                        </label>
                        <div className="relative">
                            <Input
                            type="date"
                            value={edu.start_date || ""}
                            onChange={(e) =>
                              handleUpdateEducation(edu.id, "start_date", e.target.value)
                            }
                            className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                            style={{
                              borderBottom: '2px solid #d1d5db'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderBottom = 'none';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderBottom = '2px solid #d1d5db';
                            }}
                            placeholder="mm/dd/yyyy"
                            disabled={!isEditMode}
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                          End Date
                        </label>
                        <div className="relative">
                            <Input
                            type="date"
                            value={edu.end_date || ""}
                            onChange={(e) =>
                              handleUpdateEducation(edu.id, "end_date", e.target.value)
                            }
                            className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus-visible:ring-0 bg-transparent transition-colors hover:border-gray-400"
                            style={{
                              borderBottom: '2px solid #d1d5db'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderBottom = 'none';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderBottom = '2px solid #d1d5db';
                            }}
                            placeholder="mm/dd/yyyy"
                            disabled={!isEditMode}
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                        </div>
                      </div>
                    </div>

                    {/* Description area that expands to fill remaining space */}
                    <div className="flex flex-col flex-1 min-h-0">
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        Description
                      </label>
                      <div className="relative flex-1 min-h-0">
                        <textarea
                          value={edu.description || ""}
                          onChange={(e) =>
                            handleUpdateEducation(edu.id, "description", e.target.value)
                          }
                          className="w-full h-full min-h-[120px] px-0 py-3 text-base border-0 border-b-2 border-gray-300 rounded-none focus:outline-none focus-visible:ring-0 bg-transparent resize-none transition-colors hover:border-gray-400"
                          style={{
                            borderBottom: '2px solid #d1d5db'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderBottom = 'none';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderBottom = '2px solid #d1d5db';
                          }}
                          placeholder="Additional details about your education..."
                          disabled={!isEditMode}
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 focus-within:scale-x-100 transition-transform origin-left"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
    </div>
  </div>
);
};

export default EducationTab;
