/**
 * Enhanced Tooltip Component using native React
 * Provides better accessibility and positioning
 */

import React, { useState } from "react";
import { cn } from "../../../lib/utils";

interface TooltipContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextType | undefined>(
  undefined,
);

const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div>{children}</div>;

const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  (
    { children, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props },
    ref,
  ) => {
    const context = React.useContext(TooltipContext);

    return (
      <div
        ref={ref}
        onMouseEnter={(e) => {
          context?.setOpen(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          context?.setOpen(false);
          onMouseLeave?.(e);
        }}
        onFocus={(e) => {
          context?.setOpen(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          context?.setOpen(false);
          onBlur?.(e);
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "top" | "bottom" | "left" | "right";
  }
>(({ className, side = "top", children, ...props }, ref) => {
  const context = React.useContext(TooltipContext);

  if (!context?.open) return null;

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap pointer-events-none",
        sideClasses[side],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
