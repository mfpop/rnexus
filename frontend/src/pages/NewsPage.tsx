import React from "react";
import { NewsRightCard } from "../components/news";

/**
 * NewsPage - News page right-side content for StableLayout integration
 * This component renders only the right-side content as StableLayout handles the overall structure
 * Left-side content is handled by NewsLeftCard in StableLayout
 * Uses NewsContext to communicate with the left card
 */
const NewsPage: React.FC = () => {
  return <NewsRightCard />;
};

export default NewsPage;
