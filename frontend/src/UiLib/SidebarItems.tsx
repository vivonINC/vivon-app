import { useState, useEffect } from 'react';
import type { User } from '../types';
import SidebarItem from './SidebarItem';
import FriendRequestItem from './FriendRequestItem';
import avatarPlaceholder from "../assets/avatars/Portrait_Placeholder.png"
import { API_BASE_URL } from '../config/api.ts';

interface Group {
  conversation_id: number;
  conversation_name: string;
  conversation_type: string;
  last_message_time: string | null;
}

interface SidebarItemsProps {
  onChatSelect: (userId: string, userName: string, type: string) => void;
  activeTab: "friends"|"groups"|"requests";
  onTabChange: (tab: 'friends' | 'groups' | 'requests') => void;
}

export default function SidebarItems({ onChatSelect, onTabChange, activeTab }: SidebarItemsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const activeTabClass = 'bg-stone-700 text-white';
  const inactiveTabClass = 'text-stone-400 hover:text-white';

  const filteredFriends = friends.filter(user =>
    user.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.conversation_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = friendRequests.filter(user =>
    user.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabClick = (tab: 'friends' | 'groups' | 'requests') => {
    onTabChange(tab); // Notify parent component
  };

  useEffect(() => {
    if (activeTab === 'friends') {
      fetchFriends();
    } else if (activeTab === 'groups') {
      fetchGroups();
    } else if (activeTab === 'requests') {
      fetchFriendRequests();
    }
  }, [activeTab]);

  // Separate useEffect to fetch friend requests count for badge
  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/users/friends`, {
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

    const handleFriendRemoved = (removedUserId: string) => {
    setFriends(prev => prev.filter(friend => friend.id !== removedUserId));
  };

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const currentUserId = sessionStorage.getItem("myID");

      const response = await fetch(`${API_BASE_URL}/api/messages/getConversationGroups?userID=${currentUserId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const groupsData = await response.json();
        setGroups(groupsData);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendRequests = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const currentUserId = sessionStorage.getItem("myID");

      const response = await fetch(`${API_BASE_URL}/api/users/incFriendRequests?id=${currentUserId}`, {
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
      const token = sessionStorage.getItem("token");
      const currentUserId = sessionStorage.getItem("myID");

      const response = await fetch(`${API_BASE_URL}/api/users/acceptFriendRequest`, {
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
      const token = sessionStorage.getItem("token");
      const currentUserId = sessionStorage.getItem("myID");

      const response = await fetch(`${API_BASE_URL}/api/users/declineFriendRequest`, {
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

  const handleGroupSelect = (conversationId: string, groupName: string) => {
    onChatSelect(conversationId, groupName, 'group');
  };

  console.log('Friend IDs:', filteredFriends.map(f => f.id));

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="p-2 space-y-3">
        <div className="flex bg-stone-800 rounded-lg p-1">
          <button
            className={`flex-1 px-2 py-1.5 text-xs rounded-md transition-colors ${activeTab === 'friends' ? activeTabClass : inactiveTabClass}`}
            onClick={() => handleTabClick('friends')}
          >
            Friends
          </button>
          <button
            className={`flex-1 px-2 py-1.5 text-xs rounded-md transition-colors ${activeTab === 'groups' ? activeTabClass : inactiveTabClass}`}
            onClick={() => handleTabClick('groups')}
          >
            Groups
          </button>
          <button
            className={`flex-1 px-2 py-1.5 text-xs rounded-md transition-colors relative ${activeTab === 'requests' ? activeTabClass : inactiveTabClass}`}
            onClick={() => handleTabClick('requests')}
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
                  type='friend'
                  key={user.id}
                  avatar={user.avatar ?? avatarPlaceholder}
                  name={user.userName}
                  isOnline={user.isOnline}
                  userId={user.id}
                  onChatSelect={(userId, userName) => onChatSelect(userId, userName, 'friend')}
                  onFriendRemoved={handleFriendRemoved} 
                />
              ))
            )}
          </>
        )}

        {activeTab === 'groups' && (
          <>
            {loading ? (
              <div className="text-center text-stone-400 py-4">Loading...</div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center text-stone-400 py-4">No groups yet</div>
            ) : (
              filteredGroups.map(group => (
                <SidebarItem
                  type='group'
                  key={group.conversation_id}
                  avatar={avatarPlaceholder}
                  name={group.conversation_name}
                  userId={group.conversation_id.toString()}
                  onChatSelect={handleGroupSelect}
                />
              ))
            )}
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