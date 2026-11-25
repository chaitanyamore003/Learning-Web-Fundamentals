import sequelize from "../config/database.js";

import User from "./user.model.js";
import Conversation from "./conversation.model.js";
import ConversationMember from "./conversationMember.model.js";
import Message from "./message.model.js";
import Attachment from "./attachment.model.js";
import MessageReceipt from "./messageReceipt.model.js";
import ArchivedMessage from "./archivedMessage.model.js";
import ArchivedAttachment from "./archivedAttachment.model.js";

/**
 * ============================================================
 * CENTRAL ASSOCIATION FILE
 * ============================================================
 *
 * WHY DO WE NEED THIS FILE?
 *
 * We have different tables in our database:
 *
 * 1. users
 * 2. conversations
 * 3. conversation_members
 * 4. messages
 * 5. attachments
 * 6. message_receipts
 *
 * These tables are connected to each other.
 * For example:
 * - A user can participate in multiple conversations.
 * - A conversation can contain multiple messages.
 * - A message can have multiple attachments.
 *
 * Sequelize needs to know how these tables are connected.
 * We define all those relationships in this file.
 *
 *
 * WHAT DOES AN ASSOCIATION DO?
 *
 * An association mainly serves two purposes:
 *
 * 1. DATABASE RELATIONSHIP:
 *    It tells Sequelize which table is connected to which
 *    table through a foreign key.
 *
 * 2. FETCHING RELATED DATA:
 *    It allows us to use `include` when querying data.
 *
 *    Example:
 *
 *    Message.findAll({
 *      include: [{ model: User, as: "sender" }]
 *    });
 *
 *    This allows us to fetch messages along with the
 *    information of the user who sent them.
 *
 *
 * IMPORTANT:
 *
 * - belongsTo() means this model contains the foreign key.
 * - hasMany() means this model is related to multiple
 *   records in another table.
 * - belongsToMany() means two models are connected through
 *   an intermediate (junction) table.
 *
 * We use associations to describe these relationships.
 *
 * NOTE:
 * Composite UNIQUE constraints for conversation_members
 * and message_receipts are defined inside their model files.
 * They prevent duplicate user-conversation memberships
 * and duplicate message receipts.
 */

/**
 * ============================================================
 * 1. USER ↔ CONVERSATION (MANY-TO-MANY)
 * ============================================================
 *
 * WHY DO WE NEED THIS?
 *
 * Imagine a chat application:
 *
 * - One user can participate in multiple conversations.
 * - One conversation can have multiple users.
 *
 * For example:
 *
 * User A → Conversation 1, Conversation 2
 * User B → Conversation 1, Conversation 3
 *
 * We cannot store all these relationships directly inside
 * the users or conversations table.
 *
 * So we use an intermediate table:
 *
 * conversation_members
 *
 * This table stores which user belongs to which conversation.
 *
 * Example:
 *
 * user_id | conversation_id
 * --------|----------------
 * 1       | 101
 * 1       | 102
 * 2       | 101
 *
 * WHY belongsToMany()?
 *
 * Because both users and conversations can have multiple
 * records connected to each other.
 *
 * `through` tells Sequelize which intermediate table
 * should be used to establish this relationship.
 *
 * foreignKey = column pointing to the current model.
 * otherKey   = column pointing to the other model.
 *
 * `as` gives the relationship a name that we can use
 * while fetching related data.
 *
 * User.belongsToMany(Conversation):
 * We can fetch all conversations of a user using
 * the alias "conversations".
 *
 * Conversation.belongsToMany(User):
 * We can fetch all users of a conversation using
 * the alias "members".
 */

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

/**
 * ============================================================
 * 2. CONVERSATION → ConversationMember (ONE-TO-MANY)
 * ============================================================
 *
 * WHY DO WE NEED THIS?
 *
 * Remember that conversation_members is our intermediate table.
 *
 * It does not only store which users belong to a conversation.
 * It can also store additional information such as:
 *
 * - role (ADMIN or MEMBER)
 * - joined_at
 *
 * Sometimes we need to access these membership records directly.
 *
 * For example:
 *
 * - Find all members of a particular conversation.
 * - Check who is the admin.
 * - Check when a user joined the conversation.
 *
 * WHY hasMany()?
 *
 * One conversation can have multiple membership records.
 *
 * Example:
 *
 * Conversation 101:
 *   Membership 1 → User A
 *   Membership 2 → User B
 *   Membership 3 → User C
 *
 * hasMany() allows us to fetch all these records.
 *
 * WHY belongsTo()?
 *
 * Each membership record belongs to exactly one conversation.
 *
 * It tells Sequelize that conversation_members contains
 * the conversation_id foreign key.
 *
 * ON DELETE CASCADE:
 *
 * If a conversation is deleted, all its membership records
 * should also be deleted automatically.
 *
 * Otherwise, unnecessary membership records would remain
 * in the database.
 */

