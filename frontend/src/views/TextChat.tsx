import { useState, useEffect } from "react";
import TextChatItem from "../UiLib/TextChatItem";
import temp1 from "../assets/avatars/genji.png";
import { useWebSocket, type Message } from "../useWebSocket";
import AddUserToGroupModal from "./AddUserToGroupModal";

interface TextChatProps {
  conversationId: number | null;
  chatName: string;
  conversationType: string;
}

export default function TextChat({ conversationId, chatName, conversationType }: TextChatProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  const { messages, isConnected, sendMessage, loadInitialMessages, setMessages } = useWebSocket(conversationId);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      setMessages([]);
      return;
    }

    setLoading(true);
    loadInitialMessages(conversationId)
      .then(() => setLoading(false))
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [conversationId]);

  const handleSend = (content: string) => {
    if (!content.trim()) return;
    
    sendMessage(content);
    setInputText("");
  };

  const addUserToConvo = () => {
    setShowAddUserModal(true);
  };

  // No conversation selected
  if (!conversationId) {
    return (
      <div className="m-3 flex flex-col items-center justify-center h-full">
        <div className="text-center text-gray-500">Select a friend to start chatting</div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="m-3 flex flex-col items-center justify-center h-full">
        <div className="text-center">Loading messages...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="m-3 flex flex-col items-center justify-center h-full">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="m-3 flex flex-col h-full">
        <div className="mb-4 p-2 border-b flex items-center justify-between">
          <div>
            {conversationType === "group" && (
              <button 
                onClick={addUserToConvo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                Add User
              </button>
            )}
          </div>
          <h2 className="text-lg font-semibold">{chatName}</h2>
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
               title={isConnected ? 'Connected' : 'Disconnected'} />
        </div>
        
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No messages yet with {chatName}
            </div>
          ) : (
            messages.map((message: Message) => (
              <div key={message.id} className="mb-5">
                <TextChatItem 
                  avatar={message.avatar || temp1}
                  date={message.created_at ? new Date(message.created_at).toLocaleDateString() : ''}
                  text={message.content}
                  name={message.username || 'Unknown'}
                />
              </div>
            ))
          )}
        </div>
        
        <div className="mt-auto">
          <input 
            type="text" 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)} 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend(inputText);
              }
            }} 
            className="w-full p-2 bg-stone-700 border border-stone-500 rounded-lg" 
            placeholder="Type a message..."
            disabled={!isConnected}
          />
        </div>
      </div>

      {showAddUserModal && (
        <AddUserToGroupModal 
          conversationId={conversationId!}
          onClose={() => setShowAddUserModal(false)} 
        />
      )}
    </>
  );
}