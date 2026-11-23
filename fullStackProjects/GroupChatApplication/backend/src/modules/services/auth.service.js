// src/modules/auth/auth.service.js
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Op, UniqueConstraintError } from "sequelize";
import { User } from "../../models/index.js";
import { AppError } from "../../utils/errors.js";
import sendEmail from "../../config/emailService.js";
import resetPasswordHTML from "../../utils/emailComponents.js";

const INVALID_CREDENTIALS = "Invalid credentials.";

/* ---------------- LOGIN ---------------- */
const login = async ({ identifier, password }) => {
  if (!identifier || !password) throw new AppError(INVALID_CREDENTIALS, 401);

  const normalised = String(identifier).trim().toLowerCase();

  // SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1;
  const user = await User.findOne({
    where: { [Op.or]: [{ email: normalised }, { phone: normalised }] },
  });

  // Same error for both failure paths — prevents user enumeration.
  if (!user) throw new AppError("user is not registered", 401);

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new AppError(INVALID_CREDENTIALS, 401);

  await user.update({ last_seen: new Date() });

  const { password_hash, ...safeUser } = user.get({ plain: true });
  return safeUser;
};

/* ---------------- SIGNUP ---------------- */
const signup = async ({
  name,
  email,
  phone,
  password,
  profile_picture,
  profile_picture_public_id,
}) => {
  if (!name || !email || !phone || !password) {
    throw new AppError("All fields are required", 400);
  }

  const normalisedEmail = String(email).trim().toLowerCase();
  const normalisedPhone = String(phone).trim();
  const passwordHash = await bcrypt.hash(password, 12);

  let user;
  try {
    user = await User.create({
      name: String(name).trim(),
      email: normalisedEmail,
      phone: normalisedPhone,
      password: passwordHash,
      profile_picture: profile_picture || null,
      profile_picture_public_id: profile_picture_public_id || null,
    });
  } catch (err) {
    // UNIQUE constraint is the only atomic duplicate check.
    if (err instanceof UniqueConstraintError) {
      throw new AppError("Email or phone already registered", 409);
    }
    throw err;
  }

  const { password_hash, ...safeUser } = user.get({ plain: true });
  return safeUser;
};

/* ---------------- GET ME ---------------- */
const getMe = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User not found", 404);

  const { password_hash, ...safeUser } = user.get({ plain: true });
  return safeUser;
};

/* ---------------- FORGOT PASSWORD ---------------- */
const forgotPassword = async (email) => {
  const normalised = String(email).trim().toLowerCase();
  const user = await User.findOne({ where: { email: normalised } });

  // Same success shape even if the email doesn't exist.
  if (!user) return { sent: true };

  const token = crypto.randomBytes(32).toString("hex");
  await user.update({ password_reset_token: token });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your Said Hi password",
    text: `Click this link to reset your password: ${resetUrl}`,
    html: resetPasswordHTML(resetUrl),
  });

  return { sent: true };
};

/* ---------------- RESET PASSWORD ---------------- */
const resetPassword = async ({ token, newPassword }) => {
  if (!token || !newPassword) {
    throw new AppError("Token and new password are required", 400);
  }
  if (newPassword.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }

  const user = await User.findOne({ where: { password_reset_token: token } });
  if (!user) throw new AppError("Invalid reset token", 400);

  const passwordHash = await bcrypt.hash(newPassword, 12);

  // Clear the token in the same update — single use.
  await user.update({
    password: passwordHash,
    password_reset_token: null,
  });

  return { ok: true };
};

export default {
  login,
  signup,
  getMe,
  forgotPassword,
  resetPassword,
};
