// hooks/useGroups.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsApi } from '../api/groups';
import type { Group, CreateGroupRequest, Channel } from '../types';

// Query Keys
export const groupsKeys = {
  all: ['groups'] as const,
  lists: () => [...groupsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...groupsKeys.lists(), { filters }] as const,
  details: () => [...groupsKeys.all, 'detail'] as const,
  detail: (id: string) => [...groupsKeys.details(), id] as const,
  invites: (groupId: string) => [...groupsKeys.detail(groupId), 'invites'] as const,
};

// Queries
export const useGroups = () => {
  return useQuery({
    queryKey: groupsKeys.lists(),
    queryFn: async () => {
      const response = await groupsApi.getGroups();
      return response.groups;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGroup = (groupId?: string) => {
  return useQuery({
    queryKey: groupsKeys.detail(groupId!),
    queryFn: () => groupsApi.getGroup(groupId!),
    enabled: !!groupId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGroupInvites = (groupId?: string) => {
  return useQuery({
    queryKey: groupsKeys.invites(groupId!),
    queryFn: async () => {
      const response = await groupsApi.getInvites(groupId!);
      return response.invites;
    },
    enabled: !!groupId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Group Mutations
export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: CreateGroupRequest) => groupsApi.createGroup(request),
    onSuccess: (newGroup) => {
      queryClient.setQueryData(groupsKeys.lists(), (old: Group[] = []) => 
        [...old, newGroup]
      );
      // Cache the individual group as well
      queryClient.setQueryData(groupsKeys.detail(newGroup.id), newGroup);
    },
    onError: (error) => {
      console.error('Failed to create group:', error);
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ groupId, updates }: { groupId: string; updates: Partial<Group> }) =>
      groupsApi.updateGroup(groupId, updates),
    onSuccess: (updatedGroup) => {
      // Update in lists
      queryClient.setQueryData(groupsKeys.lists(), (old: Group[] = []) =>
        old.map(group => group.id === updatedGroup.id ? updatedGroup : group)
      );
      // Update individual group cache
      queryClient.setQueryData(groupsKeys.detail(updatedGroup.id), updatedGroup);
    },
    onError: (error) => {
      console.error('Failed to update group:', error);
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (groupId: string) => groupsApi.deleteGroup(groupId),
    onSuccess: (_, groupId) => {
      queryClient.setQueryData(groupsKeys.lists(), (old: Group[] = []) =>
        old.filter(group => group.id !== groupId)
      );
      queryClient.removeQueries({ queryKey: groupsKeys.detail(groupId) });
    },
    onError: (error) => {
      console.error('Failed to delete group:', error);
    },
  });
};

export const useJoinGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (groupId: string) => groupsApi.joinGroup(groupId),
    onSuccess: (_, groupId) => {
      // Invalidate to refetch updated member list
      queryClient.invalidateQueries({ queryKey: groupsKeys.detail(groupId) });
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to join group:', error);
    },
  });
};

export const useLeaveGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (groupId: string) => groupsApi.leaveGroup(groupId),
    onSuccess: (_, groupId) => {
      // Remove from lists if we left
      queryClient.setQueryData(groupsKeys.lists(), (old: Group[] = []) =>
        old.filter(group => group.id !== groupId)
      );
      queryClient.removeQueries({ queryKey: groupsKeys.detail(groupId) });
    },
    onError: (error) => {
      console.error('Failed to leave group:', error);
    },
  });
};

export const useUpdateGroupIcon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ groupId, iconFile }: { groupId: string; iconFile: File }) =>
      groupsApi.updateGroupIcon(groupId, iconFile),
    onSuccess: (updatedGroup) => {
      queryClient.setQueryData(groupsKeys.lists(), (old: Group[] = []) =>
        old.map(group => group.id === updatedGroup.id ? updatedGroup : group)
      );
      queryClient.setQueryData(groupsKeys.detail(updatedGroup.id), updatedGroup);
    },
    onError: (error) => {
      console.error('Failed to update group icon:', error);
    },
  });
};

// Member Management Mutations
export const useInviteToGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      groupsApi.inviteToGroup(groupId, userId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.detail(groupId) });
    },
    onError: (error) => {
      console.error('Failed to invite user to group:', error);
    },
  });
};

export const useKickFromGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      groupsApi.kickFromGroup(groupId, userId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.detail(groupId) });
    },
    onError: (error) => {
      console.error('Failed to kick user from group:', error);
    },
  });
};

export const useBanFromGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ groupId, userId, reason }: { groupId: string; userId: string; reason?: string }) =>
      groupsApi.banFromGroup(groupId, userId, reason),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.detail(groupId) });
    },
    onError: (error) => {
      console.error('Failed to ban user from group:', error);
    },
  });
};

