const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChannelMember = sequelize.define('channel_members', {
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    channel_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        references: {
            model: 'channels',
            key: 'id',
        },
    },
}, {
    timestamps: true,
});

module.exports = ChannelMember;
