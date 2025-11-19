/**
 * Validation Schemas with Zod
 * Used for form validation and API request validation
 */

import { z } from "zod";
import { PLUSHIE_STYLES, IMAGE_UPLOAD } from "./constants";

// Authentication Schemas
export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .optional(),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Image Upload & Generation Schemas
const styleIds = PLUSHIE_STYLES.map((s) => s.id) as [string, ...string[]];

export const imageUploadSchema = z.object({
  style: z.enum(styleIds),
  prompt: z
    .string()
    .max(200, "Prompt must be less than 200 characters")
    .optional(),
});

export const imageFileSchema = z.custom<File>(
  (val) => val instanceof File,
  "Must be a file",
).refine(
  (file) =>
    IMAGE_UPLOAD.acceptedFormats.includes(
      file.type as (typeof IMAGE_UPLOAD.acceptedFormats)[number],
    ),
  `File must be one of: ${IMAGE_UPLOAD.acceptedFormats.join(", ")}`,
).refine(
  (file) => file.size <= IMAGE_UPLOAD.maxFileSize,
  `File size must be less than ${IMAGE_UPLOAD.maxSizeMB}MB`,
);

// User Profile Schemas
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
});

// User Settings Schemas
export const updateSettingsSchema = z.object({
  defaultStyle: z.enum(styleIds).optional(),
  emailNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
});

// Credits & Payments Schemas
export const purchaseCreditsSchema = z.object({
  planId: z.enum(["BASIC", "PRO", "ELITE"]),
});

// Type exports for TypeScript
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type ImageUploadInput = z.infer<typeof imageUploadSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type PurchaseCreditsInput = z.infer<typeof purchaseCreditsSchema>;
