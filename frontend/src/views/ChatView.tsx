export default function Chat() {  
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Chat messages will go here */}
      </div>
      <div className="p-4 bg-stone-800 rounded-md">
        {/* Input for sending messages */}
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full p-2 bg-stone-700 text-white rounded-md"
        />
      </div>
    </div>
  );
}