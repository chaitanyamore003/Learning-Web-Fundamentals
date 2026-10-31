const { orderModel, userModel } = require("../models/associations");
const cashfree = require("../utils/cashfree");
const { randomUUID } = require("crypto");
const db = require("../utils/database");

// Fixed premium membership price for development
const MEMBERSHIP_AMOUNT = 49;

// ==========================================
// CREATE PAYMENT ORDER
// ==========================================

const createOrder = async (req, res) => {
  try {
    // Get the authenticated user's ID from the JWT payload
    const userId = req.user.userId;

    // Find the user in the database using their primary key
    const user = await userModel.findByPk(userId);

    // Check whether the authenticated user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Cashfree requires a valid customer phone number
    // before creating a payment order
    if (!user.phone) {
      return res.status(400).json({
        success: false,
        message: "Please add your phone number before purchasing premium",
      });
    }

    // Prevent users who already have premium membership
    // from purchasing the same membership again
    if (user.isPremium) {
      return res.status(400).json({
        success: false,
        message: "You are already a premium member",
      });
    }

    // Generate a unique order ID for the current purchase
    // randomUUID() prevents duplicate order IDs
    const orderId = `PREMIUM_${randomUUID()}`;

    // Create an order record in our database before initiating payment
    // Its initial status is PENDING because payment is not completed yet
    const order = await orderModel.create({
      orderId,
      amount: MEMBERSHIP_AMOUNT,
      status: "PENDING",
      UserId: userId,
    });

    // Prepare the order details required by Cashfree
    const request = {
      order_id: orderId,
      order_amount: MEMBERSHIP_AMOUNT,
      order_currency: "INR",

      // Provide customer information required by Cashfree
      customer_details: {
        customer_id: String(userId),
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone,
      },

      // Configure the URL where Cashfree redirects the user
      // after completing or attempting the payment
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/payment-result.html?order_id={order_id}`,
      },
    };

    // Send the order creation request to Cashfree
    // Cashfree generates a payment session for checkout
    const response = await cashfree.PGCreateOrder(request);

    // Store the Cashfree-generated order reference in our database
    await order.update({
      cfOrderId: response.data.cf_order_id,
    });

    // Return the order ID and payment session ID to the frontend
    // The payment session ID is used to open Cashfree Checkout
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId,
      paymentSessionId: response.data.payment_session_id,
    });
  } catch (error) {
    // Log the actual Cashfree or database error for debugging
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
  // Start a database transaction so that order status
  // and premium membership are updated atomically
  const transaction = await db.transaction();

  try {
    // Get the authenticated user's ID from the JWT payload
    const userId = req.user.userId;

    // Extract the order ID sent by the frontend
    const { orderId } = req.body;

    // Ensure the frontend has provided an order ID
    if (!orderId) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find the order using both order ID and user ID
    // This prevents one user from verifying another user's order
    const order = await orderModel.findOne({
      where: {
        orderId,
        UserId: userId,
      },
      transaction,

      // Lock the selected order row during this transaction
      // to prevent concurrent updates from conflicting
      lock: transaction.LOCK.UPDATE,
    });

    // Ensure that the requested order belongs to this user
    if (!order) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // If the order was already marked successful,
    // avoid processing the same successful payment again
    if (order.status === "SUCCESSFUL") {
      await transaction.rollback();

      return res.status(200).json({
        success: true,
        status: "SUCCESSFUL",
        message: "Transaction successful",
      });
    }

    // Fetch the actual payment records directly from Cashfree
    // Never trust payment status received from the frontend
    const response = await cashfree.PGOrderFetchPayments(orderId);

    // Extract all payment attempts associated with this order
    const payments = response.data;

    // If no payment attempts exist, the payment is still pending
    // Keep the database order status unchanged
    if (!Array.isArray(payments) || payments.length === 0) {
      await transaction.rollback();

      return res.status(200).json({
        success: true,
        status: "PENDING",
        message: "Payment has not been completed yet",
      });
    }

    // Search for a successful payment among all payment attempts
    // A successful attempt takes priority over failed attempts
    const successfulPayment = payments.find(
      (payment) => payment.payment_status === "SUCCESS",
    );

    if (successfulPayment) {
      // Extract the amount actually paid by the customer
      const paidAmount = Number(successfulPayment.payment_amount);

      // Verify that the payment belongs to the requested order
      // and that the paid amount matches our membership price
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

      // Update the order record after successful payment verification
      // Store Cashfree's payment ID for future reference
      await order.update(
        {
          status: "SUCCESSFUL",
          paymentId: String(successfulPayment.cf_payment_id),
        },
        { transaction },
      );

      // Activate premium membership for the authenticated user
      await userModel.update(
        { isPremium: true },
        {
          where: { id: userId },
          transaction,
        },
      );

      // Permanently save both database updates together
      await transaction.commit();

      return res.status(200).json({
        success: true,
        status: "SUCCESSFUL",
        message: "Transaction successful. Premium membership activated!",
      });
    }

    // Check whether any payment attempt is still being processed
    const pendingPayment = payments.find(
      (payment) => payment.payment_status === "PENDING",
    );

    // Do not mark the order as failed while a payment is pending
    if (pendingPayment) {
      await transaction.rollback();

      return res.status(200).json({
        success: true,
        status: "PENDING",
        message: "Payment is still processing",
      });
    }

    // Check whether every recorded payment attempt has failed
    const allFailed = payments.every(
      (payment) => payment.payment_status === "FAILED",
    );

    if (allFailed) {
      // Update the order status from PENDING to FAILED
      // because Cashfree confirms that all attempts failed
      await order.update({ status: "FAILED" }, { transaction });

      // Commit the failed order status to the database
      await transaction.commit();

      return res.status(200).json({
        success: false,
        status: "FAILED",
        message: "TRANSACTION FAILED",
      });
    }

    // If Cashfree returns another or unrecognized status,
    // leave the order pending until its final status is known
    await transaction.rollback();

    return res.status(200).json({
      success: true,
      status: "PENDING",
      message: "Payment status is not yet final",
    });
  } catch (error) {
    // Roll back database changes if an unexpected error occurs
    // Only roll back if the transaction has not already finished
    if (!transaction.finished) {
      await transaction.rollback();
    }

    // Log the actual Cashfree or database error for debugging
    console.error("Verify Payment Error:", error.response?.data || error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify payment",
    });
  }
};

// Export both controller functions so they can be used in payment.routes.js
module.exports = {
  createOrder,
  verifyPayment,
};
