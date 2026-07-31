import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "Dashboard — TradeX",
  description: "Your TradeX market intelligence dashboard.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "Trader";

  const avatarUrl =
    user?.user_metadata?.avatar_url ??
    user?.user_metadata?.picture ??
    null;

  const provider = user?.app_metadata?.provider ?? "email";

  return (
    <div className="dashboard-page">
      {/* Background */}
      <div className="dashboard-bg" aria-hidden="true">
        <div className="dashboard-bg-blob" />
        <div className="auth-bg-grid" />
      </div>

      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-logo">
            <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className="dashboard-logo-icon">
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
          </div>

          <div className="dashboard-user">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={`${displayName}'s avatar`}
                className="dashboard-avatar"
                width={36}
                height={36}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="dashboard-avatar dashboard-avatar--initials" aria-hidden="true">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="dashboard-username">{displayName}</span>
          </div>
        </header>

        {/* Welcome card */}
        <main id="main-content" className="dashboard-main">
          <div className="dashboard-welcome-card">
            <div className="dashboard-welcome-icon" aria-hidden="true">🎉</div>
            <h1 className="dashboard-welcome-title">Welcome to TradeX!</h1>
            <p className="dashboard-welcome-sub">
              You&apos;re signed in as <strong>{user?.email}</strong>
              {provider !== "email" && (
                <span className="dashboard-provider-badge"> via {provider}</span>
              )}
            </p>
            <p className="dashboard-welcome-desc">
              The full dashboard is coming soon. You&apos;ve successfully completed authentication —
              your AI-powered market insights are being prepared.
            </p>

            {/* Stats placeholder */}
            <div className="dashboard-stats">
              {[
                { label: "Stocks Tracked", value: "—" },
                { label: "AI Analyses", value: "—" },
                { label: "Portfolio Value", value: "—" },
              ].map(({ label, value }) => (
                <div key={label} className="dashboard-stat">
                  <span className="dashboard-stat-value">{value}</span>
                  <span className="dashboard-stat-label">{label}</span>
                </div>
              ))}
            </div>

            {/* Sign out */}
            <form action={signOut}>
              <button type="submit" className="dashboard-signout-btn">
                Sign Out
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
