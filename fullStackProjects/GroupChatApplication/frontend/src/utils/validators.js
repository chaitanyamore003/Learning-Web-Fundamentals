// src/utils/validators.js

/**
 * Validates an email address format.
 * Checks for a standard pattern: text@text.text
 */
export const isEmail = (value) => {
  if (!value) return false;
  // Uses a standard, practical regex for basic email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
};

/**
 * Validates a phone number format.
 * Accepts 10 to 15 digits.
 * Allows optional spaces, dashes, parentheses, and a leading '+'.
 */
export const isPhone = (value) => {
  if (!value) return false;

  // Remove common formatting characters (spaces, dashes, parentheses)
  const cleaned = String(value).replace(/[\s\-()]/g, "");

  // Must be an optional '+' followed by 10 to 15 digits
  return /^\+?\d{10,15}$/.test(cleaned);
};
