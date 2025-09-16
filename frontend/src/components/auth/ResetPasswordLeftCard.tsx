import React from "react";
import {
  KeyRound,
  Shield,
  Clock,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
} from "lucide-react";

/**
 * ResetPasswordLeftCard - Reset password page specific left card content component
 * Independent content - not related to the password reset form in the right card
 * Provides information about security and recovery process
 */
const ResetPasswordLeftCard: React.FC = () => {
  const securityFeatures = [
    {
      id: 1,
      title: "Secure Recovery Process",
      description:
        "Multi-step verification ensures only you can reset your password.",
      icon: <Shield className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      id: 2,
      title: "Temporary Access Link",
      description:
        "Reset links are valid for 15 minutes and can only be used once.",
      icon: <Clock className="h-5 w-5" />,
      color: "text-orange-600",
    },
    {
      id: 3,
      title: "Email Verification",
      description:
        "Reset instructions are sent to your registered email address.",
      icon: <Mail className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      id: 4,
      title: "Account Protection",
      description:
        "Your account remains secure throughout the recovery process.",
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "text-purple-600",
    },
  ];

  const securityTips = [
    {
      icon: <AlertTriangle className="h-4 w-4" />,
      tip: "Choose a strong password with at least 8 characters",
      color: "text-amber-600",
    },
    {
      icon: <CheckCircle2 className="h-4 w-4" />,
      tip: "Include uppercase, lowercase, numbers, and symbols",
      color: "text-green-600",
    },
    {
      icon: <Smartphone className="h-4 w-4" />,
      tip: "Consider enabling two-factor authentication",
      color: "text-blue-600",
    },
    {
      icon: <KeyRound className="h-4 w-4" />,
      tip: "Use a unique password for your Nexus LMD account",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="p-4 h-full flex flex-col justify-between">
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <KeyRound className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Password Recovery
            </h2>
            <p className="text-xs text-gray-600">Secure account recovery</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          We'll help you regain access to your Nexus LMD account quickly and
          securely. Our recovery process follows industry best practices to
          protect your account.
        </p>
      </div>

      {/* Recovery Process */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          How It Works
        </h3>
        <div className="space-y-2">
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

      {/* Security Tips */}
      <div className="flex-1 mb-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Security Tips
        </h3>
        <div className="space-y-2">
          {securityTips.map((tip, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg"
            >
              <div className={`${tip.color} flex-shrink-0 mt-0.5`}>
                {tip.icon}
              </div>
              <p className="text-xs text-gray-700">{tip.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordLeftCard;
