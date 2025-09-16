import React from "react";
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
} from "lucide-react";
import { useCall } from "../../contexts/CallContext";
import { Button } from "../ui/Button";

interface CallControlsProps {
  isMinimized?: boolean;
}

const CallControls: React.FC<CallControlsProps> = ({ isMinimized = false }) => {
  const {
    callControls,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    endCall,
    currentCall,
  } = useCall();

  if (!currentCall || currentCall.status !== "connected") {
    return null;
  }

  const buttonSize = isMinimized ? "w-8 h-8" : "w-12 h-12";
  const iconSize = isMinimized ? "h-4 w-4" : "h-5 w-5";

  return (
    <div
      className={`flex items-center justify-center gap-3 ${isMinimized ? "px-2" : "px-6 py-4"}`}
    >
      {/* Mute Toggle */}
      <Button
        variant="secondary"
        size="sm"
        className={`${buttonSize} rounded-full ${
          callControls.muted
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-white"
        }`}
        onClick={toggleMute}
        title={callControls.muted ? "Unmute" : "Mute"}
      >
        {callControls.muted ? (
          <MicOff className={iconSize} />
        ) : (
          <Mic className={iconSize} />
        )}
      </Button>

      {/* Video Toggle - Only for video calls */}
      {currentCall.type === "video" && (
        <Button
          variant="secondary"
          size="sm"
          className={`${buttonSize} rounded-full ${
            !callControls.videoEnabled
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
          onClick={toggleVideo}
          title={
            callControls.videoEnabled ? "Turn off camera" : "Turn on camera"
          }
        >
          {callControls.videoEnabled ? (
            <Video className={iconSize} />
          ) : (
            <VideoOff className={iconSize} />
          )}
        </Button>
      )}

      {/* Screen Share Toggle - Only for video calls */}
      {currentCall.type === "video" && (
        <Button
          variant="secondary"
          size="sm"
          className={`${buttonSize} rounded-full ${
            callControls.screenSharing
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
          onClick={toggleScreenShare}
          title={
            callControls.screenSharing ? "Stop screen share" : "Share screen"
          }
        >
          {callControls.screenSharing ? (
            <MonitorOff className={iconSize} />
          ) : (
            <Monitor className={iconSize} />
          )}
        </Button>
      )}

      {/* End Call */}
      <Button
        variant="secondary"
        size="sm"
        className={`${buttonSize} rounded-full bg-red-500 hover:bg-red-600 text-white`}
        onClick={endCall}
        title="End call"
      >
        <PhoneOff className={iconSize} />
      </Button>
    </div>
  );
};

export default CallControls;
