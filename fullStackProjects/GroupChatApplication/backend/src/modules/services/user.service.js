import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { User } from "../../models/index.js";
import { AppError } from "../../utils/errors.js";
import jwt from "jsonwebtoken";

const INVALID_CREDENTIALS = "Invalid credentials.";

/**
 * Verify a user by email OR phone + password.
 * Returns the user without password_hash. Throws on failure.
 */
const login = async ({ identifier, password }) => {
  if (!identifier || !password) {
    throw new AppError(INVALID_CREDENTIALS, 401);
  }

  const normalised = String(identifier).trim().toLowerCase();

  // SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1;
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: normalised }, { phone: normalised }],
    },
  });

  // Same error for "no user" and "wrong password" — prevents
  // attackers from discovering which emails/phones are registered.
  if (!user) throw new AppError(INVALID_CREDENTIALS, 401);

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new AppError(INVALID_CREDENTIALS, 401);

  await user.update({ last_seen: new Date() });

  const { password_hash, ...safeUser } = user.get({ plain: true });
  return safeUser;
};

/**
 * Signup the user by name, email, phone, password, and optional avatar.
 * Returns the user (without password_hash) after signup completes.
 */
const signup = async ({
  name,
  email,
  phone,
  password,
  profile_picture, // Cloudinary secure_url, optional
  profile_picture_public_id, // Cloudinary public_id, optional
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
    if (err instanceof UniqueConstraintError) {
      throw new AppError("Email or phone already registered", 409);
    }
    throw err;
  }

  const { password_hash, ...safeUser } = user.get({ plain: true });
  return safeUser;
};

/**
 * Return the current user's profile by id.
 * The controller gets the id from the verified JWT, never from the client.
 */
const getMe = async (userId) => {
  // SELECT * FROM users WHERE id = ? LIMIT 1;
  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const { password_hash, ...safeUser } = user.get({ plain: true });
  return safeUser;
};

export default {
  login,
  signup,
  getMe,
};
