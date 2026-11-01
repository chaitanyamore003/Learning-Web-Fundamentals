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
<body style="margin:0; padding:0; background-color:#070c17;">
  <!-- Preheader: shows in the inbox preview, hidden in the body -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:#070c17;">
    Use the secure link in this email to reset your ExpenseFlow password.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#070c17; margin:0; padding:0;">
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:560px; width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:22px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle"
                      style="width:34px; height:34px; border-radius:10px;
                             background-color:#7c5cf5;
                             background-image:linear-gradient(135deg,#8b5cf6,#6366f1);
                             text-align:center; vertical-align:middle;
                             font-family:Inter,Arial,sans-serif; font-size:17px;
                             font-weight:800; color:#ffffff; line-height:34px;">
                    &#9889;
                  </td>
                  <td valign="middle"
                      style="padding-left:10px;
                             font-family:Inter,Arial,sans-serif;
                             font-size:18px; font-weight:800;
                             letter-spacing:-0.4px; color:#eef2f9;">
                    ExpenseFlow
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#0e1626;
                       background-image:linear-gradient(180deg,#101a2c,#0d1524);
                       border:1px solid #2b3b57; border-radius:18px;
                       padding:36px 32px;">

              <h1 style="margin:0 0 12px;
                         font-family:Inter,Arial,sans-serif;
                         font-size:22px; line-height:1.3; font-weight:800;
                         letter-spacing:-0.6px; color:#eef2f9;">
                Reset your password
              </h1>

              <p style="margin:0 0 26px;
                        font-family:Inter,Arial,sans-serif;
                        font-size:14px; line-height:1.75; color:#94a3b8;">
                We received a request to reset the password for your ExpenseFlow
                account. Click the button below to choose a new one.
              </p>

              <!-- Gradient button (solid fallback for Outlook) -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"
                     style="margin:0 0 26px;">
                <tr>
                  <td align="center" bgcolor="#7c5cf5"
                      style="border-radius:10px;
                             background-color:#7c5cf5;
                             background-image:linear-gradient(100deg,#7c5cf5,#6366f1);">
                    <a href="${resetURL}"
                       target="_blank"
                       rel="noopener"
                       style="display:inline-block; padding:14px 28px;
                              font-family:Inter,Arial,sans-serif;
                              font-size:14px; font-weight:700;
                              letter-spacing:-0.1px; color:#ffffff;
                              text-decoration:none; border-radius:10px;">
                      Reset password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 22px;
                        font-family:Inter,Arial,sans-serif;
                        font-size:13px; line-height:1.7; color:#94a3b8;">
                If the button doesn't work, copy and paste this link into your
                browser:
              </p>

              <p style="margin:0 0 24px; padding:12px 14px;
                        background-color:#0b1220; border:1px solid #1f2c42;
                        border-radius:10px;
                        font-family:Inter,Arial,sans-serif;
                        font-size:12px; line-height:1.6;
                        word-break:break-all;">
                <a href="${resetURL}" target="_blank" rel="noopener"
                   style="color:#a78bfa; text-decoration:none;">${resetURL}</a>
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-top:20px; border-top:1px solid #1f2c42;
                             font-family:Inter,Arial,sans-serif;
                             font-size:12px; line-height:1.7; color:#64748b;">
                    Didn't request a password reset? You can safely ignore this
                    email — your password won't change.
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:22px 8px 0;
                       font-family:Inter,Arial,sans-serif;
                       font-size:11px; line-height:1.7; color:#64748b;">
              © 2026 ExpenseFlow. All rights reserved.<br />
              You received this email because a password reset was requested
              for this address.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports = { resetEmailHtml };
