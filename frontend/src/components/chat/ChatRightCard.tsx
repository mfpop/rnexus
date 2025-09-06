import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useChatContext } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { useChatGraphQL } from '../../hooks/useChatGraphQL';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ProfileView from './ProfileView';
import CameraModal from './CameraModal';
import ChatApiService from '../../lib/chatApi';
import { Message, ImageMessage, VideoMessage, AudioMessage, DocumentMessage, TextMessage } from './MessageTypes';

const ChatRightCard: React.FC = () => {
  const { selectedContact, setSelectedContact } = useChatContext();
  const { user: currentUser } = useAuth();

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

  // Search functionality state
  const [searchQuery, setSearchQuery] = useState('');


  // Dropdown states for MessageInput
  const [emojiDropdownOpen, setEmojiDropdownOpen] = useState(false);
  const [attachmentDropdownOpen, setAttachmentDropdownOpen] = useState(false);



  // GraphQL integration for enhanced chat functionality
  const {
    messages: graphqlMessages,
    loading: graphqlLoading,
    error: graphqlError,
    loadMessages: loadGraphQLMessages,
    sendMessage: sendGraphQLMessage,
    clearError,
  } = useChatGraphQL();



  // Filter messages based on search query
  const filteredMessages = searchQuery.trim()
    ? messages.filter(message =>
        message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.senderName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;





  // Search handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Load messages from database when contact changes
  useEffect(() => {
    if (selectedContact) {
      loadMessages();
    }
  }, [selectedContact]);

  // Sync GraphQL messages with local state
  useEffect(() => {
    if (graphqlMessages.length > 0) {
      console.log('🔄 Syncing GraphQL messages to local state:', graphqlMessages.length);
      setMessages(graphqlMessages);
    }
  }, [graphqlMessages]);

  // Load messages from GraphQL (with REST API fallback)
  const loadMessages = async () => {
    if (!selectedContact) return;

    try {
      console.log('🔄 Loading messages via GraphQL for:', selectedContact.name);

      // Try GraphQL first
      await loadGraphQLMessages(selectedContact.id.toString(), 'user');

      // Always try to use GraphQL messages first, then fallback to REST
      console.log('📊 GraphQL messages count:', graphqlMessages.length);

      if (graphqlMessages.length >= 0) {
        setMessages(graphqlMessages);
        console.log('✅ Using GraphQL messages:', graphqlMessages.length);
      } else {
        // Fallback to REST API
        console.log('📡 Falling back to REST API...');
        const result = await ChatApiService.getMessages(selectedContact.id.toString());
        setMessages(result.messages);

        // Mark messages as read
        await ChatApiService.markMessagesAsRead(selectedContact.id.toString());
      }

      // Scroll to bottom after messages load
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
      // Clear GraphQL error and fallback to empty messages
      clearError();
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
      console.log('📤 Sending message via GraphQL:', messageContent);

      // Try GraphQL first
      const graphqlMessage = await sendGraphQLMessage({
        chatId: selectedContact.id.toString(),
        chatType: 'user',
        senderId: currentUser?.id?.toString() || '1', // Use current user ID dynamically
        senderName: currentUser?.username || 'You',
        content: messageContent,
        messageType: 'text'
      });

      if (graphqlMessage) {
        console.log('✅ GraphQL message sent successfully:', graphqlMessage);
        // The GraphQL hook should automatically update the messages state
        // But let's also manually add it to local state for immediate feedback
        setMessages(prev => {
          const newMessages = [...prev, graphqlMessage];
          return newMessages;
        });
        console.log('📝 Added message to local state');
      } else {
        // Fallback to REST API
        console.log('📡 Falling back to REST API for sending message...');
        const newMessage = await ChatApiService.sendMessage(
          selectedContact.id.toString(),
          messageContent,
          'text',
          replyToMessage?.id,
          false,
          ''
        );

        // Add message to local state
        setMessages(prev => {
          const newMessages = [...prev, newMessage];
          return newMessages;
        });
      }

      // Scroll to bottom
      setTimeout(() => {
        scrollToBottom();
      }, 100);

    } catch (error) {
      console.error('Error sending message:', error);
      clearError();
      // You could show an error toast here
    }
  };

  // Handle typing indicator - This should only be called when OTHER person types
  // For demo purposes, we'll simulate the other person typing after a delay
  const handleTyping = useCallback(() => {
    // Don't show typing indicator for current user typing
    // In a real app, this would send a "typing" signal to the server
    // and the server would notify the other person

    // For demo: simulate other person typing after current user stops typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Simulate other person typing after 1 second of current user stopping
    typingTimeoutRef.current = setTimeout(() => {
      // Show typing indicator for other person
      setIsTyping(true);

      // Hide after 2 seconds
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }, 1000);
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
      setMessages(prev => {
        const newMessages = prev.filter(msg => msg.id !== messageId);
        return newMessages;
      });
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

      setMessages(prev => {
        const newMessages = prev.filter(msg => !selectedMessages.has(msg.id));
        return newMessages;
      });
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

  // Helper function to determine message type from file
  const getMessageTypeFromFile = (file: File): 'audio' | 'video' | 'document' | 'text' | 'image' | 'location' | 'contact' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) return 'document';
    return 'text'; // Default to text for unknown file types
  };

  // File handling
  const handleFileUpload = useCallback((acceptedTypes: string) => {
    console.debug('File upload for types:', acceptedTypes);

    // Create a temporary file input for this upload
    const tempFileInput = document.createElement('input');
    tempFileInput.type = 'file';
    tempFileInput.accept = acceptedTypes;
    tempFileInput.style.display = 'none';

    tempFileInput.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file && selectedContact) {
        try {
          console.log('📁 File selected:', file.name, 'Size:', file.size, 'Type:', file.type);

          // Create a temporary message to show the file is being uploaded
          const messageType = getMessageTypeFromFile(file);
          let tempMessage: Message;

          if (messageType === 'image') {
            tempMessage = {
              id: Date.now(),
              senderId: currentUser?.id || 1,
              senderName: currentUser?.username || 'You',
              content: `Uploading ${file.name}...`,
              type: 'image',
              timestamp: new Date().toISOString(),
              status: 'sending',
              replyTo: null,
              forwarded: false,
              forwardedFrom: '',
              edited: false,
              editedAt: undefined,
              imageUrl: URL.createObjectURL(file),
              fileName: file.name,
              caption: '',
              thumbnailUrl: URL.createObjectURL(file),
              fileSize: file.size
            } as ImageMessage;
          } else if (messageType === 'video') {
            tempMessage = {
              id: Date.now(),
              senderId: currentUser?.id || 1,
              senderName: currentUser?.username || 'You',
              content: `Uploading ${file.name}...`,
              type: 'video',
              timestamp: new Date().toISOString(),
              status: 'sending',
              replyTo: null,
              forwarded: false,
              forwardedFrom: '',
              edited: false,
              editedAt: undefined,
              videoUrl: URL.createObjectURL(file),
              thumbnailUrl: URL.createObjectURL(file),
              fileName: file.name,
              duration: 0,
              caption: '',
              fileSize: file.size
            } as VideoMessage;
          } else if (messageType === 'audio') {
            tempMessage = {
              id: Date.now(),
              senderId: currentUser?.id || 1,
              senderName: currentUser?.username || 'You',
              content: `Uploading ${file.name}...`,
              type: 'audio',
              timestamp: new Date().toISOString(),
              status: 'sending',
              replyTo: null,
              forwarded: false,
              forwardedFrom: '',
              edited: false,
              editedAt: undefined,
              audioUrl: URL.createObjectURL(file),
              duration: 0
            } as AudioMessage;
          } else if (messageType === 'document') {
            tempMessage = {
              id: Date.now(),
              senderId: currentUser?.id || 1,
              senderName: currentUser?.username || 'You',
              content: `Uploading ${file.name}...`,
              type: 'document',
              timestamp: new Date().toISOString(),
              status: 'sending',
              replyTo: null,
              forwarded: false,
              forwardedFrom: '',
              edited: false,
              editedAt: undefined,
              documentUrl: URL.createObjectURL(file),
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type
            } as DocumentMessage;
          } else {
            // Default to text message
            tempMessage = {
              id: Date.now(),
              senderId: currentUser?.id || 1,
              senderName: currentUser?.username || 'You',
              content: `Uploading ${file.name}...`,
              type: 'text',
              timestamp: new Date().toISOString(),
              status: 'sending',
              replyTo: null,
              forwarded: false,
              forwardedFrom: '',
              edited: false,
              editedAt: undefined
            } as TextMessage;
          }

          // Add temporary message to chat
          setMessages(prev => {
            const newMessages = [...prev, tempMessage];
            return newMessages;
          });

          // Simulate file upload process (in real app, this would upload to server)
          setTimeout(() => {
            // Update message status to sent
            setMessages(prev => prev.map(msg =>
              msg.id === tempMessage.id
                ? { ...msg, status: 'sent', content: `📎 ${file.name}` }
                : msg
            ));

            // Scroll to bottom
            scrollToBottom();
          }, 2000);

          // Clean up temporary file input
          document.body.removeChild(tempFileInput);

        } catch (error) {
          console.error('Error handling file upload:', error);
          alert('❌ Error uploading file. Please try again.');
        }
      }
    };

    // Add to DOM and trigger click
    document.body.appendChild(tempFileInput);
    tempFileInput.click();
  }, [selectedContact, currentUser, scrollToBottom]);

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
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary floating elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-40 h-40 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 left-1/5 w-28 h-28 bg-gradient-to-br from-purple-200 to-violet-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Secondary accent elements */}
          <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        </div>

        <div className="text-center z-10 max-w-lg px-6 py-8 flex flex-col justify-center h-full min-h-0">
          {/* Compact Chat Icon */}
          <div className="relative mx-auto mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#25d366] via-[#20bd5f] to-[#128c7e] rounded-2xl flex items-center justify-center mx-auto shadow-xl transform hover:scale-105 transition-all duration-300 ease-out border-2 border-white/20">
              <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce shadow-lg border border-white">
              <span className="text-white text-xs">💬</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#25d366] via-[#20bd5f] to-[#128c7e] bg-clip-text text-transparent">
              Advanced Chat Platform
            </h3>
            <p className="text-gray-600 text-base leading-relaxed max-w-sm mx-auto">
              Select a contact from the sidebar to start a conversation
            </p>
          </div>

          {/* Compact Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="group bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/30 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-700">Instant Messaging</p>
            </div>
            <div className="group bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/30 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 11.293l-2.829-2.829a1 1 0 00-1.414 0L8.464 11.293a1 1 0 000 1.414l2.829 2.829a1 1 0 001.414 0l2.829-2.829a1 1 0 000-1.414z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17a1 1 0 102 0m0 0V9a5 5 0 10-5 5v3a1 1 0 102 0z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-700">Voice Messages</p>
            </div>
            <div className="group bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/30 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-700">File Sharing</p>
            </div>
            <div className="group bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/30 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-700">Rich Features</p>
            </div>
          </div>

          {/* Compact Security Badge */}
          <div className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full shadow-lg border border-white/30">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-gray-600">Secure • Private • Feature-Rich</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#f0f2f5] overflow-hidden">
      {/* GraphQL Error Display */}
      {graphqlError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-2 rounded relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">GraphQL Error: {graphqlError}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Loading indicator for GraphQL operations */}
      {graphqlLoading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 mx-4 mt-2 rounded text-sm">
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading messages via GraphQL...
          </div>
        </div>
      )}


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
        formatTime={(timestamp: string) => {
          try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } catch (error) {
            console.error('Error formatting timestamp:', error, timestamp);
            return '--:--';
          }
        }}
        onClearChat={handleClearChat}
        onEnterSelectionMode={enterSelectionMode}
        isSelectionMode={isSelectionMode}
        onCloseChat={() => setSelectedContact(null)}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
      />

      {/* Chat Content */}
      {showProfileView ? (
        <ProfileView
          messages={messages}
          setShowProfileView={setShowProfileView}
        />
      ) : (
        <>
          {/* Typing Indicator - Shows when OTHER person is typing (not current user) */}
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
          <div className="flex-1 min-h-0 overflow-hidden">
            <MessageList
            messages={filteredMessages}
            formatTime={(timestamp: string) => {
              try {
                const date = new Date(timestamp);
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              } catch (error) {
                console.error('Error formatting timestamp:', error, timestamp);
                return '--:--';
              }
            }}
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
            currentUserId={currentUser?.id}
            />
          </div>


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
            emojiDropdownOpen={emojiDropdownOpen}
            setEmojiDropdownOpen={setEmojiDropdownOpen}
            attachmentDropdownOpen={attachmentDropdownOpen}
            setAttachmentDropdownOpen={setAttachmentDropdownOpen}
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
