import { User, ChannelMessage, DirectMessage, File } from "../models";
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
    // Update user status to online
    await socket.user?.update({ is_online: true, last_seen: new Date() });
    io.emit("user_status", { userId: socket.user?.get().id, is_online: true });

    // Join user-specific room for DMs
    socket.join(`user_${socket.user?.get().id}`);

    // Join channels
    socket.on("join_channel", (channelId) => {
      socket.join(`channel_${channelId}`);
    });

    // Send message (Channel)
    socket.on("send_message", async (data) => {
      try {
        const { channelId, content, fileId, type } = data;

        const message = await ChannelMessage.create({
          content: content || null,
          type: type || 'TEXT',
          sender_id: socket.user?.get().id as string,
          channel_id: channelId,
          file_id: fileId || null,
        });

        const fullMessage = await ChannelMessage.findByPk(message.get().id, {
          include: [
            { model: User, as: "Sender", attributes: ["id", "username", "avatar_url"] },
            { model: File, as: "File", attributes: ["id", "original_name", "file_size", "mime_type", "download_url", "preview_url"] },
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
        const { recipientId, content, fileId, type } = data;

        const message = await DirectMessage.create({
          content: content || null,
          type: type || 'TEXT',
          sender_id: socket.user?.get().id as string,
          recipient_id: recipientId,
          file_id: fileId || null,
        });

        const fullMessage = await DirectMessage.findByPk(message.get().id, {
          include: [
            { model: User, as: "Sender", attributes: ["id", "username", "avatar_url"] },
            {
              model: User,
              as: "Recipient",
              attributes: ["id", "username", "avatar_url"],
            },
            { model: File, as: "File", attributes: ["id", "original_name", "file_size", "mime_type", "download_url", "preview_url"] },
          ],
        });

        // Emit to recipient
        io.to(`user_${recipientId}`).emit("new_direct_message", fullMessage);
        // Emit to sender
        io.to(`user_${socket.user?.get().id}`).emit("new_direct_message", fullMessage);
      } catch (error) {
        console.error("Error sending direct message:", error);
      }
    });

    // Typing indicator
    socket.on("typing", (data) => {
      const { channelId, recipientId, isTyping } = data;

      if (channelId) {
        // Channel typing
        socket.to(`channel_${channelId}`).emit("user_typing", {
          userId: socket.user?.get().id,
          username: socket.user?.get().username,
          isTyping,
          channelId,
        });
      } else if (recipientId) {
        // DM typing
        socket.to(`user_${recipientId}`).emit("user_typing", {
          userId: socket.user?.get().id,
          username: socket.user?.get().username,
          isTyping,
          recipientId,
        });
      }
    });

    socket.on("disconnect", async () => {
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
