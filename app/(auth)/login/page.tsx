import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your TradeX account to access AI-powered stock analysis and market insights.",
};

export default function LoginPage() {
  return (
    <>
      {/* Card heading */}
      <div className="auth-card-header">
        <div className="auth-card-badge">
          <svg className="auth-card-badge-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
          <span>Secure login</span>
        </div>
        <h1 className="auth-card-title">Welcome back</h1>
        <p className="auth-card-subtitle">
          Sign in to continue to your market insights dashboard
        </p>
      </div>

      <LoginForm />
    </>
  );
}
