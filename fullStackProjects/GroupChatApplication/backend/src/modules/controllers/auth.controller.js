import authService from "../services/auth.service.js";
import { signToken } from "../../utils/jwt.js";

/* ---------------- SIGNUP ---------------- */
// POST /api/auth/signup
// Body: { name, email, phone, password, profile_picture?, profile_picture_public_id? }
export const signup = async (req, res) => {
  const user = await authService.signup({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    profile_picture: req.body.profile_picture,
    profile_picture_public_id: req.body.profile_picture_public_id,
  });

  // Single-token auth — sign a JWT and send it back in the JSON.
  const token = signToken({ id: user.id });
  res.status(201).json({ success: true, user, token });
};

/* ---------------- LOGIN ---------------- */
// POST /api/auth/login
// Body: { identifier, password } — identifier = email OR phone
export const login = async (req, res) => {
  const user = await authService.login({
    identifier: req.body.identifier,
    password: req.body.password,
  });

  const token = signToken({ id: user.id });
  res.status(200).json({ success: true, user, token });
};

/* ---------------- GET ME ---------------- */
// GET /api/auth/me
// requireAuth middleware sets req.user.id from the verified JWT.
export const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res.status(200).json({ success: true, user });
};

/* ---------------- FORGOT PASSWORD ---------------- */
// POST /api/auth/forgot-password
// Body: { email }
// Always returns the same generic success — never reveals whether
// the email is registered.
export const forgotPassword = async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.status(200).json({
    success: true,
    message: "If that email exists, a reset link has been sent.",
  });
};

/* ---------------- RESET PASSWORD ---------------- */
// POST /api/auth/reset-password
// Body: { token, newPassword }
// The token comes from the URL in the email — one-time use.
export const resetPassword = async (req, res) => {
  await authService.resetPassword({
    token: req.body.token,
    newPassword: req.body.newPassword,
  });
  res.status(200).json({ success: true, message: "Password updated." });
};
