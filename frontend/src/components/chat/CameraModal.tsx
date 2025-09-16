import React from "react";
import { Paperclip } from "lucide-react";

interface CameraModalProps {
  showCamera: boolean;
  setShowCamera: (show: boolean) => void;
  onPhotoCapture: (photoData: string) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const CameraModal: React.FC<CameraModalProps> = ({
  showCamera,
  setShowCamera,
  onPhotoCapture,
  videoRef,
  fileInputRef,
}) => {
  if (!showCamera) {
    return null;
  }

  const closeCamera = () => setShowCamera(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-md max-h-screen flex flex-col">
        {/* Camera Header */}
        <div className="flex justify-between items-center p-4 text-white">
          <button
            onClick={closeCamera}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x h-6 w-6"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <h3 className="text-lg font-medium">Take Photo</h3>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* Camera Preview */}
        <div className="flex-1 flex items-center justify-center relative">
          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-lg"
            autoPlay
            playsInline
            muted
          />
        </div>

        {/* Camera Controls */}
        <div className="p-6 flex justify-center items-center">
          <div className="flex items-center gap-8">
            {/* Fallback to file picker */}
            <button
              onClick={() => {
                closeCamera();
                fileInputRef?.current?.click();
              }}
              className="p-3 bg-gray-600 hover:bg-gray-500 text-white rounded-full transition-colors"
              title="Choose from gallery"
            >
              <Paperclip className="h-6 w-6" />
            </button>

            {/* Capture button */}
            <button
              onClick={() => {
                // Simulate photo capture
                onPhotoCapture("photo_data_url_here");
                closeCamera();
              }}
              className="p-4 bg-white hover:bg-gray-200 rounded-full transition-colors"
              title="Take photo"
            >
              <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
            </button>

            {/* Switch camera button */}
            <button
              onClick={() => {
                // Placeholder for camera switching functionality
                console.debug("Switch camera");
              }}
              className="p-3 bg-gray-600 hover:bg-gray-500 text-white rounded-full transition-colors"
              title="Switch camera"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;
