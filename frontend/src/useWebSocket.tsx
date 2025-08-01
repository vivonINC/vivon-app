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
      setMessages(prev => [...prev, newMessage]);
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
    };
  }, [conversationId]);

  // Function to send message
  const sendMessage = (content: string) => {
    if (!conversationId) return;

    const message = {
      sender_id: parseInt(sessionStorage.getItem("myID") ?? "1"),
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
        console.log("Failed to send message")
        throw new Error('Failed to send message');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error sending message:', error);
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
        console.log("initial messages fetched conv_id:" + conversationId)
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