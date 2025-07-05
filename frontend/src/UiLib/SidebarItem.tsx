import { useNavigate } from 'react-router-dom';

interface SidebarItemProps {
  avatar: string;
  name: string;
  isOnline?: boolean;
  userId: string;
  lastMessage?: string;
  lastMessageDate?: string;
}

export default function SidebarItem({
  avatar,
  name,
  isOnline,
  userId,
  lastMessage,
  lastMessageDate,
}: SidebarItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-2 px-2 py-2 rounded hover:bg-stone-800 transition-colors cursor-pointer"
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
    </div>
  );
}