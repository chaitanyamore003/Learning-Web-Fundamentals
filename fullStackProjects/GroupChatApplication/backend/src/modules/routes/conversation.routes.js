import { Router } from "express";
import { asyncHandler } from "../../utils/errors.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  createDirectChat,
  getConversations,
} from "../controllers/conversation.controller.js";

const router = Router();

// All conversation routes require login
router.use(requireAuth);

router.post("/direct", asyncHandler(createDirectChat));

router.get("/", asyncHandler(getConversations)); // Add this

export default router;
