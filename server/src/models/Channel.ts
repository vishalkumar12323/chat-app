import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ChannelAttributes {
    id: string;
    name: string;
    description?: string;
    created_by: string;
}

interface ChannelCreationAttributes extends Optional<ChannelAttributes, 'id' | 'description'> {}

const Channel = sequelize.define<Model<ChannelAttributes, ChannelCreationAttributes>>('channels', {
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

