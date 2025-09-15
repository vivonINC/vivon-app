// Custom hook for WebSocket with infinite scroll
import { useState, useEffect, useRef, useCallback } from 'react';
import { WS_BASE_URL } from './config/api.ts';
import { API_BASE_URL } from './config/api.ts';


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
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const currentConversationRef = useRef<number | null>(null);
  const pendingOptimisticMessages = useRef<Set<number>>(new Set());

  // Clear messages when conversation changes
  useEffect(() => {
    if (conversationId !== currentConversationRef.current) {
      console.log('Conversation changed, clearing messages');
      setMessages([]);
      setHasMoreMessages(true);
      pendingOptimisticMessages.current.clear();
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) {
      // Clean up when no conversation is selected
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      setMessages([]);
      currentConversationRef.current = null;
      return;
    }

    // Create WebSocket connection
    const token = sessionStorage.getItem("token");
    const ws = new WebSocket(`${WS_BASE_URL}/ws/chat?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected for conversation:', conversationId);
      setIsConnected(true);
      
      // Leave previous conversation if exists
      if (currentConversationRef.current && currentConversationRef.current !== conversationId) {
        ws.send(JSON.stringify({
          action: 'leave_conversation',
          conversationId: currentConversationRef.current.toString()
        }));
      }
      
      // Join the new conversation
      ws.send(JSON.stringify({
        action: 'join_conversation',
        conversationId: conversationId.toString()
      }));
      
      currentConversationRef.current = conversationId;
    };

  ws.onmessage = (event) => {
    const newMessage = JSON.parse(event.data);
    console.log('Received WebSocket message:', newMessage);
    
    if (currentConversationRef.current !== conversationId) {
      console.log('Message for different conversation, ignoring');
      return;
    }
    
    setMessages(prev => {
      // Check for exact duplicate by ID only
      const existsByID = prev.some(msg => msg.id === newMessage.id);
      if (existsByID) {
        console.log('Message already exists by ID, skipping');
        return prev;
      }
      
      console.log('Adding new message to conversation');
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
        console.log('Leaving conversation:', currentConversationRef.current);
        ws.send(JSON.stringify({
          action: 'leave_conversation',
          conversationId: currentConversationRef.current.toString()
        }));
      }
      ws.close();
      wsRef.current = null;
      //not used anymore
      pendingOptimisticMessages.current.clear();
    };
  }, [conversationId]);

const sendMessage = (content: string) => {
  if (!conversationId || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
    console.log('Cannot send message: no conversation or WebSocket not ready');
    return;
  }

  const myID = parseInt(sessionStorage.getItem("myID") ?? "1");
  
  const message = {
    sender_id: myID,
    content: content,
    created_at: new Date().toISOString(),
    type: "TEXT",
    conversation_id: conversationId
  };
  const token = sessionStorage.getItem("token");

  fetch(`${API_BASE_URL}/api/messages/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(message)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    return response.json();
  })
  .then(savedMessage => {
    console.log('Message saved successfully:', savedMessage);
  })
  .catch(error => {
    console.error('Error sending message:', error);
  });
};

  // Load initial messages (newest 25)
  const loadInitialMessages = useCallback(async (conversationId: number) => {
    try {
      console.log('Loading initial messages for conversation:', conversationId);
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/messages/last25?conversationID=${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Initial messages loaded:', data.length, 'messages');
        setMessages(data);
        
        if (data.length < 25) {
          setHasMoreMessages(false);
        }
      } else {
        console.error('Failed to load initial messages:', response.status);
      }
    } catch (error) {
      console.error('Error loading initial messages:', error);
    }
  }, []);

  // Load older msg
  const loadOlderMessages = useCallback(async () => {
    if (!conversationId || isLoadingOlder || !hasMoreMessages || messages.length === 0) {
      return;
    }

    setIsLoadingOlder(true);
    
    try {
      // Get timestamp of oldest message
      const oldestMessage = messages[0];
      const beforeTimestamp = oldestMessage.created_at;
      
      console.log('Loading older messages before:', beforeTimestamp);
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/messages/before?conversationID=${conversationId}&beforeTimestamp=${encodeURIComponent(beforeTimestamp)}&limit=25`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const olderMessages = await response.json();
        console.log('Loaded older messages:', olderMessages.length, 'messages');
        
        if (olderMessages.length === 0) {
          setHasMoreMessages(false);
        } else {
          setMessages(prev => [...olderMessages, ...prev]);
          
          if (olderMessages.length < 25) {
            setHasMoreMessages(false);
          }
        }
      } else {
        console.error('Failed to load older messages:', response.status);
      }
    } catch (error) {
      console.error('Error loading older messages:', error);
    } finally {
      setIsLoadingOlder(false);
    }
  }, [conversationId, isLoadingOlder, hasMoreMessages, messages]);

  return {
    messages,
    isConnected,
    isLoadingOlder,
    hasMoreMessages,
    sendMessage,
    loadInitialMessages,
    loadOlderMessages,
    setMessages
  };
};