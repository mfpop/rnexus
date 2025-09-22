import React from 'react';
import { useQuery } from '@apollo/client';
import {
  Star,
  Users,
  MapPin,
  Briefcase,
  Award,
  Share2,
  Settings,
  Download
} from 'lucide-react';
import { GET_USER_PROFILE } from '../../graphql/userProfile';
import { computeProfileCompletion } from '../../lib/profileCompletion';

interface ProfileLeftCardProps {
  className?: string;
}

// Enhanced work experience calculation
function calculateWorkExperience(workHistory: any) {
  if (!workHistory) return { totalMonths: 0, companies: 0 };

  let parsedWorkHistory: any[] = [];

  if (Array.isArray(workHistory)) {
    parsedWorkHistory = workHistory;
  } else if (typeof workHistory === 'string' && workHistory.trim()) {
    try {
      parsedWorkHistory = JSON.parse(workHistory);
      if (!Array.isArray(parsedWorkHistory)) return { totalMonths: 0, companies: 0 };
    } catch (error) {
      console.error('Error parsing work history:', error);
      return { totalMonths: 0, companies: 0 };
    }
  }

  if (parsedWorkHistory.length === 0) return { totalMonths: 0, companies: 0 };

  const uniqueCompanies = new Set();
  let totalMonths = 0;

  parsedWorkHistory.forEach((job: any) => {
    // Count unique companies
    if (job.company || job.companyName) {
      uniqueCompanies.add(job.company || job.companyName);
    }

    if (job.start_date || job.startDate) {
      let startDate, endDate;

      // Try to parse start date - handle both field names
      const startDateStr = job.start_date || job.startDate;
      if (typeof startDateStr === 'string') {
        // Handle MM/DD/YYYY format
        if (startDateStr.includes('/')) {
          const parts = startDateStr.split('/');
          if (parts.length === 3) {
            const [month, day, year] = parts;
            if (month && day && year) {
              startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            }
          }
        } else {
          startDate = new Date(startDateStr);
        }
      } else {
        startDate = new Date(startDateStr);
      }

      // Try to parse end date - handle both field names
      const endDateStr = job.end_date || job.endDate;
      if (endDateStr) {
        if (typeof endDateStr === 'string') {
          // Handle MM/DD/YYYY format
          if (endDateStr.includes('/')) {
            const parts = endDateStr.split('/');
            if (parts.length === 3) {
              const [month, day, year] = parts;
              if (month && day && year) {
                endDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
              }
            }
          } else {
            endDate = new Date(endDateStr);
          }
        } else {
          endDate = new Date(endDateStr);
        }
      } else {
        endDate = new Date(); // Current date if no end date
      }

      // Calculate months if both dates are valid
      if (startDate && !isNaN(startDate.getTime()) && endDate && !isNaN(endDate.getTime())) {
        const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                          (endDate.getMonth() - startDate.getMonth());
        totalMonths += Math.max(0, monthsDiff);
      }
    }
  });

  return { totalMonths, companies: uniqueCompanies.size };
}

