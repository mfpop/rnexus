import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface ExpandableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  expandedWidth?: string;
  collapsedWidth?: string;
}

/**
 * ExpandableSearch - Modern search input that expands on hover/focus
 * Collapses when not in use to save space
 */
const ExpandableSearch: React.FC<ExpandableSearchProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  expandedWidth = "w-80",
  collapsedWidth = "w-10",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-expand if there's a search value
  useEffect(() => {
    if (value.trim()) {
      setIsExpanded(true);
    }
  }, [value]);

  // Handle clicking outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (!value.trim() && !isFocused) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, isFocused]);

  const handleContainerClick = () => {
    setIsExpanded(true);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setIsExpanded(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Don't collapse immediately, let the click outside handler deal with it
  };

  const handleClear = () => {
    onChange("");
    setIsExpanded(false);
    inputRef.current?.blur();
  };

  const shouldShowInput = isExpanded || value.trim() || isFocused;
  const shouldShowClearButton = value.trim() && (isExpanded || isFocused);

  return (
    <div
      ref={containerRef}
      className={`relative transition-all duration-300 ease-in-out ${
        shouldShowInput ? expandedWidth : collapsedWidth
      } ${className}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        if (!value.trim() && !isFocused) {
          setIsExpanded(false);
        }
      }}
    >
      <div
        className={`relative flex items-center bg-white border rounded-lg transition-all duration-300 cursor-pointer ${
          shouldShowInput
            ? "border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200"
            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
        }`}
        onClick={handleContainerClick}
      >
        {/* Search Icon */}
        <div className="absolute left-3 flex items-center pointer-events-none z-10">
          <Search
            className={`transition-all duration-300 ${
              shouldShowInput
                ? "h-4 w-4 text-gray-400"
                : "h-5 w-5 text-gray-500"
            }`}
          />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className={`w-full bg-transparent border-0 outline-none transition-all duration-300 ${
            shouldShowInput
              ? "pl-10 pr-10 py-2 text-sm opacity-100"
              : "pl-10 pr-3 py-2 text-sm opacity-0 pointer-events-none"
          }`}
          placeholder={placeholder}
          style={{
            transform: shouldShowInput ? "translateX(0)" : "translateX(-100%)",
          }}
        />

        {/* Clear Button */}
        {shouldShowClearButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
          </button>
        )}

        {/* Collapsed State Overlay */}
        {!shouldShowInput && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500 hover:text-gray-700 transition-colors">
              <Search className="h-5 w-5" />
            </div>
          </div>
        )}
      </div>

      {/* Expansion Hint */}
      {!shouldShowInput && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
          Click or hover to search
        </div>
      )}
    </div>
  );
};

export default ExpandableSearch;
