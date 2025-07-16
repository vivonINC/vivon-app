import { useState, useEffect } from 'react';
import type { User } from '../types';
import SidebarItem from './SidebarItem';
import FriendRequestItem from './FriendRequestItem';

const mockGroups = [
  { id: '1', name: 'Gaming Squad', avatar: '../avatars/8bithero.png' },
  { id: '2', name: 'Study Group', avatar: '../assets/avatars/deadlock.png' },
  { id: '3', name: 'Project Team', avatar: '../assets/avatars/squid.png' },
];

interface SidebarItemsProps {
  onChatSelect: (userId: string, userName: string) => void;
}

export default function SidebarItems({ onChatSelect }: SidebarItemsProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'groups' | 'requests'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const activeTabClass = 'bg-stone-700 text-white';
  const inactiveTabClass = 'text-stone-400 hover:text-white';

  const filteredFriends = friends.filter(user =>
    user.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = friendRequests.filter(user =>
    user.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (activeTab === 'friends') {
      fetchFriends();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchFriendRequests();
    }
  }, [activeTab]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch('/api/users/friends', {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const friendsData = await response.json();
        setFriends(friendsData);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const currentUserId = localStorage.getItem("myID");

      const response = await fetch(`/api/users/incFriendRequests?id=${currentUserId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const requests = await response.json();
        setFriendRequests(requests);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (friendId: string) => {
    try {
      const token = localStorage.getItem("token");
      const currentUserId = localStorage.getItem("myID");

      const response = await fetch('/api/users/acceptFriendRequest', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          myID: parseInt(currentUserId!),
          friendID: parseInt(friendId)
        }),
      });

      if (response.ok) {
        setFriendRequests(prev => prev.filter(req => req.id !== friendId));
        fetchFriends();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDeclineRequest = async (friendId: string) => {
    try {
      const token = localStorage.getItem("token");
      const currentUserId = localStorage.getItem("myID");

      const response = await fetch('/api/users/declineFriendRequest', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          myID: parseInt(currentUserId!),
          friendID: parseInt(friendId)
        }),
      });

      if (response.ok) {
        setFriendRequests(prev => prev.filter(req => req.id !== friendId));
      }
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="p-2 space-y-3">
        <div className="flex bg-stone-800 rounded-lg p-1">
          <button
            className={`flex-1 px-2 py-1.5 text-xs rounded-md transition-colors ${activeTab === 'friends' ? activeTabClass : inactiveTabClass}`}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </button>
          <button
            className={`flex-1 px-2 py-1.5 text-xs rounded-md transition-colors ${activeTab === 'groups' ? activeTabClass : inactiveTabClass}`}
            onClick={() => setActiveTab('groups')}
          >
            Groups
          </button>
          <button
            className={`flex-1 px-2 py-1.5 text-xs rounded-md transition-colors relative ${activeTab === 'requests' ? activeTabClass : inactiveTabClass}`}
            onClick={() => setActiveTab('requests')}
          >
            Invites
            {friendRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {friendRequests.length}
              </span>
            )}
          </button>
        </div>

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

      <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-0.5">
        {activeTab === 'friends' && (
          <>
            {loading ? (
              <div className="text-center text-stone-400 py-4">Loading...</div>
            ) : filteredFriends.length === 0 ? (
              <div className="text-center text-stone-400 py-4">No friends yet</div>
            ) : (
              filteredFriends.map(user => (
                <SidebarItem
                  key={user.id}
                  avatar={user.avatar}
                  name={user.userName}
                  isOnline={user.isOnline}
                  userId={user.id}
                  onChatSelect={onChatSelect}
                />
              ))
            )}
          </>
        )}

        {activeTab === 'groups' && (
          <>
            {mockGroups.map(group => (
              <SidebarItem
                key={group.id}
                avatar={group.avatar}
                name={group.name}
                userId={group.id}
                onChatSelect={onChatSelect}
              />
            ))}
          </>
        )}

        {activeTab === 'requests' && (
          <>
            {loading ? (
              <div className="text-center text-stone-400 py-4">Loading...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center text-stone-400 py-4">No friend requests</div>
            ) : (
              filteredRequests.map(request => (
                <FriendRequestItem
                  key={request.id}
                  avatar={request.avatar}
                  name={request.userName}
                  userId={request.id}
                  onAccept={handleAcceptRequest}
                  onDecline={handleDeclineRequest}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
