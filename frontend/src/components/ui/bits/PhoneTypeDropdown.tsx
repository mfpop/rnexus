import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Smartphone, Home, Building2, Phone } from "lucide-react";
import { cn } from "../../../lib/bits-ui";

interface PhoneTypeOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface PhoneTypeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const phoneTypeOptions: PhoneTypeOption[] = [
  {
    value: "mobile",
    label: "Mobile",
    icon: <Smartphone className="w-4 h-4" />,
  },
  { value: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
  { value: "work", label: "Work", icon: <Building2 className="w-4 h-4" /> },
  { value: "other", label: "Other", icon: <Phone className="w-4 h-4" /> },
];

export const PhoneTypeDropdown: React.FC<PhoneTypeDropdownProps> = ({
  value,
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    phoneTypeOptions.find((option) => option.value === value) ||
    phoneTypeOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Ensure we always have a valid selected option
  if (!selectedOption) {
    return null;
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-8 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {selectedOption.icon}
          <span>{selectedOption.label}</span>
        </div>
        <ChevronDown
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {phoneTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors",
                option.value === value && "bg-blue-50 text-blue-600",
              )}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
