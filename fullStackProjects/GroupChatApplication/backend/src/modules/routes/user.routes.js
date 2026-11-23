import { Router } from "express";
import { asyncHandler } from "../../utils/errors.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  discoverUsers,
  updateProfile,
  updatePassword,
  updateAvatar,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.use(requireAuth); // All routes below require auth

router.get("/discover", asyncHandler(discoverUsers));
router.put("/profile", asyncHandler(updateProfile));
router.put("/password", asyncHandler(updatePassword));
router.put("/avatar", asyncHandler(updateAvatar));
router.get("/:id", asyncHandler(getUserProfile));

export default router;
