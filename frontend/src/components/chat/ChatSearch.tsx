import React, { useState, useCallback, memo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface ChatSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  placeholder?: string;
  className?: string;
}

const ChatSearch: React.FC<ChatSearchProps> = memo(({
  searchQuery,
  onSearchChange,
  onClearSearch,
  placeholder = "Search messages...",
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const handleClear = useCallback(() => {
    onSearchChange("");
    onClearSearch();
  }, [onSearchChange, onClearSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear();
    }
  }, [handleClear]);

  return (
    <div className={`relative ${className}`}>
      <div className={`relative flex items-center ${
        isFocused ? "ring-2 ring-blue-500 ring-opacity-50" : ""
      }`}>
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="h-4 w-4 text-gray-400" />
        </div>

        <Input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10 py-2 w-full border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        />

        {searchQuery && (
          <Button
            onClick={handleClear}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            title="Clear search"
          >
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        )}
      </div>

      {/* Search results indicator */}
      {searchQuery && (
        <div className="mt-2 text-xs text-gray-500">
          Searching for: "{searchQuery}"
        </div>
      )}
    </div>
  );
});

ChatSearch.displayName = "ChatSearch";

export default ChatSearch;
