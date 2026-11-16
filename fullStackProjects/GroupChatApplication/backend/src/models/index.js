import User from "./user.model.js";
import Conversation from "./conversation.model.js";
import ConversationMember from "./conversationMember.model.js";
import Message from "./message.model.js";
import Attachment from "./attachment.model.js";
import MessageReceipt from "./messageReceipt.model.js";

// User <-> Conversation through ConversationMember
User.belongsToMany(Conversation, {
  through: ConversationMember,
  foreignKey: "user_id",
  otherKey: "conversation_id",
  as: "conversations",
});

Conversation.belongsToMany(User, {
  through: ConversationMember,
  foreignKey: "conversation_id",
  otherKey: "user_id",
  as: "members",
});

// Conversation -> Members
Conversation.hasMany(ConversationMember, {
  foreignKey: "conversation_id",
  as: "conversationMembers",
  onDelete: "CASCADE",
});

ConversationMember.belongsTo(Conversation, {
  foreignKey: "conversation_id",
});

// User -> ConversationMember
User.hasMany(ConversationMember, {
  foreignKey: "user_id",
});

ConversationMember.belongsTo(User, {
  foreignKey: "user_id",
});

// Conversation -> Messages
Conversation.hasMany(Message, {
  foreignKey: "conversation_id",
  as: "messages",
  onDelete: "CASCADE",
});

Message.belongsTo(Conversation, {
  foreignKey: "conversation_id",
});

// User -> Messages
User.hasMany(Message, {
  foreignKey: "sender_id",
  as: "sentMessages",
});

Message.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
});

// Message -> Attachments
Message.hasMany(Attachment, {
  foreignKey: "message_id",
  as: "attachments",
  onDelete: "CASCADE",
});

Attachment.belongsTo(Message, {
  foreignKey: "message_id",
});

// Message -> MessageReceipt
Message.hasMany(MessageReceipt, {
  foreignKey: "message_id",
  as: "receipts",
  onDelete: "CASCADE",
});

MessageReceipt.belongsTo(Message, {
  foreignKey: "message_id",
});

// User -> MessageReceipt
User.hasMany(MessageReceipt, {
  foreignKey: "user_id",
  as: "messageReceipts",
});

MessageReceipt.belongsTo(User, {
  foreignKey: "user_id",
  as: "recipient",
});

// User -> Created Conversations
User.hasMany(Conversation, {
  foreignKey: "created_by",
  as: "createdConversations",
});

Conversation.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

export {
  User,
  Conversation,
  ConversationMember,
  Message,
  Attachment,
  MessageReceipt,
};
