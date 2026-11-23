// src/modules/messages/message.service.js
import { Message, ConversationMember, User } from "../../models/index.js";
import { AppError } from "../../utils/errors.js";

export const sendMessage = async (senderId, conversationId, content) => {
  if (!content || content.trim() === "") {
    throw new AppError("Message content cannot be empty", 400);
  }

  // 1. Verify the sender is actually a member of this conversation
  const member = await ConversationMember.findOne({
    where: { conversation_id: conversationId, user_id: senderId },
  });
  if (!member)
    throw new AppError("You are not a member of this conversation", 403);

  // 2. Create the message in the database
  const message = await Message.create({
    conversation_id: conversationId,
    sender_id: senderId,
    message_type: "TEXT",
    content: content.trim(),
  });

  // 3. Fetch it back with the sender's info attached so the frontend can render it
  return await Message.findByPk(message.id, {
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "name", "profile_picture"],
      },
    ],
  });
};

export const getMessages = async (userId, conversationId) => {
  // 1. Verify the user is a member of this conversation
  const member = await ConversationMember.findOne({
    where: { conversation_id: conversationId, user_id: userId },
  });
  if (!member)
    throw new AppError("You are not a member of this conversation", 403);

  // 2. Fetch all messages ordered from oldest to newest
  return await Message.findAll({
    where: { conversation_id: conversationId, deleted_at: null },
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "name", "profile_picture"],
      },
    ],
    order: [["createdAt", "ASC"]],
  });
};
