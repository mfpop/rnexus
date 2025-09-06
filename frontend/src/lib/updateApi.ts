import { Update, UpdateExtended, UpdateAttachment, UpdateMedia } from '../components/news';
import AuthService from './authService';

const API_BASE_URL = 'http://localhost:8000';

export interface Tag {
  id: number;
  name: string;
  description: string;
  color: string;
  category: string;
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export class TagApiService {
  // Get all available tags
  static async getTags(
    category: string = '',
    searchQuery: string = '',
    activeOnly: boolean = true
  ): Promise<Tag[]> {
    try {
      const params = new URLSearchParams({
        active_only: activeOnly.toString(),
      });

      if (category) {
        params.append('category', category);
      }

      if (searchQuery) {
        params.append('q', searchQuery);
      }

      // Try to get auth headers, but don't fail if not authenticated
      let headers = { 'Content-Type': 'application/json' };
      try {
        const authHeaders = AuthService.getAuthHeaders();
        headers = { ...headers, ...authHeaders };
      } catch (authError) {
  console.debug('No authentication available, proceeding without auth headers');
      }

      const response = await fetch(`${API_BASE_URL}/api/tags/?${params}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.debug('Authentication required for tags, using fallback');
          throw new Error('AUTH_REQUIRED');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return data.tags;
      } else {
        throw new Error(data.error || 'Failed to fetch tags');
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  // Create a new tag
  static async createTag(tagData: {
    name: string;
    description?: string;
    color?: string;
    category?: string;
    is_active?: boolean;
  }): Promise<Tag> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tags/create/`, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(tagData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return data.tag;
      } else {
        throw new Error(data.error || 'Failed to create tag');
      }
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  // Update an existing tag
  static async updateTag(tagId: number, tagData: Partial<Tag>): Promise<Tag> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tags/${tagId}/`, {
        method: 'PUT',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(tagData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return data.tag;
      } else {
        throw new Error(data.error || 'Failed to update tag');
      }
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }

  // Delete a tag
  static async deleteTag(tagId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tags/${tagId}/`, {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete tag');
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }
}

export class UpdateApiService {
  // Get all updates with optional filtering and pagination
  static async getUpdates(
    type: string = 'all',
    status: string = 'all',
    searchQuery: string = '',
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ updates: UpdateExtended[]; pagination: any }> {
    try {
      const params = new URLSearchParams({
        type,
        status,
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      if (searchQuery) {
        params.append('q', searchQuery);
      }

      const response = await fetch(`${API_BASE_URL}/api/updates/?${params}`, {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return {
          updates: data.updates.map((update: any): UpdateExtended => ({
            id: update.id,
            type: update.type,
            title: update.title,
            summary: update.summary,
            body: update.content.body,
            timestamp: update.timestamp,
            status: update.status,
            tags: update.tags,
            author: update.author,
            icon: update.icon,
            priority: update.priority || 'normal',
            isActive: update.is_active,
            isExpired: update.expires_at ? new Date(update.expires_at) < new Date() : false,
            timeAgo: update.created_at ? `${Math.floor((Date.now() - new Date(update.created_at).getTime()) / 60000)} min ago` : '',
            readingTime: Math.max(1, Math.ceil((update.content.body || '').split(' ').length / 200)),
            fullName: update.created_by ? `${update.created_by.firstName} ${update.created_by.lastName}`.trim() : update.author || '',
            createdAt: update.created_at,
            updatedAt: update.updated_at,
            expiresAt: update.expires_at,
            attachments: update.content.attachments || [],
            media: update.content.media || [],
            related: update.content.related || [],
            createdBy: update.created_by,
            can_delete: update.can_delete,
            can_edit: update.can_edit,
            user_like_status: update.user_like_status,
            likes_count: update.likes_count,
            dislikes_count: update.dislikes_count,
            comments_count: update.comments_count,
          })),
          pagination: data.pagination,
        };
      } else {
        throw new Error(data.error || 'Failed to fetch updates');
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
      throw error;
    }
  }

  // Get a specific update by ID
  static async getUpdate(updateId: string): Promise<UpdateExtended> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/updates/${updateId}/`, {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        const update = data.update;
        return {
          id: update.id,
          type: update.type,
          title: update.title,
          summary: update.summary,
          body: update.content.body,
          timestamp: update.timestamp,
          status: update.status,
          tags: update.tags,
          author: update.author,
          icon: update.icon,
          priority: update.priority || 'normal',
          isActive: update.is_active,
          isExpired: update.expires_at ? new Date(update.expires_at) < new Date() : false,
          timeAgo: update.created_at ? `${Math.floor((Date.now() - new Date(update.created_at).getTime()) / 60000)} min ago` : '',
          readingTime: Math.max(1, Math.ceil((update.content.body || '').split(' ').length / 200)),
          fullName: update.created_by ? `${update.created_by.firstName} ${update.created_by.lastName}`.trim() : update.author || '',
          createdAt: update.created_at,
          updatedAt: update.updated_at,
          expiresAt: update.expires_at,
          attachments: update.content.attachments || [],
          media: update.content.media || [],
          related: update.content.related || [],
          createdBy: update.created_by,
          can_delete: update.can_delete,
          can_edit: update.can_edit,
          user_like_status: update.user_like_status,
          likes_count: update.likes_count,
          dislikes_count: update.dislikes_count,
          comments_count: update.comments_count,
        };
      } else {
        throw new Error(data.error || 'Failed to fetch update');
      }
    } catch (error) {
      console.error('Error fetching update:', error);
      throw error;
    }
  }

  // Create a new update
  static async createUpdate(updateData: {
    id: string;
    type: 'news' | 'communication' | 'alert';
    title: string;
    summary: string;
    body: string;
    author: string;
    icon?: string;
    tags?: string[];
    status?: string;
    priority?: number;
    attachments?: UpdateAttachment[];
    media?: UpdateMedia[];
  }): Promise<Update> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/updates/`, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return data.update;
      } else {
        throw new Error(data.error || 'Failed to create update');
      }
    } catch (error) {
      console.error('Error creating update:', error);
      throw error;
    }
  }

  // Update an existing update
  static async updateUpdate(
    updateId: string,
    updateData: Partial<{
      title: string;
      summary: string;
      body: string;
      status: string;
      tags: string[];
      priority: number;
    }>
  ): Promise<Update> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/updates/${updateId}/`, {
        method: 'PUT',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return data.update;
      } else {
        throw new Error(data.error || 'Failed to update update');
      }
    } catch (error) {
      console.error('Error updating update:', error);
      throw error;
    }
  }

  // Delete an update (soft delete)
  static async deleteUpdate(updateId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/updates/${updateId}/`, {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete update');
      }
    } catch (error) {
      console.error('Error deleting update:', error);
      throw error;
    }
  }

  // Update the status of an update
  static async updateUpdateStatus(updateId: string, status: string): Promise<{ id: string; status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/updates/${updateId}/status/`, {
        method: 'PUT',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return data.update;
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating update status:', error);
      throw error;
    }
  }

  // Search updates
  static async searchUpdates(
    query: string,
    type: string = 'all',
    tags: string = ''
  ): Promise<{ results: Update[]; total_count: number }> {
    try {
      const params = new URLSearchParams({
        q: query,
        type,
      });

      if (tags) {
        params.append('tags', tags);
      }

      const response = await fetch(`${API_BASE_URL}/api/updates/search/?${params}`, {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return {
          results: data.results.map((result: any) => ({
            id: result.id,
            type: result.type,
            title: result.title,
            summary: result.summary,
            timestamp: result.timestamp,
            status: result.status,
            tags: result.tags,
            author: result.author,
            icon: result.icon,
            content: {
              body: '',
              attachments: [],
              media: [],
              related: [],
            },
          })),
          total_count: data.total_count,
        };
      } else {
        throw new Error(data.error || 'Failed to search updates');
      }
    } catch (error) {
      console.error('Error searching updates:', error);
      throw error;
    }
  }

  // Mark an update as read
  static async markAsRead(updateId: string): Promise<void> {
    try {
      await this.updateUpdateStatus(updateId, 'read');
    } catch (error) {
      console.error('Error marking update as read:', error);
      throw error;
    }
  }

  // Get updates by type
  static async getUpdatesByType(type: 'news' | 'communication' | 'alert'): Promise<Update[]> {
    try {
      const { updates } = await this.getUpdates(type);
      return updates;
    } catch (error) {
      console.error(`Error fetching ${type} updates:`, error);
      throw error;
    }
  }

  // Get urgent updates
  static async getUrgentUpdates(): Promise<Update[]> {
    try {
      const { updates } = await this.getUpdates('all', 'urgent');
      return updates;
    } catch (error) {
      console.error('Error fetching urgent updates:', error);
      throw error;
    }
  }

  // Get new updates (unread)
  static async getNewUpdates(): Promise<Update[]> {
    try {
      const { updates } = await this.getUpdates('all', 'new');
      return updates;
    } catch (error) {
      console.error('Error fetching new updates:', error);
      throw error;
    }
  }

  // Enhanced getUpdates with likes, comments, and permissions
  static async getUpdatesEnhanced(params: {
    type?: string;
    status?: string;
    searchQuery?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<{ updates: any[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();

      if (params.type && params.type !== 'all') queryParams.append('type', params.type);
      if (params.status && params.status !== 'all') queryParams.append('status', params.status);
      if (params.searchQuery) queryParams.append('q', params.searchQuery);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('page_size', params.pageSize.toString());

      const response = await fetch(`${API_BASE_URL}/api/updates/?${queryParams}`, {
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return {
          updates: data.updates,
          pagination: data.pagination,
        };
      } else {
        throw new Error(data.error || 'Failed to fetch updates');
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
      throw error;
    }
  }

  // Create a new update using the new endpoint
  static async createUpdateNew(updateData: {
    title: string;
    type: 'news' | 'communication' | 'alert';
    summary: string;
    body: string;
    tags?: string[];
    icon?: string;
    priority?: number;
    expires_at?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/updates/create/`, {
        method: 'POST',
        headers: {
          ...AuthService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error creating update:', error);
      throw error;
    }
  }

  // Edit an existing update using the new endpoint
  static async editUpdateNew(updateId: string, updateData: Partial<{
    title: string;
    summary: string;
    body: string;
    type: 'news' | 'communication' | 'alert';
    tags: string[];
    icon: string;
    priority: number;
    expires_at: string;
  }>): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/updates/${updateId}/edit/`, {
        method: 'PUT',
        headers: {
          ...AuthService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error editing update:', error);
      throw error;
    }
  }

  // Delete an update using the new endpoint
  static async deleteUpdateNew(updateId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/updates/${updateId}/delete/`, {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error deleting update:', error);
      throw error;
    }
  }

  // Like or dislike an update
  static async toggleLike(updateId: string, isLike: boolean): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/updates/${updateId}/like/`, {
        method: 'POST',
        headers: {
          ...AuthService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_like: isLike }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  // Get comments for an update
  static async getComments(updateId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/updates/${updateId}/comments/`, {
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  // Create a comment
  static async createComment(updateId: string, content: string, parentCommentId?: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/updates/${updateId}/comments/create/`, {
        method: 'POST',
        headers: {
          ...AuthService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          parent_comment_id: parentCommentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  // Edit a comment
  static async editComment(commentId: number, content: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}/edit/`, {
        method: 'PUT',
        headers: {
          ...AuthService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error editing comment:', error);
      throw error;
    }
  }

  // Delete a comment
  static async deleteComment(commentId: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}/delete/`, {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}
