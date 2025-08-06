import { useState } from "react";
import Sidebar from "./SidebarView";
import TextChat from "./TextChat";

export default function Home() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [selectedChatName, setSelectedChatName] = useState<string>("");
  const [selectedConversationType, setSelectedConversationType] = useState<string>("friend");

  const handleChatSelect = async (
    id: string, 
    name: string, 
    type: string,
  ) => {
    if (type === 'group') {
      setSelectedConversationId(parseInt(id));
      setSelectedChatName(name);
      setSelectedConversationType('group');
    } else if (type === 'friend') {
      const conversationId = await findOrCreateConversation(id);
      setSelectedConversationId(conversationId);
      setSelectedChatName(name);
      setSelectedConversationType('friend');
    }
  };

  const findOrCreateConversation = async (friendId: string): Promise<number> => {
    try {
      const token = sessionStorage.getItem("token");
      const currentUserId = sessionStorage.getItem("myID");

      // First, try to find existing conversation
      const response = await fetch(`/api/messages/getDirectConversations?userID=${currentUserId}&friendID=${friendId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const conversation = await response.json();
        
        if (conversation == null) {
          // If no conversation exists, create one
          const createResponse = await fetch(`/api/messages/createConversation?type=direct&name=placeholderName&ids=${currentUserId},${friendId}`, {
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (createResponse.ok) {
            const newConversation = await createResponse.json();
            return newConversation.id;
          }
        } else {
          return conversation.id;
        }
      }
    } catch (error) {
      console.error('Error finding/creating conversation:', error);
    }
    
    return 1; // Fallback
  };

  return (
    <div className="p-8 flex w-screen h-screen relative">
      <Sidebar onChatSelect={handleChatSelect} openWithTab= "friends" />
      <TextChat 
        conversationType={selectedConversationType}
        conversationId={selectedConversationId}
        chatName={selectedChatName}
      />
    </div>
  );
}