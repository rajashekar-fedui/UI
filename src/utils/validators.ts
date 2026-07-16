/**
 * Form Validation Utilities
 * 
 * Production Pattern:
 * - Centralized validation logic
 * - Reusable validators
 * - Type-safe validation
 * - Consistent error messages
 */

import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

/**
 * Password validation schema
 * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)');

/**
 * Strong password (weaker version for optional fields)
 */
export const strongPasswordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

/**
 * Register form validation schema
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Change password validation schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Forgot password validation schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Utility function to validate form data
 */
export async function validateFormData<T>(schema: z.ZodSchema, data: unknown): Promise<T> {
  return schema.parseAsync(data);
}

/**
 * Utility function to get field errors
 */
export function getFieldError(error: z.ZodError, fieldName: string): string | undefined {
  return error.errors.find((err) => err.path[0] === fieldName)?.message;
}

/**
 * Utility function to convert Zod error to object
 */
export function zodErrorToObject(error: z.ZodError) {
  return error.errors.reduce(
    (acc, err) => {
      const key = String(err.path[0]);
      acc[key] = err.message;
      return acc;
    },
    {} as Record<string, string>
  );
}
