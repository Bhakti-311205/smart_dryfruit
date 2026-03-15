const nodemailer = require("nodemailer");

// Lazy-initialize transporter so env vars are guaranteed to be loaded
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { EMAIL_USER, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;

  console.log("[EmailService] Initializing OAuth2 transporter...");

  if (EMAIL_USER && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL_USER,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000
    });
    console.log(`[EmailService] Gmail OAuth2 transporter created for ${EMAIL_USER}`);
  } else {
    // Fallback: log emails to console in development if keys are missing
    console.log("[EmailService] OAuth2 credentials not fully configured — using console fallback.");
    transporter = {
      sendMail: async (options) => {
        console.log("=== EMAIL (DEV FALLBACK) ===");
        console.log("To:", options.to);
        console.log("Subject:", options.subject);
        console.log("============================");
        return Promise.resolve();
      }
    };
  }

  return transporter;
}

async function sendOtpEmail(to, otp) {
  const from = process.env.EMAIL_USER ? `"NutHub" <${process.env.EMAIL_USER}>` : '"NutHub" <no-reply@localhost>';

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

  console.log("[EmailService] Sending OTP via Gmail OAuth2 to:", to);
  try {
    const t = getTransporter();
    const info = await t.sendMail(mailOptions);
    console.log("[EmailService] Email sent successfully! MessageID:", info?.messageId);
    return info;
  } catch (err) {
    console.error("[EmailService] FAILED to send email via OAuth2:", err.message);
    if (err.response) console.error("[EmailService] OAuth2 Response:", err.response);
    throw err;
  }
}

module.exports = { sendOtpEmail };
