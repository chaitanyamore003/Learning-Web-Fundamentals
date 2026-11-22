import { z } from "zod";

// ─── Reusable field schemas ──────────────────────────────────────────────
// .trim() and .toLowerCase() are *transforms* — Zod rewrites the value
// before handing it to the controller, so the service receives clean input.

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

// Only enforced at signup. Login must NOT apply strength rules, or a
// user who registered before the rule changed could never log in again.
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
  // Email OR phone — so we only require a non-empty string, not a format.
  identifier: z
    .string({ required_error: "Email or phone is required" })
    .trim()
    .min(1, "Email or phone is required"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});
