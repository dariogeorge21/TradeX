import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard \u2014 TradeX",
  description: "Your TradeX market intelligence dashboard.",
};

// ---------------------------------------------------------------------------
// Time-of-day greeting (server-side, computed in UTC)
// ---------------------------------------------------------------------------
function getTimeGreeting(): { greeting: string; emoji: string } {
  const hour = new Date().getUTCHours();

  if (hour >= 5 && hour < 12) {
    return { greeting: "Good morning", emoji: "\u2600\uFE0F" };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: "Good afternoon", emoji: "\uD83C\uDF24\uFE0F" };
  } else if (hour >= 17 && hour < 21) {
    return { greeting: "Good evening", emoji: "\uD83C\uDF05" };
  } else {
    return { greeting: "Good night", emoji: "\uD83C\uDF19" };
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
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

  const { greeting, emoji } = getTimeGreeting();

  return (
    <div className="dash-home">
      {/* Ambient background blobs */}
      <div className="dash-home-bg" aria-hidden="true">
        <div className="dash-home-blob dash-home-blob--1" />
        <div className="dash-home-blob dash-home-blob--2" />
        <div className="auth-bg-grid" />
      </div>

      {/* Page content */}
      <div className="dash-home-content">
        {/* Greeting section */}
        <section
          className="dash-greeting-section"
          aria-labelledby="greeting-heading"
        >
          <div className="dash-greeting-badge" aria-hidden="true">
            <span className="dash-greeting-emoji">{emoji}</span>
          </div>
          <h1 id="greeting-heading" className="dash-greeting-title">
            {greeting},{" "}
            <span className="dash-greeting-name gradient-text-emerald">
              {displayName}
            </span>
            !
          </h1>
          <p className="dash-greeting-sub">
            Welcome to your TradeX dashboard. Your market intelligence hub is
            ready.
          </p>
        </section>

        {/* Widget area */}
        <section className="dash-widgets" aria-label="Dashboard overview">
          {(
            [
              {
                id: "stocks",
                label: "Stocks Tracked",
                value: "\u2014",
                desc: "Monitor your watchlist",
                accent: "emerald",
              },
              {
                id: "analyses",
                label: "AI Analyses",
                value: "\u2014",
                desc: "Instant market insights",
                accent: "blue",
              },
              {
                id: "portfolio",
                label: "Portfolio Value",
                value: "\u2014",
                desc: "Track your holdings",
                accent: "purple",
              },
            ] as const
          ).map(({ id, label, value, desc, accent }) => (
            <article
              key={id}
              className={`dash-widget-card dash-widget-card--${accent}`}
              aria-label={label}
            >
              <span className="dash-widget-value">{value}</span>
              <span className="dash-widget-label">{label}</span>
              <span className="dash-widget-desc">{desc}</span>
            </article>
          ))}
        </section>

        {/* Future content area */}
        <div
          className="dash-future-area"
          role="region"
          aria-label="Upcoming features"
        >
          <div className="dash-future-inner">
            <div className="dash-future-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" width={28} height={28}>
                <path
                  d="M3 12L7 8L11 12L17 6L21 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 20H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="dash-future-text">
              AI-powered stock analysis, real-time insights, and portfolio
              tracking are coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
