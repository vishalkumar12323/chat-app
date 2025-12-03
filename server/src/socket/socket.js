const { User, Message } = require('../models');
const jwt = require('jsonwebtoken');

const socketHandler = (io) => {
    // authentication
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            socket.user = await User.findByPk(decoded.id);
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.user?.username}`);

        // Update user status to online
        await socket.user?.update({ is_online: true, last_seen: new Date() });
        io.emit('user_status', { userId: socket.user.id, is_online: true });

        // Join user-specific room for DMs
        socket.join(`user_${socket.user.id}`);

        // Join channels
        socket.on('join_channel', (channelId) => {
            socket.join(`channel_${channelId}`);
            console.log(`User ${socket.user?.username} joined channel ${channelId}`);
        });

        // Send message (Channel)
        socket.on('send_message', async (data) => {
            try {
                const { channelId, content } = data;

                const message = await Message.create({
                    content,
                    user_id: socket.user.id,
                    channel_id: channelId,
                });

                const fullMessage = await Message.findByPk(message.id, {
                    include: [{ model: User, attributes: ['id', 'username', 'avatar_url'] }],
                });

                io.to(`channel_${channelId}`).emit('new_message', fullMessage);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        // Send Direct Message
        socket.on('send_direct_message', async (data) => {
            try {
                const { recipientId, content } = data;

                const message = await Message.create({
                    content,
                    user_id: socket.user.id,
                    recipient_id: recipientId,
                });

                const fullMessage = await Message.findByPk(message.id, {
                    include: [
                        { model: User, attributes: ['id', 'username', 'avatar_url'] },
                        { model: User, as: 'Recipient', attributes: ['id', 'username', 'avatar_url'] }
                    ],
                });

                // Emit to recipient
                io.to(`user_${recipientId}`).emit('new_direct_message', fullMessage);
                // Emit to sender (so it appears in their chat immediately if they have multiple tabs open, or just consistency)
                io.to(`user_${socket.user.id}`).emit('new_direct_message', fullMessage);

            } catch (error) {
                console.error('Error sending direct message:', error);
            }
        });

        // Typing indicator
        socket.on('typing', (data) => {
            const { channelId, isTyping } = data;
            socket.to(`channel_${channelId}`).emit('user_typing', {
                userId: socket.user.id,
                username: socket.user.username,
                isTyping,
                channelId
            });
        });


        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${socket.user.username}`);
            await socket.user.update({ is_online: false, last_seen: new Date() });
            io.emit('user_status', { userId: socket.user.id, is_online: false, last_seen: new Date() });
        });
    });
};

module.exports = socketHandler;
