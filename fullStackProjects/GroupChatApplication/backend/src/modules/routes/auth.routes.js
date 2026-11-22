// auth.routes.js
import { Router } from "express";
import { asyncHandler, validate } from "../../utils/errors.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { signupSchema, loginSchema } from "../auth/auth.validator.js";
import authController from "../controllers/user.controller.js";

const router = Router();

router.post(
  "/signup",
  validate(signupSchema),
  asyncHandler(authController.signup),
);
router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(authController.login),
);
router.get("/me", requireAuth, asyncHandler(authController.getMe));

export default router;
