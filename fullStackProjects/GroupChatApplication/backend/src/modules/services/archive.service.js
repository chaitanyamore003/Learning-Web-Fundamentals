// src/services/archive.service.js
import { Op } from "sequelize";
import sequelize from "../../config/database.js";
import Message from "../../models/message.model.js";
import Attachment from "../../models/attachment.model.js";
import ArchivedMessage from "../../models/archivedMessage.model.js";
import ArchivedAttachment from "../../models/archivedAttachment.model.js";

export const archiveOldMessages = async () => {
  console.log("🕒 Starting message archiving process...");

  // Calculate the cutoff date (24 hours ago)
  const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // We will process 1000 messages at a time to prevent memory crashes
  const BATCH_SIZE = 1000;
  let totalArchived = 0;
  let hasMoreMessages = true;

  while (hasMoreMessages) {
    // 1. Fetch a batch of old messages along with their attachments
    const oldMessages = await Message.findAll({
      where: {
        created_at: { [Op.lte]: cutoffDate },
      },
      include: [{ model: Attachment, as: "attachments" }],
      limit: BATCH_SIZE,
      // Order by ID ensures we process oldest first and don't get stuck
      order: [["id", "ASC"]],
    });

    // If no more messages are found, break the loop
    if (oldMessages.length === 0) {
      hasMoreMessages = false;
      break;
    }

    const messageIds = oldMessages.map((m) => m.id);

    // 2. Start a transaction for THIS batch
    const transaction = await sequelize.transaction();

    try {
      // 3. Prepare data for bulk insert into Archive tables
      const messagesToArchive = [];
      const attachmentsToArchive = [];

      oldMessages.forEach((msg) => {
        // Convert Sequelize model to plain JSON, preserving IDs and timestamps
        const msgData = msg.get({ plain: true });

        messagesToArchive.push(msgData);

        if (msgData.attachments && msgData.attachments.length > 0) {
          msgData.attachments.forEach((att) => {
            attachmentsToArchive.push(att);
          });
        }
      });

      // 4. Bulk insert into Archived Tables
      // We use validate: false to speed up insertion and ignore re-validation
      await ArchivedMessage.bulkCreate(messagesToArchive, {
        transaction,
        validate: false,
      });

      if (attachmentsToArchive.length > 0) {
        await ArchivedAttachment.bulkCreate(attachmentsToArchive, {
          transaction,
          validate: false,
        });
      }

      // 5. Delete from the live tables
      // Because of ON DELETE CASCADE, deleting the Message might auto-delete the Attachments.
      // However, to be absolutely safe, we explicitly delete attachments first.
      await Attachment.destroy({
        where: { message_id: { [Op.in]: messageIds } },
        transaction,
      });

      await Message.destroy({
        where: { id: { [Op.in]: messageIds } },
        transaction,
      });

      // 6. Commit the transaction
      await transaction.commit();

      totalArchived += oldMessages.length;
      console.log(
        `📦 Archived batch of ${oldMessages.length} messages. Total so far: ${totalArchived}`,
      );
    } catch (error) {
      // If ANYTHING fails, rollback this batch so no data is lost
      await transaction.rollback();
      console.error("❌ Error archiving batch. Rolling back.", error);
      throw error; // Stop the process
    }
  }

  console.log(
    `✅ Archiving complete! Total messages archived: ${totalArchived}`,
  );
};
