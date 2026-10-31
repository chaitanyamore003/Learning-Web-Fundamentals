const { orderModel, userModel } = require("../models/associations");
const cashfree = require("../utils/cashfree");
const { randomUUID } = require("crypto");
const db = require("../utils/database");

const MEMBERSHIP_AMOUNT = 49;

// Mock payments are permitted only in development
const isMockPayment =
  process.env.NODE_ENV === "development" &&
  process.env.MOCK_PAYMENTS === "true";

// ==========================================
// CREATE PAYMENT ORDER
// ==========================================

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await userModel.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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

    const orderId = `PREMIUM_${randomUUID()}`;

    // Create order in our database
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
        return_url: `${process.env.FRONTEND_URL}/payment-result.html?order_id={order_id}`,
      },
    };

    const response = await cashfree.PGCreateOrder(request);

    await order.update({
      cfOrderId: response.data.cf_order_id,
    });

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
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Start transaction inside try so transaction creation
    // failures are also handled by the catch block
    transaction = await db.transaction();

    // Find only the authenticated user's order
    const order = await orderModel.findOne({
      where: {
        orderId,
        UserId: userId,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Make verification idempotent
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
      // Activate premium and mark the order successful
      await order.update(
        {
          status: "SUCCESSFUL",
          paymentId: `MOCK_PAYMENT_${order.orderId}`,
        },
        { transaction },
      );

      await userModel.update(
        { isPremium: true },
        {
          where: { id: userId },
          transaction,
        },
      );

      // Save both changes atomically
      await transaction.commit();

      console.log("Mock payment successful:", orderId);

      return res.status(200).json({
        success: true,
        status: "SUCCESSFUL",
        message: "Mock payment successful. Premium membership activated!",
      });
    }

    // ==========================================
    // REAL CASHFREE PAYMENT VERIFICATION
    // ==========================================

    const response = await cashfree.PGOrderFetchPayments(orderId);
    const payments = response.data;

    if (!Array.isArray(payments) || payments.length === 0) {
      await transaction.rollback();

      return res.status(200).json({
        success: true,
        status: "PENDING",
        message: "Payment has not been completed yet",
      });
    }

    const successfulPayment = payments.find(
      (payment) => payment.payment_status === "SUCCESS",
    );

    if (successfulPayment) {
      const paidAmount = Number(successfulPayment.payment_amount);

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

      await order.update(
        {
          status: "SUCCESSFUL",
          paymentId: String(successfulPayment.cf_payment_id),
        },
        { transaction },
      );

      await userModel.update(
        { isPremium: true },
        {
          where: { id: userId },
          transaction,
        },
      );

      await transaction.commit();

      return res.status(200).json({
        success: true,
        status: "SUCCESSFUL",
        message: "Transaction successful. Premium membership activated!",
      });
    }

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
