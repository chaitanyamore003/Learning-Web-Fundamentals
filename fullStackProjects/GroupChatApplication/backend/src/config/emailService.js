// src/config/emailService.js
import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "Said Hi";

/**
 * Send an email through Brevo's transactional email API.
 *
 * Brevo's payload uses `htmlContent` and `textContent` — NOT
 * `html` / `text` (that's SendGrid / Nodemailer). Sending the
 * wrong keys returns 400 `missing_parameter`.
 */
const sendEmail = async ({ to, subject, text, html }) => {
  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
    throw new Error("Brevo credentials missing from .env");
  }

  try {
    const { data } = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
        // `to` MUST come from the caller — the recipient, not the sender.
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
    return data;
  } catch (err) {
    // Brevo puts the useful message in err.response.data — surface it
    // instead of re-throwing the full AxiosError object (which contains
    // the API key in `config.headers`, as you just saw).
    const brevoError =
      err?.response?.data?.message || err?.message || "Email send failed";
    console.error("Brevo Email Error:", brevoError);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
