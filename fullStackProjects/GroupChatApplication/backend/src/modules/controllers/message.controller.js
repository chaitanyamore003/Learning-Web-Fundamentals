// src/modules/messages/message.controller.js
import * as messageService from "../services/message.service.js";

export const send = async (req, res) => {
  // 1. Extract message_type from the body
  const { conversationId, content, message_type = "TEXT" } = req.body;

  // Save message (pass the message_type)
  const message = await messageService.sendMessage(
    req.user.id,
    conversationId,
    content,
    message_type, // <-- Passed here
  );

  // Broadcast to conversation room
  const io = req.app.get("io");
  io.to(`conversation_${conversationId}`).emit("receive_message", message);

  res.status(201).json({ success: true, message });
};

export const getAll = async (req, res) => {
  const { conversationId } = req.params;

  const messages = await messageService.getMessages(
    req.user.id,
    conversationId,
  );

  res.status(200).json({ success: true, messages });
};
