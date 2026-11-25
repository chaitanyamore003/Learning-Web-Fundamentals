// src/modules/controllers/ai.controller.js
import * as aiService from "../services/ai.service.js";

export const predict = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.length < 3) return res.json({ suggestion: "" });

    const suggestion = await aiService.getPredictiveText(text);
    res.status(200).json({ suggestion });
  } catch (error) {
    res.status(500).json({ error: "AI Prediction failed" });
  }
};

export const getReplies = async (req, res) => {
  try {
    const { lastMessage, context } = req.body;
    if (!lastMessage) return res.json({ replies: [] });

    const replies = await aiService.getSmartReplies(lastMessage, context);
    res.status(200).json({ replies });
  } catch (error) {
    res.status(500).json({ error: "AI Reply failed" });
  }
};
