import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * TableOfContents - Legacy table of contents component
 * Original home page left card content (for reference/backup)
 */
const TableOfContents: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Table of Contents */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Table of Contents
        </h1>

        {/* News & Updates */}
        <div
          className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          onClick={() => handleCardClick("/news")}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                News & Updates
              </h3>
              <p className="text-gray-600 text-xs">
                Stay informed with latest updates and announcements
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Activity Tracking */}
        <div
          className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          onClick={() => handleCardClick("/activities")}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                Activity Management
              </h3>
              <p className="text-gray-600 text-xs">
                Track and manage ongoing activities
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Projects */}
        <div
          className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          onClick={() => handleCardClick("/projects")}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Projects</h3>
              <p className="text-gray-600 text-xs">
                Explore and manage ongoing projects
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Production Management */}
        <div
          className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          onClick={() => handleCardClick("/production")}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                Production Management
              </h3>
              <p className="text-gray-600 text-xs">
                Monitor and manage your production environment
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Performance Metrics */}
        <div
          className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          onClick={() => handleCardClick("/metrics")}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                Performance Metrics
              </h3>
              <p className="text-gray-600 text-xs">
                View detailed performance metrics and analytics
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Application Performance */}
        <div
          className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          onClick={() => handleCardClick("/system")}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                Application Performance
              </h3>
              <p className="text-gray-600 text-xs">
                Monitor real-time application performance and diagnostics
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Team Communication */}
        <div
          className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          onClick={() => handleCardClick("/chat")}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                Team Communication
              </h3>
              <p className="text-gray-600 text-xs">
                Communicate with team members
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* About */}
        <div
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          onClick={() => handleCardClick("/about")}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">About</h3>
              <p className="text-gray-600 text-xs">
                Learn about RNexus - our mission, team, and achievements
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Contact */}
        <div
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          onClick={() => handleCardClick("/contact")}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Contact</h3>
              <p className="text-gray-600 text-xs">
                Get in touch with our team
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
