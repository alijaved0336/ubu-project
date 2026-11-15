export const returnEmailWrapper1 = (messageBody: string) => {
  return `
  <div style="background-color: #fff; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 10px;">
    <div style="text-align: center; padding: 10px 0; background-color: #000;">
      <h1 style="color: white; font-family: 'Classy Vogue'; font-size: 36px; margin: 0;">
        UBU
      </h1>
    </div>
    <div style="padding: 20px;">
        ${messageBody}
    </div>
    <div style="text-align: center; padding: 10px; background-color: #f0f0f0;">
      <p style="font-size: 12px; color: #888;">UBU Corporation<br>
      You are receiving this email because you opted in via our website.</p>
      <div style="margin-top: 10px;">
        <a href="https://tiktok.com" style="text-decoration: none; color: #888;">TikTok</a> |
        <a href="https://facebook.com" style="text-decoration: none; color: #888;">Facebook</a> |
        <a href="https://instagram.com" style="text-decoration: none; color: #888;">Instagram</a>
      </div>
    </div>
  </div>
`;
};
