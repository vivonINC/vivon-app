
import { apiClient } from './client';
import type { Group, CreateGroupRequest, Channel } from '../types';

export const groupsApi = {
  getGroups: (): Promise<{ groups: Group[] }> =>
    apiClient.get('/groups'),

  getGroup: (groupId: string): Promise<Group> =>
    apiClient.get(`/groups/${groupId}`),

  createGroup: (request: CreateGroupRequest): Promise<Group> =>
    apiClient.post('/groups', request),

  updateGroup: (groupId: string, updates: Partial<Group>): Promise<Group> =>
    apiClient.patch(`/groups/${groupId}`, updates),

  deleteGroup: (groupId: string): Promise<void> =>
    apiClient.delete(`/groups/${groupId}`),

  joinGroup: (groupId: string): Promise<void> =>
    apiClient.post(`/groups/${groupId}/join`),

  leaveGroup: (groupId: string): Promise<void> =>
    apiClient.post(`/groups/${groupId}/leave`),

  inviteToGroup: (groupId: string, userId: string): Promise<void> =>
    apiClient.post(`/groups/${groupId}/invite`, { userId }),

  kickFromGroup: (groupId: string, userId: string): Promise<void> =>
    apiClient.post(`/groups/${groupId}/kick`, { userId }),

  banFromGroup: (groupId: string, userId: string, reason?: string): Promise<void> =>
    apiClient.post(`/groups/${groupId}/ban`, { userId, reason }),

  unbanFromGroup: (groupId: string, userId: string): Promise<void> =>
    apiClient.delete(`/groups/${groupId}/ban/${userId}`),

  updateGroupIcon: (groupId: string, iconFile: File): Promise<Group> => {
    const formData = new FormData();
    formData.append('icon', iconFile);
    return apiClient.upload(`/groups/${groupId}/icon`, formData);
  },

  // Channel management
  createChannel: (groupId: string, channel: Omit<Channel, 'id' | 'groupId'>): Promise<Channel> =>
    apiClient.post(`/groups/${groupId}/channels`, channel),

  updateChannel: (groupId: string, channelId: string, updates: Partial<Channel>): Promise<Channel> =>
    apiClient.patch(`/groups/${groupId}/channels/${channelId}`, updates),

  deleteChannel: (groupId: string, channelId: string): Promise<void> =>
    apiClient.delete(`/groups/${groupId}/channels/${channelId}`),

  reorderChannels: (groupId: string, channelIds: string[]): Promise<Channel[]> =>
    apiClient.patch(`/groups/${groupId}/channels/reorder`, { channelIds }),

  // Group invites
  createInvite: (groupId: string, options?: { maxUses?: number; expiresAt?: Date }): Promise<{ code: string; url: string }> =>
    apiClient.post(`/groups/${groupId}/invites`, options),

  getInvites: (groupId: string): Promise<{ invites: any[] }> =>
    apiClient.get(`/groups/${groupId}/invites`),

  deleteInvite: (groupId: string, inviteCode: string): Promise<void> =>
    apiClient.delete(`/groups/${groupId}/invites/${inviteCode}`),

  joinByInvite: (inviteCode: string): Promise<Group> =>
    apiClient.post(`/invites/${inviteCode}/join`),
};