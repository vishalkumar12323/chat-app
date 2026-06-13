import { User, ChannelMessage, DirectMessage } from "../models";
import { verifyToken } from "../utils/jwt"
import { type Server } from "socket.io";
import * as dotenv from "dotenv";

dotenv.config();

const socketHandler = (io: Server) => {
  // authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }
      const payload = verifyToken(token);
      socket.user = await User.findByPk(payload.userId);
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    // console.log(`User connected: ${socket.user?.username}`);

    // Update user status to online
    await socket.user?.update({ is_online: true, last_seen: new Date() });
    io.emit("user_status", { userId: socket.user?.get().id, is_online: true });

    // Join user-specific room for DMs
    socket.join(`user_${socket.user?.get().id}`);

    // Join channels
    socket.on("join_channel", (channelId) => {
      socket.join(`channel_${channelId}`);
      // console.log(`User ${socket.user?.username} joined channel ${channelId}`);
    });

    // Send message (Channel)
    socket.on("send_message", async (data) => {
      try {
        const { channelId, content } = data;

        const message = await ChannelMessage.create({
          content,
          sender_id: socket.user?.get().id as string,
          channel_id: channelId,
        });

        const fullMessage = await ChannelMessage.findByPk(message.get().id, {
          include: [
            { model: User, as: "Sender", attributes: ["id", "username", "avatar_url"] },
          ],
        });

        io.to(`channel_${channelId}`).emit("new_message", fullMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Send Direct Message
    socket.on("send_direct_message", async (data) => {
      try {
        const { recipientId, content } = data;

        const message = await DirectMessage.create({
          content,
          sender_id: socket.user?.get().id as string,
          recipient_id: recipientId,
        });

        const fullMessage = await DirectMessage.findByPk(message.get().id, {
          include: [
            { model: User, as: "Sender", attributes: ["id", "username", "avatar_url"] },
            {
              model: User,
              as: "Recipient",
              attributes: ["id", "username", "avatar_url"],
            },
          ],
        });

        // Emit to recipient
        io.to(`user_${recipientId}`).emit("new_direct_message", fullMessage);
        // Emit to sender (so it appears in their chat immediately if they have multiple tabs open, or just consistency)
        io.to(`user_${socket.user?.get().id}`).emit("new_direct_message", fullMessage);
      } catch (error) {
        console.error("Error sending direct message:", error);
      }
    });

    // Typing indicator
    socket.on("typing", (data) => {
      const { channelId, isTyping } = data;
      socket.to(`channel_${channelId}`).emit("user_typing", {
        userId: socket.user?.get().id,
        username: socket.user?.get().username,
        isTyping,
        channelId,
      });
    });

    socket.on("disconnect", async () => {
      // console.log(`User disconnected: ${socket.user.username}`);
      await socket.user?.update({ is_online: false, last_seen: new Date() });
      io.emit("user_status", {
        userId: socket.user?.get().id,
        is_online: false,
        last_seen: new Date(),
      });
    });
  });
};

export default socketHandler;
