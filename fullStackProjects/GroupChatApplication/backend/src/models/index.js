import sequelize from "../config/database.js"; // add export { sequelize } to your database.js if not already

import User from "./user.model.js";
import Conversation from "./conversation.model.js";
import ConversationMember from "./conversationMember.model.js";
import Message from "./message.model.js";
import Attachment from "./attachment.model.js";
import MessageReceipt from "./messageReceipt.model.js";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * CENTRAL ASSOCIATION FILE
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Each model file declares its own columns. This file declares how the
 * tables relate to each other. Every relationship in the app is here, in
 * one place, so the entire relational shape can be read top to bottom.
 *
 * An association does two jobs at once:
 *
 *   1. SCHEMA INSTRUCTION — it tells sequelize.sync() which FOREIGN KEY
 *      (and, when defined on the model, which UNIQUE) constraints go into
 *      the CREATE TABLE statements.
 *
 *   2. QUERY HELPER — it teaches Sequelize which models can be `include`-d
 *      together, so `Message.findAll({ include: [User, Attachment] })`
 *      produces the right SQL JOINs automatically.
 *
 * If an association is missing here, the corresponding FOREIGN KEY will
 * not exist even though the tables themselves were created.
 *
 * NOTE: composite UNIQUE constraints for join tables
 * (conversation_members, message_receipts) are NOT declared here — they
 * live in the model files' `indexes:` arrays. That separation is
 * intentional: constraints describe a single table, associations describe
 * the relationship between two. Both are needed for the DB to be correct.
 */

// ─────────────────────────────────────────────────────────────────────────
// USER ↔ CONVERSATION (many-to-many, via ConversationMember)
// ─────────────────────────────────────────────────────────────────────────
// "A user is in many conversations; a conversation has many users."
//
// SQL: conversation_members.user_id      → FK → users.id
//      conversation_members.conversation_id → FK → conversations.id
//      (plus composite UNIQUE on the pair, defined in the through model)
//
// `as` differs on each side on purpose:
//   - from a user's perspective       → "conversations"
//   - from a conversation's perspective → "members"
// The FK is identical; only the query alias changes.
User.belongsToMany(Conversation, {
  through: ConversationMember, // the table that records the pair
  foreignKey: "user_id", // column on through pointing back to User
  otherKey: "conversation_id", // column on through pointing to Conversation
  as: "conversations",
});

Conversation.belongsToMany(User, {
  through: ConversationMember,
  foreignKey: "conversation_id",
  otherKey: "user_id",
  as: "members",
});

// ─────────────────────────────────────────────────────────────────────────
// CONVERSATION → ConversationMember (one-to-many, the through model itself)
// ─────────────────────────────────────────────────────────────────────────
// A many-to-many cannot store per-pair data (role, joined_at) by itself,
// so we also give the through model its own hasMany/belongsTo links.
// This lets us query "give me all membership rows for this conversation"
// and read the `role` column on each.
//
// ON DELETE CASCADE: if a conversation is deleted, its membership rows
// are deleted by the database. That's a real FK-level cascade, not a
// Sequelize cleanup step.
Conversation.hasMany(ConversationMember, {
  foreignKey: "conversation_id",
  as: "conversationMembers",
  onDelete: "CASCADE",
});

ConversationMember.belongsTo(Conversation, {
  foreignKey: "conversation_id",
});

// ─────────────────────────────────────────────────────────────────────────
// USER → ConversationMember (one-to-many)
// ─────────────────────────────────────────────────────────────────────────
// The reverse side of the same through table: "give me all memberships
// for this user." Needed for the conversation list ("which chats am I in?").
//
// (Note: there is no onDelete: CASCADE on this side. If a user is ever
// deleted, their membership rows would block the delete unless we add it.
// Not urgent because we do not delete users in the current design.)
User.hasMany(ConversationMember, {
  foreignKey: "user_id",
});

ConversationMember.belongsTo(User, {
  foreignKey: "user_id",
});

