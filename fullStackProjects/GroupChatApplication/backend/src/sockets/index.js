import { verifyToken } from "../utils/jwt.js";

export const setupSockets = (io) => {
  // 1. Authenticate socket using JWT
  io.use((socket, next) => {
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
  });

  // 2. Handle socket connections
  io.on("connection", (socket) => {
    // Join personal room
    socket.join(`user_${socket.user.id}`);

    // Join conversation room
    socket.on("join_conversation", (conversationId) => {
      if (!conversationId) return;

      socket.join(`conversation_${conversationId}`);
    });

    // Leave conversation room
    socket.on("leave_conversation", (conversationId) => {
      if (!conversationId) return;

      socket.leave(`conversation_${conversationId}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`🔌 User disconnected: ${socket.user.id}`);
    });
  });

  // 3. Expose function to broadcast messages
  const emitToConversation = (conversationId, message) => {
    io.to(`conversation_${conversationId}`).emit("receive_message", message);
  };

  return { emitToConversation };
};
