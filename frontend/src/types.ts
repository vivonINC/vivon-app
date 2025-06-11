// types/index.ts

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  status: UserStatus;
  isOnline: boolean;
  customStatus?: string;
  joinedAt?: Date;
  badges?: UserBadge[];
}

export type UserStatus = 'online' | 'away' | 'busy' | 'invisible';

export type UserBadge = 'developer' | 'moderator' | 'premium' | 'verified' | 'early_supporter';

export interface Friend {
  id: string;
  user: User;
  status: FriendStatus;
  lastMessageAt?: Date;
  unreadCount?: number;
  mutualFriends?: string[];
  addedAt?: Date;
}

export type FriendStatus = 'accepted' | 'pending' | 'blocked';

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  members: User[];
  ownerId: string;
  unreadCount?: number;
  lastActivity?: Date;
  channels: Channel[];
  roles?: Role[];
  permissions?: GroupPermissions;
  createdAt?: Date;
  isPrivate?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  groupId: string;
  topic?: string;
  position: number;
  parentId?: string;
  permissions?: ChannelPermissions;
  lastMessageId?: string;
  unreadCount?: number;
  isNsfw?: boolean;
  slowMode?: number;
}

export type ChannelType = 'text' | 'voice' | 'category' | 'announcement' | 'stage';

export interface Message {
  id: string;
  content: string;
  authorId: string;
  channelId: string;
  timestamp: Date;
  editedAt?: Date;
  attachments?: Attachment[];
  embeds?: Embed[];
  reactions?: Reaction[];
  mentions?: string[];
  mentionsEveryone?: boolean;
  pinned?: boolean;
  type: MessageType;
  replyTo?: string;
  threadId?: string;
}

export type MessageType = 'default' | 'system' | 'reply' | 'slash_command';

export interface Attachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxyUrl?: string;
  height?: number;
  width?: number;
  contentType?: string;
}

export interface Embed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: Date;
  color?: number;
  footer?: EmbedFooter;
  image?: EmbedImage;
  thumbnail?: EmbedImage;
  author?: EmbedAuthor;
  fields?: EmbedField[];
}

export interface EmbedFooter {
  text: string;
  iconUrl?: string;
}

export interface EmbedImage {
  url: string;
  proxyUrl?: string;
  height?: number;
  width?: number;
}

export interface EmbedAuthor {
  name: string;
  url?: string;
  iconUrl?: string;
}

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface Reaction {
  emoji: Emoji;
  count: number;
  me: boolean;
  users?: string[];
}

export interface Emoji {
  id?: string;
  name: string;
  animated?: boolean;
  url?: string;
}

export interface Role {
  id: string;
  name: string;
  color?: string;
  hoist?: boolean;
  position: number;
  permissions: string[];
  mentionable?: boolean;
  managed?: boolean;
}

export interface GroupPermissions {
  administrator?: boolean;
  manageChannels?: boolean;
  manageRoles?: boolean;
  manageMessages?: boolean;
  kickMembers?: boolean;
  banMembers?: boolean;
  createInvites?: boolean;
  changeNickname?: boolean;
  manageNicknames?: boolean;
  useVoiceActivity?: boolean;
  priority?: boolean;
}

export interface ChannelPermissions {
  viewChannel?: boolean;
  sendMessages?: boolean;
  sendTtsMessages?: boolean;
  manageMessages?: boolean;
  embedLinks?: boolean;
  attachFiles?: boolean;
  readMessageHistory?: boolean;
  mentionEveryone?: boolean;
  useExternalEmojis?: boolean;
  addReactions?: boolean;
  connect?: boolean;
  speak?: boolean;
  muteMembers?: boolean;
  deafenMembers?: boolean;
  moveMembers?: boolean;
  useVoiceActivity?: boolean;
}

export interface DirectMessage {
  id: string;
  participants: string[];
  lastMessageId?: string;
  unreadCount?: number;
  lastReadMessageId?: string;
  messages: Message[];
}

export interface VoiceState {
  userId: string;
  channelId?: string;
  isMuted: boolean;
  isDeafened: boolean;
  isSelfMuted: boolean;
  isSelfDeafened: boolean;
  isStreaming?: boolean;
  isVideoEnabled?: boolean;
  isSuppressed?: boolean;
}

export interface UserSettings {
  isMuted: boolean;
  isDeafened: boolean;
  theme: Theme;
  fontSize: FontSize;
  compactMode: boolean;
  showTimestamps: boolean;
  use24HourTime: boolean;
  enableNotifications: boolean;
  enableSounds: boolean;
  enableDesktopNotifications: boolean;
  muteAll: boolean;
  reducedMotion: boolean;
  locale: string;
  autoplayGifs: boolean;
  showEmbeds: boolean;
  showEmojis: boolean;
  enableDeveloperMode: boolean;
}

