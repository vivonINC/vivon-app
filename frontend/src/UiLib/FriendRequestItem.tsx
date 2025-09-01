interface FriendRequestItemProps {
  avatar: string;
  name: string;
  userId: string;
  onAccept: (userId: string) => void;
  onDecline: (userId: string) => void;
}

export default function FriendRequestItem({
  avatar,
  name,
  userId,
  onAccept,
  onDecline,
}: FriendRequestItemProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-stone-800 transition-colors">
      <div className="w-10 h-10 rounded-full bg-stone-700">
        <img src={avatar} alt={name} className="w-full h-full object-cover rounded-full" />
      </div>
      
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-stone-200 truncate">{name}</span>
      </div>
      
      <div className="flex gap-1">
        <button
          onClick={() => onAccept(userId)}
          className="w-8 h-8 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center transition-colors"
          title="Accept friend request"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
        
        <button
          onClick={() => onDecline(userId)}
          className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
          title="Decline friend request"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}