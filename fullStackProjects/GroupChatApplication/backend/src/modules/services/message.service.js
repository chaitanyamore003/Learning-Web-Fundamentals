// src/modules/messages/message.service.js
import sequelize from "../../config/database.js";
import Message from "../../models/message.model.js";
import Attachment from "../../models/attachment.model.js";
import User from "../../models/user.model.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../../config/s3Client.js"; // Adjust path if needed

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

export const deleteMessage = async (userId, messageId) => {
  const transaction = await sequelize.transaction();

  try {
    // 1. Find the message
    const message = await Message.findByPk(messageId, {
      include: [{ model: Attachment, as: "attachments" }],
      transaction,
    });

    if (!message) throw new Error("Message not found");

    // 2. Check ownership (Only the sender can delete it)
    if (String(message.sender_id) !== String(userId)) {
      throw new Error("Unauthorized to delete this message");
    }

    // 3. If there's an attachment, delete it from S3 (to save costs)
    if (message.attachments && message.attachments.length > 0) {
      for (const att of message.attachments) {
        try {
          // Extract the key from the S3 URL
          const urlParts = att.file_url.split(".amazonaws.com/");
          if (urlParts.length === 2) {
            const key = urlParts[1];
            await s3Client.send(
              new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: key,
              }),
            );
          }
        } catch (s3Error) {
          console.error("Failed to delete file from S3:", s3Error);
          // We continue even if S3 fails, so the DB record is still deleted
        }
      }
    }

    // 4. Delete the message (ON DELETE CASCADE will automatically delete attachments in DB)
    await message.destroy({ transaction });
    await transaction.commit();

    // 5. Return the conversation ID so the controller can notify the room
    return {
      messageId: message.id,
      conversationId: message.conversation_id,
    };
  } catch (error) {
    await transaction.rollback();
    console.error("Error in deleteMessage service:", error);
    throw error;
  }
};
