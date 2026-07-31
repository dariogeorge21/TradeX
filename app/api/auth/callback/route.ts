import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * Handles the OAuth callback from Supabase after Google authentication.
 * Exchanges the auth code for a user session, then redirects to dashboard.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth errors from the provider
  if (error) {
    console.error("OAuth error:", error, errorDescription);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription ?? error)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // Successfully authenticated — redirect to dashboard or the intended page
      const redirectUrl = next.startsWith("/") ? `${origin}${next}` : `${origin}/dashboard`;
      return NextResponse.redirect(redirectUrl);
    }

    console.error("Code exchange error:", exchangeError.message);
  }

  // Something went wrong
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
