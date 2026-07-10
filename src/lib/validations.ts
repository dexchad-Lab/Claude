import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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
  jobDescription: z.string().trim().min(1, "Job description is required"),
  aboutCompany: z.string().trim().max(5000).optional().or(z.literal("")),
  outcomeNotes: z.string().trim().max(5000).optional().or(z.literal("")),
  links: z.array(linkSchema).max(20).optional().default([]),
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
