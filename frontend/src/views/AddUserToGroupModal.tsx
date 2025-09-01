import { useState, useEffect } from "react";

interface User {
  id: string;
  userName: string;
  avatar?: string;
}

interface AddUserToGroupModalProps {
  conversationId: number;
  onClose: () => void;
}

export default function AddUserToGroupModal({ conversationId, onClose }: AddUserToGroupModalProps) {
  const [friends, setFriends] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingFriends, setFetchingFriends] = useState(true);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setFetchingFriends(true);
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch('/api/users/friends', {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const friendsData = await response.json();
        setFriends(friendsData);
      } else {
        setError("Failed to fetch friends");
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      setError("Error loading friends");
    } finally {
      setFetchingFriends(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedUserId) {
      setError("Please select a user to add");
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("Authentication error. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/messages/addToConv`, {
        method: "POST",
        headers: {
          "Authorization": token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userID: parseInt(selectedUserId), 
          ConvoID: conversationId 
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to add user to group.");
        return;
      }

      onClose(); // Close modal on success
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-stone-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Add User to Group</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Select a friend to add:</label>
            {fetchingFriends ? (
              <div className="text-center text-gray-400 py-4">Loading friends...</div>
            ) : friends.length === 0 ? (
              <div className="text-center text-gray-400 py-4">No friends available</div>
            ) : (
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full p-2 rounded bg-stone-700 text-white border border-stone-600 focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Choose a friend...</option>
                {friends.map((friend) => (
                  <option key={friend.id} value={friend.id}>
                    {friend.userName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-2">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading || fetchingFriends || friends.length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded flex-1"
            >
              {loading ? "Adding..." : "Add User"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}