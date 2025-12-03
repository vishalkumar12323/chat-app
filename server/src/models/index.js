const User = require('./User');
const Channel = require('./Channel');
const Message = require('./Message');
const ChannelMember = require('./ChannelMember');

// User - Message (One-to-Many)
User.hasMany(Message, { foreignKey: 'user_id' });
Message.belongsTo(User, { foreignKey: 'user_id' });

// Channel - Message (One-to-Many)
Channel.hasMany(Message, { foreignKey: 'channel_id' });
Message.belongsTo(Channel, { foreignKey: 'channel_id' });

// User - Message (Direct Messages)
User.hasMany(Message, { foreignKey: 'recipient_id', as: 'ReceivedMessages' });
Message.belongsTo(User, { foreignKey: 'recipient_id', as: 'Recipient' });

// User - Channel (Many-to-Many via ChannelMember)
User.belongsToMany(Channel, { through: ChannelMember, foreignKey: 'user_id' });
Channel.belongsToMany(User, { through: ChannelMember, foreignKey: 'channel_id' });

// Channel - User (Creator)
Channel.belongsTo(User, { as: 'Creator', foreignKey: 'created_by' });

module.exports = {
    User,
    Channel,
    Message,
    ChannelMember,
};
