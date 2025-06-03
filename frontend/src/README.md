# Vivon Frontend Source Directory

This directory contains the source code for the Vivon frontend application. Below is an overview of the project structure and key components.

## Directory Structure

```
src/
├── api/          # API client and endpoint handlers
│   ├── client.ts     # Base API client configuration
│   ├── users.ts      # User-related API calls
│   ├── messages.ts   # Message-related API calls
│   ├── friends.ts    # Friend-related API calls
│   └── groups.ts     # Group-related API calls
│
├── hooks/        # Custom React hooks
│   ├── useUsers.ts     # User management hooks
│   ├── useMessages.ts  # Message handling hooks
│   ├── useFriends.ts   # Friend management hooks
│   └── useGroups.ts    # Group management hooks
│
├── stores/       # State management
│   ├── realTimesStore.ts  # Real-time state management
│   └── uiStore.ts         # UI state management
│
├── views/        # Page components
├── assets/       # Static assets
├── utils/        # Utility functions
└── mock/         # Mock data for development
```

## Key Technologies

- **React** - UI framework
- **TypeScript** - Type safety and developer experience
- **React Router** - Navigation and routing
- **React Query** - Server state management
- **Zustand** - Client state management
- **TailwindCSS** - Styling

## API Integration

The `api/` directory contains type-safe API clients organized by domain:

### Base Client (`client.ts`)
- Handles authentication and request/response interceptors
- Manages API error handling and response transformation
- Provides type-safe request methods

### Domain-Specific Clients
- **users.ts**
  - User authentication (login, register, logout)
  - Profile management (update, delete)
  - User search and filtering
  
- **messages.ts**
  - Send/receive direct messages
  - Group message operations
  - Message history and pagination
  
- **friends.ts**
  - Friend requests (send, accept, reject)
  - Friend list management
  - Blocking functionality
  
- **groups.ts**
  - Group creation and management
  - Member operations (add, remove, roles)
  - Group settings and permissions

## Custom Hooks

Our hooks provide composable logic for different features:

### User Management (`useUsers.ts`)
```typescript
// Example usage
const { 
  user,
  updateProfile,
  searchUsers,
  isLoading 
} = useUsers();
```
- User authentication state
- Profile updates
- User search functionality

### Message Handling (`useMessages.ts`)
```typescript
// Example usage
const {
  messages,
  sendMessage,
  deleteMessage,
  isTyping
} = useMessages(channelId);
```
- Real-time message updates
- Message operations (send, edit, delete)
- Typing indicators
- Message history pagination

### Friend Management (`useFriends.ts`)
```typescript
// Example usage
const {
  friends,
  sendFriendRequest,
  acceptRequest,
  blockUser
} = useFriends();
```
- Friend list operations
- Friend request handling
- Blocking functionality

### Group Operations (`useGroups.ts`)
```typescript
// Example usage
const {
  group,
  createGroup,
  updateSettings,
  addMember
} = useGroups(groupId);
```
- Group creation and management
- Member operations
- Group settings and permissions

## State Management

The application uses Zustand stores for client-side state management:

### Real-time Store (`realTimesStore.ts`)
```typescript
// Example usage
const { 
  onlineUsers,
  typingUsers,
  notifications
} = useRealTimeStore();
```
Manages:
- Online user presence
- Typing indicators
- Real-time notifications
- Voice chat states
- Connection status

### UI Store (`uiStore.ts`)
```typescript
// Example usage
const {
  theme,
  sidebar,
  modals,
  toggleSidebar
} = useUIStore();
```
Handles:
- Theme preferences
- Layout states
- Modal management
- UI preferences
- Navigation state

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Best Practices

- Use TypeScript for all new files
- Follow the established directory structure
- Leverage existing hooks and utilities
- Use React Query for all API interactions
- Keep components small and focused
- Use TailwindCSS for styling
