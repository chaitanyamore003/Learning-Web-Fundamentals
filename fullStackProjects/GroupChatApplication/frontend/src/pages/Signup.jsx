// src/pages/Signup.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { isEmail, isPhone } from "../utils/validators";
import AuthLayout from "../components/layout/AuthLayout";

const initialValues = { name: "", email: "", phone: "", password: "" };

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

const Signup = ({ onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
    setSuccess("");
  };

  const validate = (v) => {
    const err = {};

    if (!v.name.trim()) err.name = "Name is required";
    else if (v.name.trim().length < 2)
      err.name = "Name must be at least 2 characters";

    if (!v.email.trim()) err.email = "Email is required";
    else if (!isEmail(v.email)) err.email = "Enter a valid email address";

    if (!v.phone.trim()) err.phone = "Phone number is required";
    else if (!isPhone(v.phone))
      err.phone = "Enter a valid phone number (10–15 digits)";

    if (!v.password) err.password = "Password is required";
    else if (v.password.length < 8)
      err.password = "Password must be at least 8 characters";
    else if (!/[A-Za-z]/.test(v.password) || !/\d/.test(v.password))
      err.password = "Password must contain both letters and numbers";

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSuccess("");
    try {
      // TODO: replace with your real API call
      if (onSubmit) {
        await onSubmit(values);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      setSuccess("Account created successfully!");
      setValues(initialValues);
    } catch (err) {
      setErrors({
        form: err?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      {/* Back to Home Button */}
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
          Create an account
        </h1>
        <p className="mt-2 text-[14px] font-medium text-slate-500 dark:text-slate-400">
          Join Said Hi and start connecting.
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

      {success && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400"
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-300"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              className={inputClass(Boolean(errors.name), "pl-11")}
              aria-invalid={Boolean(errors.name)}
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
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
              value={values.email}
              onChange={handleChange}
              className={inputClass(Boolean(errors.email), "pl-11")}
              aria-invalid={Boolean(errors.email)}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-300"
          >
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="9876543210"
              autoComplete="tel"
              value={values.phone}
              onChange={handleChange}
              className={inputClass(Boolean(errors.phone), "pl-11")}
              aria-invalid={Boolean(errors.phone)}
            />
          </div>
          {errors.phone && (
            <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-300"
          >
            Password
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

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="cursor-pointer w-full rounded-full bg-blue-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:hover:translate-y-0 dark:focus-visible:ring-offset-[#09090b]"
          >
            {submitting ? "Creating account..." : "Sign up"}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-[14px] font-medium text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-bold text-blue-600 transition hover:text-blue-700 hover:underline dark:text-blue-500 dark:hover:text-blue-400"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
