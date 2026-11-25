// src/modules/messages/message.service.js
import sequelize from "../../config/database.js";
import Message from "../../models/message.model.js";
import Attachment from "../../models/attachment.model.js";
import User from "../../models/user.model.js";

export const sendMessage = async (
  senderId,
  conversationId,
  content,
  messageType,
  attachmentData,
) => {
  const transaction = await sequelize.transaction();

  try {
    // 1. Create the Message record
    const message = await Message.create(
      {
        conversation_id: conversationId,
        sender_id: senderId,
        content: content || "",
        message_type: messageType,
      },
      { transaction },
    );

    // 2. If there is file data, create the Attachment record
    if (attachmentData) {
      await Attachment.create(
        {
          message_id: message.id,
          file_url: attachmentData.file_url,
          file_name: attachmentData.file_name,
          mime_type: attachmentData.mime_type,
          file_size: attachmentData.file_size,
          storage_provider: "S3",
        },
        { transaction },
      );
    }

    await transaction.commit();

    // 3. Fetch the complete message with Sender and Attachment included
    const completeMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: "sender",
          // 👇 REMOVED the attributes restriction here so it fetches your actual columns
        },
        {
          model: Attachment,
          as: "attachments",
        },
      ],
    });

    return completeMessage;
  } catch (error) {
    await transaction.rollback();
    console.error("Error in sendMessage service:", error);
    throw error;
  }
};

export const getMessages = async (userId, conversationId) => {
  // Fetch all messages for the chat room, including attachments
  return await Message.findAll({
    where: { conversation_id: conversationId },
    include: [
      {
        model: User,
        as: "sender",
        // 👇 REMOVED the attributes restriction here too
      },
      {
        model: Attachment,
        as: "attachments",
      },
    ],
    order: [["created_at", "ASC"]],
  });
};
