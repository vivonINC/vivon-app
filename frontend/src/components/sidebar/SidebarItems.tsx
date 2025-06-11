import { useState } from 'react';
import { avatars } from '../../assets/avatars';
import { users } from '../../mock/users';
import type { User } from '../../types';
import SidebarItem from './SidebarItem';

const mockUsers: User[] = users;

const mockGroups = [
  { id: '1', name: 'Gaming Squad', avatar: avatars[0] },
  { id: '2', name: 'Study Group', avatar: avatars[1] },
  { id: '3', name: 'Project Team', avatar: avatars[2] },
];

export default function SidebarItems() {
  const [activeTab, setActiveTab] = useState<'friends' | 'groups'>('friends');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTabClass = 'bg-stone-700 text-white';
  const inactiveTabClass = 'text-stone-400 hover:text-white';

  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="p-2 space-y-3">
        {/* Tabs */}
        <div className="flex bg-stone-800 rounded-lg p-1">
          <button
            className={`flex-1 px-4 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'friends' ? activeTabClass : inactiveTabClass
            }`}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </button>
          <button
            className={`flex-1 px-4 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'groups' ? activeTabClass : inactiveTabClass
            }`}
            onClick={() => setActiveTab('groups')}
          >
            Groups
          </button>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-stone-800 rounded-md px-3 py-1.5 text-sm text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-600"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-0.5">
        {activeTab === 'friends'
          ? filteredUsers.map(user => (
              <SidebarItem
                key={user.id}
                avatar={user.avatar}
                name={user.displayName}
                isOnline={user.isOnline}
                userId={user.id}
              />
            ))
          : mockGroups.map(group => (
              <SidebarItem
                key={group.id}
                avatar={group.avatar}
                name={group.name}
                userId={group.id}
              />
            ))}
      </div>
    </div>
  );
}
