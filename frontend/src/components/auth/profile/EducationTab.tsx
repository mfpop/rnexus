import React from "react";
import { GraduationCap, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Input } from "../../ui/bits";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  gpa: string;
  description: string;
}

interface EducationTabProps {
  profileData: any;
  isEditMode: boolean;
  handleAddEducation: () => void;
  handleRemoveEducation: (id: string) => void;
  handleUpdateEducation: (id: string, field: string, value: string) => void;
  currentEducationPage: number;
  totalEducationPages: number;
  handleEducationPageChange: (page: number) => void;
}

const EducationTab: React.FC<EducationTabProps> = ({
  profileData,
  isEditMode,
  handleAddEducation,
  handleRemoveEducation,
  handleUpdateEducation,
  currentEducationPage,
  totalEducationPages,
  handleEducationPageChange,
}) => {
  const educationPerPage = 3;
  const startIndex = (currentEducationPage - 1) * educationPerPage;
  const endIndex = startIndex + educationPerPage;
  const educationArray = Array.isArray(profileData.education) ? profileData.education : [];
  const currentEducation = educationArray.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 relative overflow-hidden">
        {/* Subtle paper texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white opacity-60"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        {/* Header with pagination controls */}
        <div className="p-6 border-b border-gray-200 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <GraduationCap className="w-6 h-6 mr-3 text-blue-600" />
                Education History
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleAddEducation}
                className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:shadow-md px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                disabled={!isEditMode}
              >
                Add Education
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8 relative z-10">
          {currentEducation.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Education Records</h4>
              <p className="text-gray-600 mb-6">Start building your education history</p>
              <Button
                onClick={handleAddEducation}
                className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:shadow-md px-6 py-3 rounded-lg font-medium transition-all duration-200"
                disabled={!isEditMode}
              >
                Add Your First Education
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {currentEducation.map((edu: Education) => (
                <div
                  key={edu.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden"
                >
                  {/* Subtle paper texture for each education card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/20 to-white opacity-40"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {edu.institution || "New Education"}
                        </h4>
                      </div>
                      {isEditMode && (
                        <Button
                          onClick={() => handleRemoveEducation(edu.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent transition-colors hover:border-gray-400"
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
                            className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent transition-colors hover:border-gray-400"
                            placeholder="Bachelor's, Master's, etc."
                            disabled={!isEditMode}
                          />
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
                            className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent transition-colors hover:border-gray-400"
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
                            className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent transition-colors hover:border-gray-400"
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
                            className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent transition-colors hover:border-gray-400"
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
                            className="w-full border-0 border-b-2 border-gray-300 rounded-none px-0 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent transition-colors hover:border-gray-400"
                            disabled={!isEditMode}
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        Description
                      </label>
                      <textarea
                        value={edu.description || ""}
                        onChange={(e) =>
                          handleUpdateEducation(edu.id, "description", e.target.value)
                        }
                        className="w-full h-24 px-0 py-3 text-base border-0 border-b-2 border-gray-300 rounded-none focus:outline-none focus:border-blue-500 focus:ring-0 bg-transparent resize-none transition-colors hover:border-gray-400"
                        placeholder="Additional details about your education..."
                        disabled={!isEditMode}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalEducationPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, educationArray.length)} of{" "}
                    {educationArray.length} education records
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => handleEducationPageChange(currentEducationPage - 1)}
                      disabled={currentEducationPage === 1}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                      variant="ghost"
                      size="sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium text-gray-700 px-3 py-1 bg-gray-100 rounded-lg">
                      Page {currentEducationPage} of {totalEducationPages}
                    </span>
                    <Button
                      onClick={() => handleEducationPageChange(currentEducationPage + 1)}
                      disabled={currentEducationPage === totalEducationPages}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                      variant="ghost"
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

export default EducationTab;
