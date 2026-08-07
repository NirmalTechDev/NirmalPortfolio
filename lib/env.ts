import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string().min(16).default("nirmal_cmd_secret_key_2026_prod"),
  STAFF_EMAIL: z.string().default("nirmatech.dev@gmail.com"),
  STAFF_PASSCODE: z.string().min(6).default("admin2026"),
  GITHUB_TOKEN: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().default("https://nirmalranpariya.in"),
  NEXT_PUBLIC_COLLECTIVE_API_URL: z
    .string()
    .default("https://collective-onc6.onrender.com/api/v1"),
  COLLECTIVE_ADMIN_EMAIL: z.string().optional(),
  COLLECTIVE_ADMIN_PASSWORD: z.string().optional(),
});

export const env = envSchema.parse({
  AUTH_SECRET: process.env.AUTH_SECRET,
  STAFF_EMAIL: process.env.STAFF_EMAIL,
  STAFF_PASSCODE: process.env.STAFF_PASSCODE,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_COLLECTIVE_API_URL: process.env.NEXT_PUBLIC_COLLECTIVE_API_URL,
  COLLECTIVE_ADMIN_EMAIL: process.env.COLLECTIVE_ADMIN_EMAIL,
  COLLECTIVE_ADMIN_PASSWORD: process.env.COLLECTIVE_ADMIN_PASSWORD,
});

/** Comma-separated allowed staff emails */
export function getAllowedStaffEmails(): string[] {
  return env.STAFF_EMAIL.split(",").map((e) => e.trim().toLowerCase());
}
