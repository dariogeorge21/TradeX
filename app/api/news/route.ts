import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Simple in-process cache (survives within a single serverless invocation)
// ---------------------------------------------------------------------------
interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ---------------------------------------------------------------------------
// Valid categories accepted by Finnhub
// ---------------------------------------------------------------------------
const VALID_CATEGORIES = ["general", "forex", "crypto", "merger"] as const;
type Category = (typeof VALID_CATEGORIES)[number];

function isValidCategory(c: string): c is Category {
  return VALID_CATEGORIES.includes(c as Category);
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const rawCategory = searchParams.get("category") ?? "general";
  const minId = searchParams.get("minId") ?? "";

  const category = isValidCategory(rawCategory) ? rawCategory : "general";
  const cacheKey = `news:${category}:${minId}`;

  // Serve from cache if fresh
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "X-Cache": "HIT", "Cache-Control": "public, max-age=600" },
    });
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Finnhub API key not configured." },
      { status: 500 }
    );
  }

  const url = new URL("https://finnhub.io/api/v1/news");
  url.searchParams.set("category", category);
  url.searchParams.set("token", apiKey);
  if (minId) url.searchParams.set("minId", minId);

  try {
    const res = await fetch(url.toString(), {
      // Next.js fetch cache — revalidate every 600 s on the server
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Finnhub returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    setCache(cacheKey, data);

    return NextResponse.json(data, {
      headers: { "X-Cache": "MISS", "Cache-Control": "public, max-age=600" },
    });
  } catch (err) {
    console.error("[/api/news] Fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch news." },
      { status: 502 }
    );
  }
}
