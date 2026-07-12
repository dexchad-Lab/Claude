import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const linkSchema = z.object({
  label: z.string().trim().min(1, "Link label is required").max(50),
  url: z.url("Enter a valid URL"),
});

export const applicationFormSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required").max(200),
  jobTitle: z.string().trim().min(1, "Job title is required").max(200),
  jobDescription: z.string().trim().max(20000).optional().or(z.literal("")),
  aboutCompany: z.string().trim().max(5000).optional().or(z.literal("")),
  outcomeNotes: z.string().trim().max(5000).optional().or(z.literal("")),
  links: z.array(linkSchema).max(20).optional().default([]),
});

export const quickCreateSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required").max(200),
  jobTitle: z.string().trim().min(1, "Job title is required").max(200),
  jobDescription: z.string().trim().max(20000).optional().or(z.literal("")),
  sourceUrl: z.url().optional().or(z.literal("")),
});

export const APPLICATION_STATUSES = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
] as const;

export const statusChangeSchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
  note: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.email("Enter a valid email"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export const connectionRequestSchema = z.object({
  email: z.email("Enter a valid email"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Missing reset token"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const messageSchema = z.object({
  content: z.string().trim().min(1, "Message can't be empty").max(4000),
});
