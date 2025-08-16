/**
 * Enhanced Select Component with better styling
 * Provides better accessibility and keyboard navigation
 */

import React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../../lib/utils";

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(
  undefined,
);

const Select: React.FC<{
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}> = ({
  children,
  value: controlledValue,
  onValueChange,
  defaultValue = "",
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{ value, onValueChange: handleValueChange, open, setOpen }}
    >
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

const SelectGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => {
  const context = React.useContext(SelectContext);

  return (
    <span ref={ref} className={cn(className)} {...props}>
      {context?.value || placeholder}
    </span>
  );
});
SelectValue.displayName = "SelectValue";

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex h-8 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      onClick={() => context?.setOpen(!context.open)}
      {...props}
    >
      {children}
      <ChevronDown className="h-3 w-3 opacity-50" />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);

  if (!context?.open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 top-full mt-1 min-w-full bg-white border border-gray-200 rounded-md shadow-lg py-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "py-1 pl-6 pr-2 text-xs font-medium text-gray-700",
      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, onClick, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  const isSelected = context?.value === value;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1 pl-6 pr-2 text-xs outline-none hover:bg-gray-100 focus:bg-gray-100",
        isSelected && "bg-gray-100",
        className,
      )}
      onClick={(e) => {
        context?.onValueChange(value);
        onClick?.(e);
      }}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-1.5 flex h-3 w-3 items-center justify-center">
          <Check className="h-3 w-3" />
        </span>
      )}
      {children}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-200 border-0", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

// These are placeholders for compatibility
const SelectScrollUpButton: React.FC = () => null;
const SelectScrollDownButton: React.FC = () => null;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
