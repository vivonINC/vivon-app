// mock/mockData.ts
import type { User, Friend, Group } from '../types';

export const users: User[] = [
  {
    id: '1',
    username: 'john_doe',
    displayName: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'online',
    isOnline: true,
    joinedAt: new Date('2023-01-15'),
    badges: ['developer', 'early_supporter'],
  },
  {
    id: '2',
    username: 'jane_smith',
    displayName: 'Jane Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
    status: 'away',
    isOnline: true,
    customStatus: 'In a meeting',
    joinedAt: new Date('2023-02-10'),
    badges: ['moderator'],
  },
  {
    id: '3',
    username: 'mike_wilson',
    displayName: 'Mike Wilson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    status: 'busy',
    isOnline: true,
    customStatus: 'Do not disturb',
    joinedAt: new Date('2023-03-05'),
  },
  {
    id: '4',
    username: 'sarah_jones',
    displayName: 'Sarah Jones',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    status: 'online',
    isOnline: false,
    joinedAt: new Date('2023-01-20'),
    badges: ['premium', 'verified'],
  },
  {
    id: '5',
    username: 'alex_brown',
    displayName: 'Alex Brown',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    status: 'invisible',
    isOnline: true,
    customStatus: 'Working on something cool',
    joinedAt: new Date('2023-04-12'),
    badges: ['developer'],
  },
];

export const mockFriends: Friend[] = [
  {
    id: 'friend-1',
    user: users[1],
    status: 'accepted',
    lastMessageAt: new Date(Date.now() - 300000), // 5 minutes ago
    unreadCount: 2,
    addedAt: new Date('2023-02-15'),
    mutualFriends: ['3', '4'],
  },
  {
    id: 'friend-2',
    user: users[2],
    status: 'accepted',
    lastMessageAt: new Date(Date.now() - 3600000), // 1 hour ago
    unreadCount: 0,
    addedAt: new Date('2023-03-10'),
    mutualFriends: ['1'],
  },
  {
    id: 'friend-3',
    user: users[3],
    status: 'accepted',
    lastMessageAt: new Date(Date.now() - 86400000), // 1 day ago
    unreadCount: 5,
    addedAt: new Date('2023-01-25'),
    mutualFriends: ['1', '2'],
  },
  {
    id: 'friend-4',
    user: users[4],
    status: 'accepted',
    lastMessageAt: new Date(Date.now() - 172800000), // 2 days ago
    unreadCount: 0,
    addedAt: new Date('2023-04-15'),
  },
  {
    id: 'friend-pending-1',
    user: {
      id: '6',
      username: 'emma_wilson',
      displayName: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      status: 'online',
      isOnline: true,
      joinedAt: new Date('2023-05-01'),
    },
    status: 'pending',
    addedAt: new Date(Date.now() - 86400000), // 1 day ago
  },
];

export const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Development Team',
    description: 'Frontend developers chat',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop',
    members: [users[0], users[1], users[2]],
    ownerId: users[0].id,
    unreadCount: 12,
    lastActivity: new Date(Date.now() - 900000), // 15 minutes ago
    createdAt: new Date('2023-01-01'),
    isPrivate: false,
    channels: [
      {
        id: 'channel-1',
        name: 'general',
        type: 'text',
        groupId: 'group-1',
        position: 0,
        topic: 'General discussion for the team',
        unreadCount: 8,
      },
      {
        id: 'channel-2',
        name: 'code-review',
        type: 'text',
        groupId: 'group-1',
        position: 1,
        topic: 'Code reviews and technical discussions',
        unreadCount: 4,
      },
      {
        id: 'channel-3',
        name: 'Voice Chat',
        type: 'voice',
        groupId: 'group-1',
        position: 2,
      },
    ],
    roles: [
      {
        id: 'role-admin',
        name: 'Admin',
        color: '#ff5555',
        hoist: true,
        position: 100,
        permissions: ['administrator'],
        mentionable: false,
        managed: false,
      },
      {
        id: 'role-dev',
        name: 'Developer',
        color: '#55ff55',
        hoist: true,
        position: 50,
        permissions: ['sendMessages', 'manageMessages'],
        mentionable: true,
        managed: false,
      },
    ],
  },
  {
    id: 'group-2',
    name: 'Design Squad',
    description: 'UI/UX discussions',
    members: [users[0], users[3], users[4]],
    ownerId: users[3].id,
    unreadCount: 0,
    lastActivity: new Date(Date.now() - 7200000), // 2 hours ago
    createdAt: new Date('2023-02-01'),
    isPrivate: false,
    channels: [
      {
        id: 'channel-4',
        name: 'general',
        type: 'text',
        groupId: 'group-2',
        position: 0,
        topic: 'Design discussions and feedback',
        unreadCount: 0,
      },
      {
        id: 'channel-5',
        name: 'inspiration',
        type: 'text',
        groupId: 'group-2',
        position: 1,
        topic: 'Design inspiration and resources',
        unreadCount: 0,
      },
    ],
    roles: [],
  },
  {
    id: 'group-3',
    name: 'Random Chat',
    description: 'Just hanging out',
    members: [users[0], users[1], users[2], users[3], users[4]],
    ownerId: users[1].id,
    unreadCount: 3,
    lastActivity: new Date(Date.now() - 1800000), // 30 minutes ago
    createdAt: new Date('2023-03-01'),
    isPrivate: false,
    channels: [
      {
        id: 'channel-6',
        name: 'general',
        type: 'text',
        groupId: 'group-3',
        position: 0,
        topic: 'Random conversations',
        unreadCount: 3,
      },
      {
        id: 'channel-7',
        name: 'memes',
        type: 'text',
        groupId: 'group-3',
        position: 1,
        topic: 'Share your favorite memes',
        unreadCount: 0,
      },
      {
        id: 'channel-8',
        name: 'Lounge',
        type: 'voice',
        groupId: 'group-3',
        position: 2,
      },
    ],
    roles: [],
  },
];

export const createMockResponse = <T>(data: T, delay = 500) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockApiResponses = {
  '/api/friends': () => createMockResponse({ friends: mockFriends }),
  '/api/groups': () => createMockResponse({ groups: mockGroups }),
  '/api/user/me': () => createMockResponse(users[0]),
};