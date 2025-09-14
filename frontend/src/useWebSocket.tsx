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
      
      // Only process messages for the current conversation
      if (currentConversationRef.current !== conversationId) {
        console.log('Message for different conversation, ignoring');
        return;
      }
      
      setMessages(prev => {
        // Check if this message already exists (avoid duplicates)
        const exists = prev.some(msg => 
          msg.id === newMessage.id || 
          (msg.content === newMessage.content && 
           msg.sender_id === newMessage.sender_id && 
           Math.abs(new Date(msg.created_at).getTime() - new Date(newMessage.created_at).getTime()) < 10000)
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
            console.log('Replaced optimistic message with real message');
            return updatedMessages;
          }
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
      // Clear pending optimistic messages
      pendingOptimisticMessages.current.clear();
    };
  }, [conversationId]);

  // Function to send message
  const sendMessage = (content: string) => {
    if (!conversationId || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log('Cannot send message: no conversation or WebSocket not ready');
      return;
    }

    const myID = parseInt(sessionStorage.getItem("myID") ?? "1");
    const username = sessionStorage.getItem("username") ?? "You";
    const optimisticId = Date.now(); // Temporary ID
    
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
    console.log('Added optimistic message:', optimisticMessage);
    
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
        console.log("Failed to send message");
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(msg => msg.id !== optimisticId));
        pendingOptimisticMessages.current.delete(optimisticId);
        throw new Error('Failed to send message');
      }
      return response.json();
    })
    .then(savedMessage => {
      console.log('Message saved successfully:', savedMessage);
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

  // Load older messages for infinite scroll
  const loadOlderMessages = useCallback(async () => {
    if (!conversationId || isLoadingOlder || !hasMoreMessages || messages.length === 0) {
      return;
    }

    setIsLoadingOlder(true);
    
    try {
      // Get timestamp of the oldest message
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