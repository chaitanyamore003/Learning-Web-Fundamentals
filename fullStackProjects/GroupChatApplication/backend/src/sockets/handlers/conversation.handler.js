export const conversationHandler = (io, socket) => {
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
};
