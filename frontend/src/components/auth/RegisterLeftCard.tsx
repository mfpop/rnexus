import React from "react";
import { Shield, CheckCircle2, User, Mail, Lock, Key } from "lucide-react";

/**
 * RegisterLeftCard - Register page specific left card content component
 * Independent content - not related to the registration form in the right card
 * Provides information about platform benefits and features
 */
const RegisterLeftCard: React.FC = () => {
  const accountProcess = [
    {
      id: 1,
      title: "Choose unique username",
      icon: <User className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      id: 2,
      title: "Provide valid email address",
      icon: <Mail className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      id: 3,
      title: "Create strong password",
      icon: <Lock className="h-4 w-4" />,
      color: "text-purple-600",
    },
    {
      id: 4,
      title: "Verify your email address",
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-orange-600",
    },
  ];

  const securityFeatures = [
    {
      id: 1,
      title: "Email verification required",
      icon: <Mail className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      id: 2,
      title: "Secure password requirements",
      icon: <Lock className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      id: 3,
      title: "Two-factor authentication",
      icon: <Shield className="h-4 w-4" />,
      color: "text-purple-600",
    },
    {
      id: 4,
      title: "Regular security updates",
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-orange-600",
    },
  ];

  const passwordRequirements = [
    "Minimum 8 characters long",
    "Include uppercase and lowercase letters",
    "Include at least one number",
    "Include at least one special character",
  ];

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header Section */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Account Creation
            </h2>
            <p className="text-xs text-gray-600">Secure registration process</p>
          </div>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">
          Join Nexus LMD with confidence. Our secure process protects your
          information.
        </p>
      </div>

      {/* Account Creation Process */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Registration Steps
        </h3>
        <div className="space-y-1">
          {accountProcess.map((step) => (
            <div
              key={step.id}
              className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 transition-colors"
            >
              <div
                className={`p-1 rounded bg-gray-100 ${step.color} flex-shrink-0`}
              >
                {step.icon}
              </div>
              <h4 className="text-xs font-medium text-gray-800">
                {step.title}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Account Security */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Security Features
        </h3>
        <div className="space-y-1">
          {securityFeatures.map((feature) => (
            <div
              key={feature.id}
              className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 transition-colors"
            >
              <div
                className={`p-1 rounded bg-gray-100 ${feature.color} flex-shrink-0`}
              >
                {feature.icon}
              </div>
              <h4 className="text-xs font-medium text-gray-800">
                {feature.title}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Password Requirements */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Password Standards
        </h3>
        <div className="space-y-1">
          {passwordRequirements.map((requirement, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-1.5 bg-gray-50 rounded"
            >
              <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700">{requirement}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisterLeftCard;
