import React from "react";
import { cn } from "../../lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: "default" | "error";
  size?: "sm" | "md" | "lg";
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variantClasses = {
      default: "text-gray-700",
      error: "text-red-600",
    };

    const sizeClasses = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";

export { Label };
