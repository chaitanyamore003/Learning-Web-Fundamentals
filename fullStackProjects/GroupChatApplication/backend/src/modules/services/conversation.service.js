// src/modules/conversations/conversation.service.js
import { Op } from "sequelize";
import {
  Conversation,
  ConversationMember,
  User,
  Message,
} from "../../models/index.js";
import { AppError } from "../../utils/errors.js";

export const startDirectConversation = async (currentUserId, targetUserId) => {
  if (currentUserId.toString() === targetUserId.toString()) {
    throw new AppError("You cannot start a conversation with yourself", 400);
  }

  // 1. Check if the target user actually exists
  const targetUser = await User.findByPk(targetUserId, {
    attributes: ["id", "name", "email", "profile_picture"],
  });
  if (!targetUser) throw new AppError("User not found", 404);

  // 2. Generate the direct_key (e.g., "1_2")
  const ids = [currentUserId, targetUserId].map(Number).sort((a, b) => a - b);
  const directKey = `${ids[0]}_${ids[1]}`;

  // 3. Check if this conversation already exists
  // SQL: SELECT * FROM conversations WHERE direct_key = ? LIMIT 1;
  let conversation = await Conversation.findOne({
    where: { direct_key: directKey },
  });

  if (conversation) {
    // Return existing conversation, but let's also attach the target user's info
    // so the frontend can display their name/avatar in the chat header.
    return { conversation, targetUser };
  }

  // 4. If it doesn't exist, create it
  conversation = await Conversation.create({
    type: "DIRECT",
    created_by: currentUserId,
    direct_key: directKey,
  });

  // 5. Add both users to the conversation_members table
  // SQL: INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?), (?, ?);
  await ConversationMember.bulkCreate([
    {
      conversation_id: conversation.id,
      user_id: currentUserId,
      role: "MEMBER",
    },
    { conversation_id: conversation.id, user_id: targetUserId, role: "MEMBER" },
  ]);

  return { conversation, targetUser };
};

export const getUserConversations = async (userId, type = null) => {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Conversation,
        as: "conversations",
        include: [
          {
            model: User,
            as: "members",
            attributes: ["id", "name", "profile_picture"],
            through: { attributes: ["role"] }, // <-- Include the role from the pivot table
          },
          {
            model: User,
            as: "creator",
            attributes: ["id", "name"],
          },
          {
            model: Message,
            as: "messages",
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
        ],
      },
    ],
  });

  if (!user) throw new AppError("User not found", 404);

  let formattedConversations = user.conversations.map((conv) => {
    let displayName = conv.name;
    let displayAvatar = conv.group_image;

    if (conv.type === "DIRECT") {
      const otherUser = conv.members.find((m) => m.id !== Number(userId));
      displayName = otherUser?.name || "Unknown User";
      displayAvatar = otherUser?.profile_picture || null;
    }

    const lastMsg =
      conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;

    // Find my role in this conversation
    const myMemberInfo = conv.members.find((m) => m.id === Number(userId));
    const myRole = myMemberInfo?.ConversationMember?.role || "MEMBER";

    return {
      id: conv.id,
      type: conv.type,
      name: displayName,
      avatar: displayAvatar,
      creatorName: conv.creator?.name || "Unknown",
      myRole: myRole, // <-- Pass my role to the frontend
      members: conv.members.map((m) => ({
        id: m.id,
        name: m.name,
        avatar: m.profile_picture,
        role: m.ConversationMember?.role || "MEMBER",
      })), // <-- Pass the full members list
      lastMessage: lastMsg ? lastMsg.content : "No messages yet",
      time: lastMsg
        ? new Date(lastMsg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      targetUserId:
        conv.type === "DIRECT"
          ? conv.members.find((m) => m.id !== Number(userId))?.id
          : null,
    };
  });

  if (type) {
    formattedConversations = formattedConversations.filter(
      (conv) => conv.type === type,
    );
  }

  return formattedConversations.sort((a, b) => b.id - a.id);
};

