// 1. EXISTING FUNCTION: Reset Password Request
const resetEmailHtml = (resetURL) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Reset your ExpenseFlow password</title>
</head>
<body style="margin:0; padding:0; background-color:#191A23;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:#191A23;">
    Use the secure link in this email to reset your ExpenseFlow password.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#191A23; margin:0; padding:0;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle">
                    <img src="https://res.cloudinary.com/ddivlvrkv/image/upload/v1793869062/expenseflow-logo-1024_tw0ubu.png" alt="ExpenseFlow" width="36" height="36" style="display:block; border-radius:8px;" />
                  </td>
                  <td valign="middle" style="padding-left:12px; font-family:Inter,Arial,sans-serif; font-size:22px; font-weight:900; letter-spacing:-0.5px; color:#ffffff;">
                    ExpenseFlow
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#292A32; border:2px solid #B9FF66; border-radius:24px; padding:36px 32px;">
              <h1 style="margin:0 0 16px; font-family:Inter,Arial,sans-serif; font-size:26px; line-height:1.2; font-weight:800; letter-spacing:-0.5px; color:#ffffff;">
                Reset your password
              </h1>
              <p style="margin:0 0 28px; font-family:Inter,Arial,sans-serif; font-size:15px; line-height:1.6; color:#a1a1aa;">
                We received a request to reset the password for your ExpenseFlow account. Click the button below to choose a new one.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
                <tr>
                  <td align="center" bgcolor="#B9FF66" style="border-radius:12px; border:2px solid #B9FF66; background-color:#B9FF66;">
                    <a href="${resetURL}" target="_blank" rel="noopener" style="display:inline-block; padding:14px 32px; font-family:Inter,Arial,sans-serif; font-size:16px; font-weight:800; letter-spacing:-0.2px; color:#191A23; text-decoration:none; border-radius:10px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px; font-family:Inter,Arial,sans-serif; font-size:13px; line-height:1.6; color:#a1a1aa;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 24px; padding:14px; background-color:#191A23; border:2px solid #3f3f46; border-radius:12px; font-family:Inter,Arial,sans-serif; font-size:13px; line-height:1.6; word-break:break-all;">
                <a href="${resetURL}" target="_blank" rel="noopener" style="color:#B9FF66; text-decoration:underline;">${resetURL}</a>
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-top:20px; border-top:2px solid #3f3f46; font-family:Inter,Arial,sans-serif; font-size:13px; line-height:1.6; color:#a1a1aa;">
                    Didn't request a password reset? You can safely ignore this email — your password won't change.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 8px 0; font-family:Inter,Arial,sans-serif; font-size:12px; line-height:1.6; color:#71717a;">
              &copy; 2026 ExpenseFlow. All rights reserved.<br />
              You received this email because a password reset was requested for this address.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// 2. NEW FUNCTION: Password Reset Confirmation
const resetConfirmationEmailHtml = (loginURL) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Password Reset Successful</title>
</head>
<body style="margin:0; padding:0; background-color:#191A23;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:#191A23;">
    Your ExpenseFlow password has been successfully reset.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#191A23; margin:0; padding:0;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle">
                    <img src="https://res.cloudinary.com/ddivlvrkv/image/upload/v1793869062/expenseflow-logo-1024_tw0ubu.png" alt="ExpenseFlow" width="36" height="36" style="display:block; border-radius:8px;" />
                  </td>
                  <td valign="middle" style="padding-left:12px; font-family:Inter,Arial,sans-serif; font-size:22px; font-weight:900; letter-spacing:-0.5px; color:#ffffff;">
                    ExpenseFlow
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#292A32; border:2px solid #B9FF66; border-radius:24px; padding:36px 32px;">
              <div style="font-size: 40px; margin-bottom: 16px; text-align: center;">✅</div>
              <h1 style="margin:0 0 16px; font-family:Inter,Arial,sans-serif; font-size:26px; line-height:1.2; font-weight:800; letter-spacing:-0.5px; color:#ffffff; text-align: center;">
                Password Reset Successful
              </h1>
              <p style="margin:0 0 28px; font-family:Inter,Arial,sans-serif; font-size:15px; line-height:1.6; color:#a1a1aa; text-align: center;">
                Your ExpenseFlow password has been successfully changed. You can now log in to your account using your new password.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px;">
                <tr>
                  <td align="center" bgcolor="#B9FF66" style="border-radius:12px; border:2px solid #B9FF66; background-color:#B9FF66;">
                    <a href="${loginURL}" target="_blank" rel="noopener" style="display:inline-block; padding:14px 32px; font-family:Inter,Arial,sans-serif; font-size:16px; font-weight:800; letter-spacing:-0.2px; color:#191A23; text-decoration:none; border-radius:10px;">
                      Log in to ExpenseFlow
                    </a>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-top:20px; border-top:2px solid #3f3f46; font-family:Inter,Arial,sans-serif; font-size:13px; line-height:1.6; color:#a1a1aa; text-align: center;">
                    If you did not make this change, please contact support immediately to secure your account.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 8px 0; font-family:Inter,Arial,sans-serif; font-size:12px; line-height:1.6; color:#71717a;">
              &copy; 2026 ExpenseFlow. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// 3. NEW FUNCTION: Premium Purchase Confirmation
