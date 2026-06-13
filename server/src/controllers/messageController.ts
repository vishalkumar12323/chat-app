import { ChannelMessage, DirectMessage, User } from '../models';
import { Request, Response } from "express"

import { Op } from 'sequelize';

const getMessages = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;
        const pageNum = Number(req.query.page) || 1;
        const limitNum = Number(req.query.limit) || 50;
        const offset = (pageNum - 1) * limitNum;

        const messages = await ChannelMessage.findAndCountAll({
            where: { channel_id: channelId },
            include: [
                {
                    model: User,
                    as: 'Sender',
                    attributes: ['id', 'username', 'avatar_url'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: limitNum,
            offset,
        });

        res.json({
            messages: messages.rows.reverse(),
            total: messages.count,
            page: pageNum,
            totalPages: Math.ceil(messages.count / limitNum),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getDirectMessages = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params; // The other user
        const currentUserId = req.user?.userId;
        const pageNum = Number(req.query.page) || 1;
        const limitNum = Number(req.query.limit) || 50;
        const offset = (pageNum - 1) * limitNum;

        const messages = await DirectMessage.findAndCountAll({
            where: {
                [Op.or]: [
                    { sender_id: currentUserId, recipient_id: userId },
                    { sender_id: userId, recipient_id: currentUserId },
                ],
            },
            include: [
                {
                    model: User,
                    as: 'Sender',
                    attributes: ['id', 'username', 'avatar_url'],
                },
                {
                    model: User,
                    as: 'Recipient',
                    attributes: ['id', 'username', 'avatar_url'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: limitNum,
            offset,
        });

        res.json({
            messages: messages.rows.reverse(),
            total: messages.count,
            page: pageNum,
            totalPages: Math.ceil(messages.count / limitNum),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export {
    getMessages,
    getDirectMessages,
};
