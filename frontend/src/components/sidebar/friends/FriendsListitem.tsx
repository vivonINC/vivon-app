import { Link } from 'react-router-dom';

interface FriendListItemProps {
  avatar: string;
  name: string;
  lastMessage: string;
  to?: string;
}

export default function FriendListItem({
  avatar,
  name,
  lastMessage,
  to = '/',
}: FriendListItemProps) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-stone-700 text-white"
      >
        <img
          src={avatar}
          alt={`${name} Avatar`}
          className="w-11 h-11 rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-sm">{name}</span>
          <span className="text-xs text-stone-300">{lastMessage}</span>
        </div>
      </Link>
    </li>
  );
}
