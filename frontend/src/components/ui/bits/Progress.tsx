/**
 * Enhanced Progress Component using native React
 * Provides better accessibility and customization
 */

import React from "react";
import { cn } from "../../../lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  size?: "default" | "sm" | "lg";
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, size = "default", indicatorClassName, value = 0, ...props },
    ref,
  ) => {
    const sizeClasses = {
      sm: "h-1.5",
      default: "h-3",
      lg: "h-4",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-gray-200",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 ease-in-out bg-blue-500",
            indicatorClassName,
          )}
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
          }}
        />
      </div>
    );
  },
);
Progress.displayName = "Progress";

export { Progress };
