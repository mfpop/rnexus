import React from 'react';

interface TeamsLeftCardProps {
  onCreateMeeting?: () => void;
  onStartChat?: () => void;
}

const TeamsLeftCard: React.FC<TeamsLeftCardProps> = ({ onCreateMeeting, onStartChat }) => {
  const handleCreateMeeting = () => {
    if (onCreateMeeting) {
      onCreateMeeting();
    } else {
      // Fallback: navigate to teams page and trigger create meeting
      window.location.href = '/teams';
    }
  };

  const handleStartChat = () => {
    if (onStartChat) {
      onStartChat();
    } else {
      // Fallback: navigate to teams page and trigger start chat
      window.location.href = '/teams';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="space-y-3">
          <button
            onClick={handleCreateMeeting}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Meeting</span>
          </button>
          <button
            onClick={handleStartChat}
            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Recent Meetings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Meetings</h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 text-sm">Weekly Standup</h4>
            <p className="text-xs text-gray-600">Today, 9:00 AM</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 text-sm">Project Review</h4>
            <p className="text-xs text-gray-600">Tomorrow, 2:00 PM</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-xs text-blue-700">Meetings</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">4</div>
            <div className="text-xs text-green-700">Channels</div>
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Need help with Teams?</p>
          <button
            onClick={() => window.location.href = '/help'}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamsLeftCard;
