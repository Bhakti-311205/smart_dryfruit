const sgMail = require("@sendgrid/mail");

// Lazy-initialize
let initialized = false;

function initSendGrid() {
  if (initialized) return true;

  const apiKey = process.env.SENDGRID_API_KEY;
  if (apiKey && apiKey.startsWith("SG.")) {
    sgMail.setApiKey(apiKey);
    initialized = true;
    console.log("[EmailService] SendGrid API Key initialized.");
    return true;
  } else {
    console.log("[EmailService] SendGrid not configured or invalid API key — using console fallback.");
    return false;
  }
}

async function sendOtpEmail(to, otp) {
  const isReady = initSendGrid();
  const fromEmail = process.env.EMAIL_FROM || "no-reply@nuthub-demo.local";

  const msg = {
    to,
    from: fromEmail,
    subject: "Your NutHub OTP Verification Code",
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    html: `
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
    `
  };

  if (isReady) {
    console.log("[EmailService] Sending OTP via SendGrid to:", to);
    try {
      const response = await sgMail.send(msg);
      console.log("[EmailService] Email sent successfully via SendGrid! Status:", response[0]?.statusCode);
    } catch (err) {
      console.error("[EmailService] FAILED to send email via SendGrid:", err.message);
      if (err.response) {
        console.error(err.response.body);
      }
      throw err;
    }
  } else {
    // Development fallback
    console.log("=== EMAIL (DEV FALLBACK) ===");
    console.log("To:", msg.to);
    console.log("Subject:", msg.subject);
    console.log("Text:", msg.text);
    console.log("============================");
    return Promise.resolve();
  }
}

module.exports = {
  sendOtpEmail
};