// ─────────────────────────────────────────────────────────────────────────
// CONVERSATION → Message (one-to-many)
// ─────────────────────────────────────────────────────────────────────────
// "One conversation has many messages; each message belongs to one
// conversation."
//
// ON DELETE CASCADE: deleting a conversation deletes all its messages.
Conversation.hasMany(Message, {
  foreignKey: "conversation_id",
  as: "messages",
  onDelete: "CASCADE",
});

Message.belongsTo(Conversation, {
  foreignKey: "conversation_id",
});

// ─────────────────────────────────────────────────────────────────────────
// USER → Message (one-to-many, as sender)
// ─────────────────────────────────────────────────────────────────────────
// "One user has sent many messages; each message has one sender."
//
// This is a second FK on the messages table (sender_id → users.id),
// separate from the conversation_id FK above. A message therefore has
// two parents: the conversation it lives in, and the user who wrote it.
//
// `as: "sender"` matters for the query side: Message.findAll({
//   include: [{ model: User, as: "sender" }]
// }) returns each message with its author attached.
User.hasMany(Message, {
  foreignKey: "sender_id",
  as: "sentMessages",
});

Message.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
});

// ─────────────────────────────────────────────────────────────────────────
// MESSAGE → Attachment (one-to-many)
// ─────────────────────────────────────────────────────────────────────────
// "One message can have many attachments." Modelled as a separate table
// (not a column on messages) so a single message can carry multiple
// files, and so the same schema works for image/video/audio/document.
//
// ON DELETE CASCADE: deleting a message deletes its attachment rows.
// (This only deletes DB rows, not the actual files in Cloudinary —
//  that must be handled in the service layer, using public_id.)
Message.hasMany(Attachment, {
  foreignKey: "message_id",
  as: "attachments",
  onDelete: "CASCADE",
});

Attachment.belongsTo(Message, {
  foreignKey: "message_id",
});

// ─────────────────────────────────────────────────────────────────────────
// MESSAGE → MessageReceipt (one-to-many)
// ─────────────────────────────────────────────────────────────────────────
// One message produces one receipt row per recipient. The receipt holds
// delivered_at and read_at. In a direct chat there is one recipient; in
// a group there is one per member. Composite UNIQUE (message_id, user_id)
// is defined on the model to prevent duplicate receipts.
Message.hasMany(MessageReceipt, {
  foreignKey: "message_id",
  as: "receipts",
  onDelete: "CASCADE",
});

MessageReceipt.belongsTo(Message, {
  foreignKey: "message_id",
});

// ─────────────────────────────────────────────────────────────────────────
// USER → MessageReceipt (one-to-many)
// ─────────────────────────────────────────────────────────────────────────
// "Give me all receipt rows for this user" — needed for unread counts and
// the "mark as read" endpoint.
User.hasMany(MessageReceipt, {
  foreignKey: "user_id",
  as: "messageReceipts",
});

MessageReceipt.belongsTo(User, {
  foreignKey: "user_id",
  as: "recipient", // used when building a receipt with its user attached
});

// ─────────────────────────────────────────────────────────────────────────
// USER → CONVERSATION (one-to-many, as creator)
// ─────────────────────────────────────────────────────────────────────────
// A second FK from conversations back to users: created_by.
// Distinct from the membership relation — this records who opened a group,
// which is what grants them the ADMIN role on creation.
//
// No cascade on delete: deleting a user should not delete the
// conversations they created, because other members still depend on them.
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

/**
 * ─────────────────────────────────────────────────────────────────────────
 * INITIALISE MODELS
 * ─────────────────────────────────────────────────────────────────────────
 * Called once at server startup, after connectDB() has succeeded.
 *
 * sync() (without options) is equivalent to CREATE TABLE IF NOT EXISTS:
 *   - missing tables are created, using the associations above to emit FKs
 *   - existing tables are left untouched
 *
 * We deliberately do NOT pass { alter: true }. On MySQL dialect, `alter`
 * drops and recreates indexes/columns unpredictably, and the Sequelize
 * docs themselves advise against it in production. Schema changes from
 * here on are made with explicit ALTER TABLE statements, which are visible
 * and explainable in a viva.
 */
export const initializeModels = async () => {
  await sequelize.sync();
  console.log("Sequelize models synchronised with the database.");
};
