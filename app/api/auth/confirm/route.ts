import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * Handles email confirmation links sent by Supabase.
 * Validates the OTP token, establishes the session, then redirects.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as
    | "email"
    | "recovery"
    | "invite"
    | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      const redirectUrl = next.startsWith("/") ? `${origin}${next}` : `${origin}/dashboard`;
      return NextResponse.redirect(redirectUrl);
    }

    console.error("Email confirm error:", error.message);
  }

  return NextResponse.redirect(`${origin}/login?error=email_confirm_failed`);
}
