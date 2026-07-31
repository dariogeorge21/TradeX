import { z } from "zod";

// ---------------------------------------------------------------------------
// Signup schema
// ---------------------------------------------------------------------------
export const SignupFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(80, { message: "Name must be 80 characters or fewer." })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "Name can only contain letters, spaces, hyphens, and apostrophes.",
    })
    .trim(),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .trim(),
  terms: z.literal("true", {
    message: "You must accept the terms to continue.",
  }),
});

// ---------------------------------------------------------------------------
// Login schema
// ---------------------------------------------------------------------------
export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .trim(),
});

// ---------------------------------------------------------------------------
// Shared FormState type for useActionState
// ---------------------------------------------------------------------------
export type AuthFormState =
  | {
      errors?: {
        fullName?: string[];
        email?: string[];
        password?: string[];
        terms?: string[];
        general?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
