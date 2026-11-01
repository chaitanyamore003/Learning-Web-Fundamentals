const { main } = require("../utils/ai");

const askQuestion = async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await main(prompt);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: "Error generating AI response" });
  }
};

module.exports = {
  askQuestion,
};
