// api/messages.ts
import { apiClient } from './client';
import type { Message, CreateMessageRequest, PaginatedResponse, Reaction } from '../types';

export const messagesApi = {
  getMessages: (
    channelId: string, 
    page = 1, 
    limit = 50
  ): Promise<PaginatedResponse<Message>> =>
    apiClient.get(`/channels/${channelId}/messages?page=${page}&limit=${limit}`),

  getMessage: (messageId: string): Promise<Message> =>
    apiClient.get(`/messages/${messageId}`),

  sendMessage: (request: CreateMessageRequest): Promise<Message> => {
    const formData = new FormData();
    formData.append('content', request.content);
    formData.append('channelId', request.channelId);
    
    if (request.replyTo) {
      formData.append('replyTo', request.replyTo);
    }
    
    if (request.attachments) {
      request.attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }

    return apiClient.upload('/messages', formData);
  },

  updateMessage: (messageId: string, content: string): Promise<Message> =>
    apiClient.patch(`/messages/${messageId}`, { content }),

  deleteMessage: (messageId: string): Promise<void> =>
    apiClient.delete(`/messages/${messageId}`),

  // Message actions
  pinMessage: (messageId: string): Promise<Message> =>
    apiClient.post(`/messages/${messageId}/pin`),

  unpinMessage: (messageId: string): Promise<Message> =>
    apiClient.post(`/messages/${messageId}/unpin`),

  getPinnedMessages: (channelId: string): Promise<{ messages: Message[] }> =>
    apiClient.get(`/channels/${channelId}/pins`),

  // Reactions
  addReaction: (messageId: string, emoji: string): Promise<void> =>
    apiClient.post(`/messages/${messageId}/reactions`, { emoji }),

  removeReaction: (messageId: string, emoji: string): Promise<void> =>
    apiClient.delete(`/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`),

  getReactions: (messageId: string): Promise<{ reactions: Reaction[] }> =>
    apiClient.get(`/messages/${messageId}/reactions`),

  // Message search
  searchMessages: (
    channelId: string, 
    query: string, 
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Message>> =>
    apiClient.get(`/channels/${channelId}/messages/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`),

  searchGlobalMessages: (
    query: string,
    groupId?: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Message>> => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (groupId) {
      params.append('groupId', groupId);
    }
    
    return apiClient.get(`/messages/search?${params}`);
  },

  // Message history and pagination
  getMessagesBefore: (channelId: string, messageId: string, limit = 50): Promise<Message[]> =>
    apiClient.get(`/channels/${channelId}/messages?before=${messageId}&limit=${limit}`),

  getMessagesAfter: (channelId: string, messageId: string, limit = 50): Promise<Message[]> =>
    apiClient.get(`/channels/${channelId}/messages?after=${messageId}&limit=${limit}`),

  getMessagesAround: (channelId: string, messageId: string, limit = 50): Promise<Message[]> =>
    apiClient.get(`/channels/${channelId}/messages?around=${messageId}&limit=${limit}`),

  // Bulk operations
  bulkDeleteMessages: (channelId: string, messageIds: string[]): Promise<void> =>
    apiClient.post(`/channels/${channelId}/messages/bulk-delete`, { messageIds }),

  // Message reports
  reportMessage: (messageId: string, reason: string): Promise<void> =>
    apiClient.post(`/messages/${messageId}/report`, { reason }),

  // Read state
  markAsRead: (channelId: string, messageId?: string): Promise<void> =>
    apiClient.post(`/channels/${channelId}/read`, messageId ? { messageId } : {}),

  getUnreadCount: (channelId: string): Promise<{ count: number }> =>
    apiClient.get(`/channels/${channelId}/unread`),

  // Typing indicators
  startTyping: (channelId: string): Promise<void> =>
    apiClient.post(`/channels/${channelId}/typing`),

  // Message templates (for bots/automation)
  createMessageTemplate: (name: string, content: string): Promise<{ id: string; name: string; content: string }> =>
    apiClient.post('/message-templates', { name, content }),

  getMessageTemplates: (): Promise<{ templates: Array<{ id: string; name: string; content: string }> }> =>
    apiClient.get('/message-templates'),

  useMessageTemplate: (templateId: string, channelId: string, variables?: Record<string, string>): Promise<Message> =>
    apiClient.post(`/message-templates/${templateId}/use`, { channelId, variables }),
};