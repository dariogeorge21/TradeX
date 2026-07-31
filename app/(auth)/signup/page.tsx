import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create your free TradeX account to get AI-powered stock analysis, market insights, and investment risk evaluations.",
};

export default function SignupPage() {
  return (
    <>
      {/* Card heading */}
      <div className="auth-card-header">
        <div className="auth-card-badge">
          <svg className="auth-card-badge-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          <span>Free forever</span>
        </div>
        <h1 className="auth-card-title">Create your account</h1>
        <p className="auth-card-subtitle">
          Join thousands of investors using AI to understand markets
        </p>
      </div>

      <SignupForm />
    </>
  );
}
