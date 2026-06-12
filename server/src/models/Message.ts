import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface MessageAttributes {
    id: string;
    content: string;
    user_id: string;
    channel_id?: string;
    recipient_id?: string;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'channel_id' | 'recipient_id'> {}

const Message = sequelize.define<Model<MessageAttributes, MessageCreationAttributes>>('messages', {
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

export default Message;