const premiumConfirmationEmailHtml = (userName, dashboardURL) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Welcome to ExpenseFlow Premium!</title>
</head>
<body style="margin:0; padding:0; background-color:#191A23;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:#191A23;">
    Your Premium account is now active. Thank you for upgrading!
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#191A23; margin:0; padding:0;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle">
                    <img src="https://res.cloudinary.com/ddivlvrkv/image/upload/v1793869062/expenseflow-logo-1024_tw0ubu.png" alt="ExpenseFlow" width="36" height="36" style="display:block; border-radius:8px;" />
                  </td>
                  <td valign="middle" style="padding-left:12px; font-family:Inter,Arial,sans-serif; font-size:22px; font-weight:900; letter-spacing:-0.5px; color:#ffffff;">
                    ExpenseFlow
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#292A32; border:2px solid #B9FF66; border-radius:24px; padding:36px 32px;">
              <div style="font-size: 40px; margin-bottom: 16px; text-align: center;">👑</div>
              <h1 style="margin:0 0 16px; font-family:Inter,Arial,sans-serif; font-size:26px; line-height:1.2; font-weight:800; letter-spacing:-0.5px; color:#ffffff; text-align: center;">
                Welcome to Premium, ${userName}!
              </h1>
              <p style="margin:0 0 28px; font-family:Inter,Arial,sans-serif; font-size:15px; line-height:1.6; color:#a1a1aa; text-align: center;">
                Thank you for upgrading! Your account has been successfully activated with our Premium features.
              </p>
              <div style="background-color:#191A23; border:2px solid #3f3f46; border-radius:12px; padding:20px; margin-bottom:28px;">
                <p style="margin:0 0 12px; font-family:Inter,Arial,sans-serif; font-size:14px; font-weight:800; color:#B9FF66;">
                  You now have access to:
                </p>
                <ul style="margin:0; padding-left:20px; font-family:Inter,Arial,sans-serif; font-size:14px; line-height:1.8; color:#a1a1aa;">
                  <li>Unlimited expense history</li>
                  <li>Live Spending Leaderboard</li>
                  <li>Detailed Reports & CSV Export</li>
                  <li>Priority Support</li>
                </ul>
              </div>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px;">
                <tr>
                  <td align="center" bgcolor="#B9FF66" style="border-radius:12px; border:2px solid #B9FF66; background-color:#B9FF66;">
                    <a href="${dashboardURL}" target="_blank" rel="noopener" style="display:inline-block; padding:14px 32px; font-family:Inter,Arial,sans-serif; font-size:16px; font-weight:800; letter-spacing:-0.2px; color:#191A23; text-decoration:none; border-radius:10px;">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 8px 0; font-family:Inter,Arial,sans-serif; font-size:12px; line-height:1.6; color:#71717a;">
              &copy; 2026 ExpenseFlow. All rights reserved.<br />
              If you have any questions, reply to this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports = {
  resetEmailHtml,
  resetConfirmationEmailHtml,
  premiumConfirmationEmailHtml,
};
