// src/pages/Signup.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Upload,
  User,
  X,
} from "lucide-react";
import { isEmail, isPhone } from "../utils/validators";
import AuthLayout from "../components/layout/AuthLayout";
// 1. CHANGED IMPORT HERE
import { uploadToS3 } from "../utils/s3Upload";
import { useAuth } from "../context/AuthContext";

const initialValues = { name: "", email: "", phone: "", password: "" };

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=d1f4d9",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya&backgroundColor=ffeaa7",
];

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

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
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedPreset, setSelectedPreset] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState("");

  const previewUrl = uploadPreview || selectedPreset || "";

  useEffect(() => {
    return () => {
      if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    };
  }, [uploadPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
  };

  const clearAvatar = () => {
    setSelectedPreset(null);
    setUploadedFile(null);
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    setUploadPreview("");
  };

  const handlePresetSelect = (url) => {
    setSelectedPreset(url);
    setUploadedFile(null);
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    setUploadPreview("");
    setErrors((prev) => ({ ...prev, avatar: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, avatar: "Please choose an image file" }));
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Image must be 5 MB or smaller",
      }));
      return;
    }
    setSelectedPreset(null);
    setUploadedFile(file);
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    setUploadPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, avatar: "" }));
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
    try {
      const payload = { ...values };

      if (uploadedFile) {
        // 2. CHANGED FUNCTION CALL HERE (and folder name to "avatars")
        const { secure_url, public_id } = await uploadToS3(
          uploadedFile,
          "avatars",
        );
        payload.profile_picture = secure_url;
        payload.profile_picture_public_id = public_id;
      } else if (selectedPreset) {
        payload.profile_picture = selectedPreset;
      }

      await signup(payload);

      navigate("/chat", { replace: true });
    } catch (err) {
      setErrors({
        form:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again.",
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

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        {/* Avatar */}
        <div>
          <label className="mb-2 block text-[13px] font-semibold text-slate-700 dark:text-slate-300">
            Profile Picture{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>

          <div className="mb-3 flex items-center gap-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-7 w-7 text-slate-400" />
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              {!selectedPreset && (
                <>
                  <label
                    htmlFor="avatar-upload"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </>
              )}
              {previewUrl && (
                <button
                  type="button"
                  onClick={clearAvatar}
                  className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                >
                  <X className="h-3 w-3" />
                  Remove
                </button>
              )}
            </div>
          </div>

          {!uploadedFile && (
            <>
              <p className="mb-1.5 text-xs text-slate-500 dark:text-slate-400">
                Or pick one:
              </p>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_AVATARS.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => handlePresetSelect(url)}
                    aria-label="Select preset avatar"
                    aria-pressed={selectedPreset === url}
                    className={`cursor-pointer aspect-square overflow-hidden rounded-full transition ${
                      selectedPreset === url
                        ? "ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-[#09090b]"
                        : "ring-1 ring-transparent hover:ring-slate-300 dark:hover:ring-slate-600"
                    }`}
                  >
                    <img
                      src={url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </>
          )}

          {errors.avatar && (
            <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.avatar}
            </p>
          )}
        </div>

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
