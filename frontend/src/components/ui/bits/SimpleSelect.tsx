/**
 * Simple Select Component with enhanced styling
 * Better styled version of the native select element
 */

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: "default" | "error";
}

const SimpleSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-2.5 py-1.5 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            variant === "error" && "border-destructive focus:ring-destructive",
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-2.5 top-2 h-3 w-3 opacity-50 pointer-events-none" />
      </div>
    );
  },
);

SimpleSelect.displayName = "SimpleSelect";

export { SimpleSelect };
