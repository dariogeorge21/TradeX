import "server-only";

import { z } from "zod";
import { fetchJson } from "@/lib/http";
import type { NewsItem, PriceBar } from "@/types/stock-research";

const SymbolSchema = z
  .string()
  .trim()
  .min(1)
  .max(16)
  .regex(/^[A-Za-z0-9.\-]+$/)
  .transform((s) => s.toUpperCase());

function getApiKey() {
  const apiKey = process.env.MASSIVE_API_KEY;
  if (!apiKey) throw new Error("MASSIVE_API_KEY not configured.");
  return apiKey;
}

function num(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

type PolygonNewsResult = {
  article_url?: string;
  title?: string;
  publisher?: { name?: string };
  published_utc?: string;
  image_url?: string;
  description?: string;
};

type PolygonNewsResponse = {
  results?: PolygonNewsResult[];
};

export async function getMarketNews(symbol: string): Promise<NewsItem[]> {
  const ticker = SymbolSchema.parse(symbol);
  const url = new URL("https://api.polygon.io/v2/reference/news");
  url.searchParams.set("ticker", ticker);
  url.searchParams.set("limit", "20");
  url.searchParams.set("apiKey", getApiKey());

  const data = await fetchJson<PolygonNewsResponse>(url.toString(), {
    next: { revalidate: 30 },
  });

  return (data.results ?? [])
    .filter((n) => typeof n.article_url === "string" && typeof n.title === "string")
    .map((n) => ({
      headline: n.title ?? "",
      source: n.publisher?.name ?? "Massive",
      datetimeUnixSeconds: n.published_utc ? Math.floor(Date.parse(n.published_utc) / 1000) : 0,
      url: n.article_url ?? "",
      image: n.image_url ?? null,
      summary: n.description ?? null,
    }));
}

type PolygonAggBar = {
  t?: number;
  o?: number;
  h?: number;
  l?: number;
  c?: number;
  v?: number;
};

type PolygonAggsResponse = {
  results?: PolygonAggBar[];
};

export async function getDailyAggregates(
  symbol: string,
  days = 260
): Promise<PriceBar[]> {
  const ticker = SymbolSchema.parse(symbol);
  const to = new Date();
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const fromStr = from.toISOString().slice(0, 10);
  const toStr = to.toISOString().slice(0, 10);

  const url = new URL(
    `https://api.polygon.io/v2/aggs/ticker/${encodeURIComponent(
      ticker
    )}/range/1/day/${fromStr}/${toStr}`
  );
  url.searchParams.set("adjusted", "true");
  url.searchParams.set("sort", "asc");
  url.searchParams.set("limit", "50000");
  url.searchParams.set("apiKey", getApiKey());

  const data = await fetchJson<PolygonAggsResponse>(url.toString(), {
    next: { revalidate: 30 },
  });

  return (data.results ?? []).map((b) => ({
    date: typeof b.t === "number" ? new Date(b.t).toISOString().slice(0, 10) : "",
    open: num(b.o),
    high: num(b.h),
    low: num(b.l),
    close: num(b.c),
    volume: num(b.v),
  }));
}

