import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ChannelMessageAttributes {
    id: string;
    content: string;
    sender_id: string;
    channel_id: string;
}

interface ChannelMessageCreationAttributes extends Optional<ChannelMessageAttributes, 'id'> {}

const ChannelMessage = sequelize.define<Model<ChannelMessageAttributes, ChannelMessageCreationAttributes>>('channel_messages', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    sender_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    channel_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default ChannelMessage;
