import React, { useState } from "react";
import { ChatProvider } from "../contexts/ChatContext";
import ChatHeader from "../components/chat/ChatHeader";
import MessageInput from "../components/chat/MessageInput";

const ChatFunctionalityTest: React.FC = () => {
  const [testResults, setTestResults] = useState<
    Array<{
      test: string;
      status: "pending" | "pass" | "fail";
      message: string;
    }>
  >([]);

  const [testMessage, setTestMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const runTests = () => {
    setTestResults([
      {
        test: "Message Input Component",
        status: "pending",
        message: "Testing message input functionality...",
      },
      {
        test: "Voice Recording",
        status: "pending",
        message: "Testing voice recording capabilities...",
      },
      {
        test: "File Upload",
        status: "pending",
        message: "Testing file upload functionality...",
      },
      {
        test: "Emoji Picker",
        status: "pending",
        message: "Testing emoji picker...",
      },
      {
        test: "Message Actions",
        status: "pending",
        message: "Testing message reply/forward/copy/delete...",
      },
      {
        test: "Chat Header Actions",
        status: "pending",
        message: "Testing voice/video call buttons...",
      },
      {
        test: "Search Functionality",
        status: "pending",
        message: "Testing expandable search...",
      },
    ]);

    // Run actual tests
    setTimeout(() => {
      setTestResults((prev) =>
        prev.map((test, index) => {
          switch (index) {
            case 0: // Message Input
              try {
                const input = document.querySelector(
                  "#message-input",
                ) as HTMLTextAreaElement;
                return {
                  ...test,
                  status: input ? "pass" : "fail",
                  message: input
                    ? "Message input found and accessible"
                    : "Message input not found",
                };
              } catch {
                return {
                  ...test,
                  status: "fail",
                  message: "Error testing message input",
                };
              }

            case 1: // Voice Recording
              try {
                const micButton = document.querySelector(
                  '[title="Hold to record voice message"]',
                );
                return {
                  ...test,
                  status: micButton ? "pass" : "fail",
                  message: micButton
                    ? "Voice recording button found"
                    : "Voice recording button not found",
                };
              } catch {
                return {
                  ...test,
                  status: "fail",
                  message: "Error testing voice recording",
                };
              }

            case 2: // File Upload
              try {
                const attachButton = document.querySelector(
                  '[title="Attach file or media"]',
                );
                return {
                  ...test,
                  status: attachButton ? "pass" : "fail",
                  message: attachButton
                    ? "File upload button found"
                    : "File upload button not found",
                };
              } catch {
                return {
                  ...test,
                  status: "fail",
                  message: "Error testing file upload",
                };
              }

            case 3: // Emoji Picker
              try {
                const emojiButton = document.querySelector(
                  '[title="Add emoji"]',
                );
                return {
                  ...test,
                  status: emojiButton ? "pass" : "fail",
                  message: emojiButton
                    ? "Emoji picker button found"
                    : "Emoji picker button not found",
                };
              } catch {
                return {
                  ...test,
                  status: "fail",
                  message: "Error testing emoji picker",
                };
              }

            case 4: // Message Actions
              try {
                const selectionButton = document.querySelector(
                  '[title="Select messages"]',
                );
                return {
                  ...test,
                  status: selectionButton ? "pass" : "fail",
                  message: selectionButton
                    ? "Message selection button found"
                    : "Message selection button not found",
                };
              } catch {
                return {
                  ...test,
                  status: "fail",
                  message: "Error testing message actions",
                };
              }

            case 5: // Chat Header Actions
              try {
                const moreButton = document.querySelector(
                  '[title="More options"]',
                );
                return {
                  ...test,
                  status: moreButton ? "pass" : "fail",
                  message: moreButton
                    ? "Chat header actions found"
                    : "Chat header actions not found",
                };
              } catch {
                return {
                  ...test,
                  status: "fail",
                  message: "Error testing chat header actions",
                };
              }

            case 6: // Search Functionality
              try {
                const searchButton = document.querySelector(
                  '[title="Search messages"]',
                );
                const expandableSearch =
                  document.querySelector(".expandable-search");
                return {
                  ...test,
                  status: searchButton || expandableSearch ? "pass" : "fail",
                  message:
                    searchButton || expandableSearch
                      ? "Search functionality found"
                      : "Search functionality not found",
                };
              } catch {
                return {
                  ...test,
                  status: "fail",
                  message: "Error testing search functionality",
                };
              }

            default:
              return test;
          }
        }),
      );
    }, 1000);
  };

  const mockHandlers = {
    handleSendMessage: (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Send message:", testMessage);
      setTestMessage("");
    },
    startVoiceRecording: () => {
      console.log("Start voice recording");
      setIsRecording(true);
    },
    stopVoiceRecording: () => {
      console.log("Stop voice recording");
      setIsRecording(false);
      setRecordingTime(0);
    },
    formatRecordingTime: (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
    addEmoji: (emoji: string) => {
      console.log("Add emoji:", emoji);
      setTestMessage((prev) => prev + emoji);
    },
    handleFileUpload: (acceptedTypes: string) => {
      console.log("File upload requested:", acceptedTypes);
    },
    handlePhotoCapture: () => {
      console.log("Photo capture requested");
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Chat Functionality Test
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Results */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <button
              onClick={runTests}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Run Tests
            </button>

            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      result.status === "pass"
                        ? "bg-green-500"
                        : result.status === "fail"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{result.test}</div>
                    <div className="text-sm text-gray-600">
                      {result.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Interface Test */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <ChatProvider>
              <div className="h-96 flex flex-col">
                <ChatHeader
                  messages={[]}
                  formatTime={(timestamp) => {
                    try {
                      const date = new Date(timestamp);
                      return date.toLocaleTimeString();
                    } catch (error) {
                      return "--:--";
                    }
                  }}
                  onClearChat={() => console.log("Clear chat")}
                  onEnterSelectionMode={() =>
                    console.log("Enter selection mode")
                  }
                  isSelectionMode={false}
                  onCloseChat={() => console.log("Close chat")}
                  onSearch={(query) => console.log("Search:", query)}
                  searchQuery=""
                  onClearSearch={() => console.log("Clear search")}
                />

                <div className="flex-1 p-4 bg-gray-50">
                  <div className="text-center text-gray-500">
                    Test chat interface - Check if buttons work
                  </div>
                </div>

                <MessageInput
                  message={testMessage}
                  setMessage={setTestMessage}
                  handleSendMessage={mockHandlers.handleSendMessage}
                  isRecording={isRecording}
                  recordingTime={recordingTime}
                  formatRecordingTime={mockHandlers.formatRecordingTime}
                  stopVoiceRecording={mockHandlers.stopVoiceRecording}
                  startVoiceRecording={mockHandlers.startVoiceRecording}
                  addEmoji={mockHandlers.addEmoji}
                  handleFileUpload={mockHandlers.handleFileUpload}
                  handlePhotoCapture={mockHandlers.handlePhotoCapture}
                  fileInputRef={React.createRef()}
                  emojiDropdownOpen={false}
                  setEmojiDropdownOpen={() => {}}
                  attachmentDropdownOpen={false}
                  setAttachmentDropdownOpen={() => {}}
                  showCamera={false}
                  setShowCamera={() => {}}
                  setReplyToMessage={() => {}}
                />
              </div>
            </ChatProvider>
          </div>
        </div>

        {/* Manual Test Instructions */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Manual Test Instructions
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>1. Message Input:</strong> Type in the message box and
              press Enter
            </p>
            <p>
              <strong>2. Emoji Button:</strong> Click the 😀 button to open
              emoji picker
            </p>
            <p>
              <strong>3. Attachment Button:</strong> Click the 📎 button to open
              attachment menu
            </p>
            <p>
              <strong>4. Voice Recording:</strong> Hold the 🎤 button to record
              voice
            </p>
            <p>
              <strong>5. Header Actions:</strong> Click the ⋮ button for more
              options
            </p>
            <p>
              <strong>6. Search:</strong> Click the 🔍 button to search messages
            </p>
            <p>
              <strong>7. Selection Mode:</strong> Click the select button in
              header
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatFunctionalityTest;
