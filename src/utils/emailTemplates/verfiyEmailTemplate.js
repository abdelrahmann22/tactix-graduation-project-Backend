export const verifyEmailTemplate = (userName, verifyLink) => `
<!DOCTYPE html>
<html>
  <body style="background-color:#f9f9f9; font-family:Inter, Arial, sans-serif; text-align:center; padding:40px;">
    <div style="background:#fff; padding:30px; border-radius:12px; border:1px solid #ddd; max-width:450px; margin:auto;">
      <h2 style="color:#111;">Hello, ${userName} 👋</h2>
      <p style="color:#555; line-height:1.6;">
        Thanks for registering! Please click the button below to verify your account.
      </p>
      <a href="${verifyLink}"
         style="display:inline-block; margin-top:20px; padding:12px 24px; background-color:#000; color:#fff; text-decoration:none; border-radius:8px; font-weight:bold;">
         Verify My Account
      </a>
      <p style="margin-top:20px; color:#999; font-size:13px;">
        If you didn’t create an account, you can safely ignore this email.
      </p>
    </div>
  </body>
</html>
`;
