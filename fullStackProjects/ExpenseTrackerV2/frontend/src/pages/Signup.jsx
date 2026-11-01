import { useState } from "react";
import { useTheme } from "../context/ThemeContext"; // Adjust path if needed

const Signup = () => {
  const { isDarkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Add your signup API call here
    setTimeout(() => setLoading(false), 1500); // Simulated delay
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

  return (
    <>
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
        <p
          className={`mt-2 text-sm font-medium ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Start tracking your expenses with AI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-bold tracking-wide"
          >
            Full Name
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={inputClass}
            />
          </div>
        </div>

        {/* Email Address */}
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
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-bold tracking-wide"
          >
            Phone Number
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              pattern="[6-9][0-9]{9}"
              maxLength="10"
              title="Enter a valid 10-digit Indian mobile number"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className={inputClass}
            />
          </div>
          <span
            className={`mt-1.5 block text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
          >
            Enter your 10-digit mobile number.
          </span>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-bold tracking-wide"
          >
            Password
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
              name="password"
              id="password"
              required
              minLength="8"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-[#191A23] dark:hover:text-white"
            >
              {showPassword ? (
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
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          <span
            className={`mt-1.5 block text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
          >
            Must be at least 8 characters.
          </span>
        </div>

        {/* Terms & Conditions Checkbox */}
        <div className="pt-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm font-medium">
            <input
              type="checkbox"
              required
              className={`mt-0.5 h-4 w-4 rounded border-2 accent-[#B9FF66] ${
                isDarkMode
                  ? "border-gray-600 bg-[#191A23]"
                  : "border-[#191A23] bg-white"
              }`}
            />
            <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              I agree to the{" "}
              <a
                href="#"
                className="font-bold underline decoration-2 underline-offset-4 hover:text-[#B9FF66]"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-bold underline decoration-2 underline-offset-4 hover:text-[#B9FF66]"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 py-4 text-base font-bold transition-all hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70 ${
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
              Creating account...
            </span>
          ) : (
            <>
              Create account
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-8 text-center text-sm font-medium">
        <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
          Already have an account?{" "}
        </span>
        <a
          href="#login"
          className="font-bold underline decoration-2 underline-offset-4 transition-colors hover:text-[#B9FF66]"
        >
          Log in
        </a>
      </div>
    </>
  );
};

export default Signup;
