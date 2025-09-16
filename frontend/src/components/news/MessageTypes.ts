export interface UpdateAttachment {
  type: string;
  url: string;
  label: string;
}

export interface UpdateMedia {
  type: string;
  url: string;
  label: string;
  thumbnailUrl?: string;
}

export interface UpdateContent {
  body: string;
  attachments: UpdateAttachment[];
  media: UpdateMedia[];
  related: string[];
}

export interface UpdateComment {
  id: number;
  content: string;
  author: string;
  created_at: string;
  can_edit: boolean;
  can_delete: boolean;
  replies: UpdateComment[];
}

export interface Update {
  id: string;
  type: "news" | "communication" | "alert";
  title: string;
  summary: string;
  timestamp: string;
  status: "new" | "read" | "urgent";
  tags: string[];
  author: string;
  icon: string;
  priority?: number;
  content: UpdateContent;
  // New fields for enhanced functionality
  likes_count?: number;
  dislikes_count?: number;
  comments_count?: number;
  user_like_status?: boolean | null; // true for like, false for dislike, null for none
  can_edit?: boolean;
  can_delete?: boolean;
}
