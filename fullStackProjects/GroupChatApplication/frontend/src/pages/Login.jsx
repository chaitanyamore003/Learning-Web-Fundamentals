// src/pages/Login.jsx
import { useState } from "react";
import { isEmail, isPhone } from "../utils/validators";

const initialValues = { identifier: "", password: "" };

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

const Login = ({ onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
  };

  const validate = (v) => {
    const err = {};
    const id = v.identifier.trim();

    if (!id) {
      err.identifier = "Email or phone number is required";
    } else if (id.includes("@")) {
      if (!isEmail(id)) err.identifier = "Enter a valid email address";
    } else if (!isPhone(id)) {
      err.identifier = "Enter a valid email or a 10–15 digit phone number";
    }

    if (!v.password) err.password = "Password is required";

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      // Normalise: detect whether the user typed an email or a phone
      const id = values.identifier.trim();
      const payload = {
        [id.includes("@") ? "email" : "phone"]: id,
        password: values.password,
      };

      // TODO: replace with your real API call
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      setValues(initialValues);
    } catch (err) {
      setErrors({
        form: err?.message || "Invalid credentials. Please try again.",
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
          Welcome back
        </h1>
        <p className="mt-1.5 mb-6 text-sm text-slate-500">
          Log in with your email or phone number.
        </p>

        {errors.form && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
          >
            {errors.form}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="identifier"
            className="mb-1.5 block text-[13px] font-semibold text-slate-700"
          >
            Email or phone number
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            placeholder="jane@example.com or 9876543210"
            autoComplete="username"
            value={values.identifier}
            onChange={handleChange}
            className={inputClass(Boolean(errors.identifier))}
            aria-invalid={Boolean(errors.identifier)}
            aria-describedby={
              errors.identifier ? "identifier-error" : undefined
            }
          />
          {errors.identifier && (
            <p id="identifier-error" className="mt-1.5 text-xs text-red-600">
              {errors.identifier}
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
              placeholder="Enter your password"
              autoComplete="current-password"
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
          {submitting ? "Logging in…" : "Log in"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
