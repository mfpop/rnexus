import React, { useEffect, useRef } from 'react';
import { useCall } from '../../contexts/CallContext';
import { formatCallDuration } from '../../utils/callUtils';

interface VideoStreamProps {
  stream?: MediaStream;
  isLocal?: boolean;
  muted?: boolean;
  className?: string;
}

const VideoStream: React.FC<VideoStreamProps> = ({
  stream,
  isLocal = false,
  muted = false,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted || isLocal} // Always mute local video to prevent echo
      className={`w-full h-full object-cover ${className}`}
    />
  );
};

interface CallVideoProps {
  isMinimized?: boolean;
}

const CallVideo: React.FC<CallVideoProps> = ({ isMinimized = false }) => {
  const {
    currentCall,
    webrtcConnection,
    callControls,
    callDuration
  } = useCall();

  if (!currentCall || currentCall.type !== 'video') {
    return null;
  }

  const containerClass = isMinimized
    ? 'w-80 h-60'
    : 'w-full h-full';

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${containerClass}`}>
      {/* Remote Video (Main) */}
      <div className="w-full h-full">
        {webrtcConnection.remoteStream ? (
          <VideoStream
            stream={webrtcConnection.remoteStream}
            isLocal={false}
            className="bg-gray-800"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-semibold">
                  {currentCall.receiver.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-lg font-medium">{currentCall.receiver.name}</p>
              <p className="text-sm text-gray-300">
                {currentCall.status === 'calling' ? 'Calling...' :
                 currentCall.status === 'connected' ? formatCallDuration(callDuration) :
                 currentCall.status}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Local Video (Picture-in-Picture) */}
      {webrtcConnection.localStream && callControls.videoEnabled && (
        <div className={`absolute ${isMinimized ? 'top-2 right-2 w-20 h-16' : 'top-4 right-4 w-32 h-24'} bg-gray-900 rounded-lg overflow-hidden border-2 border-white shadow-lg`}>
          <VideoStream
            stream={webrtcConnection.localStream}
            isLocal={true}
            muted={true}
          />
        </div>
      )}

      {/* Call Info Overlay */}
      {!isMinimized && (
        <div className="absolute top-4 left-4 text-white">
          <p className="text-lg font-medium">{currentCall.receiver.name}</p>
          <p className="text-sm text-gray-300">
            {currentCall.status === 'calling' ? 'Calling...' :
             currentCall.status === 'connected' ? formatCallDuration(callDuration) :
             currentCall.status}
          </p>
        </div>
      )}

      {/* Screen Sharing Indicator */}
      {callControls.screenSharing && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
          Screen Sharing
        </div>
      )}
    </div>
  );
};

export default CallVideo;
