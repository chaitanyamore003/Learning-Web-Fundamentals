// src/modules/messages/message.routes.js
import { Router } from "express";
import { asyncHandler } from "../../utils/errors.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  send,
  getAll,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = Router();
router.use(requireAuth);

router.post("/", asyncHandler(send));
router.get("/:conversationId", asyncHandler(getAll));
router.delete("/:messageId", deleteMessage);

export default router;
