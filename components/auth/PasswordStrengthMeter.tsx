"use client";

import { useMemo } from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

interface StrengthResult {
  score: number; // 0-4
  label: string;
  color: string;
  checks: {
    length: boolean;
    letter: boolean;
    number: boolean;
    special: boolean;
    uppercase: boolean;
  };
}

function evaluatePassword(password: string): StrengthResult {
  const checks = {
    length: password.length >= 8,
    letter: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  };

  const passed = Object.values(checks).filter(Boolean).length;

  const levels: Array<{ score: number; label: string; color: string }> = [
    { score: 0, label: "Very Weak", color: "#ef4444" },
    { score: 1, label: "Weak", color: "#f97316" },
    { score: 2, label: "Fair", color: "#eab308" },
    { score: 3, label: "Good", color: "#84cc16" },
    { score: 4, label: "Strong", color: "#10b981" },
  ];

  const idx = Math.min(Math.max(passed - 1, 0), 4);
  return { ...levels[password.length === 0 ? 0 : idx], checks };
}

const requirementItems = [
  { key: "length" as const, label: "At least 8 characters" },
  { key: "uppercase" as const, label: "One uppercase letter" },
  { key: "number" as const, label: "One number" },
  { key: "special" as const, label: "One special character (!@#$...)" },
];

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => evaluatePassword(password), [password]);
  const segments = 4;

  if (!password) return null;

  return (
    <div className="pwd-meter" role="status" aria-live="polite" aria-label={`Password strength: ${strength.label}`}>
      {/* Segmented bar */}
      <div className="pwd-bar" aria-hidden="true">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className="pwd-segment"
            style={{
              backgroundColor:
                i < strength.score + 1 ? strength.color : "rgba(255,255,255,0.08)",
              transition: `background-color 0.3s ease ${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      {/* Label */}
      <div className="pwd-label" style={{ color: strength.color }}>
        {strength.label}
      </div>

      {/* Requirement checklist */}
      <ul className="pwd-requirements" aria-label="Password requirements">
        {requirementItems.map(({ key, label }) => (
          <li
            key={key}
            className={`pwd-req-item ${strength.checks[key] ? "met" : ""}`}
          >
            <span className="pwd-req-icon" aria-hidden="true">
              {strength.checks[key] ? "✓" : "○"}
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
