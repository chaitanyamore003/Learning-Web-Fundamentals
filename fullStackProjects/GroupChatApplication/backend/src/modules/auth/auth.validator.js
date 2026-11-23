import { z } from "zod";

// ─── Reusable field schemas ──────────────────────────────────────────────
// .trim() / .toLowerCase() are transforms — they run BEFORE the controller,
// so the service always receives clean input.

const nameField = z
  .string({ required_error: "Name is required" })
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name is too long");

const emailField = z
  .string({ required_error: "Email is required" })
  .trim()
  .toLowerCase()
  .email("Enter a valid email address")
  .max(150, "Email is too long");

const phoneField = z
  .string({ required_error: "Phone is required" })
  .trim()
  .regex(/^\d{10,15}$/, "Phone must be 10–15 digits");

// Only enforced on signup/reset — login must not apply strength rules,
// or a user who registered before a rule change could never log in.
const passwordField = z
  .string({ required_error: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/\d/, "Password must contain a number");

const optionalUrl = z
  .string()
  .url("Profile picture must be a valid URL")
  .max(500)
  .optional();

const optionalPublicId = z.string().max(255).optional();

// ─── Schemas ─────────────────────────────────────────────────────────────

export const signupSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  password: passwordField,
  profile_picture: optionalUrl,
  profile_picture_public_id: optionalPublicId,
});

export const loginSchema = z.object({
  // Email OR phone — only require a non-empty string, not a format.
  identifier: z
    .string({ required_error: "Email or phone is required" })
    .trim()
    .min(1, "Email or phone is required"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

// Forgot-password: just an email to look up.
export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
});

// Reset-password: token from the email link + the new password.
// Reuses passwordField — same strength rules as signup.
export const resetPasswordSchema = z.object({
  token: z
    .string({ required_error: "Token is required" })
    .min(1, "Token is required"),
  newPassword: passwordField,
});
