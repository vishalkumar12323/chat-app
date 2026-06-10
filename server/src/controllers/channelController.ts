const { Channel, User, ChannelMember } = require('../models');

const createChannel = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        // Check if channel exists
        const existingChannel = await Channel.findOne({ where: { name } });
        if (existingChannel) {
            return res.status(400).json({ message: 'Channel already exists' });
        }

        const newChannel = await Channel.create({
            name,
            description,
            created_by: userId,
        });

        // Add creator as member
        await ChannelMember.create({
            user_id: userId,
            channel_id: newChannel.id,
        });

        res.status(201).json(newChannel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getChannels = async (_req, res) => {
    try {
        const channels = await Channel.findAll({
            include: [
                {
                    model: User,
                    as: 'Creator',
                    attributes: ['id', 'username'],
                },
            ],
        });
        res.json(channels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const joinChannel = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const channel = await Channel.findByPk(id);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        // Check if already member
        const existingMember = await ChannelMember.findOne({
            where: { user_id: userId, channel_id: id },
        });

        if (existingMember) {
            return res.status(400).json({ message: 'Already a member' });
        }

        await ChannelMember.create({
            user_id: userId,
            channel_id: id,
        });

        res.json({ message: 'Joined channel successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMyChannels = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Channel,
                    through: { attributes: [] },
                },
            ],
        });
        res.json(user.Channels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createChannel,
    getChannels,
    joinChannel,
    getMyChannels,
};
