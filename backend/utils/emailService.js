const { Resend } = require("resend");

// Lazy-initialize Resend client
let resend = null;

function getResendClient() {
  if (resend) return resend;

  const apiKey = process.env.RESEND_API_KEY;
  console.log("[EmailService] RESEND_API_KEY set:", apiKey ? `yes (${apiKey.length} chars)` : "no");

  if (apiKey) {
    resend = new Resend(apiKey);
    console.log("[EmailService] Resend client initialized.");
  } else {
    // Fallback: log emails to console in development
    console.log("[EmailService] RESEND_API_KEY not configured — using console fallback.");
    resend = {
      emails: {
        send: async (options) => {
          console.log("=== EMAIL (DEV FALLBACK) ===");
          console.log("To:", options.to);
          console.log("Subject:", options.subject);
          console.log("Text:", options.text);
          console.log("============================");
          return { data: { id: "dev-fallback" }, error: null };
        }
      }
    };
  }

  return resend;
}

async function sendOtpEmail(to, otp) {
  const from = process.env.EMAIL_FROM || "NutHub <onboarding@resend.dev>";

  const mailOptions = {
    from,
    to,
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

  console.log("[EmailService] Sending OTP email via Resend to:", to);
  try {
    const client = getResendClient();
    const { data, error } = await client.emails.send(mailOptions);
    if (error) {
      console.error("[EmailService] Resend API error:", error);
      throw new Error(error.message || "Failed to send email");
    }
    console.log("[EmailService] Email sent successfully! ID:", data?.id);
  } catch (err) {
    console.error("[EmailService] FAILED to send email:", err.message);
    throw err;
  }
}

module.exports = {
  sendOtpEmail
};
