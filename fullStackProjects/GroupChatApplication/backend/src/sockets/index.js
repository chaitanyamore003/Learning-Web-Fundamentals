// src/sockets/index.js
import { socketAuthMiddleware } from "../middleware/socketAuth.middlware.js";
import { connectionHandler } from "./handlers/connection.handler.js";

export const setupSockets = (io) => {
  io.use(socketAuthMiddleware);

  // Map to track online users: { userId: Set(socketId1, socketId2) }
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    // Assuming your auth middleware sets socket.user
    const userId = String(socket.user?.id || socket.user?._id);

    if (userId) {
      // Add user to online map
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);

      // Broadcast to everyone else that this user is online
      socket.broadcast.emit("user_status_change", { userId, isOnline: true });

      // Send the list of currently online users to the newly connected user
      socket.emit("initial_online_users", Array.from(onlineUsers.keys()));
    }

    // Standard handlers (join rooms, typing, etc.)
    connectionHandler(io, socket);

    // 👇 THIS IS THE MISSING PIECE 👇
    // Handle request to check a specific user's status
    socket.on("check_user_status", ({ userId: targetId }, callback) => {
      if (callback) {
        // Returns true if the target user is in the online map
        callback(onlineUsers.has(String(targetId)));
      }
    });

    // Handle typing indicators
    socket.on("typing", ({ conversationId, userName }) => {
      socket
        .to(`conversation_${conversationId}`)
        .emit("user_typing", { conversationId, userName });
    });
    socket.on("stop_typing", ({ conversationId }) => {
      socket
        .to(`conversation_${conversationId}`)
        .emit("user_stopped_typing", { conversationId });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      if (userId && onlineUsers.has(userId)) {
        const userSockets = onlineUsers.get(userId);
        userSockets.delete(socket.id);

        // Only mark as offline if they have no other active tabs
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          socket.broadcast.emit("user_status_change", {
            userId,
            isOnline: false,
          });
        }
      }
    });
  });

  const emitToConversation = (conversationId, message) => {
    io.to(`conversation_${conversationId}`).emit("receive_message", message);
  };

  return { emitToConversation };
};
