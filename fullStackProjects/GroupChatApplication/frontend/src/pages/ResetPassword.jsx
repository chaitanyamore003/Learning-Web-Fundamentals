// src/pages/ResetPassword.jsx
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout";
import api from "../lib/axios";

const initialValues = { password: "", confirmPassword: "" };

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

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // The reset link in the email looks like:
  //   http://localhost:5173/reset-password?token=<hex>
  // If there's no token, there's no point showing the form.
  const token = searchParams.get("token");

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
  };

  const validate = (v) => {
    const err = {};

    if (!v.password) {
      err.password = "Password is required";
    } else if (v.password.length < 8) {
      err.password = "Password must be at least 8 characters";
    } else if (!/[A-Za-z]/.test(v.password) || !/\d/.test(v.password)) {
      err.password = "Password must contain both letters and numbers";
    }

    if (!v.confirmPassword) {
      err.confirmPassword = "Please confirm your password";
    } else if (v.password !== v.confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: values.password,
      });
      setSuccess(true);
    } catch (err) {
      setErrors({
        form:
          err?.response?.data?.message ||
          "Failed to reset password. The link may have expired.",
      });
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

      {/* No token in URL → the link is broken or was pasted wrong. */}
      {!token ? (
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
            Invalid reset link
          </h1>
          <p className="mt-3 text-[14px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            This page needs a reset token. Open the link from your email, or
            request a new one.
          </p>
          <div className="mt-8">
            <Link
              to="/forgot-password"
              className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Request a new link
            </Link>
          </div>
        </div>
      ) : success ? (
        <div className="text-center animate-in fade-in zoom-in duration-300">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
            Password reset
          </h1>
          <p className="mt-3 text-[14px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            Your password has been successfully updated. You can now log in with
            your new credentials.
          </p>

          <div className="mt-8">
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="cursor-pointer w-full inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
            >
              Continue to Log in
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
              Set new password
            </h1>
            <p className="mt-2 text-[14px] font-medium text-slate-500 dark:text-slate-400">
              Your new password must be different from previously used
              passwords.
            </p>
          </div>

          {errors.form && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
            >
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-300"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  value={values.password}
                  onChange={handleChange}
                  className={inputClass(
                    Boolean(errors.password),
                    "pl-11 pr-12",
                  )}
                  aria-invalid={Boolean(errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200/50 hover:text-slate-600 dark:hover:bg-slate-700/50 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-300"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  className={inputClass(
                    Boolean(errors.confirmPassword),
                    "pl-11 pr-12",
                  )}
                  aria-invalid={Boolean(errors.confirmPassword)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200/50 hover:text-slate-600 dark:hover:bg-slate-700/50 dark:hover:text-slate-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="cursor-pointer w-full rounded-full bg-blue-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:hover:translate-y-0 dark:focus-visible:ring-offset-[#09090b]"
              >
                {submitting ? "Resetting password..." : "Reset password"}
              </button>
            </div>
          </form>
        </>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
