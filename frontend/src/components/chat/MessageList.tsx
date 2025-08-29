import React from 'react';
import {
  Mic,
  MoreVertical,
  Forward,
  Copy,
  Trash2,
  Check,
  CheckCheck,
  Clock,
  Reply as ReplyIcon,
  FileText,
  Download,
  MapPin,
  User,
  Phone
} from 'lucide-react';
import { Message, ImageMessage, AudioMessage, VideoMessage, DocumentMessage, LocationMessage, ContactMessage } from './MessageTypes';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/bits/DropdownMenu';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  scrollToBottom: () => void;
  formatTime: (date: Date) => string;
  onReply: (message: Message) => void;
  onForward: (message: Message) => void;
  onDelete: (messageId: number) => void;
  onCopy: (content: string) => void;
  onMessageSelect: (messageId: number) => void;
  selectedMessages: Set<number>;
  isSelectionMode: boolean;
  messageOptionsOpen: number | null;
  setMessageOptionsOpen: (messageId: number | null) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  messagesEndRef,
  scrollToBottom,
  formatTime,
  onReply,
  onForward,
  onDelete,
  onCopy,
  onMessageSelect,
  selectedMessages,
  isSelectionMode,
  messageOptionsOpen,
  setMessageOptionsOpen
}) => {
  const isImageMessage = (msg: Message): msg is ImageMessage => msg.type === 'image';
  const isAudioMessage = (msg: Message): msg is AudioMessage => msg.type === 'audio';
  const isVideoMessage = (msg: Message): msg is VideoMessage => msg.type === 'video';
  const isDocumentMessage = (msg: Message): msg is DocumentMessage => msg.type === 'document';
  const isLocationMessage = (msg: Message): msg is LocationMessage => msg.type === 'location';
  const isContactMessage = (msg: Message): msg is ContactMessage => msg.type === 'contact';

  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const renderMessageContent = (msg: Message) => {
    if (isImageMessage(msg)) {
      return (
        <div className="space-y-2">
          <img
            src={msg.imageUrl}
            alt={msg.fileName || 'Shared image'}
            className="w-full h-auto rounded-lg max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onLoad={scrollToBottom}
            onClick={() => window.open(msg.imageUrl, '_blank')}
          />
          {msg.caption && <p className="text-sm">{msg.caption}</p>}
        </div>
      );
    }

    if (isAudioMessage(msg)) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-3 min-w-[200px]">
            <div className="w-10 h-10 bg-[#25d366] rounded-full flex items-center justify-center">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div className="bg-[#25d366] h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="text-xs text-gray-600 mt-1">{msg.duration}s</div>
            </div>
            <button className="w-8 h-8 bg-[#25d366] rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
            </button>
          </div>
          {msg.content && <p className="text-sm">{msg.content}</p>}
        </div>
      );
    }

    if (isVideoMessage(msg)) {
      return (
        <div className="space-y-2">
          <div className="relative">
            <img
              src={msg.thumbnailUrl}
              alt={msg.fileName || 'Video thumbnail'}
              className="w-full h-auto rounded-lg max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
              <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[12px] border-l-[#25d366] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {Math.floor(msg.duration / 60)}:{(msg.duration % 60).toString().padStart(2, '0')}
            </div>
          </div>
          {msg.caption && <p className="text-sm">{msg.caption}</p>}
        </div>
      );
    }

    if (isDocumentMessage(msg)) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-3 min-w-[250px]">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{msg.fileName}</div>
              <div className="text-xs text-gray-600">{msg.fileType.toUpperCase()} • {(msg.fileSize / 1024).toFixed(1)} KB</div>
            </div>
            <button className="w-8 h-8 bg-[#25d366] rounded-full flex items-center justify-center">
              <Download className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      );
    }

    if (isLocationMessage(msg)) {
      return (
        <div className="space-y-2">
          <div className="bg-gray-100 rounded-lg p-3 min-w-[250px]">
            <div className="w-full h-32 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
            <div className="font-medium text-sm">{msg.placeName || 'Location'}</div>
            {msg.address && <div className="text-xs text-gray-600">{msg.address}</div>}
          </div>
        </div>
      );
    }

    if (isContactMessage(msg)) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-3 min-w-[250px]">
            <div className="w-12 h-12 bg-[#25d366] rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{msg.contactName}</div>
              <div className="text-xs text-gray-600">{msg.phoneNumber}</div>
            </div>
            <button className="w-8 h-8 bg-[#25d366] rounded-full flex items-center justify-center">
              <Phone className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      );
    }

    return <p className="text-sm whitespace-pre-wrap">{msg.content}</p>;
  };

  const renderReplyPreview = (msg: Message) => {
    if (!msg.replyTo) return null;

    return (
      <div className="mb-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-l-4 border-[#25d366] shadow-sm">
        <div className="text-xs font-medium text-gray-600 mb-1">
          {msg.replyTo.senderName}
        </div>
        <div className="text-xs text-gray-700 truncate">
          {msg.replyTo.type === 'text' ? msg.replyTo.content : `📎 ${msg.replyTo.type}`}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
      <div className="space-y-3 p-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === 1 ? 'justify-end' : 'justify-start'} group`}>

            {/* Selection Checkbox */}
            {isSelectionMode && (
              <div className="flex items-center mr-2">
                <button
                  onClick={() => onMessageSelect(msg.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedMessages.has(msg.id)
                      ? 'bg-[#25d366] border-[#25d366]'
                      : 'border-gray-300 hover:border-[#25d366]'
                  }`}
                  title={selectedMessages.has(msg.id) ? 'Deselect message' : 'Select message'}
                >
                  {selectedMessages.has(msg.id) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </button>
              </div>
            )}

            <div className="relative max-w-xs lg:max-w-md">
              {/* Reply Preview */}
              {renderReplyPreview(msg)}

              {/* Message Content */}
              <div
                className={`px-4 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
                  msg.senderId === 1
                    ? 'bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white'
                    : 'bg-white text-gray-800 border border-gray-200 hover:border-gray-300'
                }`}>

                {renderMessageContent(msg)}

                {/* Message Footer */}
                <div className={`flex items-center justify-between mt-2 ${
                  msg.senderId === 1 ? 'text-white' : 'text-gray-500'
                }`}>
                  <div className="flex items-center gap-1">
                    {msg.senderId === 1 && getMessageStatusIcon(msg.status)}
                    <span className="text-xs opacity-80">{formatTime(msg.timestamp)}</span>
                  </div>

                  {/* Message Actions */}
                  {!isSelectionMode && (
                    <DropdownMenu open={messageOptionsOpen === msg.id} onOpenChange={(open) => setMessageOptionsOpen(open ? msg.id : null)}>
                      <DropdownMenuTrigger asChild>
                        <button data-testid="message-more-options" className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 rounded transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg py-1" align="end">
                        <DropdownMenuItem
                          onClick={() => onReply(msg)}
                          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                        >
                          <ReplyIcon className="w-4 h-4" />
                          Reply
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onForward(msg)}
                          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                        >
                          <Forward className="w-4 h-4" />
                          Forward
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onCopy(msg.content)}
                          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => onDelete(msg.id)}
                          className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
