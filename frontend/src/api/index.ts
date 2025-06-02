export * from './client';
export * from './friends';
export * from './groups';
export * from './messages';
export * from './users';


import { friendsApi } from './friends';
import { groupsApi } from './groups';
import { messagesApi } from './messages';
import { usersApi } from './users';

export const api = {
  friends: friendsApi,
  groups: groupsApi,
  messages: messagesApi,
  users: usersApi,
};