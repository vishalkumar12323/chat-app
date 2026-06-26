import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type MessageType = 'TEXT' | 'IMAGE' | 'DOCUMENT';

export interface ChannelMessageAttributes {
    id: string;
    type: MessageType;
    content: string;
    sender_id: string;
    channel_id: string;
    file_id?: string;
}

interface ChannelMessageCreationAttributes extends Optional<ChannelMessageAttributes, 'id' | 'content' | 'file_id'> {}

const ChannelMessage = sequelize.define<Model<ChannelMessageAttributes, ChannelMessageCreationAttributes>>('channel_messages', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    type: {
        type: DataTypes.ENUM('TEXT', 'IMAGE', 'DOCUMENT'),
        allowNull: false,
        defaultValue: 'TEXT',
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    sender_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    channel_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    file_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'files',
            key: 'id',
        },
    },
}, {
    timestamps: true,
});

export default ChannelMessage;
