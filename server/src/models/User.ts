import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    avatar_url?: string;
    is_online?: boolean;
    last_seen?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'avatar_url' | 'is_online' | 'last_seen'> {}

const User = sequelize.define<Model<UserAttributes, UserCreationAttributes>>('users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar_url: {
        type: DataTypes.STRING,
    },
    is_online: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    last_seen: {
        type: DataTypes.DATE,
    },
}, {
    timestamps: true,
});

export default User;

