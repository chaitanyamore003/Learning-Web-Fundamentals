import * as conversationService from "../services/conversation.service.js";

// POST /api/conversations/direct
// Body: { targetUserId: 5 }
export const createDirectChat = async (req, res) => {
  const { targetUserId } = req.body;

  if (!targetUserId) {
    throw new AppError("targetUserId is required", 400);
  }

  const data = await conversationService.startDirectConversation(
    req.user.id,
    targetUserId,
  );

  res.status(200).json({
    success: true,
    conversation: data.conversation,
    targetUser: data.targetUser,
  });
};

export const getConversations = async (req, res) => {
  const conversations = await conversationService.getUserConversations(
    req.user.id,
  );
  res.status(200).json({ success: true, conversations });
};
