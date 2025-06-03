// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import type { User, DirectMessage, UpdateUserSettingsRequest, PaginatedResponse, Message } from '../types';

// Query Keys
export const usersKeys = {
  all: ['users'] as const,
  me: () => [...usersKeys.all, 'me'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...usersKeys.lists(), { filters }] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
  search: (query: string) => [...usersKeys.all, 'search', query] as const,
  directMessages: () => [...usersKeys.all, 'dm'] as const,
  directMessage: (dmId: string) => [...usersKeys.directMessages(), dmId] as const,
};

// Current User Queries
export const useCurrentUser = () => {
  return useQuery({
    queryKey: usersKeys.me(),
    queryFn: usersApi.getCurrentUser,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.status === 401) return false;
      return failureCount < 3;
    },
  });
};

export const useUser = (userId?: string) => {
  return useQuery({
    queryKey: usersKeys.detail(userId!),
    queryFn: () => usersApi.getUser(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: usersKeys.search(query),
    queryFn: () => usersApi.searchUsers(query),
    enabled: query.length > 2,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

// User Mutations
export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: UpdateUserSettingsRequest) => usersApi.updateUserSettings(request),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(usersKeys.me(), updatedUser);
    },
    onError: (error) => {
      console.error('Failed to update user settings:', error);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Partial<User>) => usersApi.updateProfile(updates),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(usersKeys.me(), updatedUser);
      queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);
    },
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ status, customStatus }: { status: User['status']; customStatus?: string }) =>
      usersApi.updateStatus(status, customStatus),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(usersKeys.me(), updatedUser);
    },
  });
};

// Direct Messages Queries
export const useDirectMessages = () => {
  return useQuery({
    queryKey: usersKeys.directMessages(),
    queryFn: usersApi.getDirectMessages,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDirectMessageHistory = (dmId?: string) => {
  return useInfiniteQuery<PaginatedResponse<Message>, Error>({
    queryKey: usersKeys.directMessage(dmId!),
    queryFn: ({ pageParam = 1 }) => 
      usersApi.getDirectMessageHistory(dmId!, typeof pageParam === 'number' ? pageParam : 1),
    enabled: !!dmId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => 
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    getPreviousPageParam: (firstPage) => 
      firstPage.pagination.hasPrev ? firstPage.pagination.page - 1 : undefined,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Direct Messages Mutations
export const useCreateDirectMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => usersApi.createDirectMessage(userId),
    onSuccess: (newDM) => {
      queryClient.setQueryData(usersKeys.directMessages(), (old: DirectMessage[] = []) => 
        [...old, newDM]
      );
    },
  });
};

// Prefetch helpers
export const usePrefetchUser = () => {
  const queryClient = useQueryClient();
  
  return (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: usersKeys.detail(userId),
      queryFn: () => usersApi.getUser(userId),
      staleTime: 5 * 60 * 1000,
    });
  };
};

export const usePrefetchDirectMessageHistory = () => {
  const queryClient = useQueryClient();
  
  return (dmId: string) => {
    queryClient.prefetchInfiniteQuery({
      queryKey: usersKeys.directMessage(dmId),
      queryFn: ({ pageParam = 1 }) => usersApi.getDirectMessageHistory(dmId, pageParam),
      initialPageParam: 1,
      staleTime: 30 * 1000,
    });
  };
};

// Real-time sync helpers
export const useUsersSync = () => {
  const queryClient = useQueryClient();

  const updateUserStatus = (userId: string, status: User['status'], customStatus?: string) => {
    // Update in current user cache if it's the current user
    queryClient.setQueryData(usersKeys.me(), (old: User | undefined) => 
      old && old.id === userId 
        ? { ...old, status, customStatus }
        : old
    );
    
    // Update in individual user cache
    queryClient.setQueryData(usersKeys.detail(userId), (old: User | undefined) =>
      old ? { ...old, status, customStatus } : undefined
    );
  };

  const updateUserOnline = (userId: string, isOnline: boolean) => {
    queryClient.setQueryData(usersKeys.me(), (old: User | undefined) => 
      old && old.id === userId 
        ? { ...old, isOnline }
        : old
    );
    
    queryClient.setQueryData(usersKeys.detail(userId), (old: User | undefined) =>
      old ? { ...old, isOnline } : undefined
    );
  };

  const invalidateCurrentUser = () => {
    queryClient.invalidateQueries({ queryKey: usersKeys.me() });
  };

  const invalidateDirectMessages = () => {
    queryClient.invalidateQueries({ queryKey: usersKeys.directMessages() });
  };

  return {
    updateUserStatus,
    updateUserOnline,
    invalidateCurrentUser,
    invalidateDirectMessages,
  };
};