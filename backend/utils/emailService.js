const https = require("https");
const querystring = require("querystring");

/**
 * Send OTP email using Elastic Email HTTP API.
 * This approach uses HTTPS (Port 443) — never blocked by cloud providers.
 * No extra npm packages required.
 */
async function sendOtpEmail(to, otp) {
  const apiKey = process.env.ELASTIC_EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM || "inbhakti3112@gmail.com";
  const fromName = "NutHub";

  if (!apiKey) {
    // Dev fallback: just log the OTP
    console.log("=== EMAIL (DEV FALLBACK) ===");
    console.log("To:", to);
    console.log("OTP:", otp);
    console.log("===========================");
    return;
  }

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
      <div style="background: linear-gradient(135deg, #1e3c72, #2193b0); padding: 28px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.5px;">🥜 NutHub</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 13px;">Email Verification</p>
      </div>
      <div style="padding: 32px 24px; text-align: center;">
        <p style="color: #333; font-size: 15px; margin: 0 0 8px;">Hello,</p>
        <p style="color: #555; font-size: 14px; margin: 0 0 24px;">Use the code below to verify your account:</p>
        <div style="background: linear-gradient(135deg, #f0f7ff, #e8f4f8); border-radius: 10px; padding: 20px; display: inline-block; min-width: 200px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1e3c72;">${otp}</span>
        </div>
        <p style="color: #888; font-size: 13px; margin: 24px 0 0;">This code expires in <strong>5 minutes</strong>.</p>
        <p style="color: #aaa; font-size: 12px; margin: 16px 0 0;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
      <div style="background: #f8f9fa; padding: 16px 24px; text-align: center; border-top: 1px solid #eee;">
        <p style="color: #aaa; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} NutHub. All rights reserved.</p>
      </div>
    </div>
  `;

  const postData = querystring.stringify({
    apikey: apiKey,
    from: from,
    fromName: fromName,
    to: to,
    subject: "Your NutHub OTP Verification Code",
    bodyHtml: htmlBody,
    bodyText: `Your NutHub OTP code is ${otp}. It is valid for 5 minutes.`,
    isTransactional: true
  });

  return new Promise((resolve, reject) => {
    console.log("[EmailService] Sending OTP via Elastic Email to:", to);

    const options = {
      hostname: "api.elasticemail.com",
      path: "/v2/email/send",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log("[EmailService] Elastic Email sent! TransactionID:", result.data?.transactionid);
            resolve(result);
          } else {
            console.error("[EmailService] Elastic Email error:", result.error);
            reject(new Error(result.error || "Email send failed"));
          }
        } catch (e) {
          console.error("[EmailService] Failed to parse response:", data);
          reject(new Error("Invalid response from Elastic Email"));
        }
      });
    });

    req.on("error", (err) => {
      console.error("[EmailService] Network error:", err.message);
      reject(err);
    });

    req.setTimeout(15000, () => {
      console.error("[EmailService] Request timeout");
      req.destroy();
      reject(new Error("Email API request timed out"));
    });

    req.write(postData);
    req.end();
  });
}

module.exports = { sendOtpEmail };
