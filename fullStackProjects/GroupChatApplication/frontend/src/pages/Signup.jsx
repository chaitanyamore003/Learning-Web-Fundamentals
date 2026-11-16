// src/pages/Signup.jsx
import { useState } from "react";
import { isEmail, isPhone } from "../utils/validators";

const initialValues = { name: "", email: "", phone: "", password: "" };

const inputClass = (hasError, extra = "") =>
  [
    "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900",
    "placeholder:text-slate-400 outline-none transition",
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
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
        await new Promise((resolve) => setTimeout(resolve, 600));
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
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6 font-sans">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5"
      >
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-1.5 mb-6 text-sm text-slate-500">
          Sign up to get started. It only takes a minute.
        </p>

        {errors.form && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
          >
            {errors.form}
          </div>
        )}
        {success && (
          <div
            role="status"
            className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3.5 py-2.5 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="name"
            className="mb-1.5 block text-[13px] font-semibold text-slate-700"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            value={values.name}
            onChange={handleChange}
            className={inputClass(Boolean(errors.name))}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-1.5 block text-[13px] font-semibold text-slate-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            className={inputClass(Boolean(errors.email))}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="phone"
            className="mb-1.5 block text-[13px] font-semibold text-slate-700"
          >
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="9876543210"
            autoComplete="tel"
            value={values.phone}
            onChange={handleChange}
            className={inputClass(Boolean(errors.phone))}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1.5 text-xs text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="mb-1.5 block text-[13px] font-semibold text-slate-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              className={inputClass(Boolean(errors.password), "pr-16")}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-1.5 text-xs text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {submitting ? "Creating account…" : "Sign up"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
