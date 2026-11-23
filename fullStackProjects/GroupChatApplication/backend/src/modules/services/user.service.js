import { Op } from "sequelize";
import { User, Conversation, ConversationMember } from "../../models/index.js";
import bcrypt from "bcrypt";
import cloudinary from "../../config/cloudinary.js";
import { AppError } from "../../utils/errors.js";

/**
 * Fetch users the current user is NOT connected to.
 * Excludes:
 * 1. The current user themselves.
 * 2. Anyone the current user already has a DIRECT conversation with.
 */
export const getDiscoverableUsers = async (currentUserId) => {
  // 1. Find all DIRECT conversation IDs that belong to the current user
  const myDirectConvos = await ConversationMember.findAll({
    where: { user_id: currentUserId },
    include: [
      {
        model: Conversation,
        where: { type: "DIRECT" },
        attributes: [], // We don't need the conversation data, just the join
      },
    ],
    attributes: ["conversation_id"],
  });

  const myConvoIds = myDirectConvos.map((c) => c.conversation_id);

  // 2. Find all user IDs that are in those conversations (these are my connections)
  let connectedUserIds = [];
  if (myConvoIds.length > 0) {
    const connectedMembers = await ConversationMember.findAll({
      where: { conversation_id: { [Op.in]: myConvoIds } },
      attributes: ["user_id"],
    });
    connectedUserIds = connectedMembers.map((m) => m.user_id);
  }

  // 3. Fetch all users EXCEPT me and EXCEPT those connected IDs
  const users = await User.findAll({
    where: {
      id: {
        [Op.and]: [
          { [Op.ne]: currentUserId }, // Not me
          { [Op.notIn]: connectedUserIds }, // Not connected
        ],
      },
    },
    attributes: [
      "id",
      "name",
      "email",
      "phone",
      "profile_picture",
      "last_seen",
    ],
    limit: 50, // Good practice to limit pagination for discovery
  });

  return users;
};

export const updateProfile = async (userId, { name, phone }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User not found", 404);

  // If phone is changing, check if it's already taken
  if (phone && phone !== user.phone) {
    const existing = await User.findOne({ where: { phone } });
    if (existing) throw new AppError("Phone number already in use", 409);
  }

  await user.update({ name, phone });
  const { password_hash, ...safeUser } = user.get({ plain: true });
  return safeUser;
};

export const updatePassword = async (
  userId,
  { currentPassword, newPassword },
) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User not found", 404);

  const isValid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isValid) throw new AppError("Incorrect current password", 401);

  const newHash = await bcrypt.hash(newPassword, 12);
  await user.update({ password_hash: newHash });

  return { success: true };
};

export const updateAvatar = async (userId, { secure_url, public_id }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User not found", 404);

  // If they have an old uploaded avatar, delete it from Cloudinary
  if (user.profile_picture_public_id) {
    try {
      await cloudinary.uploader.destroy(user.profile_picture_public_id);
    } catch (err) {
      console.error("Failed to delete old avatar from Cloudinary", err);
      // We log it but don't block the update if deletion fails
    }
  }

  await user.update({
    profile_picture: secure_url,
    profile_picture_public_id: public_id || null,
  });

  const { password_hash, ...safeUser } = user.get({ plain: true });
  return safeUser;
};

export const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    // Only return public fields (never password_hash or reset tokens)
    attributes: [
      "id",
      "name",
      "email",
      "phone",
      "profile_picture",
      "last_seen",
    ],
  });
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const getAllUsers = async (currentUserId) => {
  // Fetch everyone EXCEPT the logged-in user
  const users = await User.findAll({
    where: { id: { [Op.ne]: currentUserId } },
    attributes: ["id", "name", "email", "profile_picture"],
    limit: 100, // Reasonable limit for the modal
  });
  return users;
};
