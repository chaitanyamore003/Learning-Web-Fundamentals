// ============================================================
// ExpenseFlow — Forgot password
// ============================================================

const FORGOT_PASSWORD_ENDPOINT =
  "http://localhost:3000/password/forgotpassword";

async function formSubmit(event) {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const messageEl = document.getElementById("responseMessage");
  const submitBtn = document.getElementById("submitBtn");

  const email = emailInput.value.trim();

  messageEl.textContent = "";
  messageEl.className = "";

  // Basic client-side check
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    messageEl.textContent = "Please enter a valid email address.";
    messageEl.className = "error";
    emailInput.focus();
    return;
  }

  const originalHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";

  try {
    // Send the email to the backend
    await axios.post(FORGOT_PASSWORD_ENDPOINT, { email });

    // Always show the same message so we don't reveal whether the
    // email is registered (prevents account enumeration).
    messageEl.textContent =
      "If an account exists for that email, a reset link has been sent. Check your inbox.";
    messageEl.className = "success";

    // Clear the field so the user can try a different email
    emailInput.value = "";
  } catch (error) {
    const serverMessage =
      error?.response?.data?.message ||
      "We couldn't send the reset link. Please try again in a moment.";

    messageEl.textContent = serverMessage;
    messageEl.className = "error";
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;
  }
}
