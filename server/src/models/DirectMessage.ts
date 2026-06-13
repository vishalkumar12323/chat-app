import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface DirectMessageAttributes {
    id: string;
    content: string;
    sender_id: string;
    recipient_id: string;
}

interface DirectMessageCreationAttributes extends Optional<DirectMessageAttributes, 'id'> {}

const DirectMessage = sequelize.define<Model<DirectMessageAttributes, DirectMessageCreationAttributes>>('direct_messages', {
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
    recipient_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default DirectMessage;
