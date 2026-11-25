// src/modules/messages/message.controller.js
import * as messageService from "../services/message.service.js";

export const send = async (req, res) => {
  try {
    // 1. Extract attachment along with the rest of the payload
    const {
      conversationId,
      content,
      message_type = "TEXT",
      attachment,
    } = req.body;

    // 2. Call the service (passing attachmentData)
    const message = await messageService.sendMessage(
      req.user.id,
      conversationId,
      content,
      message_type,
      attachment, // <-- Passed here
    );

    // 3. Broadcast to conversation room
    const io = req.app.get("io");
    io.to(`conversation_${conversationId}`).emit("receive_message", message);

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

export const getAll = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await messageService.getMessages(
      req.user.id,
      conversationId,
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch messages" });
  }
};
