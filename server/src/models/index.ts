import User from './User';
import Channel from './Channel';
import DirectMessage from './DirectMessage';
import ChannelMessage from './ChannelMessage';
import ChannelMember from './ChannelMember';
import File from './File';

// User - DirectMessage (Sender)
User.hasMany(DirectMessage, { foreignKey: 'sender_id', as: 'SentDirectMessages' });
DirectMessage.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender' });

// User - DirectMessage (Recipient)
User.hasMany(DirectMessage, { foreignKey: 'recipient_id', as: 'ReceivedDirectMessages' });
DirectMessage.belongsTo(User, { foreignKey: 'recipient_id', as: 'Recipient' });

DirectMessage.hasMany(File, { foreignKey: "file_id", as: "MessageFileId" });
File.belongsTo(DirectMessage, { foreignKey: "file_id", as: "FileId" });

// User - ChannelMessage (Sender)
User.hasMany(ChannelMessage, { foreignKey: 'sender_id', as: 'SentChannelMessages' });
ChannelMessage.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender' });

// Channel - ChannelMessage
Channel.hasMany(ChannelMessage, { foreignKey: 'channel_id' });
ChannelMessage.belongsTo(Channel, { foreignKey: 'channel_id' });

// User - Channel (Many-to-Many via ChannelMember)
User.belongsToMany(Channel, { through: ChannelMember, foreignKey: 'user_id' });
Channel.belongsToMany(User, { through: ChannelMember, foreignKey: 'channel_id' });

// Channel - User (Creator)
Channel.belongsTo(User, { as: 'Creator', foreignKey: 'created_by' });

// User - File (Sender)
User.hasMany(File, {
    foreignKey: "sender_id",
    as: "SentFiles"
});

File.belongsTo(User, {
    foreignKey: "sender_id",
    as: "Sender"
});

// User - File (Recipient)
User.hasMany(File, {
    foreignKey: "recipient_id",
    as: "ReceivedFiles"
});

File.belongsTo(User, {
    foreignKey: "recipient_id",
    as: "Recepient"
});

// Channel - File
Channel.hasMany(File, {
    foreignKey: "channel_id",
    as: "Files"
});

File.belongsTo(Channel, {
    foreignKey: "channel_id",
    as: "Channel"
});

export {
    User,
    Channel,
    DirectMessage,
    ChannelMessage,
    ChannelMember,
    File
};
