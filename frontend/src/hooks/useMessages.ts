// hooks/useMessages.ts
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '../api/messages';
import type { Message, CreateMessageRequest, PaginatedResponse } from '../types';

// Query Keys
export const messagesKeys = {
  all: ['messages'] as const,
  channels: () => [...messagesKeys.all, 'channel'] as const,
  channel: (channelId: string) => [...messagesKeys.channels(), channelId] as const,
  search: (channelId: string, query: string) => [...messagesKeys.channel(channelId), 'search', query] as const,
};

// Queries
export const useMessages = (channelId?: string) => {
  return useInfiniteQuery<PaginatedResponse<Message>, Error>({
    queryKey: messagesKeys.channel(channelId!),
    queryFn: ({ pageParam = 1 }) => 
      messagesApi.getMessages(channelId!, typeof pageParam === 'number' ? pageParam : 1),
    enabled: !!channelId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => 
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    getPreviousPageParam: (firstPage) => 
      firstPage.pagination.hasPrev ? firstPage.pagination.page - 1 : undefined,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchMessages = (channelId: string, query: string) => {
  return useInfiniteQuery<PaginatedResponse<Message>, Error>({
    queryKey: messagesKeys.search(channelId, query),
    queryFn: ({ pageParam = 1 }) => 
      messagesApi.searchMessages(channelId, query, typeof pageParam === 'number' ? pageParam : 1),
    enabled: !!channelId && query.length > 2,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => 
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

// Mutations
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: CreateMessageRequest) => messagesApi.sendMessage(request),
    onSuccess: (newMessage) => {
      // Optimistically update messages
      queryClient.setQueryData(messagesKeys.channel(newMessage.channelId), (old: any) => {
        if (!old) return { pages: [{ data: [newMessage], pagination: {} }] };
        
        const newPages = [...old.pages];
        if (newPages[0]) {
          newPages[0] = {
            ...newPages[0],
            data: [newMessage, ...newPages[0].data],
          };
        }
        return { ...old, pages: newPages };
      });
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
    },
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
      messagesApi.updateMessage(messageId, content),
    onSuccess: (updatedMessage) => {
      // Update message in cache
      queryClient.setQueryData(messagesKeys.channel(updatedMessage.channelId), (old: any) => {
        if (!old) return old;
        
        const newPages = old.pages.map((page: any) => ({
          ...page,
          data: page.data.map((msg: Message) =>
            msg.id === updatedMessage.id ? updatedMessage : msg
          ),
        }));
        return { ...old, pages: newPages };
      });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageId: string) => messagesApi.deleteMessage(messageId),
    onSuccess: (_, messageId) => {
      // Remove message from all channel caches
      queryClient.setQueriesData({ queryKey: messagesKeys.channels() }, (old: any) => {
        if (!old) return old;
        
        const newPages = old.pages.map((page: any) => ({
          ...page,
          data: page.data.filter((msg: Message) => msg.id !== messageId),
        }));
        return { ...old, pages: newPages };
      });
    },
  });
};

export const usePinMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageId: string) => messagesApi.pinMessage(messageId),
    onSuccess: (updatedMessage) => {
      queryClient.setQueryData(messagesKeys.channel(updatedMessage.channelId), (old: any) => {
        if (!old) return old;
        
        const newPages = old.pages.map((page: any) => ({
          ...page,
          data: page.data.map((msg: Message) =>
            msg.id === updatedMessage.id ? updatedMessage : msg
          ),
        }));
        return { ...old, pages: newPages };
      });
    },
  });
};

export const useAddReaction = () => {
  return useMutation({
    mutationFn: ({ messageId, emoji }: { messageId: string; emoji: string }) =>
      messagesApi.addReaction(messageId, emoji),
    // Optimistic update could be added here
  });
};

export const useRemoveReaction = () => {
  return useMutation({
    mutationFn: ({ messageId, emoji }: { messageId: string; emoji: string }) =>
      messagesApi.removeReaction(messageId, emoji),
    // Optimistic update could be added here
  });
};

// Optimistic update helpers
export const useOptimisticMessage = () => {
  const queryClient = useQueryClient();
  
  const addOptimisticMessage = (tempMessage: Message) => {
    queryClient.setQueryData(messagesKeys.channel(tempMessage.channelId), (old: any) => {
      if (!old) return { pages: [{ data: [tempMessage], pagination: {} }] };
      
      const newPages = [...old.pages];
      if (newPages[0]) {
        newPages[0] = {
          ...newPages[0],
          data: [tempMessage, ...newPages[0].data],
        };
      }
      return { ...old, pages: newPages };
    });
  };

  const removeOptimisticMessage = (tempId: string, channelId: string) => {
    queryClient.setQueryData(messagesKeys.channel(channelId), (old: any) => {
      if (!old) return old;
      
      const newPages = old.pages.map((page: any) => ({
        ...page,
        data: page.data.filter((msg: Message) => msg.id !== tempId),
      }));
      return { ...old, pages: newPages };
    });
  };

  return { addOptimisticMessage, removeOptimisticMessage };
};

// Real-time sync helpers
export const useMessagesSync = () => {
  const queryClient = useQueryClient();

  const invalidateMessages = (channelId: string) => {
    queryClient.invalidateQueries({ queryKey: messagesKeys.channel(channelId) });
  };

  const addRealtimeMessage = (message: Message) => {
    queryClient.setQueryData(messagesKeys.channel(message.channelId), (old: any) => {
      if (!old) return { pages: [{ data: [message], pagination: {} }] };
      
      const newPages = [...old.pages];
      if (newPages[0]) {
        newPages[0] = {
          ...newPages[0],
          data: [message, ...newPages[0].data],
        };
      }
      return { ...old, pages: newPages };
    });
  };

  return {
    invalidateMessages,
    addRealtimeMessage,
  };
};

// Prefetch helpers
export const usePrefetchMessages = () => {
  const queryClient = useQueryClient();
  
  return (channelId: string) => {
    queryClient.prefetchInfiniteQuery({
      queryKey: messagesKeys.channel(channelId),
      queryFn: ({ pageParam = 1 }) => messagesApi.getMessages(channelId, pageParam),
      initialPageParam: 1,
      staleTime: 30 * 1000,
    });
  };
};