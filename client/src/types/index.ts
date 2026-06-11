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

export interface Message {
  id: number;
  content: string;
  channel_id?: number;
  user_id: number;
  recipient_id?: number;
  createdAt: string;
  user?: Pick<User, 'username'>;
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
  fetchUsers: () => Promise<void>;
}
