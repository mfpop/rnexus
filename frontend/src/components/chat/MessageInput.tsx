import React, { useState, useRef, useEffect } from 'react';
import { 
  Smile, 
  Paperclip, 
  Camera, 
  Mic, 
  Send,
  X
} from 'lucide-react';
import Button from '../ui/Button';
import { Message } from './MessageTypes';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isRecording: boolean;
  recordingTime: number;
  formatRecordingTime: (time: number) => string;
  stopVoiceRecording: () => void;
  startVoiceRecording: () => void;
  addEmoji: (emoji: string) => void;
  onTyping?: (isTyping: boolean) => void;
  replyToMessage?: Message | null;
  onClearReply?: () => void;
  handleFileUpload: (acceptedTypes: string) => void;
  onPhotoCapture?: (photoData: string) => void;
  showCamera: boolean;
  setShowCamera: (show: boolean) => void;
  handlePhotoCapture: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  emojiDropdownOpen: boolean;
  setEmojiDropdownOpen: (open: boolean) => void;
  attachmentDropdownOpen: boolean;
  setAttachmentDropdownOpen: (open: boolean) => void;
  setReplyToMessage: (message: Message | null) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  handleSendMessage,
  isRecording,
  recordingTime,
  formatRecordingTime,
  stopVoiceRecording,
  startVoiceRecording,
  addEmoji,
  handleFileUpload,
  handlePhotoCapture,
  fileInputRef,
  emojiDropdownOpen,
  setEmojiDropdownOpen,
  attachmentDropdownOpen,
  setAttachmentDropdownOpen,
  onTyping,
  replyToMessage,
  setReplyToMessage,
}) => {
  const [inputHeight, setInputHeight] = useState(40);
  const emojiDropdownRef = useRef<HTMLDivElement>(null);
  const attachmentDropdownRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = document.getElementById('message-input') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      setInputHeight(Math.min(textarea.scrollHeight, 120));
    }
  }, [message]);

  // Handle typing
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    onTyping?.(true);
  };

  // Popular emojis for quick access
  const popularEmojis = [
    '😀', '😂', '🥰', '😍', '😎', '🤔', '😢', '😡', '😴', '🤗',
    '👍', '👎', '❤️', '💔', '🎉', '🎊', '🔥', '💯', '✨', '🌟',
    '🙏', '👏', '💪', '🤝', '👋', '💋', '🌹', '🍕', '☕', '🍺'
  ];

  // Emoji categories with proper emoji sequences
  const emojiCategories = [
    {
      name: 'Smileys & Emotions',
      emojis: '😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🤩🥳😏😒😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😤😠😡🤬🤯😳🥵🥶😱😨😰😥😓🤗🤔🤭🤫🤥😶😐😑😯😦😧😮😲🥱😴🤤😪😵🤐🥴🤢🤮🤧😷🤒🤕'
    },
    {
      name: 'Hearts & Love',
      emojis: '❤️🧡💛💚💙💜🖤🤍🤎💔❣️💕💞💓💗💖💘💝💟'
    },
    {
      name: 'Gestures & Body',
      emojis: '👍👎👌✌️🤞🤟🤘🤙👈👉👆🖕👇☝️👋🤚🖐️✋🖖👌🤌🤏🤙🤝🙏✍️💪🦾🦿🦵🦶👂🦻👃🧠🫀🫁🦷🦴👀👁️👅👄💋🩸'
    },
    {
      name: 'Celebrations',
      emojis: '🎉🎊🎈🎂🎁🎄🎃🎗️🏆🥇🥈🥉🎖️🏅🎟️🎫🎠🎡🎢🎪🎭🎨🎬🎤🎧🎼🎹🥁🎷🎺🎸🪕🎻🎯🎲🎮🎰🧩🎨📱📲💻⌨️🖥️🖨️🖱️🖲️🕹️🎮🎲♟️🎭🖼️🎨🎬🎤🎧🎼🎹🥁🎷🎺🎸🪕🎻🎯🎲🎮🎰🧩'
    }
  ];

  const handleEmojiClick = (emoji: string) => {
    addEmoji(emoji);
  };

  const handleCategoryClick = (emojis: string) => {
    // Add multiple emojis from the category
    const emojiArray = Array.from(emojis);
    const randomEmojis = emojiArray
      .sort(() => 0.5 - Math.random())
      .slice(0, 3); // Add 3 random emojis from the category
    
    randomEmojis.forEach(emoji => addEmoji(emoji));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (emojiDropdownRef.current && !emojiDropdownRef.current.contains(event.target as Node)) {
      setEmojiDropdownOpen(false);
    }
    if (attachmentDropdownRef.current && !attachmentDropdownRef.current.contains(event.target as Node)) {
      setAttachmentDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="px-4 py-3 border-t border-gray-200 bg-white relative z-40">
      {/* Reply Preview */}
      {replyToMessage && (
        <div className="mb-3 p-3 bg-gray-50 border-l-4 border-[#25d366] rounded-r-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-1">
                Replying to {replyToMessage.senderName}
              </div>
              <div className="text-sm text-gray-700 truncate">
                {replyToMessage.type === 'text' ? replyToMessage.content : `📎 ${replyToMessage.type}`}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReplyToMessage(null)}
              className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-end gap-2">
        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            id="message-input"
            value={message}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            className="w-full pl-12 pr-20 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#25d366] focus:border-[#25d366] transition-all resize-none min-h-[40px] max-h-[120px] text-sm"
            placeholder="Type a message..."
            rows={1}
            style={{ height: `${inputHeight}px` }}
          />

          {/* Left side buttons in input - Emoji */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setEmojiDropdownOpen(!emojiDropdownOpen)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                title="Add emoji">
                <Smile className="h-5 w-5 text-gray-500 hover:text-[#25d366]" />
              </button>
              
              {/* Emoji Dropdown */}
              {emojiDropdownOpen && (
                <div
                  ref={emojiDropdownRef}
                  className="absolute bottom-full left-0 mb-2 w-80 bg-white border border-gray-200 shadow-xl rounded-xl p-3 z-50">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Quick Emojis
                  </div>
                  
                  {/* Popular Emojis Grid */}
                  <div className="grid grid-cols-10 gap-1 mb-3">
                    {popularEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiClick(emoji)}
                        className="w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center text-lg hover:scale-110 transform duration-150"
                        title={`Add ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 my-2"></div>
                  
                  {/* Emoji Categories */}
                  <div className="grid grid-cols-2 gap-2">
                    {emojiCategories.map((category, index) => (
                      <button
                        key={index}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer rounded-lg flex items-center justify-between"
                        onClick={() => handleCategoryClick(category.emojis)}
                      >
                        <span>{category.name}</span>
                        <span className="text-lg">
                          {Array.from(category.emojis).slice(0, 3).join('')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side buttons in input */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Attachment Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAttachmentDropdownOpen(!attachmentDropdownOpen)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                title="Attach file or media">
                <Paperclip className="h-5 w-5 text-gray-500 hover:text-[#25d366]" />
              </button>
              
              {/* Attachment Dropdown */}
              {attachmentDropdownOpen && (
                <div
                  ref={attachmentDropdownRef}
                  className="absolute bottom-full right-0 mb-2 w-64 bg-white border border-gray-200 shadow-xl rounded-xl p-3 z-50">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Attach Media
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer rounded-lg flex flex-col items-center text-center"
                      onClick={() => handleFileUpload('image/*')}>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                        <Camera className="h-6 w-6 text-blue-600" />
                      </div>
                      <span>Photo</span>
                    </button>

                    <button
                      className="px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer rounded-lg flex flex-col items-center text-center"
                      onClick={() => handleFileUpload('video/*')}>
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                        <Mic className="h-6 w-6 text-red-600" />
                      </div>
                      <span>Video</span>
                    </button>

                    <button
                      className="px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer rounded-lg flex flex-col items-center text-center"
                      onClick={() => handleFileUpload('audio/*')}>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                        <Mic className="h-6 w-6 text-purple-600" />
                      </div>
                      <span>Audio</span>
                    </button>

                    <button
                      className="px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer rounded-lg flex flex-col items-center text-center"
                      onClick={() => handleFileUpload('.pdf,.doc,.docx,.txt')}>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                        <Paperclip className="h-6 w-6 text-green-600" />
                      </div>
                      <span>Document</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-200 my-2"></div>

                  <button
                    className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer rounded-lg flex items-center"
                    onClick={() => {
                      handlePhotoCapture();
                      setAttachmentDropdownOpen(false);
                    }}>
                    <Camera className="h-4 w-4 mr-2 text-[#25d366]" />
                    Take Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Send/Voice Button */}
        {message.trim() ? (
          <Button
            type="submit"
            className="p-3 bg-[#25d366] hover:bg-[#128c7e] text-white rounded-full transition-all flex-shrink-0 min-h-[40px] flex items-center justify-center shadow-lg hover:shadow-xl">
            <Send className="h-5 w-5" />
          </Button>
        ) : isRecording ? (
          <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-full">
            {/* Recording indicator */}
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            
            {/* Recording time display */}
            <div className="text-sm text-red-600 font-medium">
              {formatRecordingTime(recordingTime)}
            </div>
            
            {/* Stop recording button */}
            <button
              type="button"
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors flex-shrink-0"
              onClick={stopVoiceRecording}
              title="Stop recording">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="p-3 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 min-h-[40px] flex items-center justify-center"
            title="Hold to record voice message"
            onMouseDown={startVoiceRecording}
            onTouchStart={startVoiceRecording}
            onMouseUp={stopVoiceRecording}
            onTouchEnd={stopVoiceRecording}>
            <Mic className="h-5 w-5 text-gray-500 hover:text-[#25d366]" />
          </button>
        )}
      </form>

      {/* Hidden File Input for Camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={() => {}}
      />
    </div>
  );
};

export default MessageInput;
