import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface FileAttributes {
    id: string;
    sender_id: string;
    recipient_id?: string;
    channel_id?: string;
    file_name: string;
    file_size: number;
    file_url: string;
    extension: string;
};

interface FileCreationAttributes extends Optional<FileAttributes, 'id' | 'recipient_id' | 'channel_id'> { };

const File = sequelize.define<Model<FileAttributes, FileCreationAttributes>>('files', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    sender_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    recipient_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    channel_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    file_size: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    file_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    extension: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true
});

export default File;