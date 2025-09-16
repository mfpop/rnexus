import React from "react";
import { Briefcase, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Input } from "../../ui/bits";

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
  profileData: any;
  isEditMode: boolean;
  handleAddExperience: () => void;
  handleRemoveExperience: (id: string) => void;
  handleUpdateExperience: (id: string, field: string, value: string | boolean) => void;
  currentExperiencePage: number;
  totalExperiencePages: number;
  handleExperiencePageChange: (page: number) => void;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({
  profileData,
  isEditMode,
  handleAddExperience,
  handleRemoveExperience,
  handleUpdateExperience,
  currentExperiencePage,
  totalExperiencePages,
  handleExperiencePageChange,
}) => {
  const experiencePerPage = 3;
  const startIndex = (currentExperiencePage - 1) * experiencePerPage;
  const endIndex = startIndex + experiencePerPage;
  const experienceArray = Array.isArray(profileData.work_experience) ? profileData.work_experience : [];
  const currentExperience = experienceArray.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header with pagination controls */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
              Work Experience
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleAddExperience}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                disabled={!isEditMode}
              >
                Add Experience
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {currentExperience.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No work experience records found</p>
              <Button
                onClick={handleAddExperience}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                disabled={!isEditMode}
              >
                Add Your First Experience
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentExperience.map((work: WorkExperience) => (
                <div
                  key={work.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      {work.position || "New Position"} at {work.company || "Company"}
                    </h4>
                    {isEditMode && (
                      <Button
                        onClick={() => handleRemoveExperience(work.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <Input
                        type="text"
                        value={work.company || ""}
                        onChange={(e) =>
                          handleUpdateExperience(work.id, "company", e.target.value)
                        }
                        className="w-full h-[38px]"
                        placeholder="Company name"
                        disabled={!isEditMode}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <Input
                        type="text"
                        value={work.position || ""}
                        onChange={(e) =>
                          handleUpdateExperience(work.id, "position", e.target.value)
                        }
                        className="w-full h-[38px]"
                        placeholder="Job title"
                        disabled={!isEditMode}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <Input
                        type="text"
                        value={work.location || ""}
                        onChange={(e) =>
                          handleUpdateExperience(work.id, "location", e.target.value)
                        }
                        className="w-full h-[38px]"
                        placeholder="City, Country"
                        disabled={!isEditMode}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <Input
                        type="date"
                        value={work.start_date || ""}
                        onChange={(e) =>
                          handleUpdateExperience(work.id, "start_date", e.target.value)
                        }
                        className="w-full h-[38px]"
                        disabled={!isEditMode}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <Input
                        type="date"
                        value={work.end_date || ""}
                        onChange={(e) =>
                          handleUpdateExperience(work.id, "end_date", e.target.value)
                        }
                        className="w-full h-[38px]"
                        disabled={!isEditMode || work.current}
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={work.current || false}
                          onChange={(e) =>
                            handleUpdateExperience(work.id, "current", e.target.checked)
                          }
                          className="mr-2"
                          disabled={!isEditMode}
                        />
                        <span className="text-sm text-gray-700">Currently working here</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={work.description || ""}
                      onChange={(e) =>
                        handleUpdateExperience(work.id, "description", e.target.value)
                      }
                      className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Describe your responsibilities and achievements..."
                      disabled={!isEditMode}
                    />
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalExperiencePages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, experienceArray.length)} of{" "}
                    {experienceArray.length} experience records
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleExperiencePageChange(currentExperiencePage - 1)}
                      disabled={currentExperiencePage === 1}
                      className="p-2"
                      variant="outline"
                      size="sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-700">
                      Page {currentExperiencePage} of {totalExperiencePages}
                    </span>
                    <Button
                      onClick={() => handleExperiencePageChange(currentExperiencePage + 1)}
                      disabled={currentExperiencePage === totalExperiencePages}
                      className="p-2"
                      variant="outline"
                      size="sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceTab;
