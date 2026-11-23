// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, User } from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout";
import { useAuth } from "../context/AuthContext";

const initialValues = { identifier: "", password: "" };

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

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!values.identifier.trim())
      nextErrors.identifier = "Email or phone is required";
    if (!values.password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login({
        identifier: values.identifier.trim(),
        password: values.password,
      });
      navigate("/chat", { replace: true });
    } catch (err) {
      setErrors({
        form: err?.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 flex items-center">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full px-2 py-1.5 text-[13px] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </Link>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-[14px] font-medium text-slate-500 dark:text-slate-400">
          Log in to continue to Said Hi.
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
            htmlFor="identifier"
            className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-300"
          >
            Email or Phone
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              placeholder="jane@example.com or 9876543210"
              value={values.identifier}
              onChange={handleChange}
              className={inputClass(Boolean(errors.identifier), "pl-11")}
              aria-invalid={Boolean(errors.identifier)}
            />
          </div>
          {errors.identifier && (
            <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.identifier}
            </p>
          )}
        </div>

        <div>
          {/* Label Row with Forgot Password Link */}
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[12px] font-semibold text-blue-600 transition hover:text-blue-700 hover:underline dark:text-blue-500 dark:hover:text-blue-400"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              value={values.password}
              onChange={handleChange}
              className={inputClass(Boolean(errors.password), "pl-11 pr-12")}
              aria-invalid={Boolean(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
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

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="cursor-pointer w-full rounded-full bg-blue-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:hover:translate-y-0 dark:focus-visible:ring-offset-[#09090b]"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-[14px] font-medium text-slate-500 dark:text-slate-400">
        New here?{" "}
        <Link
          to="/signup"
          className="font-bold text-blue-600 transition hover:text-blue-700 hover:underline dark:text-blue-500 dark:hover:text-blue-400"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
