import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import api from "../services/api";

const ForgotPassword = () => {
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Replace with your actual route (e.g., /auth/forgot-password or /password/forgot)
      const response = await api.post("/password/forgotpassword", { email });

      if (response.data.success) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Forgot Password Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to send reset email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Reusable input styling class
  const inputClass = `w-full rounded-xl border-2 py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition-all ${
    isDarkMode
      ? "border-gray-600 bg-[#191A23] text-white placeholder-gray-600 focus:border-[#B9FF66] focus:ring-1 focus:ring-[#B9FF66]"
      : "border-[#191A23] bg-white text-[#191A23] placeholder-gray-400 focus:border-[#B9FF66] focus:ring-1 focus:ring-[#191A23]"
  }`;

  const iconClass = `pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 ${
    isDarkMode ? "text-gray-500" : "text-gray-400"
  }`;

  // ================= SUCCESS STATE =================
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#B9FF66]/20 text-4xl">
          ✉️
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Check your email
        </h2>
        <p
          className={`text-sm font-medium mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          We've sent a password reset link to <br />
          <strong className={isDarkMode ? "text-white" : "text-[#191A23]"}>
            {email}
          </strong>
        </p>
        <Link
          to="/login"
          className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 py-4 text-base font-bold transition-all hover:-translate-y-1 ${
            isDarkMode
              ? "border-[#B9FF66] bg-[#B9FF66] text-[#191A23] shadow-[4px_4px_0_0_#ffffff]"
              : "border-[#191A23] bg-[#191A23] text-white shadow-[4px_4px_0_0_#B9FF66]"
          }`}
        >
          Return to Login
        </Link>
      </div>
    );
  }

  // ================= FORM STATE =================
  return (
    <>
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Forgot Password?</h2>
        <p
          className={`mt-2 text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error Message Display */}
        {error && (
          <div
            className={`rounded-xl border-2 p-3 text-sm font-bold ${
              isDarkMode
                ? "border-red-500/50 bg-red-500/10 text-red-400"
                : "border-red-500 bg-red-50 text-red-600"
            }`}
          >
            {error}
          </div>
        )}

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-bold tracking-wide"
          >
            Email Address
          </label>
          <div className="relative">
            <div className={iconClass}>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="you@example.com"
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`cursor-pointer mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 py-4 text-base font-bold transition-all hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70 ${
            isDarkMode
              ? "border-[#B9FF66] bg-[#B9FF66] text-[#191A23] shadow-[4px_4px_0_0_#ffffff]"
              : "border-[#191A23] bg-[#191A23] text-white shadow-[4px_4px_0_0_#B9FF66]"
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
              Sending...
            </span>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      {/* Back to Login Link */}
      <div className="mt-8 text-center text-sm font-medium">
        <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
          Remember your password?{" "}
        </span>
        <Link
          to="/login"
          className="font-bold underline decoration-2 underline-offset-4 transition-colors hover:text-[#B9FF66]"
        >
          Log in
        </Link>
      </div>
    </>
  );
};

export default ForgotPassword;
