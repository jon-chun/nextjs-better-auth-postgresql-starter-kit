/**
 * Email Sending Utilities
 * Supports multiple email providers (nodemailer for development)
 */

import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create reusable transporter for development
// In production, replace with Resend, SendGrid, or SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    : undefined,
});

export async function sendVerificationEmail({
  to,
  subject,
  html,
}: SendEmailOptions) {
  try {
    // In development without SMTP configured, log the email
    if (!process.env.SMTP_USER) {
      console.log("=== EMAIL (Dev Mode) ===");
      console.log("To:", to);
      console.log("Subject:", subject);
      console.log("HTML:", html);
      console.log("========================");
      return;
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"PlushifyMe" <noreply@plushifyme.com>',
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
  userName,
}: {
  to: string;
  resetUrl: string;
  userName?: string;
}) {
  return sendVerificationEmail({
    to,
    subject: "Reset your PlushifyMe password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">PlushifyMe</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
            <p>Hi ${userName || "there"},</p>
            <p>We received a request to reset your password for your PlushifyMe account.</p>
            <p style="margin: 30px 0;">
              <a href="${resetUrl}" style="background: #667eea; color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
            </p>
            <p>If you didn't request this, you can safely ignore this email. Your password won't change.</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">This link will expire in 24 hours for security reasons.</p>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>&copy; 2024 PlushifyMe. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendWelcomeEmail({
  to,
  userName,
}: {
  to: string;
  userName?: string;
}) {
  return sendVerificationEmail({
    to,
    subject: "Welcome to PlushifyMe! 🧸",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to PlushifyMe</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to PlushifyMe! 🧸</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Your account is ready!</h2>
            <p>Hi ${userName || "there"},</p>
            <p>Thanks for verifying your email! Your PlushifyMe account is now active.</p>
            <p>You can now start transforming your photos into adorable plushie versions with our AI-powered service.</p>
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #667eea;">Getting Started:</h3>
              <ul style="padding-left: 20px;">
                <li>Upload a photo from your dashboard</li>
                <li>Choose your favorite plushie style</li>
                <li>Watch the AI work its magic!</li>
                <li>Download and share your plushie</li>
              </ul>
            </div>
            <p style="margin: 30px 0;">
              <a href="${process.env.BETTER_AUTH_URL}/dashboard" style="background: #667eea; color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Go to Dashboard</a>
            </p>
            <p>If you have any questions, feel free to check out our <a href="${process.env.BETTER_AUTH_URL}/faq" style="color: #667eea;">FAQ</a> or contact our support team.</p>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>&copy; 2024 PlushifyMe. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
  });
}
