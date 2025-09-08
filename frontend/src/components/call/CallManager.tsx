import React from "react";
import { useCall } from "../../contexts/CallContext";
import CallWindow from "./CallWindow";
import IncomingCallModal from "./IncomingCallModal";

/**
 * CallManager handles all call-related UI states and renders the appropriate components
 */
const CallManager: React.FC = () => {
  const { currentCall } = useCall();

  if (!currentCall) {
    return null;
  }

  return (
    <>
      {/* Incoming Call Modal - Shows when receiving a call */}
      {currentCall.status === "ringing" && currentCall.isIncoming && (
        <IncomingCallModal />
      )}

      {/* Call Window - Shows during active calls */}
      {(currentCall.status === "calling" ||
        currentCall.status === "connected" ||
        currentCall.status === "ended") && <CallWindow />}
    </>
  );
};

export default CallManager;
