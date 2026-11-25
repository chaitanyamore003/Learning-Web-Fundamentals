// src/modules/services/ai.service.js
import { GoogleGenAI } from "@google/genai";

// Initialize the SDK. It automatically picks up GEMINI_API_KEY from .env
const ai = new GoogleGenAI({});
const model = "gemini-3.5-flash-lite"; // Fast and cheap, perfect for real-time chat

export const getPredictiveText = async (textSoFar) => {
  try {
    const prompt = `
      You are an autocomplete engine for a chat application.
      The user has typed: "${textSoFar}"
      Predict the next 1 to 3 words to naturally complete the sentence.
      Rules:
      - ONLY return the exact words to append. Do not include the original text.
      - Do not include quotes, punctuation at the start, or explanations.
      - If no natural completion exists, return an empty string.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    // Clean up the response to ensure it's just the text
    const suggestion = response.text.trim().replace(/^["']|["']$/g, "");
    return suggestion;
  } catch (error) {
    console.error("Gemini Predictive Error:", error);
    return "";
  }
};

export const getSmartReplies = async (lastMessage, context = "") => {
  try {
    const prompt = `
      You are an AI assistant in a chat application. 
      The user just received this message: "${lastMessage}"
      Recent conversation context: "${context}"
      
      Generate exactly 3 short, distinct replies the user could send.
      Rules:
      - Keep them under 10 words each.
      - Match the tone (casual, professional, emojis).
      - Return ONLY a valid JSON array of strings. Example: ["Yes, I'll be there.", "Running late!", "Can we reschedule?"]
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    // Parse the JSON safely
    let replyText = response.text.trim();
    // Remove markdown formatting if Gemini adds it (e.g., ```json ... ```)
    replyText = replyText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const replies = JSON.parse(replyText);
    return Array.isArray(replies) ? replies.slice(0, 3) : [];
  } catch (error) {
    console.error("Gemini Smart Reply Error:", error);
    return [];
  }
};
