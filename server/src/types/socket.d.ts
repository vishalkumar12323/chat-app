import { Model } from 'sequelize';
import { UserAttributes, UserCreationAttributes } from '../models/User';

declare module 'socket.io' {
    interface Socket {
        user?: Model<UserAttributes, UserCreationAttributes> | null;
    }
}
