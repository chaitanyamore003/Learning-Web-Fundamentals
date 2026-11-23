import * as userService from "../services/user.service.js";

// GET /api/users/discover
export const discoverUsers = async (req, res) => {
  // req.user.id comes from our requireAuth middleware
  const users = await userService.getDiscoverableUsers(req.user.id);

  res.status(200).json({
    success: true,
    users,
  });
};

export const updateProfile = async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  res.status(200).json({ success: true, user });
};

export const updatePassword = async (req, res) => {
  await userService.updatePassword(req.user.id, req.body);
  res.status(200).json({ success: true, message: "Password updated" });
};

export const updateAvatar = async (req, res) => {
  const user = await userService.updateAvatar(req.user.id, req.body);
  res.status(200).json({ success: true, user });
};

export const getUserProfile = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({ success: true, user });
};

export const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers(req.user.id);
  res.status(200).json({ success: true, users });
};
