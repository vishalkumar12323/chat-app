import { create } from "zustand";
import api from "../services/api";
import { io, Socket } from "socket.io-client";
import type { ChatState, Channel, User, Message, ChannelMessage, DirectMessage, TypingUser } from "../types";

// Safety timeout map to auto-clear stale typing indicators
const typingTimeouts = new Map<number, ReturnType<typeof setTimeout>>();

const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  channels: [],
  currentChannel: null,
  selectedUser: null,
  messages: [],
  users: [],
  onlineUsers: new Set<number>(),
  typingUsers: [],
  isLoading: false,
  hasMoreMessages: true,
  page: 1,

  connectSocket: (token: string): void => {
    if (get().socket) return;
    const socket: Socket = io(import.meta.env.VITE_SOCKET_IO_URL, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("new_message", (message: ChannelMessage) => {
      const { currentChannel, messages } = get();
      if (currentChannel && message.channel_id === currentChannel.id) {
        set({ messages: [...messages, message] });
      }
    });

    socket.on("new_direct_message", (message: DirectMessage) => {
      const { selectedUser, messages } = get();
      // Check if the message belongs to the currently selected conversation
      // Either sent by the selected user OR sent by me TO the selected user
      const isRelevant =
        selectedUser &&
        (message.sender_id === selectedUser.id ||
          message.recipient_id === selectedUser.id);

      if (isRelevant) {
        set({ messages: [...messages, message] });
      }
    });

    socket.on("user_status", ({ userId, is_online }: { userId: number; is_online: boolean }) => {
      set((state) => {
        const newOnlineUsers = new Set(state.onlineUsers);
        if (is_online) {
          newOnlineUsers.add(userId);
        } else {
          newOnlineUsers.delete(userId);
        }
        return { onlineUsers: newOnlineUsers };
      });
    });

    socket.on("user_typing", ({ userId, username, isTyping, channelId, recipientId }: {
      userId: number;
      username: string;
      isTyping: boolean;
      channelId?: number;
      recipientId?: number;
    }) => {
      const { currentChannel, selectedUser } = get();

      // Only show typing if it's relevant to the current view
      const isRelevant =
        (channelId && currentChannel && currentChannel.id === channelId) ||
        (recipientId && selectedUser && selectedUser.id === userId);

      if (!isRelevant) return;

      if (isTyping) {
        set((state) => {
          const alreadyTyping = state.typingUsers.some((u) => u.userId === userId);
          if (alreadyTyping) return state;
          return { typingUsers: [...state.typingUsers, { userId, username }] };
        });

        // Safety timeout: auto-remove after 3 seconds
        if (typingTimeouts.has(userId)) {
          clearTimeout(typingTimeouts.get(userId)!);
        }
        typingTimeouts.set(
          userId,
          setTimeout(() => {
            set((state) => ({
              typingUsers: state.typingUsers.filter((u) => u.userId !== userId),
            }));
            typingTimeouts.delete(userId);
          }, 3000)
        );
      } else {
        // Remove typing user
        if (typingTimeouts.has(userId)) {
          clearTimeout(typingTimeouts.get(userId)!);
          typingTimeouts.delete(userId);
        }
        set((state) => ({
          typingUsers: state.typingUsers.filter((u) => u.userId !== userId),
        }));
      }
    });

    set({ socket });
  },

  disconnectSocket: (): void => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  fetchChannels: async (): Promise<void> => {
    try {
      const response = await api.get("/channels");
      set({ channels: response.data });
    } catch (error) {
      console.error(error);
    }
  },

  createChannel: async (name: string, description: string): Promise<Channel> => {
    try {
      const response = await api.post("/channels", { name, description });
      set((state) => ({ channels: [...state.channels, response.data] }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  joinChannel: async (channelId: number): Promise<void> => {
    try {
      await api.post(`/channels/${channelId}/join`);
    } catch (error) {
      console.error(error);
    }
  },

  selectChannel: async (channel: Channel): Promise<void> => {
    set({
      currentChannel: channel,
      selectedUser: null,
      messages: [],
      typingUsers: [],
      page: 1,
      hasMoreMessages: true,
    });
    const { socket } = get();
    if (socket) {
      socket.emit("join_channel", channel.id);
    }
    await get().fetchMessages(channel.id, 1);
  },

  selectUser: async (user: User): Promise<void> => {
    set({
      selectedUser: user,
      currentChannel: null,
      messages: [],
      typingUsers: [],
      page: 1,
      hasMoreMessages: true,
    });
    await get().fetchDirectMessages(user.id, 1);
  },

  fetchMessages: async (channelId: number, page: number = 1): Promise<void> => {
    if (page === 1) set({ isLoading: true });
    try {
      const response = await api.get(
        `/messages/${channelId}?page=${page}&limit=50`
      );
      const newMessages: Message[] = response.data.messages;

      set((state) => ({
        messages:
          page === 1 ? newMessages : [...newMessages, ...state.messages],
        isLoading: false,
        page,
        hasMoreMessages: newMessages.length === 50,
      }));
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  fetchDirectMessages: async (userId: number, page: number = 1): Promise<void> => {
    if (page === 1) set({ isLoading: true });
    try {
      const response = await api.get(
        `/messages/direct/${userId}?page=${page}&limit=50`
      );
      const newMessages: Message[] = response.data.messages;

      set((state) => ({
        messages:
          page === 1 ? newMessages : [...newMessages, ...state.messages],
        isLoading: false,
        page,
        hasMoreMessages: newMessages.length === 50,
      }));
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  loadMoreMessages: async (): Promise<void> => {
    const { currentChannel, selectedUser, page, hasMoreMessages, isLoading } =
      get();
    if ((!currentChannel && !selectedUser) || !hasMoreMessages || isLoading)
      return;

    if (currentChannel) {
      await get().fetchMessages(currentChannel.id, page + 1);
    } else if (selectedUser) {
      await get().fetchDirectMessages(selectedUser.id, page + 1);
    }
  },

  sendMessage: (content: string): void => {
    const { socket, currentChannel, selectedUser } = get();
    if (socket) {
      if (currentChannel) {
        socket.emit("send_message", { channelId: currentChannel.id, content });
      } else if (selectedUser) {
        socket.emit("send_direct_message", {
          recipientId: selectedUser.id,
          content,
        });
      }
    }
  },

  emitTyping: (isTyping: boolean): void => {
    const { socket, currentChannel, selectedUser } = get();
    if (!socket) return;

    if (currentChannel) {
      socket.emit("typing", { channelId: currentChannel.id, isTyping });
    } else if (selectedUser) {
      socket.emit("typing", { recipientId: selectedUser.id, isTyping });
    }
  },

  fetchUsers: async (): Promise<void> => {
    try {
      const response = await api.get("/users");
      const users: User[] = response.data;
      // Only initialize onlineUsers if it's empty (first load)
      // Otherwise, let socket events manage the online status
      set((state) => {
        if (state.onlineUsers.size === 0) {
          // First load: use database status
          const onlineUsers = new Set<number>(
            users.filter((u: User) => u.is_online).map((u: User) => u.id)
          );
          return { users, onlineUsers };
        } else {
          // Subsequent loads: keep socket-managed status
          return { users };
        }
      });
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useChatStore;
