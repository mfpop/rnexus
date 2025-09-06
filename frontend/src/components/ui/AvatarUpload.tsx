import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  fallbackText: string;
  onAvatarChange: (base64Data: string) => Promise<void>;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  fallbackText,
  onAvatarChange,
  disabled = false,
  size = 'md',
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        setIsUploading(true);
        try {
          await onAvatarChange(e.target.result as string);
        } catch (error) {
          console.error('Avatar upload failed:', error);
          alert('Failed to upload avatar. Please try again.');
        } finally {
          setIsUploading(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value so the same file can be selected again
    event.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          relative ${sizeClasses[size]} cursor-pointer group transition-all duration-200
          ${dragOver ? 'scale-105 ring-2 ring-blue-500' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          ${isUploading ? 'animate-pulse' : ''}
        `}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Avatar className={`${sizeClasses[size]} transition-all duration-200`}>
          {currentAvatarUrl && <AvatarImage src={currentAvatarUrl} alt="Avatar" />}
          <AvatarFallback className="bg-blue-500 text-white font-medium">
            {fallbackText}
          </AvatarFallback>
        </Avatar>

        {/* Upload overlay */}
        <div className={`
          absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center
          transition-opacity duration-200
          ${disabled ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}
        `}>
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-4 h-4 text-white" />
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload hint */}
      {!disabled && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Click to upload
          </span>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
