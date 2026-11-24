import { conversationHandler } from "./conversation.handler.js";

export const connectionHandler = (io, socket) => {
  // Join personal room
  socket.join(`user_${socket.user.id}`);

  // Register conversation events
  conversationHandler(io, socket);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`🔌 User disconnected: ${socket.user.id}`);
  });
};
