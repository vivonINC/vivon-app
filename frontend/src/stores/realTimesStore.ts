import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ReduxState } from '../types';

const initialState: ReduxState = {
  typingUsers: {},
  voiceStates: {},
  currentVoiceChannel: undefined,
  isConnected: true,
  connectionState: 'connected',
  notifications: [],
  unreadNotifications: 0,
  messageCache: {},
  pendingMessages: {},
  failedMessages: [],
  lastHeartbeat: undefined,
  reconnectAttempts: 0,
};

const realtimeSlice = createSlice({
  name: 'realtime',
  initialState,
  reducers: {
    setTypingUsers: (state, action: PayloadAction<{ channelId: string; userIds: string[] }>) => {
      state.typingUsers[action.payload.channelId] = action.payload.userIds;
    },

    setVoiceState: (state, action: PayloadAction<{ userId: string; voiceState: ReduxState['voiceStates'][string] }>) => {
      state.voiceStates[action.payload.userId] = action.payload.voiceState;
    },

    addNotification: (state, action: PayloadAction<ReduxState['notifications'][0]>) => {
      state.notifications.unshift(action.payload);
      state.unreadNotifications += 1;
    },

    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(notif => notif.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadNotifications = Math.max(0, state.unreadNotifications - 1);
      }
    },

    setConnectionState: (state, action: PayloadAction<ReduxState['connectionState']>) => {
      state.connectionState = action.payload;
      state.isConnected = action.payload === 'connected';
    },

    addPendingMessage: (state, action: PayloadAction<{ tempId: string; message: ReduxState['pendingMessages'][string] }>) => {
      state.pendingMessages[action.payload.tempId] = action.payload.message;
    },

    removePendingMessage: (state, action: PayloadAction<string>) => {
      delete state.pendingMessages[action.payload];
    },

    cacheMessages: (state, action: PayloadAction<{ channelId: string; messages: ReduxState['messageCache'][string] }>) => {
      state.messageCache[action.payload.channelId] = action.payload.messages;
    },

    updateHeartbeat: (state) => {
      state.lastHeartbeat = new Date();
    },

    incrementReconnectAttempts: (state) => {
      state.reconnectAttempts += 1;
    },

    resetReconnectAttempts: (state) => {
      state.reconnectAttempts = 0;
    },
  },
});

export const {
  setTypingUsers,
  setVoiceState,
  addNotification,
  markNotificationRead,
  setConnectionState,
  addPendingMessage,
  removePendingMessage,
  cacheMessages,
  updateHeartbeat,
  incrementReconnectAttempts,
  resetReconnectAttempts,
} = realtimeSlice.actions;

// Export reducer
export const realtimeReducer = realtimeSlice.reducer;

// Configure store
export const realtimeStore = configureStore({
  reducer: {
    realtime: realtimeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization check
        ignoredActions: ['realtime/updateHeartbeat'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['payload.lastHeartbeat'],
        // Ignore these paths in the state
        ignoredPaths: ['realtime.lastHeartbeat'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof realtimeStore.getState>;
export type AppDispatch = typeof realtimeStore.dispatch;