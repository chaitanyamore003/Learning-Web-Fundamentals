import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../services/api";
import { load } from "@cashfreepayments/cashfree-js";

const Premium = () => {
  const { isDarkMode } = useTheme();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // ✅ FIX: Compute isPremium using premiumStatus from the backend
  const isPremium = user?.premiumStatus || false;

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Helper function to verify payment (used for both real and mock payments)
  const verifyPayment = async (orderId) => {
    setVerifying(true);
    try {
      const verifyRes = await api.post("/payment/verify-payment", { orderId });

      if (verifyRes.data.status === "SUCCESSFUL") {
        setSuccess(true);
        // ✅ FIX: Update premiumStatus in the context
        if (setUser) {
          setUser({ ...user, premiumStatus: true });
        }
        // Redirect to dashboard after 3 seconds
        setTimeout(() => navigate("/user/dashboard"), 3000);
      } else {
        setError(
          verifyRes.data.message || "Payment is still pending or failed.",
        );
      }
    } catch (err) {
      setError("Failed to verify payment with server.");
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Create the order on your backend
      const response = await api.post("/payment/create-order");
      const data = response.data;

      // 2. Handle Mock Payment Mode
      if (data.mockPayment) {
        console.log("Mock payment mode active. Skipping Cashfree modal.");
        await verifyPayment(data.orderId);
        return;
      }

      // 3. Safety Check: Ensure paymentSessionId exists before loading Cashfree
      if (!data.paymentSessionId) {
        throw new Error("Backend failed to return a payment session ID.");
      }

      // 4. Initialize Cashfree JS
      const cashfree = await load({ mode: "sandbox" }); // Change to "production" later

      // 5. Open Checkout Modal
      const checkoutOptions = {
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then(async (result) => {
        if (result.error) {
          setError(result.error.message || "Payment failed or cancelled.");
          setLoading(false);
          return;
        }

        if (result.redirect) {
          window.location.href = result.redirect;
          return;
        }

        // 6. If modal closes successfully, verify the payment on your backend
        await verifyPayment(data.orderId);
      });
    } catch (err) {
      console.error("Upgrade Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to initialize payment.",
      );
      setLoading(false);
    }
  };

  // UI: Success State
  if (success) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center font-sans ${isDarkMode ? "bg-[#191A23] text-white" : "bg-white text-[#191A23]"}`}
      >
        <div
          className={`max-w-md rounded-[35px] border-2 p-10 text-center ${isDarkMode ? "border-[#B9FF66] bg-[#292A32] shadow-[8px_8px_0_0_#B9FF66]" : "border-[#191A23] bg-white shadow-[8px_8px_0_0_#191A23]"}`}
        >
          <div className="mb-6 flex justify-center text-6xl">🎉</div>
          <h2 className="text-3xl font-extrabold mb-2">Welcome to Premium!</h2>
          <p
            className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Your account has been upgraded successfully. Redirecting to your
            dashboard...
          </p>
        </div>
      </div>
    );
  }

  // UI: Pricing Card
  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 selection:bg-[#B9FF66] selection:text-[#191A23] ${isDarkMode ? "bg-[#191A23] text-white" : "bg-white text-[#191A23]"}`}
    >
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 sm:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Upgrade to Premium
          </h1>
          <p
            className={`mt-4 text-lg font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Unlock the full power of ExpenseFlow.
          </p>
        </div>

        {error && (
          <div className="mb-8 w-full max-w-md rounded-xl border-2 border-red-600 bg-red-50 p-4 text-center text-sm font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <div
          className={`w-full max-w-md rounded-[35px] border-2 p-8 sm:p-10 transition-all ${
            isDarkMode
              ? "border-[#B9FF66] bg-[#292A32] shadow-[8px_8px_0_0_#B9FF66]"
              : "border-[#191A23] bg-[#191A23] text-white shadow-[8px_8px_0_0_#B9FF66]"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#B9FF66]">Premium Plan</h2>
            <span className="rounded-full bg-[#B9FF66]/20 px-3 py-1 text-xs font-bold text-[#B9FF66] uppercase tracking-wider">
              Most Popular
            </span>
          </div>

          <div className="mb-8 flex items-baseline gap-2">
            <strong className="text-5xl font-black">₹49</strong>
            <span className="text-gray-400 font-medium">/ one-time</span>
          </div>

          <ul className="mb-10 space-y-4">
            {[
              "Unlimited expense history",
              "Spending leaderboard access",
              "Detailed reports & export",
              "Priority support",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm font-medium text-gray-200"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B9FF66] text-xs font-black text-[#191A23]">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={loading || verifying || isPremium}
            className={`cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border-2 py-4 text-base font-bold transition-all hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70 ${
              isDarkMode
                ? "border-[#B9FF66] bg-[#B9FF66] text-[#191A23] shadow-[4px_4px_0_0_#ffffff]"
                : "border-[#B9FF66] bg-[#B9FF66] text-[#191A23] shadow-[4px_4px_0_0_#ffffff]"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Opening Checkout...
              </span>
            ) : verifying ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying Payment...
              </span>
            ) : isPremium ? (
              "You are already Premium"
            ) : (
              "Pay ₹49 & Upgrade"
            )}
          </button>

          <p className="mt-4 text-center text-xs text-gray-400">
            Secure payment powered by Cashfree
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Premium;