export type Theme = 'stone' | 'slate' | 'zinc' | 'neutral' | 'gray';
export type FontSize = 'small' | 'medium' | 'large';
export type SidebarTab = 'friends' | 'groups' | 'dms';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  userId?: string;
  groupId?: string;
  channelId?: string;
}

export type NotificationType = 'message' | 'friend_request' | 'group_invite' | 'mention' | 'system';
export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';
export type ModalType =
  | 'user_settings'
  | 'create_group'
  | 'invite_friend'
  | 'user_profile'
  | 'channel_settings'
  | 'group_settings';

// ===== ZUSTAND STATE (UI State) =====
export interface UIState {
  // Navigation
  activeTab: SidebarTab;
  selectedFriend?: string;
  selectedGroup?: string;
  selectedChannel?: string;
  selectedDM?: string;

  // Theme and appearance
  userSettings: UserSettings;

  // Modals and overlays
  activeModal?: ModalType;
  modalData?: any;

  // Search
  searchQuery: string;

  // UI flags
  sidebarCollapsed: boolean;
  showMemberList: boolean;

  // Actions
  setActiveTab: (tab: SidebarTab) => void;
  setSelectedFriend: (id?: string) => void;
  setSelectedGroup: (id?: string) => void;
  setSelectedChannel: (id?: string) => void;
  setUserSettings: (settings: Partial<UserSettings>) => void;
  setActiveModal: (modal?: ModalType, data?: any) => void;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  toggleMemberList: () => void;
}

// ===== REDUX STATE (Complex Client State) =====
export interface ReduxState {
  // Real-time state
  typingUsers: { [channelId: string]: string[] };
  voiceStates: { [userId: string]: VoiceState };
  currentVoiceChannel?: string;

  // Connection state
  isConnected: boolean;
  connectionState: ConnectionState;

  // Notifications
  notifications: Notification[];
  unreadNotifications: number;

  // Message cache (for offline support)
  messageCache: { [channelId: string]: Message[] };

  // Optimistic updates
  pendingMessages: { [tempId: string]: Message };
  failedMessages: string[];

  // WebSocket/real-time data
  lastHeartbeat?: Date;
  reconnectAttempts: number;
}

// Redux Actions
export interface SetTypingUsersAction {
  type: 'SET_TYPING_USERS';
  payload: { channelId: string; userIds: string[] };
}

export interface SetVoiceStateAction {
  type: 'SET_VOICE_STATE';
  payload: { userId: string; voiceState: VoiceState };
}

export interface AddNotificationAction {
  type: 'ADD_NOTIFICATION';
  payload: Notification;
}

export interface MarkNotificationReadAction {
  type: 'MARK_NOTIFICATION_READ';
  payload: string;
}

export interface SetConnectionStateAction {
  type: 'SET_CONNECTION_STATE';
  payload: ConnectionState;
}

export interface AddPendingMessageAction {
  type: 'ADD_PENDING_MESSAGE';
  payload: { tempId: string; message: Message };
}

export interface RemovePendingMessageAction {
  type: 'REMOVE_PENDING_MESSAGE';
  payload: string;
}

export interface CacheMessagesAction {
  type: 'CACHE_MESSAGES';
  payload: { channelId: string; messages: Message[] };
}

export interface UpdateHeartbeatAction {
  type: 'UPDATE_HEARTBEAT';
  payload: Date;
}

export interface IncrementReconnectAction {
  type: 'INCREMENT_RECONNECT_ATTEMPTS';
}

export interface ResetReconnectAction {
  type: 'RESET_RECONNECT_ATTEMPTS';
}

export type ReduxAction =
  | SetTypingUsersAction
  | SetVoiceStateAction
  | AddNotificationAction
  | MarkNotificationReadAction
  | SetConnectionStateAction
  | AddPendingMessageAction
  | RemovePendingMessageAction
  | CacheMessagesAction
  | UpdateHeartbeatAction
  | IncrementReconnectAction
  | ResetReconnectAction;

// ===== API TYPES (for TanStack Query) =====
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateMessageRequest {
  content: string;
  channelId: string;
  replyTo?: string;
  attachments?: File[];
}

export interface UpdateUserSettingsRequest {
  settings: Partial<UserSettings>;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  isPrivate: boolean;
  memberIds?: string[];
}

export interface SendFriendRequestRequest {
  username: string;
  message?: string;
}
