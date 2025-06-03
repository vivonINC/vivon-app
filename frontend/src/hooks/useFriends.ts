// hooks/useFriends.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { friendsApi } from '../api/friends';
import type { Friend, SendFriendRequestRequest } from '../types';

// Query Keys
export const friendsKeys = {
  all: ['friends'] as const,
  lists: () => [...friendsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...friendsKeys.lists(), { filters }] as const,
  details: () => [...friendsKeys.all, 'detail'] as const,
  detail: (id: string) => [...friendsKeys.details(), id] as const,
  requests: () => [...friendsKeys.all, 'requests'] as const,
  blocked: () => [...friendsKeys.all, 'blocked'] as const,
};

// Queries
export const useFriends = () => {
  return useQuery({
    queryKey: friendsKeys.lists(),
    queryFn: async () => {
      const response = await friendsApi.getFriends();
      return response.friends;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFriendRequests = () => {
  return useQuery({
    queryKey: friendsKeys.requests(),
    queryFn: async () => {
      const response = await friendsApi.getFriendRequests();
      return response.requests;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useBlockedFriends = () => {
  return useQuery({
    queryKey: friendsKeys.blocked(),
    queryFn: async () => {
      const response = await friendsApi.getBlockedFriends();
      return response.blocked;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useAddFriend = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: SendFriendRequestRequest) => friendsApi.addFriend(request),
    onSuccess: (newFriend) => {
      // Add to friends list if accepted, or to requests if pending
      if (newFriend.status === 'accepted') {
        queryClient.setQueryData(friendsKeys.lists(), (old: Friend[] = []) => 
          [...old, newFriend]
        );
      } else if (newFriend.status === 'pending') {
        queryClient.setQueryData(friendsKeys.requests(), (old: Friend[] = []) => 
          [...old, newFriend]
        );
      }
    },
    onError: (error) => {
      console.error('Failed to add friend:', error);
    },
  });
};

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (friendId: string) => friendsApi.removeFriend(friendId),
    onSuccess: (_, friendId) => {
      // Remove from all friend-related caches
      queryClient.setQueryData(friendsKeys.lists(), (old: Friend[] = []) => 
        old.filter(friend => friend.id !== friendId)
      );
      queryClient.setQueryData(friendsKeys.requests(), (old: Friend[] = []) => 
        old.filter(friend => friend.id !== friendId)
      );
      queryClient.setQueryData(friendsKeys.blocked(), (old: Friend[] = []) => 
        old.filter(friend => friend.id !== friendId)
      );
    },
    onError: (error) => {
      console.error('Failed to remove friend:', error);
    },
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (friendId: string) => friendsApi.acceptFriendRequest(friendId),
    onSuccess: (updatedFriend) => {
      // Move from requests to friends list
      queryClient.setQueryData(friendsKeys.requests(), (old: Friend[] = []) =>
        old.filter(friend => friend.id !== updatedFriend.id)
      );
      queryClient.setQueryData(friendsKeys.lists(), (old: Friend[] = []) => 
        [...old, updatedFriend]
      );
    },
    onError: (error) => {
      console.error('Failed to accept friend request:', error);
    },
  });
};

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (friendId: string) => friendsApi.rejectFriendRequest(friendId),
    onSuccess: (_, friendId) => {
      // Remove from requests
      queryClient.setQueryData(friendsKeys.requests(), (old: Friend[] = []) =>
        old.filter(friend => friend.id !== friendId)
      );
    },
    onError: (error) => {
      console.error('Failed to reject friend request:', error);
    },
  });
};

export const useBlockFriend = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (friendId: string) => friendsApi.blockFriend(friendId),
    onSuccess: (_, friendId) => {
      // Remove from friends list and add to blocked
      const friendToBlock = queryClient.getQueryData<Friend[]>(friendsKeys.lists())
        ?.find(friend => friend.id === friendId);
      
      if (friendToBlock) {
        queryClient.setQueryData(friendsKeys.lists(), (old: Friend[] = []) =>
          old.filter(friend => friend.id !== friendId)
        );
        queryClient.setQueryData(friendsKeys.blocked(), (old: Friend[] = []) => 
          [...old, { ...friendToBlock, status: 'blocked' as const }]
        );
      }
    },
    onError: (error) => {
      console.error('Failed to block friend:', error);
    },
  });
};

export const useUnblockFriend = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (friendId: string) => friendsApi.unblockFriend(friendId),
    onSuccess: (_, friendId) => {
      // Remove from blocked list
      queryClient.setQueryData(friendsKeys.blocked(), (old: Friend[] = []) =>
        old.filter(friend => friend.id !== friendId)
      );
    },
    onError: (error) => {
      console.error('Failed to unblock friend:', error);
    },
  });
};

export const useUpdateFriendNickname = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ friendId, nickname }: { friendId: string; nickname: string }) =>
      friendsApi.updateFriendNickname(friendId, nickname),
    onSuccess: (updatedFriend) => {
      // Update friend in the list
      queryClient.setQueryData(friendsKeys.lists(), (old: Friend[] = []) =>
        old.map(friend => 
          friend.id === updatedFriend.id ? updatedFriend : friend
        )
      );
    },
    onError: (error) => {
      console.error('Failed to update friend nickname:', error);
    },
  });
};

// Real-time sync helpers
export const useFriendsSync = () => {
  const queryClient = useQueryClient();

  const updateFriendStatus = (friendId: string, updates: Partial<Friend>) => {
    queryClient.setQueryData(friendsKeys.lists(), (old: Friend[] = []) =>
      old.map(friend => 
        friend.id === friendId ? { ...friend, ...updates } : friend
      )
    );
  };

  const updateFriendOnlineStatus = (userId: string, isOnline: boolean) => {
    queryClient.setQueryData(friendsKeys.lists(), (old: Friend[] = []) =>
      old.map(friend => 
        friend.user.id === userId 
          ? { ...friend, user: { ...friend.user, isOnline } }
          : friend
      )
    );
  };

  const addNewFriendRequest = (friendRequest: Friend) => {
    queryClient.setQueryData(friendsKeys.requests(), (old: Friend[] = []) => 
      [friendRequest, ...old]
    );
  };

  const invalidateFriends = () => {
    queryClient.invalidateQueries({ queryKey: friendsKeys.all });
  };

  return {
    updateFriendStatus,
    updateFriendOnlineStatus,
    addNewFriendRequest,
    invalidateFriends,
  };
};