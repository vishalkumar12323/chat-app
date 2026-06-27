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

export type MessageType = 'TEXT' | 'IMAGE' | 'DOCUMENT';

export interface FileAttachment {
  id: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  download_url: string;
  preview_url: string;
}

export interface ChannelMessage {
  id: number;
  type: MessageType;
  content: string;
  sender_id: number;
  channel_id: number;
  file_id?: string;
  File?: FileAttachment | null;
  createdAt: string;
  Sender?: Pick<User, 'id' | 'username'>;
}

export interface DirectMessage {
  id: number;
  type: MessageType;
  content: string;
  sender_id: number;
  recipient_id: number;
  file_id?: string;
  File?: FileAttachment | null;
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
  isUploading: boolean;
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
  sendFileMessage: (file: globalThis.File, caption?: string) => Promise<void>;
  emitTyping: (isTyping: boolean) => void;
  fetchUsers: () => Promise<void>;
}
