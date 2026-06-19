import { z } from 'zod';

// ── Auth Validators ───────────────────────────────────────────────────────────

export const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(72, 'Password is too long'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// ── Report Validators ─────────────────────────────────────────────────────────

export const uploadReportSchema = z.object({
    reportType: z.string().max(100).default("Blood Report").optional(),
});

export const analyzeReportSchema = z.object({
    reportId: z.string().min(1, 'Report ID is required').regex(/^[a-f\d]{24}$/i, 'Invalid report ID format'),
});

// ── Profile Validators ────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email('Invalid email address').optional(),
    language: z.string().min(1).max(50).optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update'
});
