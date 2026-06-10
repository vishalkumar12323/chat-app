const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('messages', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    channel_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    recipient_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = Message;
