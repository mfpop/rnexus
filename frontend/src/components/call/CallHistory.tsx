import React from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Video, Clock } from 'lucide-react';
import { formatCallDurationLong } from '../../utils/callUtils';

interface CallHistoryItem {
  id: string;
  contactName: string;
  contactAvatar?: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  duration?: number;
  timestamp: Date;
  status: 'completed' | 'missed' | 'declined';
}

interface CallHistoryProps {
  calls: CallHistoryItem[];
  onCallContact?: (contactName: string, type: 'voice' | 'video') => void;
}

const CallHistory: React.FC<CallHistoryProps> = ({ calls, onCallContact }) => {
  const getCallIcon = (item: CallHistoryItem) => {
    if (item.type === 'video') {
      return <Video className="h-4 w-4" />;
    }

    switch (item.direction) {
      case 'incoming':
        return item.status === 'missed' ?
          <PhoneMissed className="h-4 w-4 text-red-500" /> :
          <PhoneIncoming className="h-4 w-4 text-green-500" />;
      case 'outgoing':
        return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
      default:
        return <Phone className="h-4 w-4" />;
    }
  };

  const getCallStatusText = (item: CallHistoryItem) => {
    if (item.status === 'missed') return 'Missed';
    if (item.status === 'declined') return 'Declined';
    if (item.duration) return formatCallDurationLong(item.duration);
    return 'No answer';
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  if (calls.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No call history</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {calls.map((call) => (
        <div
          key={call.id}
          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
          onClick={() => onCallContact?.(call.contactName, call.type)}
        >
          <div className="flex items-center gap-3">
            {/* Contact Avatar */}
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              {call.contactAvatar ? (
                <img
                  src={call.contactAvatar}
                  alt={call.contactName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold">
                  {call.contactName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Call Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {call.contactName}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {getCallIcon(call)}
                <span>{getCallStatusText(call)}</span>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-sm text-gray-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimestamp(call.timestamp)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CallHistory;
