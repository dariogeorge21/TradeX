"use client";

import { useActionState, useState, useId } from "react";
import Link from "next/link";
import { signInWithEmail } from "@/app/actions/auth";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import type { AuthFormState } from "@/app/lib/auth-definitions";

const initialState: AuthFormState = undefined;

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const emailId = useId();
  const passwordId = useId();

  return (
    <div className="auth-form-wrapper">
      {/* Google OAuth */}
      <GoogleAuthButton label="Sign in with Google" />

      {/* Divider */}
      <div className="auth-divider" role="separator" aria-label="or">
        <span className="auth-divider-line" />
        <span className="auth-divider-text">or continue with email</span>
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
          <div className="auth-label-row">
            <label htmlFor={passwordId} className="auth-label">
              Password
            </label>
            <Link href="/forgot-password" className="auth-link auth-link--small">
              Forgot password?
            </Link>
          </div>
          <div className="auth-input-wrapper">
            <input
              id={passwordId}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              aria-invalid={!!state?.errors?.password}
              aria-describedby={state?.errors?.password ? `${passwordId}-error` : undefined}
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
              <span>Signing in…</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="auth-footer-text">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="auth-link">
          Create account
        </Link>
      </p>
    </div>
  );
}
