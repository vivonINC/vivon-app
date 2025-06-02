import FriendListItem from './FriendsListitem';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
}

interface FriendsListProps {
  friends: Friend[];
}

export default function FriendsList({ friends }: FriendsListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <ul>
        {friends.map((friend) => (
          <FriendListItem
            key={friend.id}
            avatar={friend.avatar}
            name={friend.name}
            lastMessage={friend.lastMessage}
          />
        ))}
      </ul>
    </div>
  );
}
