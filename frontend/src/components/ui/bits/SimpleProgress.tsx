/**
 * Simple Progress Component with enhanced styling
 * Better styled version of a progress bar
 */

import React from "react";
import { cn } from "../../../lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "success" | "warning" | "error";
  indicatorClassName?: string;
}

const SimpleProgress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      size = "default",
      variant = "default",
      indicatorClassName,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizeClasses = {
      sm: "h-1",
      default: "h-1.5",
      lg: "h-2",
    };

    const variantClasses = {
      default: "bg-blue-500",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            variantClasses[variant],
            indicatorClassName,
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemax={max}
          aria-valuemin={0}
        />
      </div>
    );
  },
);

SimpleProgress.displayName = "SimpleProgress";

export { SimpleProgress };
