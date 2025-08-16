import React from 'react';
import { useChatContext } from '../../contexts/ChatContext';
import { Message } from './MessageTypes';

interface ProfileViewProps {
  messages: Message[];
  setShowProfileView: (show: boolean) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ messages, setShowProfileView }) => {
  const { selectedContact } = useChatContext();

  if (!selectedContact) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {selectedContact.avatar}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedContact.name}</h2>
          <p className="text-gray-600">{selectedContact.title || 'No title'}</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="text-gray-800">{selectedContact.department || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-800">{selectedContact.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-gray-800 capitalize">{selectedContact.status || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Chat Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Messages:</span>
                  <span className="text-gray-800">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Active:</span>
                  <span className="text-gray-800">
                    {selectedContact.status === 'online' ? 'Now' : 'Recently'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setShowProfileView(false)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Back to Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
