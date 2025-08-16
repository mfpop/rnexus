import React, { createContext, useContext, useState, ReactNode } from "react";

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: Date;
  category: "company" | "industry" | "technology" | "safety" | "production";
  priority: "high" | "medium" | "low";
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  isBookmarked: boolean;
  tags: string[];
}

interface NewsContextType {
  selectedArticle: NewsArticle | null;
  setSelectedArticle: (article: NewsArticle | null) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error("useNewsContext must be used within a NewsProvider");
  }
  return context;
};

interface NewsProviderProps {
  children: ReactNode;
}

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  // Default article to show when the page loads
  const defaultArticle: NewsArticle = {
    id: 1,
    title: "New Production Line Efficiency Record Set",
    summary:
      "Our manufacturing team achieved a new efficiency record with 98.5% uptime this quarter.",
    content:
      "Our manufacturing team has accomplished a remarkable milestone by achieving a new efficiency record with 98.5% uptime this quarter. This achievement represents months of dedicated work by our cross-functional teams.",
    author: "Sarah Johnson",
    publishDate: new Date(Date.now() - 3600000),
    category: "production",
    priority: "high",
    readTime: 3,
    views: 245,
    likes: 12,
    comments: 8,
    isBookmarked: false,
    tags: ["efficiency", "production", "record"],
  };

  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    defaultArticle,
  );

  return (
    <NewsContext.Provider value={{ selectedArticle, setSelectedArticle }}>
      {children}
    </NewsContext.Provider>
  );
};

export default NewsContext;
export type { NewsArticle };
