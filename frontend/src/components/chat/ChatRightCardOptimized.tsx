import React, { useState, useEffect, useRef, useCallback } from "react";
import { useChatContext } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/AuthContext";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ProfileView from "./ProfileView";
import CameraModal from "./CameraModal";
import ChatSearch from "./ChatSearch";
import ChatLoadingSkeleton from "./ChatLoadingSkeleton";
import ChatErrorBoundary from "./ChatErrorBoundary";
import { useChatState } from "./useChatState";
import { Message, TextMessage } from "./MessageTypes";

const ChatRightCard: React.FC = () => {
  const { selectedContact } = useChatContext();
  const { user: currentUser } = useAuth();

  // Use custom hook for state management
  const chatState = useChatState({ selectedContact });

  // Additional state for UI
  const [showProfileView, setShowProfileView] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Dropdown states for MessageInput
  const [emojiDropdownOpen, setEmojiDropdownOpen] = useState(false);
  const [attachmentDropdownOpen, setAttachmentDropdownOpen] = useState(false);

  // GraphQL integration (simplified for now)
  const graphqlLoading = false;

  // Load messages when contact changes
  useEffect(() => {
    if (selectedContact) {
      // For now, just use GraphQL messages
      // TODO: Implement proper message loading
      console.log("Loading messages for contact:", selectedContact.id);
    }
  }, [selectedContact]);

  // Send message handler
  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatState.message.trim() || !selectedContact || !currentUser) return;

    const newMessage: TextMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.username || "You",
      content: chatState.message,
      timestamp: new Date().toISOString(),
      type: "text",
      status: "sending",
      replyTo: chatState.replyToMessage,
    };

    // Add message to local state immediately
    chatState.setMessages(prev => [...prev, newMessage]);
    chatState.setMessage("");
    chatState.setReplyToMessage(null);

    // Simulate sending (replace with actual API call)
    setTimeout(() => {
      chatState.setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id
            ? { ...msg, status: "sent" as const }
            : msg
        )
      );
    }, 1000);
  }, [chatState, selectedContact, currentUser]);

  // Voice recording handlers
  const startVoiceRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, []);

  const stopVoiceRecording = useCallback(() => {
    setIsRecording(false);
    setRecordingTime(0);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  }, []);

  const formatRecordingTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // File upload handler
  const handleFileUpload = useCallback((acceptedTypes: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptedTypes;
      fileInputRef.current.click();
    }
  }, []);

  // Emoji handler
  const addEmoji = useCallback((emoji: string) => {
    chatState.setMessage(prev => prev + emoji);
    setEmojiDropdownOpen(false);
  }, [chatState]);

  // Typing indicator
  const handleTyping = useCallback((isTyping: boolean) => {
    chatState.setIsTyping(isTyping);
  }, [chatState]);

  // Message actions
  const handleDelete = useCallback((messageId: number) => {
    chatState.setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, [chatState]);

  const handleForward = useCallback((message: Message) => {
    // TODO: Implement forward functionality
    console.log("Forward message:", message);
  }, []);

  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  // Format time utility
  const formatTime = useCallback((timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffInMinutes < 1) return "now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;

      return date.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  }, []);

  // If no contact selected, show empty state
  if (!selectedContact) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Select a conversation
          </h3>
          <p className="text-gray-600">
            Choose a contact or group from the left panel to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <ChatErrorBoundary>
      <div className="h-full flex flex-col bg-white">
        {/* Chat Header */}
        <ChatHeader
          messages={chatState.filteredMessages}
          formatTime={formatTime}
          onClearChat={() => chatState.setMessages([])}
          onEnterSelectionMode={() => chatState.setIsSelectionMode(true)}
          isSelectionMode={chatState.isSelectionMode}
          onCloseChat={() => {/* TODO: Implement close chat */}}
          onSearch={chatState.handleSearch}
          searchQuery={chatState.searchQuery}
          onClearSearch={chatState.handleClearSearch}
        />

        {/* Search Bar */}
        {chatState.searchQuery && (
          <div className="px-4 py-2 border-b border-gray-200">
            <ChatSearch
              searchQuery={chatState.searchQuery}
              onSearchChange={chatState.handleSearch}
              onClearSearch={chatState.handleClearSearch}
              placeholder="Search in conversation..."
            />
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden relative">
          {graphqlLoading ? (
            <div className="p-4">
              <ChatLoadingSkeleton count={5} />
            </div>
          ) : (
            <MessageList
              messages={chatState.filteredMessages}
              messagesEndRef={chatState.messagesEndRef}
              scrollToBottom={chatState.scrollToBottom}
              formatTime={formatTime}
              onReply={chatState.handleReply}
              onForward={handleForward}
              onDelete={handleDelete}
              onCopy={handleCopy}
              onMessageSelect={chatState.handleMessageSelect}
              selectedMessages={chatState.selectedMessages}
              isSelectionMode={chatState.isSelectionMode}
              messageOptionsOpen={chatState.messageOptionsOpen}
              setMessageOptionsOpen={chatState.setMessageOptionsOpen}
              currentUserId={currentUser?.id}
            />
          )}
        </div>

        {/* Message Input */}
        <MessageInput
          message={chatState.message}
          setMessage={chatState.setMessage}
          handleSendMessage={handleSendMessage}
          isRecording={isRecording}
          recordingTime={recordingTime}
          formatRecordingTime={formatRecordingTime}
          stopVoiceRecording={stopVoiceRecording}
          startVoiceRecording={startVoiceRecording}
          addEmoji={addEmoji}
          onTyping={handleTyping}
          replyToMessage={chatState.replyToMessage}
          onClearReply={() => chatState.setReplyToMessage(null)}
          handleFileUpload={handleFileUpload}
          onPhotoCapture={() => setShowCamera(true)}
          showCamera={showCamera}
          setShowCamera={setShowCamera}
          handlePhotoCapture={() => setShowCamera(true)}
          fileInputRef={fileInputRef}
          emojiDropdownOpen={emojiDropdownOpen}
          setEmojiDropdownOpen={setEmojiDropdownOpen}
          attachmentDropdownOpen={attachmentDropdownOpen}
          setAttachmentDropdownOpen={setAttachmentDropdownOpen}
          setReplyToMessage={chatState.setReplyToMessage}
        />

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={(e) => {
            // TODO: Handle file selection
            console.log("Files selected:", e.target.files);
          }}
        />

        {/* Profile View Modal */}
        {showProfileView && (
          <ProfileView
            messages={chatState.filteredMessages}
            setShowProfileView={setShowProfileView}
          />
        )}

        {/* Camera Modal */}
        {showCamera && (
          <CameraModal
            showCamera={showCamera}
            setShowCamera={setShowCamera}
            onPhotoCapture={(photoData: string) => {
              // TODO: Handle photo capture
              console.log("Photo captured:", photoData);
              setShowCamera(false);
            }}
            videoRef={videoRef}
            fileInputRef={fileInputRef}
          />
        )}
      </div>
    </ChatErrorBoundary>
  );
};

export default ChatRightCard;
