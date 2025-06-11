import { avatars } from '../assets/avatars';
import type { User } from '../types';

export const users: User[] = [
  {
    id: '1',
    username: 'Xscissors',
    displayName: 'SAIT',
    avatar: avatars[0],
    status: 'online',
    isOnline: true,
  },
  {
    id: '2',
    username: 'Nöset',
    displayName: 'Nöset',
    avatar: avatars[1],
    status: 'online',
    isOnline: true,
  },
  {
    id: '3',
    username: 'Juice',
    displayName: 'Juice',
    status: 'online',
    isOnline: true,
    avatar: avatars[2],
  },
  {
    id: '4',
    username: 'Dip',
    displayName: 'Dip',
    status: 'online',
    isOnline: true,
    avatar: avatars[3],
  },
  {
    id: '5',
    username: 'Lé monk',
    displayName: 'Lé monk',
    status: 'online',
    isOnline: true,
    avatar: avatars[4],
  },
];
