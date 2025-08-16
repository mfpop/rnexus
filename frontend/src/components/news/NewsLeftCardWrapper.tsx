import React from "react";
import { useNewsContext } from "./NewsContext";
import NewsLeftCardSimple from "./NewsLeftCardSimple";

/**
 * NewsLeftCardWrapper - Safely renders NewsLeftCardSimple within NewsProvider context
 * This component acts as a bridge to ensure the NewsProvider is available
 */
const NewsLeftCardWrapper: React.FC = () => {
  // This will throw an error if NewsProvider is not available
  const context = useNewsContext();
  
  // If we get here, the NewsProvider is available
  return <NewsLeftCardSimple />;
};

export default NewsLeftCardWrapper;
