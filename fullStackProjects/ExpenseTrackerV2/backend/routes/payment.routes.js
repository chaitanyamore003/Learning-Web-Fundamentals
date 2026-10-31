const express = require("express");
const paymentController = require("../controllers/payment.controller");
const authenticateUser = require("../middlewares/auth");

const router = express.Router();

// Create payment order
router.post("/create-order", authenticateUser, paymentController.createOrder);

// Verify payment
router.post(
  "/verify-payment",
  authenticateUser,
  paymentController.verifyPayment,
);

module.exports = router;
