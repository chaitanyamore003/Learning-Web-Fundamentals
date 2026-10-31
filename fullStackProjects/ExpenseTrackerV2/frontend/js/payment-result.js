const token = localStorage.getItem("token");

const paymentMessage = document.getElementById("paymentMessage");

// Backend payment API
const paymentApi = axios.create({
  baseURL: "http://localhost:3000/payment",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Verify payment
const verifyPayment = async () => {
  try {
    if (!token) {
      paymentMessage.textContent = "Please login to verify your payment.";

      return;
    }

    // Extract order ID from URL
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");

    if (!orderId) {
      paymentMessage.textContent = "Invalid order ID.";
      return;
    }

    paymentMessage.textContent = "Verifying your transaction...";

    // Call backend verification API
    const response = await paymentApi.post("/verify-payment", {
      orderId,
    });

    const { status, message } = response.data;

    if (status === "SUCCESSFUL") {
      paymentMessage.textContent =
        "Transaction successful! Your premium membership is now active.";

      alert("Transaction Successful!");
    } else if (status === "FAILED") {
      paymentMessage.textContent = "TRANSACTION FAILED.";

      alert("TRANSACTION FAILED.");
    } else {
      paymentMessage.textContent =
        "Your payment is still processing. Please check again shortly.";
    }
  } catch (error) {
    console.error("Payment verification error:", error.response?.data || error);

    paymentMessage.textContent =
      error.response?.data?.message ||
      "Unable to verify your payment. Please try again.";
  }
};

// Execute verification when page loads
verifyPayment();
