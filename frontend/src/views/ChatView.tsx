import { useParams } from 'react-router-dom';
import { users } from '../mock/users';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
}

export default function ChatView() {
  const { friendId = '?' } = useParams();

  // TODO: Replace with actual data fetching
  const messages: Message[] = [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-stone-800">
        <h1 className="text-xl font-semibold">
          Chat with {users.find(user => user.id === friendId)?.displayName}
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-stone-500 text-center">No messages yet</p>
        ) : (
          messages.map(message => (
            <div key={message.id} className="mb-2">
              {message.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
