// Custom hook for WebSocket
import { useState, useEffect, useRef } from 'react';

export interface Message {
  id?: number;
  sender_id: number;
  content: string;
  created_at: string;
  username: string;
  avatar: string | null;
  type: string;
}

export const useWebSocket = (conversationId: number | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const currentConversationRef = useRef<number | null>(null);
  const pendingOptimisticMessages = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!conversationId) return;

    // Create WebSocket connection
    const token = sessionStorage.getItem("token");
    const ws = new WebSocket(`ws://localhost:8080/ws/chat?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Join the conversation
      ws.send(JSON.stringify({
        action: 'join_conversation',
        conversationId: conversationId.toString()
      }));
      
      currentConversationRef.current = conversationId;
    };

    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      
      setMessages(prev => {
        // Check if this message already exists (avoid duplicates)
        const exists = prev.some(msg => 
          msg.id === newMessage.id || 
          (msg.content === newMessage.content && 
           msg.sender_id === newMessage.sender_id && 
           Math.abs(new Date(msg.created_at).getTime() - new Date(newMessage.created_at).getTime()) < 1000)
        );
        
        if (exists) {
          console.log('Duplicate message detected, skipping');
          return prev;
        }
        
        // If this is our own message coming back via WebSocket, replace any optimistic version
        const myID = parseInt(sessionStorage.getItem("myID") ?? "1");
        if (newMessage.sender_id === myID) {
          // Find and replace optimistic message with the real one
          const optimisticIndex = prev.findIndex(msg => 
            msg.id && msg.id > 1000000000000 && // Temporary ID (timestamp)
            msg.content === newMessage.content &&
            msg.sender_id === newMessage.sender_id
          );
          
          if (optimisticIndex !== -1) {
            const updatedMessages = [...prev];
            updatedMessages[optimisticIndex] = newMessage;
            pendingOptimisticMessages.current.delete(prev[optimisticIndex].id as number);
            return updatedMessages;
          }
        }
        
        return [...prev, newMessage];
      });
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      // Leave current conversation before cleanup
      if (currentConversationRef.current && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          action: 'leave_conversation',
          conversationId: currentConversationRef.current.toString()
        }));
      }
      ws.close();
      // Clear pending optimistic messages
      pendingOptimisticMessages.current.clear();
    };
  }, [conversationId]);

  // Function to send message
  const sendMessage = (content: string) => {
    if (!conversationId) return;

    const myID = parseInt(sessionStorage.getItem("myID") ?? "1");
    const username = sessionStorage.getItem("username") ?? "You";
    const optimisticId = Date.now(); // Temporary ID
    
    // Create optimistic message for immediate UI update
    const optimisticMessage: Message = {
      id: optimisticId,
      sender_id: myID,
      content: content,
      created_at: new Date().toISOString(),
      username: username,
      avatar: sessionStorage.getItem("avatar"),
      type: "TEXT"
    };

    // Track this optimistic message
    pendingOptimisticMessages.current.add(optimisticId);

    // Immediately add message to UI (optimistic update)
    setMessages(prev => [...prev, optimisticMessage]);
    
    const message = {
      sender_id: myID,
      content: content,
      created_at: new Date().toISOString(),
      type: "TEXT",
      conversation_id: conversationId
    };
    const token = sessionStorage.getItem("token");

    fetch("/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(message)
    })
    .then(response => {
      if (!response.ok) {
        console.log("Failed to send message");
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(msg => msg.id !== optimisticId));
        pendingOptimisticMessages.current.delete(optimisticId);
        throw new Error('Failed to send message');
      }
      return response.json();
    })
    .then(savedMessage => {
      // Replace optimistic message with actual saved message
      setMessages(prev => prev.map(msg => 
        msg.id === optimisticId ? {
          ...savedMessage,
          username: username,
          avatar: optimisticMessage.avatar
        } : msg
      ));
      pendingOptimisticMessages.current.delete(optimisticId);
    })
    .catch(error => {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticId));
      pendingOptimisticMessages.current.delete(optimisticId);
    });
  };

  const loadInitialMessages = async (conversationId: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`/api/messages/last25?conversationID=${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        console.log("initial messages fetched conv_id:" + conversationId);
      }
    } catch (error) {
      console.error('Error loading initial messages:', error);
    }
  };

  return {
    messages,
    isConnected,
    sendMessage,
    loadInitialMessages,
    setMessages
  };
};