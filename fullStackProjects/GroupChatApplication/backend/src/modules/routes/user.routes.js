// src/modules/users/user.routes.js
import { Router } from "express";
import { asyncHandler } from "../../utils/errors.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  discoverUsers,
  getAllUsers,
  updateProfile,
  updatePassword,
  updateAvatar,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = Router();

// All user routes require authentication
router.use(requireAuth);

// ⚠️ IMPORTANT: Specific string routes MUST go before parameterized routes (/:id)
router.get("/discover", asyncHandler(discoverUsers));
router.get("/all", asyncHandler(getAllUsers));

// Update routes
router.put("/profile", asyncHandler(updateProfile));
router.put("/password", asyncHandler(updatePassword));
router.put("/avatar", asyncHandler(updateAvatar));

// Parameterized route MUST be last
router.get("/:id", asyncHandler(getUserProfile));

export default router;
