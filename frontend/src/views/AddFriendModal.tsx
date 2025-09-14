// AddFriendModal.tsx
import { useState } from "react";
import { API_BASE_URL } from '../config/api.ts';

interface AddFriendModalProps {
  onClose: () => void;
}

export default function AddFriendModal({ onClose }: AddFriendModalProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("myID");
    const myUsername = sessionStorage.getItem("username");

    if(username === myUsername){
          setError("You can't befriend yourself")
          return;
    }

    if (!token || !id) {
      setError("Authentication error. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/sendFriendRequest`, {
        method: "POST",
        headers: {
          "Authorization": token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, myID: parseInt(id), myUsername: myUsername }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to send friend request.");
        return;
      }
      if(await res.text() === "That user is already your friend"){
        setError(await res.text())
      }
      onClose(); // Close modal on success
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-stone-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Add Friend</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Enter username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-stone-700 text-white border border-stone-600 focus:border-blue-500 focus:outline-none"
              placeholder="Username"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-2">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1"
            >
              Add Friend
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
