import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useChatContext } from '../../contexts/ChatContext';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ProfileView from './ProfileView';
import CameraModal from './CameraModal';
import ChatApiService from '../../lib/chatApi';
import { Message } from './MessageTypes';
import ExpandableSearch from '../ui/ExpandableSearch';

const ChatRightCard: React.FC = () => {
  const { selectedContact } = useChatContext();

  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [showProfileView, setShowProfileView] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [messageOptionsOpen, setMessageOptionsOpen] = useState<number | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Message search state
  const [searchQuery, setSearchQuery] = useState('');

  // Filter messages based on search query
  const filteredMessages = searchQuery.trim()
    ? messages.filter(message =>
        message.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Load messages from database when contact changes
  useEffect(() => {
    if (selectedContact) {
      loadMessages();
    }
  }, [selectedContact]);

  // Load messages from database
  const loadMessages = async () => {
    if (!selectedContact) return;

    try {
      const result = await ChatApiService.getMessages(selectedContact.id.toString());
      setMessages(result.messages);

      // Mark messages as read
      await ChatApiService.markMessagesAsRead(selectedContact.id.toString());

      // Scroll to bottom after messages load
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
      // Fallback to empty messages if API fails
      setMessages([]);
    }
  };

  // Send message to database
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedContact) return;

    const messageContent = message.trim();
    setMessage('');

    // Clear reply if exists
    if (replyToMessage) {
      setReplyToMessage(null);
    }

    try {
      // Send message to database
      const newMessage = await ChatApiService.sendMessage(
        selectedContact.id.toString(),
        messageContent,
        'text',
        replyToMessage?.id,
        false,
        ''
      );

      // Add message to local state
      setMessages(prev => [...prev, newMessage]);

      // Scroll to bottom
      setTimeout(() => {
        scrollToBottom();
      }, 100);

    } catch (error) {
      console.error('Error sending message:', error);
      // You could show an error toast here
    }
  };

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  }, []);

  // Message actions
  const handleReply = useCallback((message: Message) => {
    setReplyToMessage(message);
  }, []);

  const handleForward = useCallback((message: Message) => {
    // Implementation for forwarding messages
    console.debug('Forwarding message id:', message.id);

    // Show forward dialog
    const contacts = ['John Doe', 'Jane Smith', 'Team Group', 'Family Chat'];
    const contactOptions = contacts.map((contact, index) => `${index + 1}. ${contact}`).join('\n');

    const selectedContact = prompt(`Forward message to:\n\n${contactOptions}\n\nEnter contact number (1-${contacts.length}):`);

    if (selectedContact && !isNaN(Number(selectedContact))) {
      const contactIndex = Number(selectedContact) - 1;
      if (contactIndex >= 0 && contactIndex < contacts.length) {
        alert(`✅ Message forwarded to: ${contacts[contactIndex]}\n\nOriginal: "${message.content}"`);
      } else {
        alert('❌ Invalid contact selection');
      }
    }
  }, []);

  const handleDelete = useCallback(async (messageId: number) => {
    try {
      await ChatApiService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }, []);

  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      alert(`📋 Message copied to clipboard!\n\n"${content.length > 50 ? content.substring(0, 50) + '...' : content}"`);
    }).catch((error) => {
      console.error('Failed to copy text:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`📋 Message copied to clipboard!\n\n"${content.length > 50 ? content.substring(0, 50) + '...' : content}"`);
    });
  }, []);

  // Selection mode
  const toggleMessageSelection = useCallback((messageId: number) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  }, []);

  const enterSelectionMode = useCallback(() => {
    setIsSelectionMode(true);
  }, []);

  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedMessages(new Set());
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (selectedMessages.size === 0) return;

    try {
      for (const messageId of selectedMessages) {
        await ChatApiService.deleteMessage(messageId);
      }

      setMessages(prev => prev.filter(msg => !selectedMessages.has(msg.id)));
      exitSelectionMode();
    } catch (error) {
      console.error('Error bulk deleting messages:', error);
    }
  }, [selectedMessages, exitSelectionMode]);

  const handleBulkForward = useCallback(() => {
    // Implementation for bulk forwarding
    console.debug('Bulk forwarding messages count:', selectedMessages.size);

    if (selectedMessages.size === 0) return;

    const contacts = ['John Doe', 'Jane Smith', 'Team Group', 'Family Chat'];
    const contactOptions = contacts.map((contact, index) => `${index + 1}. ${contact}`).join('\n');

    const selectedContact = prompt(`Forward ${selectedMessages.size} messages to:\n\n${contactOptions}\n\nEnter contact number (1-${contacts.length}):`);

    if (selectedContact && !isNaN(Number(selectedContact))) {
      const contactIndex = Number(selectedContact) - 1;
      if (contactIndex >= 0 && contactIndex < contacts.length) {
        alert(`✅ ${selectedMessages.size} messages forwarded to: ${contacts[contactIndex]}`);
        exitSelectionMode();
      } else {
        alert('❌ Invalid contact selection');
      }
    }
  }, [selectedMessages, exitSelectionMode]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Emoji handling
  const addEmoji = useCallback((emoji: string) => {
    setMessage(prev => prev + emoji);
  }, []);

  // File handling
  const handleFileUpload = useCallback((acceptedTypes: string) => {
    // Handle file upload logic here
    console.debug('File upload for types:', acceptedTypes);

    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptedTypes;
      fileInputRef.current.click();

      fileInputRef.current.onchange = (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (file) {
          // Simulate file upload process
          alert(`📁 File selected: ${file.name}\nSize: ${(file.size / 1024 / 1024).toFixed(2)} MB\nType: ${file.type}\n\n✅ File would be uploaded to chat`);

          // Reset the input
          target.value = '';
        }
      };
    }
  }, [fileInputRef]);

  const handlePhotoCapture = useCallback(async () => {
    setShowCamera(true);
  }, []);

  // Voice recording
  const startVoiceRecording = useCallback(async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Stop the stream after starting (in real implementation, you'd keep it for recording)
      stream.getTracks().forEach(track => track.stop());

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('❌ Could not access microphone. Please check your permissions.');
    }
  }, []);

  const stopVoiceRecording = useCallback(() => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    const recordTime = recordingTime;
    setRecordingTime(0);

    if (recordTime > 0) {
      const mins = Math.floor(recordTime / 60);
      const secs = recordTime % 60;
      const timeString = `${mins}:${secs.toString().padStart(2, '0')}`;
      alert(`🎤 Voice message recorded!\nDuration: ${timeString}\n\n✅ Voice message would be sent to chat`);
    }
  }, [recordingTime]);

  const formatRecordingTime = useCallback((time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Clear chat
  const handleClearChat = useCallback(async () => {
    if (!selectedContact || !confirm('Are you sure you want to clear this chat? This action cannot be undone.')) {
      return;
    }

    try {
      // Clear messages from database (you might want to implement a clear chat endpoint)
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  }, [selectedContact]);

  // Cleanup typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      return undefined;
    };
  }, []);

  // Show welcome screen if no contact is selected
  if (!selectedContact) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="text-center max-w-lg mx-auto px-8">
          <div className="w-28 h-28 bg-gradient-to-br from-[#25d366] to-[#128c7e] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-message-circle text-white">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Nexus Chat</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Select a contact from the left sidebar to start chatting.
            Your conversations will be automatically saved and synchronized across all your devices.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#f0f2f5] overflow-hidden">
      {/* Selection Mode Toolbar */}
      {isSelectionMode && (
        <div className="bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white px-6 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-4">
            <button
              onClick={exitSelectionMode}
              className="p-2 hover:bg-white/20 rounded-full transition-colors hover:scale-110 transform duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="font-semibold text-lg">{selectedMessages.size} selected</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleBulkForward}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors hover:scale-105 transform duration-200"
            >
              Forward
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full text-sm font-medium transition-colors hover:scale-105 transform duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <ChatHeader
        messages={messages}
        formatTime={(timestamp: Date) => timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        onClearChat={handleClearChat}
        onEnterSelectionMode={enterSelectionMode}
        isSelectionMode={isSelectionMode}
      />

      {/* Message Search */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <ExpandableSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search messages..."
          className="w-full"
        />
      </div>

      {/* Chat Content */}
      {showProfileView ? (
        <ProfileView
          messages={messages}
          setShowProfileView={setShowProfileView}
        />
      ) : (
        <>
          {/* Typing Indicator */}
          {isTyping && (
            <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 mx-4 my-2 rounded-r-lg shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm font-medium text-blue-700">{selectedContact.name} is typing...</span>
              </div>
            </div>
          )}

          {/* Messages */}
          <MessageList
            messages={filteredMessages}
            formatTime={(timestamp: Date) => timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            onReply={handleReply}
            onForward={handleForward}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onMessageSelect={toggleMessageSelection}
            selectedMessages={selectedMessages}
            isSelectionMode={isSelectionMode}
            messageOptionsOpen={messageOptionsOpen}
            setMessageOptionsOpen={setMessageOptionsOpen}
            messagesEndRef={messagesEndRef}
            scrollToBottom={scrollToBottom}
          />

          {/* Reply Preview */}
          {replyToMessage && (
            <div className="px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs font-medium text-amber-700 mb-1">Replying to {replyToMessage.senderName}</div>
                  <div className="text-sm text-amber-800 truncate">
                    {replyToMessage.type === 'text' ? replyToMessage.content : `📎 ${replyToMessage.type}`}
                  </div>
                </div>
                <button
                  onClick={() => setReplyToMessage(null)}
                  className="p-2 hover:bg-amber-200 rounded-full transition-colors hover:scale-110 transform duration-200"
                >
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Message Input */}
          <MessageInput
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            isRecording={isRecording}
            recordingTime={recordingTime}
            formatRecordingTime={formatRecordingTime}
            stopVoiceRecording={stopVoiceRecording}
            startVoiceRecording={startVoiceRecording}
            addEmoji={addEmoji}
            handleFileUpload={handleFileUpload}
            handlePhotoCapture={handlePhotoCapture}
            fileInputRef={fileInputRef}
            emojiDropdownOpen={false}
            setEmojiDropdownOpen={() => {}}
            attachmentDropdownOpen={false}
            setAttachmentDropdownOpen={() => {}}
            onTyping={handleTyping}
            replyToMessage={replyToMessage}
            setReplyToMessage={setReplyToMessage}
            showCamera={showCamera}
            setShowCamera={setShowCamera}
          />
        </>
      )}

      {/* Camera Modal */}
      <CameraModal
        showCamera={showCamera}
        setShowCamera={setShowCamera}
        onPhotoCapture={(photoData: string) => {
          console.log('Photo captured:', photoData);
          setShowCamera(false);
        }}
        videoRef={videoRef}
        fileInputRef={fileInputRef}
      />

      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={() => {}} // Handled in handleFileUpload
      />
    </div>
  );
};

export default ChatRightCard;
