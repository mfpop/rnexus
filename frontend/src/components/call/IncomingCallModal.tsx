import React from "react";
import { Phone, PhoneOff, Video } from "lucide-react";
import { useCall } from "../../contexts/CallContext";
import Button from "../ui/Button";

const IncomingCallModal: React.FC = () => {
  const { currentCall, acceptCall, declineCall } = useCall();

  if (!currentCall || currentCall.status !== "ringing") {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        {/* Caller Avatar */}
        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
          {currentCall.caller.avatar ? (
            <img
              src={currentCall.caller.avatar}
              alt={currentCall.caller.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-3xl font-semibold text-gray-600">
              {currentCall.caller.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Caller Info */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {currentCall.caller.name}
        </h2>
        <p className="text-gray-600 mb-6">Incoming {currentCall.type} call</p>

        {/* Call Actions */}
        <div className="flex justify-center gap-6">
          {/* Decline Call */}
          <Button
            variant="secondary"
            size="lg"
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white border-none"
            onClick={declineCall}
            title="Decline call"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>

          {/* Accept Call */}
          <Button
            variant="secondary"
            size="lg"
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white border-none"
            onClick={acceptCall}
            title="Accept call"
          >
            {currentCall.type === "video" ? (
              <Video className="h-6 w-6" />
            ) : (
              <Phone className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Call Type Indicator */}
        <div className="mt-4 text-sm text-gray-500">
          {currentCall.type === "video" ? "📹 Video Call" : "📞 Voice Call"}
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
