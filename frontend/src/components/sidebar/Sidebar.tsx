import { useState } from 'react';
import UserCard from './user/UserCard';
import Tabs, { type TabItem } from '../ui/Tabs';
import FriendsList from './friends/FriendsList';

interface SidebarProps {
  user: {
    username: string;
    avatar: string;
    status: string;
  };
  friends: Array<{
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
  }>;
}

export default function Sidebar({ user, friends }: SidebarProps) {
  const tabs: TabItem[] = [
    {
      id: 'friends',
      label: 'Friends',
      content: <FriendsList friends={friends} />,
    },
    {
      id: 'groups',
      label: 'Groups',
      content: (
        <div className="flex-1 flex items-center justify-center text-stone-400">
          Groups coming soon...
        </div>
      ),
    },
  ];

  return (
    <div className="bg-stone-800 rounded-md h-full p-2 w-[300px] flex flex-col gap-2">
      <UserCard
        avatar={user.avatar}
        username={user.username}
        status={user.status}
      />

      <Tabs tabs={tabs} />
    </div>
  );
}
