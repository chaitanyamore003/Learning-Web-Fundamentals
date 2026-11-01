const token = localStorage.getItem("token");

const paymentMessage = document.getElementById("paymentMessage");

// Use the same origin as the payment-result page
const paymentApi = axios.create({
  baseURL: `http://localhost:3000/payment`,
  timeout: 15000,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Redirect after displaying the result
const startCountdown = () => {
  const countdown = document.getElementById("countdown");
  const timer = document.getElementById("timer");

  countdown.hidden = false;

  let seconds = 5;
  timer.textContent = seconds;

  const interval = setInterval(() => {
    seconds--;

    timer.textContent = seconds;

    if (seconds <= 0) {
      clearInterval(interval);
      window.location.href = "login.html";
    }
  }, 1000);
};

const verifyPayment = async () => {
  try {
    if (!token) {
      paymentMessage.textContent =
        "Login session not found. Please log in to check your transaction.";
      startCountdown();
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");

    console.log("Order ID:", orderId);

    if (!orderId) {
      paymentMessage.textContent = "Invalid order ID.";
      startCountdown();
      return;
    }

    paymentMessage.textContent = "Verifying your transaction...";

    const response = await paymentApi.post("/verify-payment", {
      orderId,
    });

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
    startCountdown();
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
    startCountdown();
  }
};

verifyPayment();
