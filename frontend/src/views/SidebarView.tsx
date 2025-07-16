import { useState } from 'react';
import SidebarUserSection from '../UiLib/SidebarUserSection';
import SidebarItems from '../UiLib/SidebarItems';
import AddFriendModal from './AddFriendModal';

interface SidebarProps {
  onChatSelect: (userId: string, userName: string) => void;
}

export default function Sidebar({ onChatSelect }: SidebarProps) {
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);

  return (
    <>
      <div className="flex flex-col w-96 not-first:bg-stone-900">
        <SidebarItems onChatSelect={onChatSelect} />
        <div className="mt-auto">
          <SidebarUserSection />
        </div>
        <div className="p-4">
          <button
            className='bg-white text-black px-4 py-2 rounded w-full'
            onClick={() => setShowAddFriendModal(true)}
          >
            Add Friend
          </button>
        </div>
      </div>
      
      {showAddFriendModal && (
        <AddFriendModal onClose={() => setShowAddFriendModal(false)} />
      )}
    </>
  );
}