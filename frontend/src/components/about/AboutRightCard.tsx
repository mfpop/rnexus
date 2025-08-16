import React from "react";
import {
  Building2,
  Target,
  Globe,
  Heart,
  Users,
  Award,
  Phone,
  Mail,
  MapPin,
  UserCheck,
} from "lucide-react";
import { useAboutContext } from "./AboutContext";

/**
 * AboutRightCard - Displays detailed content for selected about section
 */
const AboutRightCard: React.FC = () => {
  const { selectedSection } = useAboutContext();

  if (!selectedSection) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome to RNexus
          </h3>
          <p className="text-gray-600">
            Select a section from the left panel to learn more about our
            company, mission, team, and achievements.
          </p>
        </div>
      </div>
    );
  }

  const renderSectionContent = () => {
    switch (selectedSection.id) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl">
              <Building2 className="h-12 w-12 mb-4" />
              <h1 className="text-3xl font-bold mb-4">About RNexus</h1>
              <p className="text-xl text-blue-100">
                Leading the future of industrial automation and smart
                manufacturing through innovative technology solutions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  500+
                </div>
                <div className="text-gray-600">Active Clients</div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  1M+
                </div>
                <div className="text-gray-600">Production Hours Optimized</div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  35%
                </div>
                <div className="text-gray-600">Average Efficiency Increase</div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-2xl font-bold text-red-600 mb-2">25%</div>
                <div className="text-gray-600">Average Waste Reduction</div>
              </div>
            </div>
          </div>
        );

      case "mission":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Mission, Vision & Values
            </h1>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <Target className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Our Mission
                </h3>
                <p className="text-gray-600">
                  To revolutionize industrial operations through cutting-edge
                  automation, data analytics, and sustainable manufacturing
                  practices that drive efficiency and innovation.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <Globe className="h-10 w-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Our Vision
                </h3>
                <p className="text-gray-600">
                  To be the global leader in smart manufacturing solutions,
                  creating a future where technology and sustainability work
                  hand in hand.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <Heart className="h-10 w-10 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Our Values
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">
                      Innovation in everything we do
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">
                      Integrity and transparency
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700">Sustainability focus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="text-gray-700">
                      Excellence in execution
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "story":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h1>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-6">
                  Founded in 2015, RNexus began as a small team of engineers
                  with a big vision: to transform how manufacturing companies
                  operate in the digital age.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      2015 - Foundation
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Started in a garage with 3 engineers and a dream
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      2018 - First Major Client
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Implemented our first large-scale automation system
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      2020 - AI Integration
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Launched our AI-powered analytics platform
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      2024 - Global Leader
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Serving 500+ companies worldwide
                    </p>
                  </div>
                </div>

                <p className="text-gray-600">
                  Today, we're proud to serve over 500 companies globally,
                  helping them achieve operational excellence while reducing
                  their environmental footprint. Our solutions have helped our
                  clients increase efficiency by an average of 35% while
                  reducing waste by 25%.
                </p>
              </div>
            </div>
          </div>
        );

      case "team":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Leadership Team
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  SJ
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sarah Johnson
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  Chief Executive Officer
                </p>
                <p className="text-gray-600 text-sm">
                  Former VP of Operations at Tesla. 15+ years in manufacturing
                  automation.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  MC
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Michael Chen
                </h3>
                <p className="text-green-600 font-medium mb-3">
                  Chief Technology Officer
                </p>
                <p className="text-gray-600 text-sm">
                  Former Senior Engineer at Google. PhD in Computer Science from
                  MIT.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  ER
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Emily Rodriguez
                </h3>
                <p className="text-red-600 font-medium mb-3">
                  Chief Operating Officer
                </p>
                <p className="text-gray-600 text-sm">
                  Former Director at McKinsey & Company. MBA from Stanford
                  Business School.
                </p>
              </div>
            </div>
          </div>
        );

      case "achievements":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Awards & Recognition
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <Award className="h-8 w-8 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Innovation Leader 2023
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Manufacturing Technology Magazine
                    </p>
                    <p className="text-gray-500 text-xs">
                      Recognized for breakthrough AI automation solutions
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <Award className="h-8 w-8 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Best AI Solution 2023
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Industrial Automation Awards
                    </p>
                    <p className="text-gray-500 text-xs">
                      Outstanding achievement in machine learning applications
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <Award className="h-8 w-8 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Sustainability Champion 2022
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Green Manufacturing Initiative
                    </p>
                    <p className="text-gray-500 text-xs">
                      Leading environmental impact reduction in manufacturing
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <Award className="h-8 w-8 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Fast Company 50 2022
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Most Innovative Companies
                    </p>
                    <p className="text-gray-500 text-xs">
                      Ranked among top 50 most innovative companies globally
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "values":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Company Values
            </h1>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  What Drives Us
                </h3>
                <p className="text-gray-600 mb-6">
                  Our values guide every decision we make and every solution we
                  create. They are the foundation of our company culture and our
                  commitment to excellence.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Innovation
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Continuously pushing boundaries and exploring new
                          possibilities
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Heart className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Integrity
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Operating with transparency, honesty, and ethical
                          principles
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Globe className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Sustainability
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Creating solutions that benefit both business and
                          environment
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Excellence
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Delivering exceptional quality in every project and
                          partnership
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Contact Information
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600 mb-1">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 123-4568 (Support)</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600 mb-1">info@rnexus.com</p>
                    <p className="text-gray-600">support@rnexus.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Headquarters
                    </h3>
                    <p className="text-gray-600 mb-1">123 Innovation Drive</p>
                    <p className="text-gray-600">San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Transform Your Operations?
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join hundreds of companies that have already revolutionized
                their manufacturing processes with RNexus.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Schedule a Demo
                </button>
                <button className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        );

      case "careers":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Join Our Team
            </h1>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="text-center mb-8">
                <UserCheck className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Build the Future with Us
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Join a team of passionate innovators working to transform
                  manufacturing through technology. We offer competitive
                  benefits, growth opportunities, and a chance to make a real
                  impact.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    🚀 Innovation Culture
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Work on cutting-edge projects that shape the future
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    📈 Growth Opportunities
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Continuous learning and career advancement
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    🏥 Comprehensive Benefits
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Health, dental, vision, and retirement plans
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    🌍 Remote Flexibility
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Hybrid work environment with flexible hours
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  View Open Positions
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-6">
      {renderSectionContent()}
    </div>
  );
};

export default AboutRightCard;
