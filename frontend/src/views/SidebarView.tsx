import { useState } from 'react';
import SidebarUserSection from '../UiLib/SidebarUserSection';
import SidebarItems from '../UiLib/SidebarItems';
import AddFriendModal from './AddFriendModal';
import CreateGroupModal from './CreateGroupModal';

interface SidebarProps {
  onChatSelect: (id: string, name: string, type: string) => void;
  openWithTab: "friends" | "groups" | "requests";
}

export default function Sidebar({ onChatSelect, openWithTab }: SidebarProps) {
  const [reloadKey, setreloadKey] = useState(0);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'friends' | 'groups' | 'requests'>(openWithTab);

  const handleTabChange = (tab: 'friends' | 'groups' | 'requests') => {
    setActiveTab(tab);
  };

  const handleButtonClick = () => {
    if (activeTab === 'groups') {
      setShowCreateGroupModal(true);
    } else {
      setShowAddFriendModal(true);
    }
  };

  const getButtonText = () => {
    if(activeTab == "groups"){
      return "Create group"
    } else{
      return"Add friend"
    }
  };

  return (
    <>
      <div className="flex flex-col w-96 not-first:bg-stone-900">
        <SidebarItems 
          key={reloadKey}
          activeTab={activeTab}
          onChatSelect={onChatSelect} 
          onTabChange={handleTabChange}
        />
        <div className="mt-auto">
          <SidebarUserSection />
        </div>
        <div className="p-4">
          <button
            className='bg-white text-black px-4 py-2 rounded w-full'
            onClick={handleButtonClick}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
      
      {showAddFriendModal && (
        <AddFriendModal onClose={() => setShowAddFriendModal(false)} />
      )}
      {showCreateGroupModal && (
        <CreateGroupModal onClose={() =>{setShowCreateGroupModal(false)
          setreloadKey(prev => prev+1)
        }} />
      )}
    </>
  );
}