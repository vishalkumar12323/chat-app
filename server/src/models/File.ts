import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface FileAttributes {
    id: string;
    uploaded_by: string;
    original_name: string;
    file_size: number;
    mime_type: string;
    download_url: string;
    preview_url: string;
    bucket_id: string;
    file_id: string; // Appwrite file ID
};

interface FileCreationAttributes extends Optional<FileAttributes, 'id'> { };

const File = sequelize.define<Model<FileAttributes, FileCreationAttributes>>('files', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    uploaded_by: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    original_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    file_size: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    mime_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    download_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    preview_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    bucket_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    file_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
    }
}, {
    timestamps: true
});

export default File;