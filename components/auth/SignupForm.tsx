"use client";

import { useActionState, useState, useId } from "react";
import Link from "next/link";
import { signUpWithEmail } from "@/app/actions/auth";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import type { AuthFormState } from "@/app/lib/auth-definitions";

const initialState: AuthFormState = undefined;

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const termsId = useId();

  if (state?.success) {
    return (
      <div className="auth-form-wrapper" style={{ textAlign: "center", padding: "1.5rem 0" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <div className="auth-card-badge" style={{ color: "#10b981", borderColor: "rgba(16, 185, 129, 0.2)", background: "rgba(16, 185, 129, 0.1)" }}>
            <svg className="auth-card-badge-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Success</span>
          </div>
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "oklch(0.97 0.003 240)", marginBottom: "0.5rem" }}>
          Check your email
        </h2>
        <p style={{ color: "oklch(0.65 0.01 240)", marginBottom: "2rem", lineHeight: "1.5" }}>
          We&apos;ve sent a confirmation link to your email address. Please check your inbox and click the link to verify your account.
        </p>
        <Link href="/login" className="auth-submit-btn" style={{ textDecoration: "none" }}>
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-form-wrapper">
      {/* Google OAuth */}
      <GoogleAuthButton label="Sign up with Google" />

      {/* Divider */}
      <div className="auth-divider" role="separator" aria-label="or">
        <span className="auth-divider-line" />
        <span className="auth-divider-text">or sign up with email</span>
        <span className="auth-divider-line" />
      </div>

      {/* General error */}
      {state?.errors?.general && (
        <div className="auth-error-banner" role="alert" aria-live="assertive">
          <svg className="auth-error-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {state.errors.general[0]}
        </div>
      )}

      <form action={formAction} className="auth-form" noValidate>
        {/* Full Name */}
        <div className="auth-field">
          <label htmlFor={nameId} className="auth-label">
            Full name
          </label>
          <input
            id={nameId}
            name="fullName"
            type="text"
            autoComplete="name"
            required
            placeholder="Alex Johnson"
            aria-invalid={!!state?.errors?.fullName}
            aria-describedby={state?.errors?.fullName ? `${nameId}-error` : undefined}
            className={`auth-input ${state?.errors?.fullName ? "auth-input--error" : ""}`}
          />
          {state?.errors?.fullName && (
            <p id={`${nameId}-error`} className="auth-field-error" role="alert">
              {state.errors.fullName[0]}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="auth-field">
          <label htmlFor={emailId} className="auth-label">
            Email address
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            aria-invalid={!!state?.errors?.email}
            aria-describedby={state?.errors?.email ? `${emailId}-error` : undefined}
            className={`auth-input ${state?.errors?.email ? "auth-input--error" : ""}`}
          />
          {state?.errors?.email && (
            <p id={`${emailId}-error`} className="auth-field-error" role="alert">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="auth-field">
          <label htmlFor={passwordId} className="auth-label">
            Password
          </label>
          <div className="auth-input-wrapper">
            <input
              id={passwordId}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!state?.errors?.password}
              aria-describedby={state?.errors?.password ? `${passwordId}-error` : "pwd-strength"}
              className={`auth-input auth-input--with-icon ${state?.errors?.password ? "auth-input--error" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="auth-pwd-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {state?.errors?.password && (
            <p id={`${passwordId}-error`} className="auth-field-error" role="alert">
              {state.errors.password[0]}
            </p>
          )}
          <div id="pwd-strength">
            <PasswordStrengthMeter password={password} />
          </div>
        </div>

        {/* Terms */}
        <div className="auth-field auth-field--checkbox">
          <input
            id={termsId}
            name="terms"
            type="checkbox"
            value="true"
            required
            aria-required="true"
            aria-invalid={!!state?.errors?.terms}
            className="auth-checkbox"
          />
          <label htmlFor={termsId} className="auth-checkbox-label">
            I agree to the{" "}
            <Link href="/terms" className="auth-link" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="auth-link" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </Link>
          </label>
          {state?.errors?.terms && (
            <p className="auth-field-error auth-field-error--full" role="alert">
              {state.errors.terms[0]}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="auth-submit-btn"
          aria-busy={isPending}
        >
          {isPending ? (
            <>
              <span className="btn-spinner" aria-hidden="true" />
              <span>Creating account…</span>
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="auth-footer-text">
        Already have an account?{" "}
        <Link href="/login" className="auth-link">
          Sign in
        </Link>
      </p>
    </div>
  );
}
