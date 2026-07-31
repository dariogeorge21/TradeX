"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import {
  SignupFormSchema,
  LoginFormSchema,
  type AuthFormState,
} from "@/app/lib/auth-definitions";

// ---------------------------------------------------------------------------
// Email/Password Sign-Up
// ---------------------------------------------------------------------------
export async function signUpWithEmail(
  state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const rawData = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    terms: formData.get("terms") as string,
  };

  const validated = SignupFormSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
    };
  }

  const { fullName, email, password } = validated.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    if (error.code === "user_already_exists" || error.message?.toLowerCase().includes("already registered")) {
      return {
        errors: {
          email: ["An account with this email already exists. Please log in."],
        },
      };
    }
    return {
      errors: {
        general: [error.message ?? "An unexpected error occurred. Please try again."],
      },
    };
  }

  return { success: true };
}

// ---------------------------------------------------------------------------
// Email/Password Sign-In
// ---------------------------------------------------------------------------
export async function signInWithEmail(
  state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = LoginFormSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
    };
  }

  const { email, password } = validated.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (
      error.code === "invalid_credentials" ||
      error.message?.toLowerCase().includes("invalid login")
    ) {
      return {
        errors: {
          general: ["Invalid email or password. Please try again."],
        },
      };
    }
    if (error.code === "email_not_confirmed") {
      return {
        errors: {
          general: ["Please verify your email address before logging in."],
        },
      };
    }
    return {
      errors: {
        general: [error.message ?? "An unexpected error occurred. Please try again."],
      },
    };
  }

  redirect("/dashboard");
}

// ---------------------------------------------------------------------------
// Google OAuth Sign-In / Sign-Up
// ---------------------------------------------------------------------------
export async function signInWithGoogle(): Promise<void> {
  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    redirect("/login?error=oauth_failed");
  }

  if (data?.url) {
    redirect(data.url);
  }
}

// ---------------------------------------------------------------------------
// Sign Out
// ---------------------------------------------------------------------------
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