Conversation.hasMany(ConversationMember, {
  foreignKey: "conversation_id",
  as: "conversationMembers",
  onDelete: "CASCADE",
});

ConversationMember.belongsTo(Conversation, {
  foreignKey: "conversation_id",
});

/**
 * ============================================================
 * 3. USER → ConversationMember (ONE-TO-MANY)
 * ============================================================
 *
 * WHY DO WE NEED THIS?
 *
 * We have already connected Conversation with
 * ConversationMember.
 *
 * Now we also need to connect User with ConversationMember.
 *
 * Why?
 *
 * Because each membership record belongs to a particular user.
 *
 * Example:
 *
 * user_id | conversation_id
 * --------|----------------
 * 1       | 101
 * 1       | 102
 * 2       | 101
 *
 * User 1 has two membership records.
 * User 2 has one membership record.
 *
 * WHY hasMany()?
 *
 * One user can have multiple membership records because
 * they can participate in multiple conversations.
 *
 * This allows us to fetch all conversations a user belongs to
 * through their membership records.
 *
 * WHY belongsTo()?
 *
 * Each membership record belongs to one particular user.
 *
 * It tells Sequelize that conversation_members has
 * a user_id foreign key pointing to users.id.
 *
 * We are not using ON DELETE CASCADE here.
 * Therefore, deleting a user will not automatically
 * delete their membership records through this association.
 */

User.hasMany(ConversationMember, {
  foreignKey: "user_id",
});

ConversationMember.belongsTo(User, {
  foreignKey: "user_id",
});

/**
 * ============================================================
 * 4. CONVERSATION → MESSAGE (ONE-TO-MANY)
 * ============================================================
 *
 * WHY DO WE NEED THIS?
 *
 * A conversation contains multiple messages.
 *
 * For example:
 *
 * Conversation 101:
 *   Message 1 → "Hello"
 *   Message 2 → "How are you?"
 *   Message 3 → "I'm good"
 *
 * WHY hasMany()?
 *
 * One conversation can have many messages.
 *
 * It allows us to fetch all messages belonging to
 * a particular conversation.
 *
 * The `as: "messages"` alias lets us refer to these
 * messages using the name "messages".
 *
 * WHY belongsTo()?
 *
 * Every message belongs to one conversation.
 *
 * The messages table contains conversation_id,
 * which points to conversations.id.
 *
 * ON DELETE CASCADE:
 *
 * If a conversation is deleted, all its messages
 * should also be deleted.
 *
 * This prevents messages from remaining in the database
 * without their parent conversation.
 */

Conversation.hasMany(Message, {
  foreignKey: "conversation_id",
  as: "messages",
  onDelete: "CASCADE",
});

Message.belongsTo(Conversation, {
  foreignKey: "conversation_id",
});

/**
 * ============================================================
 * 5. USER → MESSAGE (ONE-TO-MANY, AS SENDER)
 * ============================================================
 *
 * WHY DO WE NEED THIS?
 *
 * Every message in our application is sent by a user.
 *
 * One user can send multiple messages.
 *
 * Example:
 *
 * User A:
 *   Message 1 → "Hello"
 *   Message 2 → "How are you?"
 *   Message 3 → "Good morning"
 *
 * WHY hasMany()?
 *
 * One user can send many messages.
 *
 * We use the alias "sentMessages" to identify
 * all messages sent by a particular user.
 *
 * WHY belongsTo()?
 *
 * Each message has only one sender.
 *
 * The messages table contains sender_id,
 * which points to users.id.
 *
 * IMPORTANT:
 *
 * A message has two different relationships:
 *
 * 1. conversation_id → tells us which conversation
 *                      the message belongs to.
 *
 * 2. sender_id       → tells us who sent the message.
 *
 * Both are separate foreign keys in the messages table.
 *
 * WHY `as: "sender"`?
 *
 * It gives the sender relationship a meaningful name.
 *
 * Example:
 *
 * Message.findAll({
 *   include: [{ model: User, as: "sender" }]
 * });
 *
 * This fetches messages along with the details
 * of the users who sent them.
 */

