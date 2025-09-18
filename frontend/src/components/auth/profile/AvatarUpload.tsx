// src/components/auth/profile/AvatarUpload.tsx

import React, { useState, useRef, useEffect } from "react";
import { User, X } from "lucide-react";

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (file: File | null) => void;
  disabled?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  disabled = false,
}) => {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentAvatar prop changes
  useEffect(() => {
    setPreview(currentAvatar || null);
    setImageError(false);
  }, [currentAvatar]);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onAvatarChange(file);
        setIsLoading(false);
        setImageError(false);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        alert('Error reading file');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset the input so the same file can be selected again
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemoveAvatar = () => {
    setPreview(null);
    setImageError(false);
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative w-32 h-32 mx-2 rounded-xl overflow-hidden bg-white border-2 transition-all duration-200 ${
          disabled
            ? 'cursor-default border-gray-200'
            : 'cursor-pointer hover:shadow-lg border-gray-300 hover:border-blue-400'
        } ${isLoading ? 'cursor-wait' : ''} ${isDragOver ? 'scale-105 shadow-lg border-blue-500' : ''}`}
        onDrop={!disabled ? handleDrop : undefined}
        onDragOver={!disabled ? handleDragOver : undefined}
        onDragLeave={!disabled ? handleDragLeave : undefined}
        onClick={!disabled ? handleClick : undefined}
        role={!disabled ? "button" : undefined}
        tabIndex={!disabled ? 0 : undefined}
        title={!disabled ? "Click to upload or change avatar" : undefined}
        onKeyDown={!disabled ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled && fileInputRef.current) {
              fileInputRef.current.click();
            }
          }
        } : undefined}
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Try to show avatar image, fallback to default icon */}
            {preview && !imageError ? (
              <>
                <img
                  src={preview}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover relative z-0"
                  onError={(e) => {
                    console.log('Image failed to load:', preview);
                    console.log('Error event:', e);
                    setImageError(true);
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', preview);
                    setImageError(false);
                  }}
                  style={{
                    display: imageError ? 'none' : 'block'
                  }}
                />
                {imageError && (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <User className="w-16 h-16 text-blue-600" />
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                <User className="w-16 h-16 text-blue-600" />
              </div>
            )}

            {/* Remove button - only show when there's a custom avatar and not disabled */}
            {!disabled && preview && !imageError && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveAvatar();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg z-10"
                title="Remove avatar"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />
    </div>
  );
};
