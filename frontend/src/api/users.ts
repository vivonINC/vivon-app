// api/users.ts
import { apiClient } from './client';
import type { User, DirectMessage, UpdateUserSettingsRequest, PaginatedResponse, Message } from '../types';

export const usersApi = {
  // Current user
  getCurrentUser: (): Promise<User> =>
    apiClient.get('/user/me'),

  updateUserSettings: (request: UpdateUserSettingsRequest): Promise<User> =>
    apiClient.patch('/user/settings', request),

  updateProfile: (updates: Partial<User>): Promise<User> =>
    apiClient.patch('/user/profile', updates),

  updateStatus: (status: User['status'], customStatus?: string): Promise<User> =>
    apiClient.patch('/user/status', { status, customStatus }),

  updateAvatar: (avatarFile: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return apiClient.upload('/user/avatar', formData);
  },

  // User lookup and search
  getUser: (userId: string): Promise<User> =>
    apiClient.get(`/users/${userId}`),

  getUserByUsername: (username: string): Promise<User> =>
    apiClient.get(`/users/username/${username}`),

  searchUsers: (query: string, limit = 20): Promise<User[]> =>
    apiClient.get(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}`),

  // User relationships
  getUserFriends: (userId: string): Promise<{ friends: User[] }> =>
    apiClient.get(`/users/${userId}/friends`),

  getMutualFriends: (userId: string): Promise<{ friends: User[] }> =>
    apiClient.get(`/users/${userId}/mutual-friends`),

  // User activity and presence
  getUserActivity: (userId: string): Promise<{ activity: any }> =>
    apiClient.get(`/users/${userId}/activity`),

  setPresence: (status: User['status'], activity?: string): Promise<void> =>
    apiClient.post('/user/presence', { status, activity }),

  // User preferences
  updateNotificationSettings: (settings: Record<string, boolean>): Promise<User> =>
    apiClient.patch('/user/notifications', settings),

  updatePrivacySettings: (settings: Record<string, any>): Promise<User> =>
    apiClient.patch('/user/privacy', settings),

  // Account management
  changePassword: (currentPassword: string, newPassword: string): Promise<void> =>
    apiClient.post('/user/change-password', { currentPassword, newPassword }),

  enable2FA: (secret: string, token: string): Promise<{ backupCodes: string[] }> =>
    apiClient.post('/user/2fa/enable', { secret, token }),

  disable2FA: (token: string): Promise<void> =>
    apiClient.post('/user/2fa/disable', { token }),

  generateBackupCodes: (): Promise<{ codes: string[] }> =>
    apiClient.post('/user/2fa/backup-codes'),

  // Direct Messages
  getDirectMessages: (): Promise<DirectMessage[]> =>
    apiClient.get('/dm'),

  createDirectMessage: (userId: string): Promise<DirectMessage> =>
    apiClient.post('/dm', { userId }),

  getDirectMessage: (dmId: string): Promise<DirectMessage> =>
    apiClient.get(`/dm/${dmId}`),

  getDirectMessageHistory: (
    dmId: string, 
    page = 1, 
    limit = 50
  ): Promise<PaginatedResponse<Message>> =>
    apiClient.get(`/dm/${dmId}/messages?page=${page}&limit=${limit}`),

  sendDirectMessage: (dmId: string, content: string, attachments?: File[]): Promise<Message> => {
    const formData = new FormData();
    formData.append('content', content);
    
    if (attachments) {
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }

    return apiClient.upload(`/dm/${dmId}/messages`, formData);
  },

  markDirectMessageAsRead: (dmId: string, messageId?: string): Promise<void> =>
    apiClient.post(`/dm/${dmId}/read`, messageId ? { messageId } : {}),

  deleteDirectMessage: (dmId: string): Promise<void> =>
    apiClient.delete(`/dm/${dmId}`),

  // Blocked users
  getBlockedUsers: (): Promise<{ users: User[] }> =>
    apiClient.get('/user/blocked'),

  blockUser: (userId: string): Promise<void> =>
    apiClient.post(`/users/${userId}/block`),

  unblockUser: (userId: string): Promise<void> =>
    apiClient.delete(`/users/${userId}/block`),

  // User reports
  reportUser: (userId: string, reason: string, details?: string): Promise<void> =>
    apiClient.post(`/users/${userId}/report`, { reason, details }),

  // User sessions
  getSessions: (): Promise<{ sessions: any[] }> =>
    apiClient.get('/user/sessions'),

  terminateSession: (sessionId: string): Promise<void> =>
    apiClient.delete(`/user/sessions/${sessionId}`),

  terminateAllSessions: (): Promise<void> =>
    apiClient.delete('/user/sessions'),

  // Data export
  requestDataExport: (): Promise<{ requestId: string }> =>
    apiClient.post('/user/export'),

  getDataExportStatus: (requestId: string): Promise<{ status: string; downloadUrl?: string }> =>
    apiClient.get(`/user/export/${requestId}`),

  // Account deletion
  requestAccountDeletion: (password: string): Promise<{ deletionDate: string }> =>
    apiClient.post('/user/delete-account', { password }),

  cancelAccountDeletion: (password: string): Promise<void> =>
    apiClient.post('/user/cancel-deletion', { password }),
};