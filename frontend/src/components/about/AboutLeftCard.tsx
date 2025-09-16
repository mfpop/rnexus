import React from "react";
import {
  Building2,
  Target,
  Globe,
  Heart,
  Users,
  Award,
  Phone,
  UserCheck,
} from "lucide-react";
import { useAboutContext, AboutSection } from "./AboutContext";

/**
 * AboutLeftCard - Navigation for about page sections
 * Provides a menu of different sections of company information
 */
const AboutLeftCard: React.FC = () => {
  const { selectedSection, setSelectedSection } = useAboutContext();

  const aboutSections: AboutSection[] = [
    {
      id: "overview",
      title: "Company Overview",
      description: "Learn about RNexus and our journey",
      icon: "building",
    },
    {
      id: "mission",
      title: "Mission & Vision",
      description: "Our core values and purpose",
      icon: "target",
    },
    {
      id: "story",
      title: "Our Story",
      description: "The journey from startup to industry leader",
      icon: "globe",
    },
    {
      id: "team",
      title: "Leadership Team",
      description: "Meet our executive leadership",
      icon: "users",
    },
    {
      id: "achievements",
      title: "Awards & Recognition",
      description: "Industry awards and achievements",
      icon: "award",
    },
    {
      id: "values",
      title: "Company Values",
      description: "What drives us every day",
      icon: "heart",
    },
    {
      id: "contact",
      title: "Contact Information",
      description: "Get in touch with our team",
      icon: "phone",
    },
    {
      id: "careers",
      title: "Join Our Team",
      description: "Career opportunities and culture",
      icon: "usercheck",
    },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "building":
        return <Building2 className="h-5 w-5" />;
      case "target":
        return <Target className="h-5 w-5" />;
      case "globe":
        return <Globe className="h-5 w-5" />;
      case "users":
        return <Users className="h-5 w-5" />;
      case "award":
        return <Award className="h-5 w-5" />;
      case "heart":
        return <Heart className="h-5 w-5" />;
      case "phone":
        return <Phone className="h-5 w-5" />;
      case "usercheck":
        return <UserCheck className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">About RNexus</h2>
        <p className="text-sm text-gray-600 mt-1">
          Discover our company, mission, and team
        </p>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {aboutSections.map((section) => (
            <div
              key={section.id}
              onClick={() => setSelectedSection(section)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${
                selectedSection?.id === section.id
                  ? "bg-blue-50 border-l-4 border-blue-500 text-blue-900"
                  : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 p-2 rounded-lg ${
                    selectedSection?.id === section.id
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {getIcon(section.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-1">{section.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">RNexus Industries</div>
          <div className="text-xs text-gray-400">
            Leading Manufacturing Innovation
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutLeftCard;
