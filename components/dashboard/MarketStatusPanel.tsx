"use client";

import { useEffect, useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types (mirrored from API route)
// ---------------------------------------------------------------------------
interface MarketStatusData {
  exchange: string;
  holiday: string | null;
  isOpen: boolean;
  session: "pre-market" | "regular" | "post-market" | null;
  timezone: string;
  t: number;
}

interface HolidayEntry {
  atDate: string;
  eventName: string;
  tradingHour: string;
}

interface MarketHolidayData {
  exchange: string;
  timezone: string;
  data: HolidayEntry[];
}

interface ApiResponse {
  statuses: MarketStatusData[];
  holidays: MarketHolidayData[];
}

// ---------------------------------------------------------------------------
// Exchange display config
// ---------------------------------------------------------------------------
const EXCHANGE_META: Record<
  string,
  { name: string; flag: string; region: string }
> = {
  US: { name: "NYSE / NASDAQ", flag: "🇺🇸", region: "New York" },
  L: { name: "London Stock Exchange", flag: "🇬🇧", region: "London" },
  T: { name: "Tokyo Stock Exchange", flag: "🇯🇵", region: "Tokyo" },
  XHKG: { name: "Hong Kong Stock Exchange", flag: "🇭🇰", region: "Hong Kong" },
};

function getSessionLabel(
  session: MarketStatusData["session"],
  isOpen: boolean
): string {
  if (!isOpen) return "Closed";
  if (session === "pre-market") return "Pre-Market";
  if (session === "regular") return "Open";
  if (session === "post-market") return "After-Hours";
  return "Open";
}

function getSessionClass(
  session: MarketStatusData["session"],
  isOpen: boolean
): string {
  if (!isOpen) return "mkt-status-chip--closed";
  if (session === "regular") return "mkt-status-chip--open";
  if (session === "pre-market") return "mkt-status-chip--pre";
  if (session === "post-market") return "mkt-status-chip--post";
  return "mkt-status-chip--open";
}

// Format Unix timestamp to local time string
function formatTime(t: number, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone,
      hour12: true,
    }).format(new Date(t * 1000));
  } catch {
    return "--:--";
  }
}

// Get next upcoming holiday for an exchange
function getNextHoliday(
  holidays: MarketHolidayData[],
  exchange: string
): HolidayEntry | null {
  const now = new Date();
  const exchangeHolidays = holidays.find((h) => h.exchange === exchange);
  if (!exchangeHolidays?.data?.length) return null;
  const upcoming = exchangeHolidays.data
    .filter((h) => new Date(h.atDate) >= now)
    .sort(
      (a, b) => new Date(a.atDate).getTime() - new Date(b.atDate).getTime()
    );
  return upcoming[0] ?? null;
}

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------
function MarketStatusSkeleton() {
  return (
    <div className="mkt-status-panel" aria-label="Loading market status">
      <div className="mkt-status-header">
        <div className="mkt-status-title-row">
          <div className="mkt-skeleton mkt-skeleton--title" />
          <div className="mkt-skeleton mkt-skeleton--badge" />
        </div>
      </div>
      <div className="mkt-status-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="mkt-exchange-card mkt-exchange-card--skeleton">
            <div className="mkt-skeleton mkt-skeleton--flag" />
            <div className="mkt-skeleton mkt-skeleton--name" />
            <div className="mkt-skeleton mkt-skeleton--chip" />
            <div className="mkt-skeleton mkt-skeleton--time" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function MarketStatusPanel() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/market-status");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ApiResponse = await res.json();
      setData(json);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) return <MarketStatusSkeleton />;

  if (error) {
    return (
      <div className="mkt-status-panel mkt-status-panel--error">
        <div className="mkt-error-row">
          <span className="mkt-error-icon" aria-hidden="true">⚠️</span>
          <p className="mkt-error-text">Unable to load market status: {error}</p>
          <button
            className="mkt-retry-btn"
            onClick={() => { setLoading(true); fetchData(); }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statuses = data?.statuses ?? [];
  const holidays = data?.holidays ?? [];
  const openCount = statuses.filter((s) => s.isOpen).length;

  return (
    <section className="mkt-status-panel" aria-labelledby="mkt-status-heading">
      {/* Header */}
      <div className="mkt-status-header">
        <div className="mkt-status-title-row">
          <div className="mkt-status-title-group">
            <div className="mkt-status-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" width={18} height={18}>
                <circle
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="1.5"
                />
                <path
                  d="M12 6v6l4 2"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 id="mkt-status-heading" className="mkt-status-heading">
              Global Market Status
            </h2>
          </div>
          <div className="mkt-status-live-badge" aria-label="Live data">
            <span className="mkt-live-dot" aria-hidden="true" />
            <span>Live</span>
          </div>
        </div>
        <div className="mkt-status-meta-row">
          <span className="mkt-open-summary">
            <span className="mkt-open-count">{openCount}</span>
            <span> of {statuses.length} markets open</span>
          </span>
          {lastUpdated && (
            <span className="mkt-last-updated">
              Updated{" "}
              {new Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              }).format(lastUpdated)}
            </span>
          )}
        </div>
      </div>

      {/* Exchange cards grid */}
      <div className="mkt-status-grid" role="list">
        {statuses.map((status) => {
          const meta = EXCHANGE_META[status.exchange] ?? {
            name: status.exchange,
            flag: "🌐",
            region: status.timezone,
          };
          const sessionLabel = getSessionLabel(status.session, status.isOpen);
          const sessionClass = getSessionClass(status.session, status.isOpen);
          const localTime = formatTime(status.t, status.timezone);
          const nextHoliday = getNextHoliday(holidays, status.exchange);

          return (
            <article
              key={status.exchange}
              className={`mkt-exchange-card ${status.isOpen ? "mkt-exchange-card--open" : ""}`}
              role="listitem"
              aria-label={`${meta.name} — ${sessionLabel}`}
            >
              {/* Top row: flag + exchange name + session chip */}
              <div className="mkt-card-top">
                <span className="mkt-exchange-flag" aria-hidden="true">
                  {meta.flag}
                </span>
                <div className="mkt-exchange-info">
                  <span className="mkt-exchange-name">{meta.name}</span>
                  <span className="mkt-exchange-region">{meta.region}</span>
                </div>
                <div className={`mkt-status-chip ${sessionClass}`}>
                  {status.isOpen && (
                    <span className="mkt-chip-dot" aria-hidden="true" />
                  )}
                  <span>{sessionLabel}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="mkt-card-divider" />

              {/* Bottom row: local time + holiday */}
              <div className="mkt-card-bottom">
                <div className="mkt-card-time-group">
                  <span className="mkt-card-time-label">Local time</span>
                  <span className="mkt-card-time-value">{localTime}</span>
                </div>
                {status.holiday ? (
                  <div className="mkt-card-holiday">
                    <span className="mkt-holiday-icon" aria-hidden="true">🎉</span>
                    <span className="mkt-holiday-name">{status.holiday}</span>
                  </div>
                ) : nextHoliday ? (
                  <div className="mkt-card-next-holiday">
                    <span className="mkt-holiday-icon" aria-hidden="true">📅</span>
                    <div>
                      <span className="mkt-next-holiday-label">Next: </span>
                      <span className="mkt-next-holiday-name">
                        {nextHoliday.eventName}
                      </span>
                      <span className="mkt-next-holiday-date">
                        {" "}
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                        }).format(new Date(nextHoliday.atDate))}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