export const createGroupConversation = async (
  creatorId,
  name,
  memberIds,
  groupImage = null,
  groupImagePublicId = null,
) => {
  if (!name || name.trim() === "")
    throw new AppError("Group name is required", 400);
  if (!memberIds || memberIds.length === 0)
    throw new AppError("Select at least one member", 400);

  // Create the conversation with the image data
  const conversation = await Conversation.create({
    type: "GROUP",
    name: name.trim(),
    created_by: creatorId,
    group_image: groupImage,
    // If you added a group_image_public_id column to your model, uncomment the next line:
    // group_image_public_id: groupImagePublicId
  });

  // Add the creator as ADMIN, and everyone else as MEMBER
  const membersToAdd = [
    { conversation_id: conversation.id, user_id: creatorId, role: "ADMIN" },
    ...memberIds.map((id) => ({
      conversation_id: conversation.id,
      user_id: id,
      role: "MEMBER",
    })),
  ];

  await ConversationMember.bulkCreate(membersToAdd);

  return conversation;
};

export const updateGroupConversation = async (
  userId,
  conversationId,
  { name, group_image, group_image_public_id },
) => {
  const conversation = await Conversation.findByPk(conversationId);
  if (!conversation) throw new AppError("Conversation not found", 404);
  if (conversation.type !== "GROUP")
    throw new AppError("Not a group chat", 400);

  // Check if the user is an ADMIN in this group
  const member = await ConversationMember.findOne({
    where: { conversation_id: conversationId, user_id: userId },
  });
  if (!member || member.role !== "ADMIN") {
    throw new AppError("Only group admins can edit group details", 403);
  }

  // If there's a new image, delete the old one from Cloudinary
  if (group_image && conversation.group_image) {
    // If you saved the public_id in the DB, use it here.
    // Otherwise, we'll do a best-effort extraction from the URL.
    // Assuming you might not have saved the public_id yet, let's skip deletion
    // if it's missing, or use a basic string manipulation if you have it.
  }

  // Update fields
  await conversation.update({
    name: name ? name.trim() : conversation.name,
    group_image: group_image || conversation.group_image,
    // group_image_public_id: group_image_public_id || conversation.group_image_public_id
  });

  return conversation;
};

export const deleteConversation = async (userId, conversationId) => {
  const conversation = await Conversation.findByPk(conversationId);
  if (!conversation) throw new AppError("Conversation not found", 404);

  // Check user's role
  const member = await ConversationMember.findOne({
    where: { conversation_id: conversationId, user_id: userId },
  });
  if (!member) throw new AppError("You are not a member of this chat", 403);

  // If it's a group, only ADMIN can delete it
  if (conversation.type === "GROUP" && member.role !== "ADMIN") {
    throw new AppError("Only group admins can delete the group", 403);
  }

  // If group has an image, delete it from Cloudinary
  if (conversation.type === "GROUP" && conversation.group_image) {
    try {
      // Extract public_id from URL if you didn't store it directly
      // Example URL: https://res.cloudinary.com/cloud/image/upload/v123/said-hi/groups/abc123.jpg
      const urlParts = conversation.group_image.split("/");
      const filename = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const publicId = `${folder}/${filename.split(".")[0]}`;

      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Failed to delete group image from Cloudinary", err);
    }
  }

  // Delete the conversation.
  // (Because of onDelete: CASCADE in models, this will automatically delete
  // all messages, conversation_members, and receipts associated with it)
  await conversation.destroy();

  return { success: true };
};

// --- NEW: ADD MEMBER ---
export const addGroupMember = async (adminId, conversationId, newUserId) => {
  const adminMember = await ConversationMember.findOne({
    where: { conversation_id: conversationId, user_id: adminId },
  });
  if (!adminMember || adminMember.role !== "ADMIN") {
    throw new AppError("Only admins can add members", 403);
  }

  const existing = await ConversationMember.findOne({
    where: { conversation_id: conversationId, user_id: newUserId },
  });
  if (existing) throw new AppError("User is already in the group", 400);

  await ConversationMember.create({
    conversation_id: conversationId,
    user_id: newUserId,
    role: "MEMBER",
  });

  return { success: true };
};

// --- NEW: REMOVE MEMBER ---
export const removeGroupMember = async (
  adminId,
  conversationId,
  targetUserId,
) => {
  const adminMember = await ConversationMember.findOne({
    where: { conversation_id: conversationId, user_id: adminId },
  });

  // Allow if user is Admin OR if they are trying to remove themselves (Leave group)
  if (adminMember.role !== "ADMIN" && adminId !== Number(targetUserId)) {
    throw new AppError("Only admins can remove members", 403);
  }

  await ConversationMember.destroy({
    where: { conversation_id: conversationId, user_id: targetUserId },
  });

  return { success: true };
};
