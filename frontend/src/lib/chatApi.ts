import { Message, Chat } from '../components/chat/MessageTypes';
import AuthService from './authService';

const API_BASE_URL = 'http://localhost:8000/api';

// Chat API Service
export class ChatApiService {
  // Get list of user's chats
  static async getChats(): Promise<Chat[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return data.chats.map((chat: any) => {
          let lastMessage: Message | null = null;
          
          if (chat.last_message) {
            const msg = chat.last_message;
            lastMessage = {
              id: msg.id,
              senderId: parseInt(msg.sender_id || '0'),
              senderName: msg.sender_name,
              content: msg.content,
              type: msg.message_type,
              timestamp: new Date(msg.timestamp),
              status: msg.status || 'sent',
              replyTo: null,
              forwarded: false,
              forwardedFrom: '',
              edited: false,
              editedAt: undefined
            } as Message;
          }
          
          return {
            id: chat.id,
            name: chat.name,
            type: chat.type,
            lastMessage,
            lastActivity: chat.last_activity ? new Date(chat.last_activity) : new Date(),
            unreadCount: chat.unread_count || 0,
            participants: chat.participants || [],
            isGroup: chat.type === 'group'
          };
        });
      } else {
        throw new Error(data.error || 'Failed to fetch chats');
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  }

  // Create a new chat
  static async createChat(chatType: 'user' | 'group', participantIds: string[], name?: string): Promise<Chat> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          chat_type: chatType,
          participant_ids: participantIds,
          name: name || ''
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return {
          id: data.chat.id,
          name: data.chat.name || '',
          type: data.chat.type,
          lastMessage: null,
          lastActivity: new Date(),
          unreadCount: 0,
          participants: data.chat.participants || [],
          isGroup: data.chat.type === 'group'
        };
      } else {
        throw new Error(data.error || 'Failed to create chat');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  // Get messages for a specific chat
  static async getMessages(chatId: string, page: number = 1, pageSize: number = 50): Promise<{
    messages: Message[];
    chat: Chat;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${chatId}/messages/?page=${page}&page_size=${pageSize}`, {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        const messages = data.messages.map((msg: any) => ({
          id: msg.id,
          senderId: parseInt(msg.sender_id),
          senderName: msg.sender_name,
          content: msg.content,
          type: msg.message_type,
          timestamp: new Date(msg.timestamp),
          status: msg.status,
          replyTo: msg.reply_to ? {
            id: msg.reply_to.id,
            senderId: parseInt(msg.reply_to.sender_id || '0'),
            senderName: msg.reply_to.sender_name,
            content: msg.reply_to.content,
            type: msg.reply_to.message_type,
            timestamp: new Date(msg.reply_to.timestamp),
            status: msg.reply_to.status || 'sent',
            replyTo: null,
            forwarded: false,
            forwardedFrom: '',
            edited: false,
            editedAt: undefined
          } as Message : null,
          forwarded: msg.forwarded || false,
          forwardedFrom: msg.forwarded_from || '',
          edited: msg.edited || false,
          editedAt: msg.edited_at ? new Date(msg.edited_at) : null,
          // File/media fields
          fileName: msg.file_name || '',
          fileSize: msg.file_size || '',
          fileUrl: msg.file_url || '',
          thumbnailUrl: msg.thumbnail_url || '',
          caption: msg.caption || '',
          // Audio/Video fields
          duration: msg.duration || 0,
          waveform: msg.waveform || null,
          // Location fields
          latitude: msg.latitude || null,
          longitude: msg.longitude || null,
          locationName: msg.location_name || '',
          // Contact fields
          contactName: msg.contact_name || '',
          contactPhone: msg.contact_phone || '',
          contactEmail: msg.contact_email || ''
        }));

        const chat = {
          id: data.chat.id,
          name: data.chat.name || '',
          type: data.chat.type,
          lastMessage: null,
          lastActivity: new Date(),
          unreadCount: 0,
          participants: data.chat.participants || [],
          isGroup: data.chat.type === 'group'
        };

        return { messages, chat };
      } else {
        throw new Error(data.error || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Send a new message
  static async sendMessage(chatId: string, content: string, messageType: string = 'text', replyToId?: number, forwarded: boolean = false, forwardedFrom: string = ''): Promise<Message> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${chatId}/messages/`, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          content,
          message_type: messageType,
          reply_to_id: replyToId,
          forwarded,
          forwarded_from: forwardedFrom
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        const msg = data.message;
        return {
          id: msg.id,
          senderId: parseInt(msg.sender_id),
          senderName: msg.sender_name,
          content: msg.content,
          type: msg.message_type,
          timestamp: new Date(msg.timestamp),
          status: msg.status,
          replyTo: msg.reply_to ? {
            id: msg.reply_to.id,
            senderId: parseInt(msg.reply_to.sender_id || '0'),
            senderName: msg.reply_to.sender_name,
            content: msg.reply_to.content,
            type: msg.reply_to.message_type,
            timestamp: new Date(msg.reply_to.timestamp),
            status: msg.reply_to.status || 'sent',
            replyTo: null,
            forwarded: false,
            forwardedFrom: '',
            edited: false,
            editedAt: undefined
          } as Message : null,
          forwarded: msg.forwarded || false,
          forwardedFrom: msg.forwarded_from || '',
          edited: false,
          editedAt: undefined
        };
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Update message status
  static async updateMessageStatus(messageId: number, status: string): Promise<{ id: number; status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/message/${messageId}/status/`, {
        method: 'PUT',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return data.message;
      } else {
        throw new Error(data.error || 'Failed to update message status');
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  }

  // Delete a message
  static async deleteMessage(messageId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/message/${messageId}/`, {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Search messages in a chat
  static async searchMessages(chatId: string, query: string): Promise<Message[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/search/?chat_id=${chatId}&q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return data.results.map((msg: any) => ({
          id: msg.id,
          senderId: 0, // Not provided in search results
          senderName: msg.sender_name,
          content: msg.content,
          type: msg.message_type,
          timestamp: new Date(msg.timestamp),
          status: 'sent',
          replyTo: null,
          forwarded: false,
          forwardedFrom: '',
          edited: false,
          editedAt: undefined
        }));
      } else {
        throw new Error(data.error || 'Failed to search messages');
      }
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }

  // Mark messages as read
  static async markMessagesAsRead(chatId: string): Promise<void> {
    try {
      // Get recent messages and mark them as read
      const { messages } = await this.getMessages(chatId, 1, 100);
      const unreadMessages = messages.filter(msg => 
        msg.senderId !== 1 && // Assuming current user ID is 1
        msg.status !== 'read'
      );

      // Update status for each unread message
      for (const message of unreadMessages) {
        await this.updateMessageStatus(message.id, 'read');
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }
}

// Export the service instance
export default ChatApiService;
