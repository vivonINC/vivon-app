import { useState, useEffect } from "react";
import TextChatItem from "../UiLib/TextChatItem";
import temp1 from "../assets/avatars/genji.png";
import temp2 from "../assets/avatars/winston.png";

// Define the Message interface
interface Message {
  id: number;
  sender_id: number;
  content: string;
  created_at: string;
  username: string;
  avatar: string | null;
}

interface TextChatProps {
  conversationId?: number;
}

export default function TextChat({ conversationId = 1 }: TextChatProps) {
  const [messages, setMessages] = useState<Message[]>([]); // Specify the type here
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/messages/last25?conversationID=${conversationId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Message[] = await response.json(); // Type the response
        setMessages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // Loading state
  if (loading) {
    return (
      <div className="m-3 flex flex-col">
        <div className="text-center">Loading messages...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="m-3 flex flex-col">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="m-3 flex flex-col">
        <div className="text-center text-gray-500">No messages yet</div>
      </div>
    );
  }

  return (
    <div className="m-3 flex flex-col">
      {messages.map((message: Message) => ( // Type is now explicit
        <div key={message.id} className="mb-5">
          <TextChatItem 
            avatar={message.avatar || temp1} // Use the avatar from backend
            date={message.created_at ? new Date(message.created_at).toLocaleDateString() : ''}
            text={message.content} // This should work now
            name={message.username || 'Unknown'} // Use username from backend
          />
        </div>
      ))}
    </div>
  );
}