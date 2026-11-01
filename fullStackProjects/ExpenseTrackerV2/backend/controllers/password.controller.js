const { userModel, forgotPasswordModel } = require("../models/associations");
const sendEmail = require("../utils/emailService");
const { resetEmailHtml } = require("../utils/emailComponents");
const crypto = require("crypto");

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

    // Generate unique UUID
    const requestId = crypto.randomUUID();

    // Save reset request in database
    await forgotPasswordModel.create({
      id: requestId,
      UserId: user.id,
      isActive: true,
    });

    // Dynamic reset URL
    const resetURL = `https://rally-tameness-mardi.ngrok-free.dev/password/resetpassword/${requestId}`;

    // Send email through Brevo
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
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const path = require("path");

const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Reset Password Request Received:", id);

    // Find reset request
    const request = await forgotPasswordModel.findOne({
      where: {
        id,
        isActive: true,
      },
    });

    // Check whether request exists
    if (!request) {
      return res.status(400).send("Invalid or expired password reset link");
    }

    // Serve reset password HTML page
    return res.sendFile(
      path.join(__dirname, "../../frontend/views/reset-password.html"),
    );
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).send("Error resetting password");
  }
};

module.exports = { forgotPassword, resetPassword };
