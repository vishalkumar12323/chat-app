// ─── Domain Models ──────────────────────────────────────────────────────────

export interface User {
  id: number;
  username: string;
  email: string;
  is_online: boolean;
}

export interface Channel {
  id: number;
  name: string;
  description: string;
}

export interface ChannelMessage {
  id: number;
  content: string;
  sender_id: number;
  channel_id: number;
  createdAt: string;
  Sender?: Pick<User, 'id' | 'username'>;
}

export interface DirectMessage {
  id: number;
  content: string;
  sender_id: number;
  recipient_id: number;
  createdAt: string;
  Sender?: Pick<User, 'id' | 'username'>;
  Recipient?: Pick<User, 'id' | 'username'>;
}

export type Message = ChannelMessage | DirectMessage;

export interface TypingUser {
  userId: number;
  username: string;
}

// ─── Store State Types ───────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export interface ChatState {
  socket: ReturnType<typeof import('socket.io-client').io> | null;
  channels: Channel[];
  currentChannel: Channel | null;
  selectedUser: User | null;
  messages: Message[];
  users: User[];
  onlineUsers: Set<number>;
  typingUsers: TypingUser[];
  isLoading: boolean;
  hasMoreMessages: boolean;
  page: number;
  connectSocket: (token: string) => void;
  disconnectSocket: () => void;
  fetchChannels: () => Promise<void>;
  createChannel: (name: string, description: string) => Promise<Channel>;
  joinChannel: (channelId: number) => Promise<void>;
  selectChannel: (channel: Channel) => Promise<void>;
  selectUser: (user: User) => Promise<void>;
  fetchMessages: (channelId: number, page?: number) => Promise<void>;
  fetchDirectMessages: (userId: number, page?: number) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  sendMessage: (content: string) => void;
  emitTyping: (isTyping: boolean) => void;
  fetchUsers: () => Promise<void>;
}
