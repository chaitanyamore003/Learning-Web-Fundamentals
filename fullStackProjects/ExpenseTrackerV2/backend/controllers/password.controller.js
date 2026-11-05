const { userModel, forgotPasswordModel } = require("../models/associations");
const sendEmail = require("../utils/emailService");
const {
  resetEmailHtml,
  resetConfirmationEmailHtml,
} = require("../utils/emailComponents"); // ✅ Added new import
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const db = require("../utils/database");

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

// backend/controllers/passwordController.js
const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await forgotPasswordModel.findOne({
      where: { id, isActive: true },
    });

    if (!request) {
      return res.status(400).send("Invalid or expired password reset link");
    }

    // ✅ REDIRECT to your React Frontend instead of serving an HTML file
    const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendURL}/reset-password/${id}`);
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).send("Error resetting password");
  }
};

const updatePassword = async (req, res) => {
  let transaction;

  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // 1. Validate the new password
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // 2. Check if the reset request is valid and active
    const request = await forgotPasswordModel.findOne({
      where: { id, isActive: true },
    });

    if (!request) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset link",
      });
    }

    // 3. Find the user associated with this request
    const user = await userModel.findByPk(request.UserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // 4. Start a transaction (optional but recommended for data safety)
    transaction = await db.transaction();

    // 5. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 6. Update the user's password
    user.password = hashedPassword;
    await user.save({ transaction });

    // 7. Invalidate the reset link so it can't be used again
    request.isActive = false;
    await request.save({ transaction });

    // 8. Commit the transaction
    await transaction.commit();

    // ✅ 9. Send Confirmation Email
    try {
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

      await sendEmail({
        to: user.email,
        subject: "ExpenseFlow — Password Reset Successful",
        textContent:
          `Your ExpenseFlow password has been successfully reset.\n\n` +
          `You can now log in to your account using your new password.\n\n` +
          `If you did not make this change, please contact support immediately.`,
        htmlContent: resetConfirmationEmailHtml(`${frontendURL}/login`),
      });
    } catch (emailError) {
      // We log the error, but we don't return an error to the user because the password WAS successfully updated.
      console.error(
        "Failed to send reset confirmation email:",
        emailError.message,
      );
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    // Rollback if something goes wrong
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    console.error("Update Password Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update password",
    });
  }
};

module.exports = { forgotPassword, resetPassword, updatePassword };
