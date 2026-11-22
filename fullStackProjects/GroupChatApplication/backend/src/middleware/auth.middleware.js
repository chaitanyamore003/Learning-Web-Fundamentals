// middleware/auth.js
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/errors.js";

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return next(new AppError("Not authenticated", 401));

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};
