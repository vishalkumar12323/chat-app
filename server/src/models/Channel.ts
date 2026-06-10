import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Channel = sequelize.define('channels', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default Channel;
