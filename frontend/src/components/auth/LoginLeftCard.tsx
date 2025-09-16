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
      {/* Hero / Welcome */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Secure Access</h2>
            <p className="text-xs text-gray-600">Enterprise-grade security</p>
          </div>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Access your Nexus LMD dashboard with confidence — advanced security,
          role-based controls and reliable audit trails keep your operations
          safe.
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>
            Recommended: enable two-factor authentication for added protection
          </span>
        </div>
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

      {/* Quick Links & Support */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex flex-col gap-2">
          <a
            href="/register"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Create a new account
          </a>
          <a
            href="/reset-password"
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Forgot password?
          </a>
          <a
            href="/contact"
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Contact support
          </a>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          Need help signing in? Reach out to your administrator or support.
        </div>
      </div>
    </div>
  );
};

export default LoginLeftCard;
