const token = localStorage.getItem("token");

const paymentMessage = document.getElementById("paymentMessage");

// Use the same origin as the payment-result page
const paymentApi = axios.create({
  baseURL: `${window.location.origin}/payment`,
  timeout: 15000,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Redirect after displaying the result
const redirectToLogin = () => {
  setTimeout(() => {
    window.location.href =
      "http://127.0.0.1:5500/fullStackProjects/ExpenseTrackerV2/frontend/views/login.html";
  }, 3000);
};

const verifyPayment = async () => {
  try {
    console.log("Payment result script loaded");

    if (!token) {
      paymentMessage.textContent =
        "Login session not found. Please log in to check your transaction.";

      redirectToLogin();
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");

    console.log("Order ID:", orderId);

    if (!orderId) {
      paymentMessage.textContent = "Invalid order ID.";
      redirectToLogin();
      return;
    }

    paymentMessage.textContent = "Verifying your transaction...";

    const response = await paymentApi.post("/verify-payment", {
      orderId,
    });

    console.log("Verification response:", response.data);

    const { status, message } = response.data;

    if (status === "SUCCESSFUL") {
      paymentMessage.textContent =
        "Transaction successful! Your premium membership is now active.";

      paymentMessage.className = "success";
    } else if (status === "FAILED") {
      paymentMessage.textContent =
        "Transaction failed. Your premium membership was not activated.";

      paymentMessage.className = "error";
    } else {
      paymentMessage.textContent =
        "Payment is still processing. Please check again later.";

      paymentMessage.className = "pending";
    }

    redirectToLogin();
  } catch (error) {
    console.error("Payment verification error:", error.response?.data || error);

    if (error.code === "ECONNABORTED") {
      paymentMessage.textContent =
        "Payment verification timed out. Please try again.";
    } else if (error.response?.status === 401) {
      paymentMessage.textContent =
        "Your session has expired. Redirecting to login.";

      localStorage.removeItem("token");
    } else {
      paymentMessage.textContent =
        error.response?.data?.message || "Unable to verify your payment.";
    }

    redirectToLogin();
  }
};

verifyPayment();
