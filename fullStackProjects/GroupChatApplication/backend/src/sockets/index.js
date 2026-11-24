import { socketAuthMiddleware } from "../middleware/socketAuth.middlware.js";
import { connectionHandler } from "./handlers/connection.handler.js";

export const setupSockets = (io) => {
  // Authenticate socket connections
  io.use(socketAuthMiddleware);

  // Handle socket connections
  io.on("connection", (socket) => {
    connectionHandler(io, socket);
  });

  // Broadcast messages to a conversation
  const emitToConversation = (conversationId, message) => {
    io.to(`conversation_${conversationId}`).emit("receive_message", message);
  };

  return { emitToConversation };
};
