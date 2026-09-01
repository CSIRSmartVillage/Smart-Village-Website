import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: Number(env.smtpPort),
  secure: false, // Use STARTTLS (Port 587)
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

/**
 * Verify SMTP connection
 */
export const verifyEmailTransport = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email transporter is ready.");
  } catch (error) {
    console.error("❌ Email transporter verification failed:", error);
    throw error;
  }
};

/**
 * Send Contact Form Email
 */
export const sendContactEmail = async ({
  name,
  email,
  subject,
  message,
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"SMART Village Management Portal" <${env.smtpUser}>`,
      to: env.contactReceiver,
      replyTo: email,
      subject: `📩 Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Contact Form Submission</h2>

          <table cellpadding="6" cellspacing="0">
            <tr>
              <td><strong>Name</strong></td>
              <td>${name}</td>
            </tr>

            <tr>
              <td><strong>Email</strong></td>
              <td>${email}</td>
            </tr>

            <tr>
              <td><strong>Subject</strong></td>
              <td>${subject}</td>
            </tr>
          </table>

          <h3>Message</h3>

          <div
            style="
              background:#f5f5f5;
              padding:16px;
              border-radius:8px;
              white-space:pre-wrap;
            "
          >
${message}
          </div>

          <hr />

          <p style="color:#666;font-size:13px;">
            This email was automatically generated from the
            SMART Village Management Portal Contact Form.
          </p>
        </div>
      `,
    });

    return info;
  } catch (error) {
    console.error("❌ Failed to send contact email:", error);
    throw error;
  }
};
