import type { Metadata } from "next";
import Link from "next/link";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s — TradeX",
    default: "Authentication — TradeX",
  },
  description: "Sign in or create your TradeX account to access AI-powered market insights.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-page">
      {/* Animated mesh gradient background */}
      <div className="auth-bg" aria-hidden="true">
        <div className="auth-bg-blob auth-bg-blob--1" />
        <div className="auth-bg-blob auth-bg-blob--2" />
        <div className="auth-bg-blob auth-bg-blob--3" />
        <div className="auth-bg-grid" />
      </div>

      {/* Header */}
      <header className="auth-header">
        <Link href="/" className="auth-logo" aria-label="TradeX — Go to home">
          <svg
            className="auth-logo-icon"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
          >
            <rect width="40" height="40" rx="10" fill="oklch(0.70 0.18 162)" fillOpacity="0.15" />
            <path
              d="M8 28L16 16L22 22L28 12L32 16"
              stroke="oklch(0.70 0.18 162)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="12" r="3" fill="oklch(0.70 0.18 162)" />
          </svg>
          <span className="auth-logo-text">TradeX</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="auth-main" id="main-content">
        <div className="auth-card">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-page-footer">
        <p>
          &copy; {new Date().getFullYear()} TradeX. All rights reserved.
        </p>
        <nav aria-label="Footer links">
          <Link href="/privacy" className="auth-footer-link">Privacy</Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms" className="auth-footer-link">Terms</Link>
        </nav>
      </footer>
    </div>
  );
}
