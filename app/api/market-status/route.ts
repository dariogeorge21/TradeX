import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Simple in-process cache
// ---------------------------------------------------------------------------
interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown, ttlMs: number): void {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface MarketStatusData {
  exchange: string;
  holiday: string | null;
  isOpen: boolean;
  session: "pre-market" | "regular" | "post-market" | null;
  timezone: string;
  t: number;
}

export interface HolidayEntry {
  atDate: string;
  eventName: string;
  tradingHour: string;
}

export interface MarketHolidayData {
  exchange: string;
  timezone: string;
  data: HolidayEntry[];
}

// The exchanges we will always fetch status for
const EXCHANGES = ["US", "L", "T", "XHKG"] as const;

// ---------------------------------------------------------------------------
// Route handler — GET /api/market-status
// Returns: { statuses: MarketStatusData[], holidays: MarketHolidayData[] }
// ---------------------------------------------------------------------------
export async function GET(_req: NextRequest) {
  const CACHE_KEY = "market:status+holidays";
  const cached = getCached(CACHE_KEY);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "X-Cache": "HIT", "Cache-Control": "public, max-age=60" },
    });
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Finnhub API key not configured." },
      { status: 500 }
    );
  }

  try {
    // Fetch status for all exchanges + holidays in parallel
    const statusRequests = EXCHANGES.map((ex) => {
      const url = new URL("https://finnhub.io/api/v1/stock/market-status");
      url.searchParams.set("exchange", ex);
      url.searchParams.set("token", apiKey);
      return fetch(url.toString(), { next: { revalidate: 60 } }).then((r) =>
        r.ok ? r.json() : null
      );
    });

    const holidayRequests = EXCHANGES.map((ex) => {
      const url = new URL("https://finnhub.io/api/v1/stock/market-holiday");
      url.searchParams.set("exchange", ex);
      url.searchParams.set("token", apiKey);
      return fetch(url.toString(), { next: { revalidate: 3600 } }).then((r) =>
        r.ok ? r.json() : null
      );
    });

    const [statusResults, holidayResults] = await Promise.all([
      Promise.all(statusRequests),
      Promise.all(holidayRequests),
    ]);

    const statuses = statusResults.filter(Boolean) as MarketStatusData[];
    const holidays = holidayResults.filter(Boolean) as MarketHolidayData[];

    const payload = { statuses, holidays };
    // Cache for 60 s (status changes frequently) 
    setCache(CACHE_KEY, payload, 60_000);

    return NextResponse.json(payload, {
      headers: { "X-Cache": "MISS", "Cache-Control": "public, max-age=60" },
    });
  } catch (err) {
    console.error("[/api/market-status] Fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch market data." },
      { status: 502 }
    );
  }
}
