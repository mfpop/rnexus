import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, MapPin, Search, Loader2 } from "lucide-react";
import { cn } from "../../../lib/bits-ui";
import OpenAddressesService, {
  AddressSuggestion,
} from "../../../lib/openAddressesService";

interface ZipCodeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  city: string;
  state: string;
  country?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const ZipCodeDropdown: React.FC<ZipCodeDropdownProps> = ({
  value,
  onChange,
  city,
  state,
  country = "US",
  className,
  placeholder = "Select ZIP code",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load ZIP code suggestions when country changes, or when city/state are available
  useEffect(() => {
    if (country && !disabled) {
      loadZipCodeSuggestions();
    }
  }, [city, state, country, disabled]);

  // Close dropdown when clicking outside
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

  const loadZipCodeSuggestions = async () => {
    setLoading(true);
    try {
      let zipCodes: string[] = [];

      if (city && state) {
        // Try OpenStreetMap API with city and state
        zipCodes = await OpenAddressesService.getZipCodes(city, state, country);

        // If no results from API, use fallback data
        if (zipCodes.length === 0) {
          console.log(
            `No ZIP codes found from API for ${city}, ${state}, using fallback data`,
          );
          zipCodes = OpenAddressesService.getFallbackZipCodes(city, state);
        }
      } else if (state) {
        // If only state is available, get all ZIP codes for the state
        zipCodes = OpenAddressesService.getFallbackZipCodes("", state);
      } else {
        // If only country is available, provide common ZIP codes or allow manual entry
        zipCodes = [];
      }

      // Convert to suggestions format
      const suggestions: AddressSuggestion[] = zipCodes.map((zip) => ({
        display:
          city && state
            ? `${city}, ${state} ${zip}`
            : state
              ? `${state} ${zip}`
              : zip,
        postcode: zip,
        city: city || "",
        state: state || "",
        country,
      }));

      setSuggestions(suggestions);
      console.log(
        `Loaded ${suggestions.length} ZIP code suggestions for ${city || "any city"}, ${state || "any state"}`,
      );
    } catch (error) {
      console.error(
        "Failed to load ZIP codes from API, using fallback data:",
        error,
      );
      // Use fallback data on error
      const fallbackZipCodes = OpenAddressesService.getFallbackZipCodes(
        city || "",
        state || "",
      );
      const fallbackSuggestions: AddressSuggestion[] = fallbackZipCodes.map(
        (zip) => ({
          display:
            city && state
              ? `${city}, ${state} ${zip}`
              : state
                ? `${state} ${zip}`
                : zip,
          postcode: zip,
          city: city || "",
          state: state || "",
          country,
        }),
      );
      setSuggestions(fallbackSuggestions);
      console.log(
        `Using ${fallbackSuggestions.length} fallback ZIP codes for ${city || "any city"}, ${state || "any state"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    onChange(suggestion.postcode);
    setIsOpen(false);
    setSearchQuery("");
  };

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.postcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.display.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // const selectedSuggestion = suggestions.find(s => s.postcode === value);

  // Disable if missing required fields or explicitly disabled
  if (disabled || !country || !city || !state) {
    return (
      <div className={cn("relative", className)}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-8 px-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
          placeholder={
            !country
              ? "Select country first"
              : !city
                ? "Select city first"
                : !state
                  ? "Select state first"
                  : "Enter ZIP code manually"
          }
          disabled
        />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-7 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white flex items-center justify-between hover:bg-gray-50"
        disabled={loading}
      >
        <div className="flex items-center gap-2 flex-1 text-left">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          ) : (
            <MapPin className="w-4 h-4 text-gray-400" />
          )}
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ZIP codes..."
                className="w-full pl-8 pr-3 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Suggestions list */}
          <div className="py-1">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.postcode}-${index}`}
                  type="button"
                  onClick={() => handleSelect(suggestion)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors",
                    suggestion.postcode === value &&
                      "bg-blue-100 text-blue-700",
                  )}
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{suggestion.display}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                {searchQuery ? "No ZIP codes found" : "No ZIP codes available"}
              </div>
            )}
          </div>

          {/* Manual entry option */}
          <div className="p-2 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2">
              <div className="text-xs text-gray-600 text-center">
                Enter ZIP code manually:
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery) {
                    onChange(searchQuery);
                    setIsOpen(false);
                    setSearchQuery("");
                  }
                }}
                placeholder="Enter ZIP code..."
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onChange(searchQuery);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className="w-full text-sm bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
                >
                  Use "{searchQuery}"
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZipCodeDropdown;
