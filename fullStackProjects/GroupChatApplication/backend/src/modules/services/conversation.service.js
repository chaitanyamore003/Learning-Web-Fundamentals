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

export const getUserConversations = async (userId) => {
  // 1. Find the user and include their conversations
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Conversation,
        as: "conversations",
        include: [
          {
            model: User,
            as: "members", // Assuming you set this alias in models/index.js
            attributes: ["id", "name", "profile_picture"],
          },
          {
            model: Message,
            as: "messages",
            limit: 1,
            order: [["createdAt", "DESC"]], // Get the latest message for the preview
          },
        ],
      },
    ],
  });

  if (!user) throw new AppError("User not found", 404);

  // 2. Format the data for the frontend ChatListPanel
  return user.conversations
    .map((conv) => {
      // If it's a DIRECT chat, the name/avatar should be the OTHER person
      let displayName = conv.name;
      let displayAvatar = conv.group_image;

      if (conv.type === "DIRECT") {
        const otherUser = conv.members.find((m) => m.id !== Number(userId));
        displayName = otherUser?.name || "Unknown User";
        displayAvatar = otherUser?.profile_picture || null;
      }

      const lastMsg =
        conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;

      return {
        id: conv.id,
        type: conv.type,
        name: displayName,
        avatar: displayAvatar,
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
    })
    .sort((a, b) => b.id - a.id); // Sort by newest conversations
};
