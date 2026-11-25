// src/modules/routes/ai.routes.js
import express from "express";
import { predict, getReplies } from "../controllers/ai.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js"; // Your auth middleware

const router = express.Router();

// Protect routes so only logged-in users can use your API quota
router.use(requireAuth);

router.post("/predict", predict);
router.post("/replies", getReplies);

export default router;
