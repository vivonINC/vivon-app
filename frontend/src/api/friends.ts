import { apiClient } from './client';
import type { Friend, SendFriendRequestRequest } from '../types';

export const friendsApi = {
  getFriends: (): Promise<{ friends: Friend[] }> => 
    apiClient.get('/friends'),

  addFriend: (request: SendFriendRequestRequest): Promise<Friend> =>
    apiClient.post('/friends', request),

  removeFriend: (friendId: string): Promise<void> =>
    apiClient.delete(`/friends/${friendId}`),

  acceptFriendRequest: (friendId: string): Promise<Friend> =>
    apiClient.post(`/friends/${friendId}/accept`),

  rejectFriendRequest: (friendId: string): Promise<void> =>
    apiClient.post(`/friends/${friendId}/reject`),

  blockFriend: (friendId: string): Promise<void> =>
    apiClient.post(`/friends/${friendId}/block`),

  unblockFriend: (friendId: string): Promise<void> =>
    apiClient.post(`/friends/${friendId}/unblock`),

  getFriendRequests: (): Promise<{ requests: Friend[] }> =>
    apiClient.get('/friends/requests'),

  getBlockedFriends: (): Promise<{ blocked: Friend[] }> =>
    apiClient.get('/friends/blocked'),

  updateFriendNickname: (friendId: string, nickname: string): Promise<Friend> =>
    apiClient.patch(`/friends/${friendId}/nickname`, { nickname }),
};