const { orderModel, userModel } = require("../models/associations");
const cashfree = require("../utils/cashfree");
const { randomUUID } = require("crypto");
const db = require("../utils/database");
const sendEmail = require("../utils/emailService"); // ✅ Added import
const { premiumConfirmationEmailHtml } = require("../utils/emailComponents"); // ✅ Added import

const MEMBERSHIP_AMOUNT = 49;

// Mock payments are permitted only in development to save API calls during testing
const isMockPayment =
  process.env.NODE_ENV === "development" &&
  process.env.MOCK_PAYMENTS === "true";

// ✅ Helper function to send the Premium confirmation email
const sendPremiumConfirmationEmail = async (userId) => {
  try {
    const user = await userModel.findByPk(userId);
    if (!user) return;

    const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
    const dashboardURL = `${frontendURL}/user/dashboard`;

    await sendEmail({
      to: user.email,
      subject: "Welcome to ExpenseFlow Premium! 👑",
      textContent:
        `Hi ${user.name},\n\n` +
        `Thank you for upgrading to ExpenseFlow Premium!\n\n` +
        `Your account has been successfully activated. You can now access unlimited expense history, detailed reports, and the live leaderboard.\n\n` +
        `Go to your dashboard: ${dashboardURL}`,
      htmlContent: premiumConfirmationEmailHtml(user.name, dashboardURL),
    });
  } catch (error) {
    // We catch the error here so that a failed email doesn't break the payment success response
    console.error("Failed to send premium confirmation email:", error.message);
  }
};

// ==========================================
// CREATE PAYMENT ORDER
// ==========================================
const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userModel.findByPk(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Cashfree requires a phone number for real payments
    if (!user.phone && !isMockPayment) {
      return res.status(400).json({
        success: false,
        message: "Please add your phone number before purchasing premium",
      });
    }

    if (user.isPremium) {
      return res.status(400).json({
        success: false,
        message: "You are already a premium member",
      });
    }

    // Generate a unique order ID
    const orderId = `PREMIUM_${randomUUID()}`;

    // 1. Create the order in our local database FIRST (status: PENDING)
    const order = await orderModel.create({
      orderId,
      amount: MEMBERSHIP_AMOUNT,
      status: "PENDING",
      UserId: userId,
    });

    // ==========================================
    // DEVELOPMENT MOCK PAYMENT
    // ==========================================
    if (isMockPayment) {
      console.log("Mock payment order created:", orderId);
      return res.status(201).json({
        success: true,
        mockPayment: true,
        message: "Mock payment order created successfully",
        orderId,
      });
    }

    // ==========================================
    // REAL CASHFREE PAYMENT
    // ==========================================
    const request = {
      order_id: orderId,
      order_amount: MEMBERSHIP_AMOUNT,
      order_currency: "INR",
      customer_details: {
        customer_id: String(userId),
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone,
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/premium?order_id={order_id}`,
      },
    };

    // 2. Call Cashfree API to generate the payment session
    const response = await cashfree.PGCreateOrder(request);

    // 3. Save the Cashfree Order ID to our database for tracking
    await order.update({
      cfOrderId: response.data.cf_order_id,
    });

    // 4. Send the session ID to the frontend to open the modal
    return res.status(201).json({
      success: true,
      mockPayment: false,
      message: "Order created successfully",
      orderId,
      paymentSessionId: response.data.payment_session_id,
    });
  } catch (error) {
    console.error("Create Order Error:", error.response?.data || error);
    return res.status(500).json({
      success: false,
      message: "Unable to create payment order",
    });
  }
};

// ==========================================
// VERIFY PAYMENT
// ==========================================
const verifyPayment = async (req, res) => {
  let transaction;

  try {
    const userId = req.user.userId;
    const { orderId } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required" });
    }

    // Start DB transaction to ensure both Order and User are updated atomically
    transaction = await db.transaction();

    // Find the order and lock the row to prevent race conditions (double clicks/webhooks)
    const order = await orderModel.findOne({
      where: { orderId, UserId: userId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Idempotency: If already successful, do nothing and return success
    if (order.status === "SUCCESSFUL") {
      await transaction.rollback();
      return res.status(200).json({
        success: true,
        status: "SUCCESSFUL",
        message: "Transaction already successful",
      });
    }

    // ==========================================
    // DEVELOPMENT MOCK PAYMENT VERIFICATION
    // ==========================================
    if (isMockPayment) {
      await order.update(
        { status: "SUCCESSFUL", paymentId: `MOCK_PAYMENT_${order.orderId}` },
        { transaction },
      );
      await userModel.update(
        { isPremium: true },
        { where: { id: userId }, transaction },
      );
      await transaction.commit();

      // ✅ Send Confirmation Email
      await sendPremiumConfirmationEmail(userId);

      return res.status(200).json({
        success: true,
        status: "SUCCESSFUL",
        message: "Mock payment successful. Premium membership activated!",
      });
    }

    // ==========================================
    // REAL CASHFREE PAYMENT VERIFICATION
    // ==========================================
    // Fetch all payment attempts for this order from Cashfree
    const response = await cashfree.PGOrderFetchPayments(orderId);
    const payments = response.data;

    // If no payments exist yet
    if (!Array.isArray(payments) || payments.length === 0) {
      await transaction.rollback();
      return res.status(200).json({
        success: true,
        status: "PENDING",
        message: "Payment has not been completed yet",
      });
    }

    // Look for a successful payment
    const successfulPayment = payments.find(
      (payment) => payment.payment_status === "SUCCESS",
    );

    if (successfulPayment) {
      const paidAmount = Number(successfulPayment.payment_amount);

      // Security check: Ensure the amount and order ID match what we expect
      if (
        successfulPayment.order_id !== orderId ||
        paidAmount !== Number(order.amount)
      ) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Payment amount or order verification failed",
        });
      }

      // Update order to SUCCESSFUL
      await order.update(
        {
          status: "SUCCESSFUL",
          paymentId: String(successfulPayment.cf_payment_id),
        },
        { transaction },
      );

      // Upgrade user to Premium
      await userModel.update(
        { isPremium: true },
        { where: { id: userId }, transaction },
      );

      await transaction.commit();

      // ✅ Send Confirmation Email
      await sendPremiumConfirmationEmail(userId);

      return res.status(200).json({
        success: true,
        status: "SUCCESSFUL",
        message: "Transaction successful. Premium membership activated!",
      });
    }

    // If payment is still processing
    const pendingPayment = payments.find(
      (payment) => payment.payment_status === "PENDING",
    );
    if (pendingPayment) {
      await transaction.rollback();
      return res.status(200).json({
        success: true,
        status: "PENDING",
        message: "Payment is still processing",
      });
    }

    // If all payment attempts failed
    const allFailed = payments.every(
      (payment) => payment.payment_status === "FAILED",
    );
    if (allFailed) {
      await order.update({ status: "FAILED" }, { transaction });
      await transaction.commit();
      return res.status(200).json({
        success: false,
        status: "FAILED",
        message: "Transaction failed",
      });
    }

    // Default fallback
    await transaction.rollback();
    return res.status(200).json({
      success: true,
      status: "PENDING",
      message: "Payment status is not yet final",
    });
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("Verify Payment Error:", error.response?.data || error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify payment",
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
