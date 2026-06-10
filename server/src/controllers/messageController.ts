const { Message, User } = require('../models');

const { Op } = require('sequelize');

const getMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        const messages = await Message.findAndCountAll({
            where: { channel_id: channelId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'avatar_url'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.json({
            messages: messages.rows.reverse(),
            total: messages.count,
            page: parseInt(page),
            totalPages: Math.ceil(messages.count / limit),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getDirectMessages = async (req, res) => {
    try {
        const { userId } = req.params; // The other user
        const currentUserId = req.user.id;
        const { page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        const messages = await Message.findAndCountAll({
            where: {
                [Op.or]: [
                    { user_id: currentUserId, recipient_id: userId },
                    { user_id: userId, recipient_id: currentUserId },
                ],
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'avatar_url'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.json({
            messages: messages.rows.reverse(),
            total: messages.count,
            page: parseInt(page),
            totalPages: Math.ceil(messages.count / limit),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getMessages,
    getDirectMessages,
};
