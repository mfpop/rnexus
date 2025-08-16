import React from 'react';
import { Search, Phone, Video, MoreVertical, User, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/bits/DropdownMenu';
import { useChatContext } from '../../contexts/ChatContext';

interface HeaderActionsProps {
  onSearch: () => void;
  onVoiceCall: () => void;
  onVideoCall: () => void;
  onClearChat: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ onSearch, onVoiceCall, onVideoCall, onClearChat }) => {
  const { setShowProfileView } = useChatContext();

  return (
    <div className="flex items-center gap-2">
      <button
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={onVoiceCall}
        title="Voice call">
        <Phone className="h-5 w-5 text-gray-600" />
      </button>
      <button
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={onVideoCall}
        title="Video call">
        <Video className="h-5 w-5 text-gray-600" />
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            title="More options">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onSelect={() => setShowProfileView(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>View Contact Info</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onSearch}>
            <Search className="mr-2 h-4 w-4" />
            <span>Search Messages</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onClearChat} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Clear Chat</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderActions;
