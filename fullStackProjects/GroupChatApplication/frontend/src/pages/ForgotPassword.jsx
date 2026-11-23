// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { isEmail } from "../utils/validators";
import AuthLayout from "../components/layout/AuthLayout";
import api from "../lib/axios";

const inputClass = (hasError, extra = "") =>
  [
    "w-full rounded-xl border bg-white/60 px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition backdrop-blur-sm",
    "dark:bg-black/20 dark:text-white dark:placeholder:text-slate-500",
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-500",
    extra,
  ]
    .filter(Boolean)
    .join(" ");

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email address is required");
      return;
    }
    if (!isEmail(trimmedEmail)) {
      setError("Enter a valid email address");
      return;
    }

    setSubmitting(true);
    try {
      // Backend always returns 200 with a generic message (no user
      // enumeration), so a success response never reveals whether
      // the email exists. Showing the success screen unconditionally
      // is correct behaviour.
      await api.post("/auth/forgot-password", { email: trimmedEmail });
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 flex items-center">
        <Link
          to="/login"
          className="group inline-flex items-center gap-2 rounded-full px-2 py-1.5 text-[13px] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Log in
        </Link>
      </div>

      {success ? (
        <div className="text-center animate-in fade-in zoom-in duration-300">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
            Check your email
          </h1>
          <p className="mt-3 text-[14px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            We've sent a password reset link to <br />
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {email}
            </span>
          </p>
          <p className="mt-6 text-[13px] text-slate-500 dark:text-slate-400">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setSuccess(false)}
              className="font-semibold text-blue-600 hover:underline dark:text-blue-500"
            >
              try another email
            </button>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
              Reset password
            </h1>
            <p className="mt-2 text-[14px] font-medium text-slate-500 dark:text-slate-400">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-300"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={handleChange}
                  className={inputClass(Boolean(error), "pl-11")}
                  aria-invalid={Boolean(error)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="cursor-pointer w-full rounded-full bg-blue-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:hover:translate-y-0 dark:focus-visible:ring-offset-[#09090b]"
              >
                {submitting ? "Sending link..." : "Send reset link"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-[14px] font-medium text-slate-500 dark:text-slate-400">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-600 transition hover:text-blue-700 hover:underline dark:text-blue-500 dark:hover:text-blue-400"
            >
              Log in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
