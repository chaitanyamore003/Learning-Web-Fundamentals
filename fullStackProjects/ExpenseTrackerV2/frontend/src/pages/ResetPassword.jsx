import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

const ResetPassword = () => {
  const { id } = useParams(); // Gets the UUID from the URL
  const { isDarkMode } = useTheme();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    setLoading(true);

    try {
      // This route must exist in your backend to update the password
      const response = await api.post(`/password/update/${id}`, {
        newPassword: password,
      });

      if (response.data.success) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Reset Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to reset password. The link may be expired or invalid.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full rounded-xl border-2 py-3.5 pl-11 pr-12 text-sm font-medium outline-none transition-all ${
    isDarkMode
      ? "border-gray-600 bg-[#191A23] text-white placeholder-gray-600 focus:border-[#B9FF66] focus:ring-1 focus:ring-[#B9FF66]"
      : "border-[#191A23] bg-white text-[#191A23] placeholder-gray-400 focus:border-[#B9FF66] focus:ring-1 focus:ring-[#191A23]"
  }`;

  const iconClass = `pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 ${
    isDarkMode ? "text-gray-500" : "text-gray-400"
  }`;

  // Success State
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#B9FF66]/20 text-4xl">
          ✅
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Password Reset!
        </h2>
        <p
          className={`text-sm font-medium mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          Your password has been successfully changed. You can now log in with
          your new password.
        </p>
        <Link
          to="/login"
          className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 py-4 text-base font-bold transition-all hover:-translate-y-1 ${
            isDarkMode
              ? "border-[#B9FF66] bg-[#B9FF66] text-[#191A23] shadow-[4px_4px_0_0_#ffffff]"
              : "border-[#191A23] bg-[#191A23] text-white shadow-[4px_4px_0_0_#B9FF66]"
          }`}
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // Form State
  return (
    <>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Set New Password</h2>
        <p
          className={`mt-2 text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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

        {/* New Password */}
        <div>
          <label className="mb-2 block text-sm font-bold tracking-wide">
            New Password
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-gray-500 hover:text-[#191A23] dark:hover:text-white"
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-sm font-bold tracking-wide">
            Confirm Password
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`cursor-pointer mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 py-4 text-base font-bold transition-all hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70 ${
            isDarkMode
              ? "border-[#B9FF66] bg-[#B9FF66] text-[#191A23] shadow-[4px_4px_0_0_#ffffff]"
              : "border-[#191A23] bg-[#191A23] text-white shadow-[4px_4px_0_0_#B9FF66]"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </>
  );
};

export default ResetPassword;
