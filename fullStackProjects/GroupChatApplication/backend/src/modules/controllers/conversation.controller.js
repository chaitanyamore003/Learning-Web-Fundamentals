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
  // Read the type from query params (e.g., /api/conversations?type=GROUP)
  const type = req.query.type || null;
  const conversations = await conversationService.getUserConversations(
    req.user.id,
    type,
  );
  res.status(200).json({ success: true, conversations });
};

export const createGroup = async (req, res) => {
  // 1. Destructure ALL fields from the request body
  const { name, memberIds, group_image, group_image_public_id } = req.body;

  // 2. Pass them to the service
  const conversation = await conversationService.createGroupConversation(
    req.user.id,
    name,
    memberIds,
    group_image,
    group_image_public_id,
  );

  res.status(201).json({ success: true, conversation });
};

export const updateGroup = async (req, res) => {
  const updatedConversation = await conversationService.updateGroupConversation(
    req.user.id,
    req.params.id,
    req.body,
  );
  res.status(200).json({ success: true, conversation: updatedConversation });
};

export const deleteChat = async (req, res) => {
  await conversationService.deleteConversation(req.user.id, req.params.id);
  res.status(200).json({ success: true, message: "Conversation deleted" });
};

export const addMember = async (req, res) => {
  await conversationService.addGroupMember(
    req.user.id,
    req.params.id,
    req.body.userId,
  );
  res.status(200).json({ success: true, message: "Member added" });
};

export const removeMember = async (req, res) => {
  await conversationService.removeGroupMember(
    req.user.id,
    req.params.id,
    req.params.userId,
  );
  res.status(200).json({ success: true, message: "Member removed" });
};