const ProfileLeftCard: React.FC<ProfileLeftCardProps> = ({ className = '' }) => {
  const { loading, error, data: profileQueryData } = useQuery(GET_USER_PROFILE, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  // Map GraphQL data to completion function expected format
  const profile = profileQueryData?.userProfile;
  const mappedProfile = profile ? {
    email: profile.user?.email,
    first_name: profile.user?.firstName,
    last_name: profile.user?.lastName,
    position: profile.position,
    department: profile.department,
    phone1: profile.phone1,
    phonecc1: profile.phonecc1,
    street: profile.streetAddress,
    city: profile.city,
    state: profile.stateProvince,
    zipcode: profile.zipCode,
    country: profile.country,
    bio: profile.bio,
    education: typeof profile.education === 'string' ? JSON.parse(profile.education || '[]') : profile.education,
    work_history: typeof profile.workHistory === 'string' ? JSON.parse(profile.workHistory || '[]') : profile.workHistory,
  } : null;

  const { percent, details } = computeProfileCompletion(mappedProfile);

  // Handle CV download with professional PDF generation
  const handleDownloadCV = async () => {
    try {
      // Create a hidden div with professional CV HTML
      const cvElement = document.createElement('div');
      cvElement.innerHTML = generateProfessionalCVHTML(profileQueryData?.userProfile);
      cvElement.style.position = 'absolute';
      cvElement.style.left = '-9999px';
      cvElement.style.width = '210mm'; // A4 width
      cvElement.style.backgroundColor = 'white';
      cvElement.style.fontFamily = 'Arial, sans-serif';
      cvElement.style.fontSize = '12px';
      cvElement.style.lineHeight = '1.4';
      cvElement.style.color = '#333';

      document.body.appendChild(cvElement);

      // Use browser's print functionality to save as PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>CV - ${profileQueryData?.userProfile?.user?.firstName || 'User'} ${profileQueryData?.userProfile?.user?.lastName || ''}</title>
              <style>
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
                @page {
                  size: A4;
                  margin: 20mm;
                }
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.4;
                  color: #333;
                  max-width: 210mm;
                  margin: 0 auto;
                  background: white;
                }
                .cv-header {
                  text-align: center;
                  padding: 20px 0;
                  border-bottom: 3px solid #2563eb;
                  margin-bottom: 30px;
                }
                .cv-name {
                  font-size: 28px;
                  font-weight: bold;
                  color: #1e40af;
                  margin-bottom: 5px;
                }
                .cv-title {
                  font-size: 16px;
                  color: #6b7280;
                  margin-bottom: 10px;
                }
                .cv-contact {
                  font-size: 12px;
                  color: #6b7280;
                }
                .cv-section {
                  margin-bottom: 25px;
                }
                .cv-section-title {
                  font-size: 16px;
                  font-weight: bold;
                  color: #1e40af;
                  border-bottom: 2px solid #e5e7eb;
                  padding-bottom: 5px;
                  margin-bottom: 15px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .cv-item {
                  margin-bottom: 15px;
                  padding-left: 15px;
                  border-left: 3px solid #e5e7eb;
                }
                .cv-item-title {
                  font-weight: bold;
                  color: #374151;
                  margin-bottom: 3px;
                }
                .cv-item-subtitle {
                  color: #6b7280;
                  font-style: italic;
                  margin-bottom: 5px;
                }
                .cv-item-duration {
                  color: #9ca3af;
                  font-size: 11px;
                  margin-bottom: 5px;
                }
                .cv-item-description {
                  color: #4b5563;
                  line-height: 1.5;
                }
                .cv-skills {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 8px;
                }
                .cv-skill {
                  background: #f3f4f6;
                  padding: 4px 12px;
                  border-radius: 12px;
                  font-size: 11px;
                  color: #374151;
                }
                .cv-two-column {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 20px;
                }
                .cv-summary {
                  background: #f8fafc;
                  padding: 15px;
                  border-radius: 8px;
                  border-left: 4px solid #2563eb;
                  margin-bottom: 25px;
                }
              </style>
            </head>
            <body>
              ${cvElement.innerHTML}
              <div class="no-print" style="position: fixed; top: 10px; right: 10px; background: #2563eb; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px;" onclick="window.print()">
                Print/Save as PDF
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();

        // Focus the print window and trigger print dialog
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }

      document.body.removeChild(cvElement);
    } catch (error) {
      console.error('Error generating CV:', error);
      alert('Error generating CV. Please try again.');
    }
  };

  // Generate professional CV HTML with modern template
  const generateProfessionalCVHTML = (profile: any) => {
    if (!profile) return '<p>No profile data available</p>';

    const user = profile.user || {};
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Professional';
    const position = profile.position || 'Professional';

    // Parse education data
    let educationData: any[] = [];
    if (Array.isArray(profile.education)) {
      educationData = profile.education;
    } else if (typeof profile.education === 'string' && profile.education.trim()) {
      try {
        const parsed = JSON.parse(profile.education);
        educationData = Array.isArray(parsed) ? parsed : [];
      } catch {
        educationData = [];
      }
    }

    // Parse work history
    let workData: any[] = [];
    if (Array.isArray(profile.workHistory)) {
      workData = profile.workHistory;
    } else if (typeof profile.workHistory === 'string' && profile.workHistory.trim()) {
      try {
        const parsed = JSON.parse(profile.workHistory);
        workData = Array.isArray(parsed) ? parsed : [];
      } catch {
        workData = [];
      }
    }

    return `
      <div class="cv-header">
        <div class="cv-name">${fullName}</div>
        <div class="cv-title">${position}</div>
        <div class="cv-contact">
          ${user.email ? `📧 ${user.email}` : ''}
          ${profile.workPhone ? ` • 📞 ${profile.workPhone}` : ''}
          ${profile.workLocation ? ` • 📍 ${profile.workLocation}` : ''}
        </div>
      </div>

      ${profile.bio ? `
        <div class="cv-section">
          <div class="cv-section-title">Professional Summary</div>
          <div class="cv-summary">
            ${profile.bio}
          </div>
        </div>
      ` : ''}

      <div class="cv-two-column">
        <div>
          ${workData.length > 0 ? `
            <div class="cv-section">
              <div class="cv-section-title">Work Experience</div>
              ${workData.map((job: any) => `
                <div class="cv-item">
                  <div class="cv-item-title">${job.position || 'Position'}</div>
                  <div class="cv-item-subtitle">${job.company || job.companyName || 'Company'}</div>
                  <div class="cv-item-duration">
                    ${job.start_date || job.startDate || ''} - ${job.end_date || job.endDate || 'Present'}
                    ${job.location ? ` • ${job.location}` : ''}
                  </div>
                  ${job.description ? `<div class="cv-item-description">${job.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${educationData.length > 0 ? `
            <div class="cv-section">
              <div class="cv-section-title">Education</div>
              ${educationData.map((edu: any) => `
                <div class="cv-item">
                  <div class="cv-item-title">${edu.degree || edu.level || 'Degree'}</div>
                  <div class="cv-item-subtitle">${edu.institution || edu.school || 'Institution'}</div>
                  <div class="cv-item-duration">
                    ${edu.graduationDate || edu.graduation_date || ''}
                    ${edu.major || edu.field ? ` • ${edu.major || edu.field}` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div>
          <div class="cv-section">
            <div class="cv-section-title">Personal Information</div>
            <div class="cv-item">
              ${profile.gender ? `<div><strong>Gender:</strong> ${profile.gender}</div>` : ''}
              ${profile.maritalStatus ? `<div><strong>Marital Status:</strong> ${profile.maritalStatus}</div>` : ''}
              ${profile.birthDate ? `<div><strong>Birth Date:</strong> ${profile.birthDate}</div>` : ''}
              ${profile.nationality ? `<div><strong>Nationality:</strong> ${profile.nationality}</div>` : ''}
              ${profile.height ? `<div><strong>Height:</strong> ${profile.height}</div>` : ''}
            </div>
          </div>

          ${profile.skills ? `
            <div class="cv-section">
              <div class="cv-section-title">Skills</div>
              <div class="cv-skills">
                ${profile.skills.split(',').map((skill: string) => `
                  <span class="cv-skill">${skill.trim()}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="cv-section">
            <div class="cv-section-title">Profile Statistics</div>
            <div class="cv-item">
              <div><strong>Profile Completion:</strong> ${percent}%</div>
              <div><strong>Work Experience:</strong> ${(() => {
                const { totalMonths, companies } = calculateWorkExperience(profile.workHistory);
                if (totalMonths === 0) return "Entry Level";
                const years = Math.floor(totalMonths / 12);
                const months = totalMonths % 12;
                let timeStr = "";
                if (years === 0) {
                  timeStr = `${months} month${months !== 1 ? 's' : ''}`;
                } else if (months === 0) {
                  timeStr = `${years} year${years !== 1 ? 's' : ''}`;
                } else {
                  timeStr = `${years}y ${months}m`;
                }
                return `${timeStr} (${companies} companies)`;
              })()}</div>
              <div><strong>Generated:</strong> ${new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="space-y-3 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center space-y-3">
          <p className="text-sm text-red-600">Failed to load profile</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:shadow-md px-6 py-2.5 rounded-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] bg-[length:24px_24px]"></div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header Section */}
        <div className="px-6 pt-8 pb-6 border-b border-slate-200/50">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {profileQueryData?.userProfile?.user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  {profileQueryData?.userProfile?.user?.firstName || 'User'} {profileQueryData?.userProfile?.user?.lastName || ''}
                </h1>
                <p className="text-slate-600 text-sm">
                  {profileQueryData?.userProfile?.position || 'Professional'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Strength */}
        <div className="px-6 py-4 border-b border-slate-200/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Profile Strength</span>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${percent >= star * 20 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-800">{percent}%</span>
              </div>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-700"
                style={{ width: `${percent}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { key: 'basicInfo' as keyof typeof details, label: 'Basic', icon: Users },
                { key: 'address' as keyof typeof details, label: 'Address', icon: MapPin },
                { key: 'professional' as keyof typeof details, label: 'Work', icon: Briefcase },
                { key: 'bio' as keyof typeof details, label: 'Bio', icon: Award }
              ].map(({ key, label, icon: Icon }) => (
                <div key={String(key)} className="text-center">
                  <div className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center mb-1 ${
                    details[key]
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs ${details[key] ? 'text-green-600' : 'text-slate-500'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">Profile Summary</h3>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-slate-600">Education:</span>
                <p className="text-sm text-slate-500 mt-1">
                  {(() => {
                    const education = profileQueryData?.userProfile?.education;
                    let educationData: any[] = [];

                    if (Array.isArray(education)) {
                      educationData = education;
                    } else if (typeof education === 'string' && education.trim()) {
                      try {
                        const parsed = JSON.parse(education);
                        educationData = Array.isArray(parsed) ? parsed : [];
                      } catch {
                        educationData = [];
                      }
                    }

                    if (educationData.length === 0) return "Not specified";

                    const levels = educationData.map(edu => edu.degree || edu.level || "").filter(Boolean);
                    if (levels.length === 0) return "Not specified";

                    const hierarchy = ["PhD", "Doctorate", "Master", "Bachelor", "Associate", "Diploma", "Certificate"];

                    for (const level of hierarchy) {
                      if (levels.some(l => l.toLowerCase().includes(level.toLowerCase()))) {
                        return level;
                      }
                    }

                    return levels[0];
                  })()}
                </p>
              </div>

              <div>
                <span className="text-sm font-medium text-slate-600">Experience:</span>
                <p className="text-sm text-slate-500 mt-1">
                  {(() => {
                    const workHistory = profileQueryData?.userProfile?.workHistory;
                    const { totalMonths, companies } = calculateWorkExperience(workHistory);

                    if (totalMonths === 0) return "No experience";

                    const years = Math.floor(totalMonths / 12);
                    const months = totalMonths % 12;

                    let timeStr = "";
                    if (years === 0) {
                      timeStr = `${months} month${months !== 1 ? 's' : ''}`;
                    } else if (months === 0) {
                      timeStr = `${years} year${years !== 1 ? 's' : ''}`;
                    } else {
                      timeStr = `${years} year${years !== 1 ? 's' : ''} and ${months} month${months !== 1 ? 's' : ''}`;
                    }

                    return `${timeStr} across ${companies} companies`;
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 border-t border-slate-200/50">
          <div className="space-y-2">
            <button
              onClick={() => handleDownloadCV()}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-700">Download CV</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/50 rounded-lg transition-colors">
              <Share2 className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-700">Share Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/50 rounded-lg transition-colors">
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-700">Privacy Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLeftCard;
