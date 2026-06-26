import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type MessageType = 'TEXT' | 'IMAGE' | 'DOCUMENT';
export interface DirectMessageAttributes {
    id: string;
    type: MessageType;
    content: string;
    sender_id: string;
    recipient_id: string;
    file_id?: string;
}

interface DirectMessageCreationAttributes extends Optional<DirectMessageAttributes, 'id' | 'content' | 'file_id'> { }

const DirectMessage = sequelize.define<Model<DirectMessageAttributes, DirectMessageCreationAttributes>>('direct_messages', {
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
    recipient_id: {
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
    }
}, {
    timestamps: true,
});

export default DirectMessage;
