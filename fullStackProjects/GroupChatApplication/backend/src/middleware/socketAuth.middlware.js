import { verifyToken } from "../utils/jwt.js";

export const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = verifyToken(token);
    socket.user = decoded;

    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
};
