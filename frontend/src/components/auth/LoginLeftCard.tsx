import React from "react";
import { Shield, Lock, Users, CheckCircle2 } from "lucide-react";

/**
 * LoginLeftCard - Login page specific left card content component
 * Independent content - not related to the login form in the right card
 * Provides information about security features and benefits
 */
const LoginLeftCard: React.FC = () => {
  const securityFeatures = [
    {
      id: 1,
      title: "Enterprise Security",
      description: "Advanced encryption and secure protocols.",
      icon: <Shield className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      id: 2,
      title: "Multi-Factor Auth",
      description: "Two-factor authentication and secure sessions.",
      icon: <Lock className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      id: 3,
      title: "Team Management",
      description: "Role-based access and collaboration tools.",
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-600",
    },
    {
      id: 4,
      title: "Compliance Ready",
      description: "GDPR, SOC2 and industry standards.",
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="p-4 h-full flex flex-col justify-between">
      {/* Welcome Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Secure Access</h2>
            <p className="text-xs text-gray-600">Enterprise-grade security</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          Access your Nexus LMD dashboard with confidence. Enterprise-level
          security features protect your production data and operational
          integrity.
        </p>
      </div>

      {/* Security Features */}
      <div className="flex-1 mb-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Security Features
        </h3>
        <div className="space-y-3">
          {securityFeatures.map((feature) => (
            <div
              key={feature.id}
              className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className={`p-1.5 rounded bg-gray-100 ${feature.color} flex-shrink-0`}
              >
                {feature.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginLeftCard;
