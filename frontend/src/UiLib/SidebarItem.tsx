import { useState } from "react";
import { DotsThreeVerticalIcon } from '@phosphor-icons/react';
import { IconButton } from "./IconButton";
import { API_BASE_URL } from '../config/api.ts';

interface SidebarItemProps {
  avatar: string;
  name: string;
  isOnline?: boolean;
  userId: string;
  type: string;
  lastMessage?: string;
  lastMessageDate?: string;
  onChatSelect: (userId: string, userName: string, type: string) => void;
  onFriendRemoved?: (userId: string) => void; // Optional callback for when friend is removed
}

export default function SidebarItem({
  avatar,
  name,
  isOnline,
  userId,
  lastMessage,
  lastMessageDate,
  type,
  onChatSelect,
  onFriendRemoved,
}: SidebarItemProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [description, setDescription] = useState("");

  const handleChatClick = () => {
    if (!isExpanded) {
      onChatSelect(userId, name, type);
    }
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering chat selection
    if (!isExpanded) {
      // Load existing description when expanding
      loadExistingDescription();
    }
    setIsExpanded(!isExpanded);
  };

  const loadExistingDescription = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const myID = sessionStorage.getItem("myID");
      
      const response = await fetch(`${API_BASE_URL}/api/users/getFriendDescription?fromID=${myID}&toID=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const existingDescription = await response.text();
        if (existingDescription) {
          setDescription(existingDescription);
        }
      }
    } catch (error) {
      console.error('Error loading description:', error);
    }
  };

  const handleRemoveFriend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = sessionStorage.getItem("token");
      const myID = sessionStorage.getItem("myID");
      
      const response = await fetch(`${API_BASE_URL}/api/users/removeFriend?fromID=${myID}&toID=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Friend removed successfully');
        // Notify parent component to refresh friends list
        if (onFriendRemoved) {
          onFriendRemoved(userId);
        }
      } else {
        console.error('Failed to remove friend');
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
    setIsExpanded(false);
  };

  const handleDescriptionSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!description.trim()) {
      console.log('Description is empty');
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const myID = sessionStorage.getItem("myID");
      
      const response = await fetch(`${API_BASE_URL}/api/users/addDescription`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          myID: myID,
          friendID: userId,
          description: description.trim()
        })
      });

      if (response.ok) {
        console.log('Description updated successfully');
      } else {
        console.error('Failed to update description');
      }
    } catch (error) {
      console.error('Error updating description:', error);
    }
    setIsExpanded(false);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setDescription(e.target.value);
  };

  return (
    <div
      className={`rounded transition-colors ${
        isExpanded ? 'bg-stone-800' : 'hover:bg-stone-800'
      }`}
    >
      {/* Main item row */}
      <div
        onClick={handleChatClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)} // Fixed: was true, should be false
        className="flex items-center gap-2 px-2 py-2 cursor-pointer"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-stone-700">
            <img src={avatar} alt={name} className="w-full h-full object-cover rounded-full" />
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-stone-900" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-stone-200 truncate">{name}</span>
            {lastMessageDate && <span className="text-xs text-stone-400">{lastMessageDate}</span>}
          </div>
          {lastMessage && <p className="text-xs text-stone-400 truncate">{lastMessage}</p>}
        </div>

        <div>
          {(isHovering || isExpanded) && type === "friend" && (
            <IconButton
              icon={DotsThreeVerticalIcon}
              variant="default"
              size="md"
              className="text-stone-400 hover:text-white hover:bg-stone-700"
              onClick={handleOptionsClick}
            />
          )}
        </div>
      </div>

      {/* Expanded options */}
      {isExpanded && (
        <div className="px-2 pb-3 space-y-2">
          <div className="border-t border-stone-700 pt-2">
            {/* Description input */}
            <div className="mb-2">
              <label className="block text-xs text-stone-400 mb-1">Friend Description</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Add a description..."
                  className="flex-1 px-2 py-1 text-xs bg-stone-700 border border-stone-600 rounded text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-500"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={handleDescriptionSubmit}
                  className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Remove friend button */}
            <button
              onClick={handleRemoveFriend}
              className="w-full px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Remove Friend
            </button>
          </div>
        </div>
      )}
    </div>
  );
}