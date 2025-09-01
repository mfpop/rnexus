
export interface BaseMessage {
  id: number;
  senderId: number;
  senderName: string;
  timestamp: string; // GraphQL returns ISO string timestamps
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'location' | 'contact';
  content: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: Message | null;
  forwarded?: boolean;
  forwardedFrom?: string;
  edited?: boolean;
  editedAt?: string; // GraphQL returns ISO string timestamps
}

export interface TextMessage extends BaseMessage {
  type: 'text';
}

export interface ImageMessage extends BaseMessage {
  type: 'image';
  imageUrl: string;
  fileName: string;
  caption?: string;
  thumbnailUrl?: string;
  fileSize?: number;
}

export interface AudioMessage extends BaseMessage {
  type: 'audio';
  audioUrl: string;
  duration: number;
  waveform?: number[];
  isPlaying?: boolean;
}

export interface VideoMessage extends BaseMessage {
  type: 'video';
  videoUrl: string;
  thumbnailUrl: string;
  fileName: string;
  duration: number;
  caption?: string;
  fileSize?: number;
}

export interface DocumentMessage extends BaseMessage {
  type: 'document';
  documentUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  thumbnailUrl?: string;
}

export interface LocationMessage extends BaseMessage {
  type: 'location';
  latitude: number;
  longitude: number;
  address?: string;
  placeName?: string;
  thumbnailUrl?: string;
}

export interface ContactMessage extends BaseMessage {
  type: 'contact';
  contactName: string;
  phoneNumber: string;
  avatarUrl?: string;
  email?: string;
}

export type Message = TextMessage | ImageMessage | AudioMessage | VideoMessage | DocumentMessage | LocationMessage | ContactMessage;

// Chat interface to match the database structure
export interface Chat {
  id: string;
  name: string;
  type: 'user' | 'group';
  lastMessage?: Message | null;
  lastActivity: string; // GraphQL returns ISO string timestamps
  unreadCount: number;
  participants: string[];
  isGroup: boolean;
}
