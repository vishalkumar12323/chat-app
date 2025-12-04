import { create } from "zustand";
import api from "../services/api";
import { io } from "socket.io-client";

const useChatStore = create((set, get) => ({
  socket: null,
  channels: [],
  currentChannel: null,
  selectedUser: null,
  messages: [],
  users: [],
  onlineUsers: new Set(),
  isLoading: false,
  hasMoreMessages: true,
  page: 1,

  connectSocket: (token) => {
    if (get().socket) return;
    const socket = io(import.meta.env.VITE_SOCKET_IO_URL, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("new_message", (message) => {
      const { currentChannel, messages } = get();
      if (currentChannel && message.channel_id === currentChannel.id) {
        set({ messages: [...messages, message] });
      }
    });

    socket.on("new_direct_message", (message) => {
      const { selectedUser, messages } = get();
      // Check if the message belongs to the currently selected conversation
      // Either sent by the selected user OR sent by me TO the selected user
      const isRelevant =
        selectedUser &&
        (message.user_id === selectedUser.id ||
          message.recipient_id === selectedUser.id);

      if (isRelevant) {
        set({ messages: [...messages, message] });
      }
    });

    socket.on("user_status", ({ userId, is_online }) => {
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

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  fetchChannels: async () => {
    try {
      const response = await api.get("/channels");
      set({ channels: response.data });
    } catch (error) {
      console.error(error);
    }
  },

  createChannel: async (name, description) => {
    try {
      const response = await api.post("/channels", { name, description });
      set((state) => ({ channels: [...state.channels, response.data] }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  joinChannel: async (channelId) => {
    try {
      await api.post(`/channels/${channelId}/join`);
    } catch (error) {
      console.error(error);
    }
  },

  selectChannel: async (channel) => {
    set({
      currentChannel: channel,
      selectedUser: null,
      messages: [],
      page: 1,
      hasMoreMessages: true,
    });
    const { socket } = get();
    if (socket) {
      socket.emit("join_channel", channel.id);
    }
    await get().fetchMessages(channel.id, 1);
  },

  selectUser: async (user) => {
    set({
      selectedUser: user,
      currentChannel: null,
      messages: [],
      page: 1,
      hasMoreMessages: true,
    });
    await get().fetchDirectMessages(user.id, 1);
  },

  fetchMessages: async (channelId, page = 1) => {
    if (page === 1) set({ isLoading: true });
    try {
      const response = await api.get(
        `/messages/${channelId}?page=${page}&limit=50`
      );
      const newMessages = response.data.messages;

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

  fetchDirectMessages: async (userId, page = 1) => {
    if (page === 1) set({ isLoading: true });
    try {
      const response = await api.get(
        `/messages/direct/${userId}?page=${page}&limit=50`
      );
      const newMessages = response.data.messages;

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

  loadMoreMessages: async () => {
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

  sendMessage: (content) => {
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

  fetchUsers: async () => {
    try {
      const response = await api.get("/users");
      const users = response.data;
      // Only initialize onlineUsers if it's empty (first load)
      // Otherwise, let socket events manage the online status
      set((state) => {
        if (state.onlineUsers.size === 0) {
          // First load: use database status
          const onlineUsers = new Set(
            users.filter((u) => u.is_online).map((u) => u.id)
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