// Channel Management Mutations
export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ groupId, channel }: { groupId: string; channel: Omit<Channel, 'id' | 'groupId'> }) =>
      groupsApi.createChannel(groupId, channel),
    onSuccess: (newChannel) => {
      // Update the group's channels list
      queryClient.setQueryData(groupsKeys.detail(newChannel.groupId), (old: Group | undefined) =>
        old ? { ...old, channels: [...old.channels, newChannel] } : undefined
      );
    },
    onError: (error) => {
      console.error('Failed to create channel:', error);
    },
  });
};

export const useUpdateChannel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ groupId, channelId, updates }: { 
      groupId: string; 
      channelId: string; 
      updates: Partial<Channel> 
    }) => groupsApi.updateChannel(groupId, channelId, updates),
    onSuccess: (updatedChannel) => {
      queryClient.setQueryData(groupsKeys.detail(updatedChannel.groupId), (old: Group | undefined) =>
        old ? {
          ...old,
          channels: old.channels.map(channel =>
            channel.id === updatedChannel.id ? updatedChannel : channel
          )
        } : undefined
      );
    },
    onError: (error) => {
      console.error('Failed to update channel:', error);
    },
  });
};

export const useDeleteChannel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ groupId, channelId }: { groupId: string; channelId: string }) =>
      groupsApi.deleteChannel(groupId, channelId),
    onSuccess: (_, { groupId, channelId }) => {
      queryClient.setQueryData(groupsKeys.detail(groupId), (old: Group | undefined) =>
        old ? {
          ...old,
          channels: old.channels.filter(channel => channel.id !== channelId)
        } : undefined
      );
    },
    onError: (error) => {
      console.error('Failed to delete channel:', error);
    },
  });
};

// Invite Management Mutations
export const useCreateInvite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ groupId, options }: { 
      groupId: string; 
      options?: { maxUses?: number; expiresAt?: Date } 
    }) => groupsApi.createInvite(groupId, options),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.invites(groupId) });
    },
    onError: (error) => {
      console.error('Failed to create invite:', error);
    },
  });
};

export const useDeleteInvite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ groupId, inviteCode }: { groupId: string; inviteCode: string }) =>
      groupsApi.deleteInvite(groupId, inviteCode),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.invites(groupId) });
    },
    onError: (error) => {
      console.error('Failed to delete invite:', error);
    },
  });
};

export const useJoinByInvite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (inviteCode: string) => groupsApi.joinByInvite(inviteCode),
    onSuccess: (newGroup) => {
      queryClient.setQueryData(groupsKeys.lists(), (old: Group[] = []) => 
        [...old, newGroup]
      );
      queryClient.setQueryData(groupsKeys.detail(newGroup.id), newGroup);
    },
    onError: (error) => {
      console.error('Failed to join group by invite:', error);
    },
  });
};

// Prefetch helpers
export const usePrefetchGroup = () => {
  const queryClient = useQueryClient();
  
  return (groupId: string) => {
    queryClient.prefetchQuery({
      queryKey: groupsKeys.detail(groupId),
      queryFn: () => groupsApi.getGroup(groupId),
      staleTime: 2 * 60 * 1000,
    });
  };
};

// Real-time sync helpers
export const useGroupsSync = () => {
  const queryClient = useQueryClient();

  const updateGroupData = (groupId: string, updates: Partial<Group>) => {
    // Update in lists
    queryClient.setQueryData(groupsKeys.lists(), (old: Group[] = []) =>
      old.map(group => group.id === groupId ? { ...group, ...updates } : group)
    );
    // Update individual group cache
    queryClient.setQueryData(groupsKeys.detail(groupId), (old: Group | undefined) =>
      old ? { ...old, ...updates } : undefined
    );
  };

  const addMemberToGroup = (groupId: string, member: any) => {
    queryClient.setQueryData(groupsKeys.detail(groupId), (old: Group | undefined) =>
      old ? { ...old, members: [...old.members, member] } : undefined
    );
  };

  const removeMemberFromGroup = (groupId: string, userId: string) => {
    queryClient.setQueryData(groupsKeys.detail(groupId), (old: Group | undefined) =>
      old ? { 
        ...old, 
        members: old.members.filter(member => member.id !== userId) 
      } : undefined
    );
  };

  const updateChannelUnreadCount = (groupId: string, channelId: string, unreadCount: number) => {
    queryClient.setQueryData(groupsKeys.detail(groupId), (old: Group | undefined) =>
      old ? {
        ...old,
        channels: old.channels.map(channel =>
          channel.id === channelId ? { ...channel, unreadCount } : channel
        )
      } : undefined
    );
  };

  const invalidateGroups = () => {
    queryClient.invalidateQueries({ queryKey: groupsKeys.all });
  };

  return {
    updateGroupData,
    addMemberToGroup,
    removeMemberFromGroup,
    updateChannelUnreadCount,
    invalidateGroups,
  };
};