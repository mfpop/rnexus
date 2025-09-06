import React from "react";
import { useNewsContext } from "./NewsContextNew";
import NewsLeftCardSimple from "./NewsLeftCardSimple";

/**
 * NewsLeftCardWrapper - Safely renders NewsLeftCardSimple within NewsProvider context
 * This component acts as a bridge to ensure the NewsProvider is available
 */
const NewsLeftCardWrapper: React.FC = () => {
  try {
    // Ensure NewsProvider is available; we intentionally call the hook for validation.
    useNewsContext();

    // If we get here, the NewsProvider is available
    return <NewsLeftCardSimple />;
  } catch (error) {
    // If context is not available, show a loading state or error
    console.error("NewsProvider not available:", error);
    return (
      <div className="p-4 text-center text-gray-500">
        Loading news...
      </div>
    );
  }
};

export default NewsLeftCardWrapper;
