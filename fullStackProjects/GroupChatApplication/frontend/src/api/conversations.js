// src/api/conversations.js
import api from "../lib/axios";

export const startDirectConversation = (targetUserId) =>
  api.post("/conversations/direct", { targetUserId }).then((res) => res.data);
