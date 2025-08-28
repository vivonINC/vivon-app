import { useState, useEffect, useRef, useCallback} from "react";
import TextChatItem from "../UiLib/TextChatItem";
import temp1 from "../assets/avatars/Portrait_Placeholder.png";
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
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  
  const { 
    messages, 
    isConnected, 
    isLoadingOlder, 
    hasMoreMessages, 
    sendMessage, 
    loadInitialMessages, 
    loadOlderMessages, 
    setMessages 
  } = useWebSocket(conversationId);
  
  // Refs for scroll management
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeight = useRef<number>(0);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto scroll on new msg
  useEffect(() => {
    if (messages.length > 0 && shouldScrollToBottom) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, shouldScrollToBottom]);

  // Handle scroll events for infinite scroll and auto-scroll detection
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Check if near bottom
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldScrollToBottom(isNearBottom);

    // Load older messages when scrolled near the top
    if (scrollTop < 100 && hasMoreMessages && !isLoadingOlder) {
      console.log('Loading older messages...');
      previousScrollHeight.current = scrollHeight;
      loadOlderMessages();
    }
  }, [hasMoreMessages, isLoadingOlder, loadOlderMessages]);

  // Restore scroll position after loading older messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && isLoadingOlder === false && previousScrollHeight.current > 0) {
      const newScrollHeight = container.scrollHeight;
      const heightDifference = newScrollHeight - previousScrollHeight.current;
      container.scrollTop = heightDifference;
      previousScrollHeight.current = 0;
    }
  }, [isLoadingOlder]);

  // Load initial messages
useEffect(() => {
  if (!conversationId) {
    setLoading(false);
    setMessages([]);
    setError(null);
    setShouldScrollToBottom(true);
    return;
  }

  console.log('Loading conversation:', conversationId);
  setLoading(true);
  setError(null);
  setShouldScrollToBottom(true);

  const timer = setTimeout(() => {
    loadInitialMessages(conversationId)
      .then(() => {
        setLoading(false);
        console.log('Successfully loaded conversation:', conversationId);

        //force scroll to bottom right after loading
        setTimeout(() => {
        const container = messagesContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 0); // next tick after render

      })
      .catch((err) => {
        console.error('Error loading conversation:', conversationId, err);
        setError(err.message);
        setLoading(false);
      });
  }, 200);

  return () => clearTimeout(timer);
}, [conversationId, loadInitialMessages]);


  // Scroll to bottom when conversation changes and messages are loaded
  useEffect(() => {
    if (!loading && messages.length > 0 && shouldScrollToBottom) {
      setTimeout(scrollToBottom, 100);
    }
  }, [loading, conversationId, messages.length, shouldScrollToBottom]);

  const handleSend = (content: string) => {
    if (!content.trim()) return;
    
    console.log('Sending message:', content);
    sendMessage(content);
    setInputText("");
    setShouldScrollToBottom(true); //scroll to bottom for new messages
  };

  const addUserToConvo = () => {
    setShowAddUserModal(true);
  };

  if (!conversationId) {
    return (
      <div className="m-3 flex flex-col items-center justify-center h-full">
        <div className="text-center text-gray-500">Select a friend to start chatting</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="m-3 flex flex-col items-center justify-center h-full">
        <div className="text-center">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-3 flex flex-col items-center justify-center h-full">
        <div className="text-center text-red-500">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="m-3 flex flex-col h-full w-120">
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
        
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto mb-4 scroll-smooth px-2"
        >
          {isLoadingOlder && (
            <div className="text-center py-2 text-gray-500">
              Loading older messages...
            </div>
          )}
          
          {!hasMoreMessages && messages.length > 0 && (
            <div className="text-center py-2 text-gray-400 text-sm">
              • Beginning of conversation •
            </div>
          )}
          
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No messages yet with {chatName}
            </div>
          ) : (
            <>
              {messages.map((message: Message, index) => (
                <div key={message.id || `temp-${message.created_at}-${index}`} className="mb-5">
                  <TextChatItem 
                    avatar={message.avatar || temp1}
                    date={message.created_at ? new Date(message.created_at).toLocaleDateString() : ''}
                    text={message.content}
                    name={message.username || 'Unknown'}
                  />
                </div>
              ))}
              {/* Invisible div at the bottom to scroll to */}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        <div className="mt-auto px-2">
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