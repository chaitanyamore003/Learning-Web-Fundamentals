import authService from "../services/user.service.js";
import { signToken } from "../../utils/jwt.js";

/**
 * POST /api/auth/signup
 * Body: { name, email, phone, password, profile_picture?, profile_picture_public_id? }
 */
const signup = async (req, res) => {
  const user = await authService.signup({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    profile_picture: req.body.profile_picture,
    profile_picture_public_id: req.body.profile_picture_public_id,
  });

  const token = signToken({ id: user.id });
  res.status(201).json({ success: true, user, token });
};

/**
 * POST /api/auth/login
 * Body: { identifier, password }
 * (identifier = email OR phone)
 */
const login = async (req, res) => {
  const user = await authService.login({
    identifier: req.body.identifier,
    password: req.body.password,
  });

  const token = signToken({ id: user.id });
  res.status(200).json({ success: true, user, token });
};

/**
 * GET /api/auth/me
 * Requires auth middleware → sets req.user.id
 */
const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res.status(200).json({ success: true, user });
};

export default {
  signup,
  login,
  getMe,
};
