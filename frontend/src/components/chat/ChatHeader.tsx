import React, { useState } from 'react';
import { useChatContext } from '../../contexts/ChatContext';
import { Message } from './MessageTypes';

interface ChatHeaderProps {
  messages: Message[];
  formatTime: (timestamp: Date) => string;
  onClearChat: () => void;
  onEnterSelectionMode: () => void;
  isSelectionMode: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  messages,
  formatTime,
  onClearChat,
  onEnterSelectionMode,
  isSelectionMode
}) => {
  const { selectedContact } = useChatContext();
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  if (!selectedContact) {
    return null;
  }

  const getLastSeen = () => {
    if (selectedContact.status === 'online') return 'online';

    const lastMessage = messages.find(msg => msg.senderId !== 1);
    if (lastMessage) {
      const now = new Date();
      const diff = now.getTime() - lastMessage.timestamp.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return lastMessage.timestamp.toLocaleDateString();
    }
    return 'offline';
  };

  return (
    <div className="px-4 py-3 border-b border-gray-200 bg-white relative z-50 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-[#25d366] to-[#128c7e] rounded-full flex items-center justify-center text-white font-medium text-lg">
              {selectedContact.avatar || selectedContact.name.charAt(0).toUpperCase()}
            </div>
            {!selectedContact.isGroup && selectedContact.status === 'online' && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-lg">{selectedContact.name}</h3>
            <p className="text-sm text-gray-600">
              {selectedContact.isGroup
                ? `${selectedContact.members || 0} members`
                : getLastSeen()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Selection Mode Toggle */}
          {!isSelectionMode && (
            <button
              onClick={onEnterSelectionMode}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Select messages"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
          )}

          {/* Search */}
          <button
            onClick={() => {
              const searchTerm = prompt(`Search in conversation with ${selectedContact?.name}:\n\nEnter search term:`);
              if (searchTerm && searchTerm.trim()) {
                const matchingMessages = messages.filter((msg) =>
                  msg.content.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (matchingMessages.length > 0) {
                  // Create a more user-friendly search results display
                  const results = matchingMessages.map((msg, index) => {
                    const time = formatTime(msg.timestamp);
                    const preview = msg.content.length > 50
                      ? msg.content.substring(0, 50) + '...'
                      : msg.content;
                    return `${index + 1}. [${time}] ${msg.senderName}: ${preview}`;
                  }).join('\n\n');

                  alert(`🔍 Found ${matchingMessages.length} message(s) containing "${searchTerm}":\n\n${results}`);
                } else {
                  alert(`🔍 No messages found containing "${searchTerm}"`);
                }
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Search messages"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* More Options */}
          <div className="relative">
            <button
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="More options"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showMoreOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    setShowMoreOptions(false);
                    if (confirm(`Start voice call with ${selectedContact?.name}?`)) {
                      alert(`📞 Calling ${selectedContact?.name}...\n\nCall duration: 00:00\nStatus: Connecting...\n\n(Real call functionality would be implemented here)`);
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Voice Call</span>
                </button>

                <button
                  onClick={() => {
                    setShowMoreOptions(false);
                    alert(`📹 Starting video call with ${selectedContact?.name}...\n\nVideo: ON\nAudio: ON\nStatus: Connecting...\n\n(Real video call functionality would be implemented here)`);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Video Call</span>
                </button>

                <div className="border-t border-gray-200 my-1"></div>

                <button
                  onClick={() => {
                    setShowMoreOptions(false);
                    onClearChat();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showMoreOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMoreOptions(false)}
        />
      )}
    </div>
  );
};

export default ChatHeader;
