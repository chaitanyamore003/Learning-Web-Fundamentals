import * as messageService from "../services/message.service.js";

export const send = async (req, res) => {
  const { conversationId, content } = req.body;

  // Save message
  const message = await messageService.sendMessage(
    req.user.id,
    conversationId,
    content,
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
