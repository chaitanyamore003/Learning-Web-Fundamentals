const { userModel } = require("../models/associations");
const sendEmail = require("../utils/emailService");
const { resetEmailHtml } = require("../utils/emailComponents");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetURL =
      "https://rally-tameness-mardi.ngrok-free.dev/reset-password.html";

    await sendEmail({
      to: email,
      subject: "ExpenseFlow — Reset your password",
      textContent:
        `Reset your ExpenseFlow password\n\n` +
        `We received a request to reset the password for your ExpenseFlow account.\n\n` +
        `Open this link to choose a new password:\n${resetURL}\n\n` +
        `If you didn't request this, you can safely ignore this email — your password won't change.`,
      htmlContent: resetEmailHtml(resetURL),
    });

    return res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
  } catch (error) {
    console.error("Update Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "error updating password",
    });
  }
};

module.exports = { forgotPassword, updatePassword };
