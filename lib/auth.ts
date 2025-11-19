/**
 * Better-Auth Configuration
 * Server-side authentication setup with Prisma adapter
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";
import { sendVerificationEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendVerificationEmail({
        to: user.email,
        subject: "Reset your PlushifyMe password",
        html: `
          <h1>Reset Your Password</h1>
          <p>Hi ${user.name || "there"},</p>
          <p>Click the link below to reset your password:</p>
          <a href="${url}">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>The link will expire in 24 hours.</p>
        `,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        to: user.email,
        subject: "Verify your PlushifyMe email",
        html: `
          <h1>Welcome to PlushifyMe!</h1>
          <p>Hi ${user.name || "there"},</p>
          <p>Thanks for signing up! Click the link below to verify your email address:</p>
          <a href="${url}">Verify Email</a>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>The link will expire in 24 hours.</p>
        `,
      });
    },
    sendOnSignUp: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (refresh if older than 1 day)
  },
  user: {
    additionalFields: {
      credits: {
        type: "number",
        defaultValue: 0,
        required: false,
      },
    },
  },
  advanced: {
    cookiePrefix: "plushifyme",
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
