export function getEmailContent(token: string): string {
  const resetLink = `https://ubu.live/reset-password?token=${token}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      font-family: 'Arial', sans-serif;
      background-color: #ffffff;
      color: #000000;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
    }
    .email-header {
      background-color: #000000;
      color: #ffffff;
      padding: 20px 0;
      font-size: 28px;
      font-weight: bold;
    }
    .email-end {
      background-color: #000000;
      color: #ffffff;
      padding: 20px 0;
      margin-top: 20px;
      font-size: 28px;
      font-weight: bold;
    }
    .email-body {
      padding: 40px 20px;
      font-size: 16px;
      line-height: 1.6;
    }
    .email-body h2 {
      font-size: 22px;
      margin-bottom: 20px;
    }
    .email-button {
      display: inline-block;
      background-color: #000000;
      color: #ffffff !important;
      padding: 12px 24px;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      border-radius: 4px;
      margin-top: 20px;
    }
    .email-footer {
      background-color: #ffffff;
      font-size: 14px;
      color: #666666;
      padding: 30px 0;
      border-top: 1px solid #eaeaea;
    }
    .email-footer p {
      margin: 0;
    }
    .email-footer .social-icons {
      margin-top: 10px;
    }
    .social-icons img {
      width: 24px;
      height: 24px;
      margin: 0 10px;
    }
    .email-footer .footer-logo {
      margin-top: 20px;
      font-weight: bold;
      font-size: 20px;
      color: #000000;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      UBU
    </div>

    <!-- Body -->
    <div class="email-body">
      <h2>Reset Password</h2>
      <p>
        A password change has been requested for your account. If this was you, please use the link below to reset your password.
      </p>
      <a href="${resetLink}" class="email-button">Reset Password</a>
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p>UBU Corporation</p>
      <p>You are receiving this email because you opted in via our website.</p>
      <div class="social-icons">
        <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/3046/3046124.png" alt="TikTok"></a>
        <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook"></a>
        <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram"></a>
      </div>
      <div class="email-end">UBU</div>
    </div>
  </div>
</body>
</html>
`;
}
