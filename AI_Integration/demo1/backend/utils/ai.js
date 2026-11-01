const genai = require("@google/genai");

const ai = new genai.GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

async function main(prompt) {
  console.log("Generating AI content...");
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
  });
  return response.text;
}

module.exports = {
  ai,
  main,
};
