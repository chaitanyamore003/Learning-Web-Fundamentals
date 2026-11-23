// src/modules/auth/auth.routes.js
import { Router } from "express";
import { asyncHandler, validate } from "../../utils/errors.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../auth/auth.validator.js";
import {
  signup,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = Router();

// Public: create account. validate() runs Zod, asyncHandler forwards throws.
router.post("/signup", validate(signupSchema), asyncHandler(signup));

// Public: email OR phone + password → returns user + JWT.
router.post("/login", validate(loginSchema), asyncHandler(login));

// Protected: requireAuth reads the Bearer token, sets req.user.id.
router.get("/me", requireAuth, asyncHandler(getMe));

// Public: generate reset token + email the reset link.
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  asyncHandler(forgotPassword),
);

// Public: token + newPassword → updates password, clears token (single use).
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  asyncHandler(resetPassword),
);

export default router;
