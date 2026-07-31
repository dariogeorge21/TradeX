import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Email Verification",
  description: "Verify your email address.",
};

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string; error_description?: string }>;
}) {
  const { code, error, error_description } = await searchParams;
  let success = false;
  let errorMessage = error_description || error;

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!exchangeError) {
      success = true;
      // Sign the user out so they can log in explicitly as requested
      await supabase.auth.signOut();
    } else {
      errorMessage = exchangeError.message;
    }
  }

  return (
    <>
      <div className="auth-card-header">
        {success ? (
          <>
            <div className="auth-card-badge" style={{ color: "#10b981", borderColor: "rgba(16, 185, 129, 0.2)", background: "rgba(16, 185, 129, 0.1)" }}>
              <svg className="auth-card-badge-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Verification Successful</span>
            </div>
            <h1 className="auth-card-title">Email Verified</h1>
            <p className="auth-card-subtitle" style={{ marginBottom: "2rem" }}>
              Your email has been successfully verified. You can now sign in to your account.
            </p>
            <Link href="/login" className="auth-submit-btn" style={{ textDecoration: "none" }}>
              Login Now
            </Link>
          </>
        ) : (
          <>
            <div className="auth-card-badge" style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.2)", background: "rgba(239, 68, 68, 0.1)" }}>
              <svg className="auth-card-badge-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Verification Failed</span>
            </div>
            <h1 className="auth-card-title">Invalid or Expired Link</h1>
            <p className="auth-card-subtitle" style={{ marginBottom: "2rem" }}>
              {errorMessage || "The magic link you clicked is invalid or has expired."}
            </p>
            <Link href="/login" className="auth-submit-btn" style={{ textDecoration: "none" }}>
              Back to Login
            </Link>
          </>
        )}
      </div>
    </>
  );
}