User.hasMany(Message, {
  foreignKey: "sender_id",
  as: "sentMessages",
});

Message.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
});

/**
 * ============================================================
 * 6. MESSAGE → ATTACHMENT (ONE-TO-MANY)
 * ============================================================
 *
 * WHY DO WE NEED THIS?
 *
 * A message can contain different types of files:
 *
 * - Images
 * - Videos
 * - Audio files
 * - Documents
 *
 * Instead of storing file information directly inside
 * the messages table, we use a separate attachments table.
 *
 * Why?
 *
 * Because one message can have multiple attachments.
 *
 * Example:
 *
 * Message 101:
 *   Attachment 1 → image.png
 *   Attachment 2 → document.pdf
 *
 * WHY hasMany()?
 *
 * One message can have multiple attachments.
 *
 * It allows us to fetch all attachments of a message.
 *
 * WHY belongsTo()?
 *
 * Each attachment belongs to one particular message.
 *
 * The attachments table contains message_id,
 * which points to messages.id.
 *
 * ON DELETE CASCADE:
 *
 * If a message is deleted, its attachment records
 * should also be deleted from the database.
 *
 * IMPORTANT:
 *
 * This only deletes attachment records from MySQL.
 *
 * Actual files stored in Cloudinary are not deleted
 * automatically.
 *
 * We must separately delete those files using their
 * Cloudinary public_id in our service/controller logic.
 */

Message.hasMany(Attachment, {
  foreignKey: "message_id",
  as: "attachments",
  onDelete: "CASCADE",
});

Attachment.belongsTo(Message, {
  foreignKey: "message_id",
});

/**
 * ============================================================
 * 7. MESSAGE → MessageReceipt (ONE-TO-MANY)
 * ============================================================
 *
 * WHY DO WE NEED THIS?
 *
 * We want to track the delivery and read status of messages.
 *
 * For example:
 *
 * When User A sends a message to User B:
 *
 * Message:
 *   "Hello"
 *
 * Receipt:
 *   delivered_at → time when User B received it.
 *   read_at      → time when User B read it.
 *
 * We store this information in a separate message_receipts
 * table instead of storing it directly inside messages.
 *
 * WHY?
 *
 * Because in group conversations, a single message can
 * have multiple recipients.
 *
 * Each recipient needs their own delivery/read status.
 *
 * Example:
 *
 * Message 101:
 *
 * message_id | user_id | delivered_at | read_at
 * -----------|---------|--------------|--------
 * 101        | 2       | timestamp    | NULL
 * 101        | 3       | timestamp    | timestamp
 * 101        | 4       | timestamp    | NULL
 *
 * WHY hasMany()?
 *
 * One message can have multiple receipt records.
 *
 * It allows us to fetch all receipts associated
 * with a particular message.
 *
 * WHY belongsTo()?
 *
 * Each receipt belongs to exactly one message.
 *
 * The message_receipts table contains message_id,
 * which points to messages.id.
 *
 * ON DELETE CASCADE:
 *
 * If a message is deleted, its receipt records
 * should also be deleted.
 */

Message.hasMany(MessageReceipt, {
  foreignKey: "message_id",
  as: "receipts",
  onDelete: "CASCADE",
});

MessageReceipt.belongsTo(Message, {
  foreignKey: "message_id",
});

/**
 * ============================================================
 * 8. USER → MessageReceipt (ONE-TO-MANY)
 * ============================================================
 *
 * WHY DO WE NEED THIS?
 *
 * We have connected Message with MessageReceipt.
 *
 * But we also need to know which user a receipt belongs to.
 *
 * For example:
 *
 * message_id | user_id | delivered_at | read_at
 * -----------|---------|--------------|--------
 * 101        | 2       | timestamp    | NULL
 *
 * This receipt belongs to User 2.
 *
 * WHY hasMany()?
 *
 * One user can have multiple receipt records because
 * they can receive multiple messages.
 *
 * It allows us to fetch all message receipts belonging
 * to a particular user.
 *
 * This is useful for:
 *
 * - Finding unread messages.
 * - Updating read status.
 * - Checking delivery status.
 *
 * WHY belongsTo()?
 *
 * Each receipt belongs to one recipient.
 *
 * The message_receipts table contains user_id,
 * which points to users.id.
 *
 * WHY `as: "recipient"`?
 *
 * It gives the user relationship a meaningful name.
 *
 * Example:
 *
 * MessageReceipt.findAll({
 *   include: [{ model: User, as: "recipient" }]
 * });
 *
 * This fetches receipt records along with
 * the users who received those messages.
 */

