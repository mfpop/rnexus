import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  Bookmark,
  Eye,
  MessageSquare,
} from "lucide-react";
import { useNewsContext, NewsArticle } from "./NewsContext";

/**
 * NewsLeftCardSimple - Simple news articles list for StableLayout integration
 * This is the left card content that appears in StableLayout for the news page
 */
const NewsLeftCardSimple: React.FC = () => {
  const { selectedArticle, setSelectedArticle } = useNewsContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const newsArticles: NewsArticle[] = [
    {
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
    },
    {
      id: 2,
      title: "Industry 4.0 Technologies Integration Update",
      summary:
        "Latest developments in our digital transformation journey and IoT implementation.",
      content:
        "Our digital transformation initiative has reached a significant milestone with the successful implementation of Industry 4.0 technologies across our manufacturing facilities. The integration of IoT sensors and smart analytics is revolutionizing our operations.",
      author: "Mike Chen",
      publishDate: new Date(Date.now() - 7200000),
      category: "technology",
      priority: "medium",
      readTime: 5,
      views: 189,
      likes: 15,
      comments: 12,
      isBookmarked: true,
      tags: ["industry40", "iot", "digital"],
    },
    {
      id: 3,
      title: "Safety Training Program Completion",
      summary:
        "100% of our workforce has completed the new safety certification program.",
      content:
        "We are proud to announce that 100% of our workforce has successfully completed the comprehensive new safety certification program. This milestone demonstrates our unwavering commitment to maintaining the highest safety standards across all operations.",
      author: "Emily Wilson",
      publishDate: new Date(Date.now() - 14400000),
      category: "safety",
      priority: "high",
      readTime: 4,
      views: 156,
      likes: 23,
      comments: 6,
      isBookmarked: false,
      tags: ["safety", "training", "certification"],
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "company":
        return "bg-blue-100 text-blue-800";
      case "industry":
        return "bg-green-100 text-green-800";
      case "technology":
        return "bg-purple-100 text-purple-800";
      case "safety":
        return "bg-red-100 text-red-800";
      case "production":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredArticles = newsArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            placeholder="Search articles..."
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {[
          { key: "all", label: "All" },
          { key: "company", label: "Company" },
          { key: "production", label: "Production" },
          { key: "technology", label: "Tech" },
          { key: "safety", label: "Safety" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeCategory === tab.key
                ? "text-blue-600 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-800 border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Articles List */}
      <div className="flex-1 overflow-y-auto">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
              selectedArticle?.id === article.id
                ? "bg-blue-50 border-blue-200"
                : ""
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}
              >
                {article.category.charAt(0).toUpperCase() +
                  article.category.slice(1)}
              </span>
              <span className="text-xs text-gray-500">
                {formatTimeAgo(article.publishDate)}
              </span>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {article.title}
            </h3>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {article.summary}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>By {article.author}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{article.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{article.comments}</span>
                </div>
                {article.isBookmarked && (
                  <Bookmark className="h-3 w-3 text-blue-500 fill-current" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsLeftCardSimple;
