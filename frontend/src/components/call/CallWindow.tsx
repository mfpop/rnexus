import React, { useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { useCall } from '../../contexts/CallContext';
import { formatCallDuration } from '../../utils/callUtils';
import CallVideo from './CallVideo';
import CallControls from './CallControls';
import Button from '../ui/Button';

const CallWindow: React.FC = () => {
  const { currentCall, endCall, callDuration } = useCall();
  const [isMinimized, setIsMinimized] = useState(false);

  if (!currentCall || currentCall.status === 'ended' || currentCall.status === 'declined') {
    return null;
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
        {/* Minimized Header */}
        <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{currentCall.receiver.name}</span>
            {currentCall.status === 'connected' && (
              <span className="text-xs text-gray-500">
                {formatCallDuration(callDuration)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0"
              onClick={toggleMinimize}
              title="Maximize"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 text-red-500 hover:text-red-600"
              onClick={endCall}
              title="End call"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Minimized Content */}
        <div className="p-2">
          {currentCall.type === 'video' ? (
            <CallVideo isMinimized={true} />
          ) : (
            <div className="w-80 h-20 bg-gray-100 rounded flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-1">
                  <span className="text-lg font-semibold">
                    {currentCall.receiver.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{currentCall.receiver.name}</p>
              </div>
            </div>
          )}

          <CallControls isMinimized={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-40">
      <div className="w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl relative">
        {/* Call Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <h2 className="font-semibold text-gray-800">{currentCall.receiver.name}</h2>
              <p className="text-sm text-gray-600">
                {currentCall.status === 'calling' && 'Calling...'}
                {currentCall.status === 'connected' && formatCallDuration(callDuration)}
                {currentCall.status === 'ringing' && 'Ringing...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMinimize}
              title="Minimize"
              className="text-gray-600 hover:text-gray-800"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={endCall}
              title="End call"
              className="text-red-500 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Call Content */}
        <div className="flex-1 relative">
          {currentCall.type === 'video' ? (
            <CallVideo isMinimized={false} />
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl font-semibold">
                    {currentCall.receiver.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold mb-2">{currentCall.receiver.name}</h2>
                <p className="text-lg opacity-90">
                  {currentCall.status === 'calling' && 'Calling...'}
                  {currentCall.status === 'connected' && formatCallDuration(callDuration)}
                  {currentCall.status === 'ringing' && 'Ringing...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="bg-gray-50 border-t">
          <CallControls isMinimized={false} />
        </div>
      </div>
    </div>
  );
};

export default CallWindow;
