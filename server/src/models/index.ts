import User from './User.js';
import Channel from './Channel.js';
import Message from './Message.js';
import ChannelMember from './ChannelMember.js';

// User - Message
User.hasMany(Message, { foreignKey: 'user_id' });
Message.belongsTo(User, { foreignKey: 'user_id' });

// Channel - Message
Channel.hasMany(Message, { foreignKey: 'channel_id' });
Message.belongsTo(Channel, { foreignKey: 'channel_id' });

// User - Message
User.hasMany(Message, { foreignKey: 'recipient_id', as: 'ReceivedMessages' });
Message.belongsTo(User, { foreignKey: 'recipient_id', as: 'Recipient' });

// User - Channel (Many-to-Many via ChannelMember)
User.belongsToMany(Channel, { through: ChannelMember, foreignKey: 'user_id' });
Channel.belongsToMany(User, { through: ChannelMember, foreignKey: 'channel_id' });

// Channel - User (Creator)
Channel.belongsTo(User, { as: 'Creator', foreignKey: 'created_by' });

export {
    User,
    Channel,
    Message,
    ChannelMember,
};
