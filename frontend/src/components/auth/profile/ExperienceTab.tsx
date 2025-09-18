import React from "react";
import { Briefcase } from "lucide-react";
import { Input } from "../../ui/bits";

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
  location: string;
}

interface ExperienceTabProps {
  workExperiences: WorkExperience[];
  isEditMode: boolean;
  handleUpdateExperience: (id: string, field: string, value: any) => void;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({
  workExperiences,
  isEditMode,
  handleUpdateExperience,
}) => {
  return (
    <div className="h-full flex-1 flex flex-col min-h-0 profile-form">
      <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-lg border border-gray-200 relative overflow-hidden">
        {/* Subtle paper texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white opacity-60"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        {/* Header */}
        <div className="p-6 border-b border-gray-200 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Briefcase className="w-6 h-6 mr-3 text-blue-600" />
              Work Experience
            </h3>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-8 relative z-10 min-h-0">
          {workExperiences.length === 0 ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 flex flex-col justify-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 text-center">No Work Experience Records</h4>
                <p className="text-gray-600 mb-6 text-center">Use the "Add Record" button in the right sidebar to add your work experience</p>
              </div>
            </div>
          ) : (
            <div className={`flex-1 flex flex-col min-h-0 ${workExperiences.length === 1 ? '' : 'space-y-8'}`}>
              {workExperiences.map((work) => (
                <div
                  key={work.id}
                  className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col flex-1 min-h-0 ${workExperiences.length === 1 ? 'h-full' : ''}`}
                  style={workExperiences.length === 1 ? { minHeight: 0, height: '100%' } : {}}
                >
                  {/* Subtle paper texture for each experience card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/20 to-white opacity-40"></div>

                  <div className="relative z-10 flex flex-col min-h-0 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                          <Briefcase className="w-6 h-6 mr-3 text-blue-600" />
                          {work.position || "New Position"} at {work.company || "Company"}
                        </h3>
                      </div>
                    </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                    Company
                  </label>
                  <div className="relative">
                      <Input
                      type="text"
                      value={work.company || ""}
                      onChange={(e) => handleUpdateExperience(work.id, "company", e.target.value)}
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
                      placeholder="Company name"
                      disabled={!isEditMode}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                    Position
                  </label>
                  <div className="relative">
                      <Input
                      type="text"
                      value={work.position || ""}
                      onChange={(e) => handleUpdateExperience(work.id, "position", e.target.value)}
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
                      placeholder="Job title"
                      disabled={!isEditMode}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors">
                    Location
                  </label>
                  <div className="relative">
                      <Input
                      type="text"
                      value={work.location || ""}
                      onChange={(e) => handleUpdateExperience(work.id, "location", e.target.value)}
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
                      placeholder="City, Country"
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
                      value={work.start_date || ""}
                      onChange={(e) => handleUpdateExperience(work.id, "start_date", e.target.value)}
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
                      value={work.end_date || ""}
                      onChange={(e) => handleUpdateExperience(work.id, "end_date", e.target.value)}
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
                      disabled={!isEditMode || work.current}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                  </div>
                </div>

                <div className="group flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={work.current || false}
                      onChange={(e) => handleUpdateExperience(work.id, "current", e.target.checked)}
                      className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={!isEditMode}
                    />
                    <span className="text-sm font-medium text-gray-700">Currently working here</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col flex-1 min-h-0">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Description
                </label>
                <div className="relative flex-1 min-h-0">
                  <textarea
                    value={work.description || ""}
                    onChange={(e) => handleUpdateExperience(work.id, "description", e.target.value)}
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
                    placeholder="Describe your responsibilities and achievements..."
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

export default ExperienceTab;
