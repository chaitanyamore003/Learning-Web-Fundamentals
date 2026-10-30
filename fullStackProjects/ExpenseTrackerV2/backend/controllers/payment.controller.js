const { orderModel, userModel } = require("../models/associations");
const cashfree = require("../utils/cashfree");
const { randomUUID } = require("crypto");

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

    if (!user.phone) {
      return res.status(400).json({
        success: false,
        message: "Please add your phone number before purchasing premium",
      });
    }

    const orderId = `PREMIUM_${randomUUID()}`;
    const amount = 49;

    // Save order in our database first
    const order = await orderModel.create({
      orderId,
      amount,
      status: "PENDING",
      UserId: userId,
    });

    const request = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: String(userId),
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone,
      },
      order_meta: {
        return_url: `http://localhost:3000/payment/return?order_id=${orderId}`,
      },
    };

    const response = await cashfree.PGCreateOrder("2023-08-01", request);

    await order.update({
      cfOrderId: response.data.cf_order_id,
    });

    return res.status(201).json({
      success: true,
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

module.exports = {
  createOrder,
};
