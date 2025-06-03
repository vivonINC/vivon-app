// hooks/index.ts
// Re-export all hooks for easier imports

// Friends hooks
export * from './useFriends';

// Groups hooks  
export * from './useGroups';

// Messages hooks
export * from './useMessages';

// Users hooks
export * from './useUsers';

// Combined real-time sync hook
export const useRealtimeSync = () => {
  const friendsSync = useFriendsSync();
  const groupsSync = useGroupsSync();
  const messagesSync = useMessagesSync();
  const usersSync = useUsersSync();

  return {
    friends: friendsSync,
    groups: groupsSync,
    messages: messagesSync,
    users: usersSync,
  };
};

// Combined prefetch hook
export const usePrefetch = () => {
  const prefetchGroup = usePrefetchGroup();
  const prefetchMessages = usePrefetchMessages();
  const prefetchUser = usePrefetchUser();
  const prefetchDirectMessageHistory = usePrefetchDirectMessageHistory();

  return {
    group: prefetchGroup,
    messages: prefetchMessages,
    user: prefetchUser,
    directMessageHistory: prefetchDirectMessageHistory,
  };
};

// Import the sync functions for the combined hook
import { useFriendsSync } from './useFriends';
import { useGroupsSync } from './useGroups';
import { useMessagesSync } from './useMessages';
import { useUsersSync } from './useUsers';
import { usePrefetchGroup } from './useGroups';
import { usePrefetchMessages } from './useMessages';
import { usePrefetchUser, usePrefetchDirectMessageHistory } from './useUsers';