User.hasMany(MessageReceipt, {
  foreignKey: "user_id",
  as: "messageReceipts",
});

MessageReceipt.belongsTo(User, {
  foreignKey: "user_id",
  as: "recipient",
});

/**
 * ============================================================
 * 9. USER → CONVERSATION (ONE-TO-MANY, AS CREATOR)
 * ============================================================
 *
 * WHY DO WE NEED THIS?
 *
 * Apart from being a member of a conversation,
 * a user can also create a conversation.
 *
 * These are two different relationships.
 *
 * MEMBERSHIP:
 * A user participates in a conversation.
 *
 * CREATOR:
 * A user originally created the conversation.
 *
 * Example:
 *
 * User A creates a group called "Project Team".
 *
 * In the conversations table:
 *
 * id | name         | created_by
 * ---|--------------|-----------
 * 1  | Project Team | 5
 *
 * created_by = 5 means User 5 created this conversation.
 *
 * WHY hasMany()?
 *
 * One user can create multiple conversations.
 *
 * We use the alias "createdConversations" to fetch
 * all conversations created by a particular user.
 *
 * WHY belongsTo()?
 *
 * Every conversation has one creator.
 *
 * The conversations table contains created_by,
 * which points to users.id.
 *
 * WHY `as: "creator"`?
 *
 * It allows us to fetch the creator's information
 * when fetching a conversation.
 *
 * Example:
 *
 * Conversation.findAll({
 *   include: [{ model: User, as: "creator" }]
 * });
 *
 * IMPORTANT:
 *
 * Creator and member are not the same relationship.
 *
 * A creator is also generally a member of the group,
 * but their membership is stored separately
 * in conversation_members.
 *
 * We do not use ON DELETE CASCADE here because
 * deleting a creator should not automatically delete
 * the conversation and affect its other members.
 */

User.hasMany(Conversation, {
  foreignKey: "created_by",
  as: "createdConversations",
});

Conversation.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

/**
 * ============================================================
 * 10. ARCHIVED MESSAGE → ARCHIVED ATTACHMENT (ONE-TO-MANY)
 * ============================================================
 * Just like live messages, archived messages need their files.
 */
ArchivedMessage.hasMany(ArchivedAttachment, {
  foreignKey: "message_id",
  as: "attachments",
  onDelete: "CASCADE",
});

ArchivedAttachment.belongsTo(ArchivedMessage, {
  foreignKey: "message_id",
});

/**
 * ============================================================
 * EXPORT MODELS
 * ============================================================
 *
 * We export these models so other parts of our application
 * can import and use them.
 *
 * For example:
 *
 * import { User, Message, Conversation } from "../models/index.js";
 *
 * Controllers and services can now perform database queries
 * using these models and their defined associations.
 */

export {
  User,
  Conversation,
  ConversationMember,
  Message,
  Attachment,
  MessageReceipt,
};

/**
 * ============================================================
 * INITIALIZE MODELS
 * ============================================================
 *
 * WHY DO WE NEED THIS FUNCTION?
 *
 * Before our application starts handling requests,
 * we need to make sure all our database tables exist.
 *
 * sequelize.sync() checks the models and creates
 * tables that do not already exist.
 *
 * It also uses the associations defined above
 * to create the required foreign key constraints.
 *
 * IMPORTANT:
 *
 * We are NOT using:
 *
 * sequelize.sync({ alter: true })
 *
 * Because alter can automatically modify existing
 * database tables, columns and indexes.
 *
 * This can lead to unexpected schema changes,
 * especially in production.
 *
 * Instead, we use normal sync() for initialization
 * and handle future database structure changes
 * through explicit migrations or ALTER TABLE statements.
 *
 * This function should be called once during
 * server startup, after the database connection succeeds.
 */

export const initializeModels = async () => {
  await sequelize.sync();

  console.log("Sequelize models synchronised with the database.");
};
