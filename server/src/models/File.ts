import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface FileAttributes {
    id: string;
    sender_id: string;
    recipient_id?: string;
    channel_id?: string;
    original_name: string;
    file_size: number;
    file_url: string;
    mime_type: string;
    download_url: string;
    preview_url: string;
    bucket_id: string;
    file_id: string;
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
    original_name: {
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
    mime_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    download_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    preview_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bucket_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

export default File;