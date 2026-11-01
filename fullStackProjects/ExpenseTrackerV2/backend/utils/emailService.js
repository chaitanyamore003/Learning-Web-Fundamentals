const axios = require("axios");

const sendEmail = async ({ to, subject, textContent, htmlContent }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "ExpenseFlow",
          email: "chaitanyamore003@gmail.com",
        },
        to: [{ email: to }],
        subject,
        textContent,
        htmlContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_EMAIL_API_KEY,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Brevo Email Error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = sendEmail;
