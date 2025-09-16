import React from "react";
import { Phone, Video, PhoneIncoming } from "lucide-react";
import { useCall } from "../../contexts/CallContext";
import { Button } from "../ui/Button";

/**
 * CallTester - A demo component to test call functionality
 * This can be added to the chat interface for testing purposes
 */
const CallTester: React.FC = () => {
  const { startCall, simulateIncomingCall, currentCall } = useCall();

  const testContacts = [
    { id: "john", name: "John Doe", avatar: undefined },
    { id: "jane", name: "Jane Smith", avatar: undefined },
    { id: "bob", name: "Bob Wilson", avatar: undefined },
  ];

  if (currentCall) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 font-medium">
          Call active with{" "}
          {currentCall.receiver?.name || currentCall.caller?.name}
        </p>
        <p className="text-xs text-blue-600">
          Status: {currentCall.status} | Type: {currentCall.type}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
      <h3 className="text-sm font-semibold text-gray-800">
        Call Testing Panel
      </h3>

      {/* Outgoing Call Tests */}
      <div className="space-y-2">
        <p className="text-xs text-gray-600">Start Outgoing Calls:</p>
        <div className="flex gap-2 flex-wrap">
          {testContacts.map((contact) => (
            <div key={contact.id} className="flex gap-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => startCall(contact, "voice")}
                className="flex items-center gap-1 text-xs"
                title={`Voice call ${contact.name}`}
              >
                <Phone className="h-3 w-3" />
                {contact.name.split(" ")[0]}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => startCall(contact, "video")}
                className="flex items-center gap-1 text-xs"
                title={`Video call ${contact.name}`}
              >
                <Video className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Incoming Call Tests */}
      <div className="space-y-2">
        <p className="text-xs text-gray-600">Simulate Incoming Calls:</p>
        <div className="flex gap-2 flex-wrap">
          {testContacts.map((contact) => (
            <div key={`incoming-${contact.id}`} className="flex gap-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => simulateIncomingCall(contact, "voice")}
                className="flex items-center gap-1 text-xs bg-green-100 hover:bg-green-200 text-green-700"
                title={`Incoming voice call from ${contact.name}`}
              >
                <PhoneIncoming className="h-3 w-3" />
                {contact.name.split(" ")[0]}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => simulateIncomingCall(contact, "video")}
                className="flex items-center gap-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700"
                title={`Incoming video call from ${contact.name}`}
              >
                <Video className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        💡 Test the call system by clicking the buttons above. The calls will
        simulate real WebRTC behavior.
      </p>
    </div>
  );
};

export default CallTester;
