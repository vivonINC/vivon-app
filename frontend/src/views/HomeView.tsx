import { useState } from "react";
import Sidebar from "./SidebarView";
import TextChat from "./TextChat";

export default function Home() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [selectedChatName, setSelectedChatName] = useState<string>("");

  const handleChatSelect = (userId: string, userName: string) => {
    setSelectedChatId(parseInt(userId, 10));
    setSelectedChatName(userName);
  };

  return (
    <div className="p-8 flex">
      <Sidebar onChatSelect={handleChatSelect} />
    <TextChat 
      conversationId={selectedChatId ?? undefined}
      chatName={selectedChatName}
    />
    </div>
  );
}