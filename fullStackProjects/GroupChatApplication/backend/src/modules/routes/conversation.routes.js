import { Router } from "express";
import { asyncHandler } from "../../utils/errors.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  createDirectChat,
  getConversations,
  createGroup,
  updateGroup,
  deleteChat,
  addMember,
  removeMember,
} from "../controllers/conversation.controller.js";

const router = Router();

// All conversation routes require login
router.use(requireAuth);

router.post("/direct", asyncHandler(createDirectChat));

router.get("/", asyncHandler(getConversations));

router.post("/group", asyncHandler(createGroup));

router.put("/:id", asyncHandler(updateGroup));

router.delete("/:id", asyncHandler(deleteChat));

router.post("/:id/members", asyncHandler(addMember));

router.delete("/:id/members/:userId", asyncHandler(removeMember));
export default router;
