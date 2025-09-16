import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { cn } from "../../../lib/utils";

interface NotificationToastProps {
  type: "success" | "error";
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 3000,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  const icon =
    type === "success" ? (
      <CheckCircle className="h-5 w-5" />
    ) : (
      <AlertCircle className="h-5 w-5" />
    );
  const bgColor =
    type === "success"
      ? "bg-green-50 border-green-200 text-green-700"
      : "bg-red-50 border-red-200 text-red-700";

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={cn(
          "flex items-center gap-3 p-4 border rounded-lg shadow-lg transition-all duration-300",
          bgColor,
          isAnimating
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0",
        )}
      >
        {icon}
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={() => {
            setIsAnimating(false);
            setTimeout(onClose, 300);
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
