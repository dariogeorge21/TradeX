import "server-only";

import { z } from "zod";
import { fetchJson } from "@/lib/http";
import type {
  CompanyProfile,
  Quote,
  BasicMetrics,
  NewsItem,
  RecommendationTrends,
} from "@/types/stock-research";

const SymbolSchema = z
  .string()
  .trim()
  .min(1)
  .max(16)
  .regex(/^[A-Za-z0-9.\-]+$/)
  .transform((s) => s.toUpperCase());

function getApiKey() {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) throw new Error("FINNHUB_API_KEY not configured.");
  return apiKey;
}

function buildUrl(path: string, params: Record<string, string>) {
  const url = new URL(`https://finnhub.io/api/v1/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("token", getApiKey());
  return url.toString();
}

type FinnhubProfile = {
  name?: string;
  ticker?: string;
  finnhubIndustry?: string;
  country?: string;
  exchange?: string;
  ipo?: string;
  weburl?: string;
  logo?: string;
  marketCapitalization?: number;
  shareOutstanding?: number;
};

export async function getCompanyProfile(symbol: string): Promise<CompanyProfile> {
  const ticker = SymbolSchema.parse(symbol);
  const url = buildUrl("stock/profile2", { symbol: ticker });
  const data = await fetchJson<FinnhubProfile>(url, { next: { revalidate: 30 } });

  return {
    name: data.name ?? null,
    ticker,
    industry: data.finnhubIndustry ?? null,
    country: data.country ?? null,
    exchange: data.exchange ?? null,
    ipo: data.ipo ?? null,
    website: data.weburl ?? null,
    logo: data.logo ?? null,
    marketCapitalization:
      typeof data.marketCapitalization === "number" ? data.marketCapitalization : null,
    sharesOutstanding:
      typeof data.shareOutstanding === "number" ? data.shareOutstanding : null,
  };
}

type FinnhubQuote = {
  c?: number;
  h?: number;
  l?: number;
  o?: number;
  pc?: number;
  t?: number;
  v?: number;
};

export async function getQuote(symbol: string): Promise<{
  quote: Quote;
  volume: number | null;
}> {
  const ticker = SymbolSchema.parse(symbol);
  const url = buildUrl("quote", { symbol: ticker });
  const data = await fetchJson<FinnhubQuote>(url, { next: { revalidate: 30 } });

  return {
    quote: {
      asOfUnixSeconds: typeof data.t === "number" ? data.t : null,
      current: typeof data.c === "number" ? data.c : null,
      previousClose: typeof data.pc === "number" ? data.pc : null,
      open: typeof data.o === "number" ? data.o : null,
      high: typeof data.h === "number" ? data.h : null,
      low: typeof data.l === "number" ? data.l : null,
    },
    volume: typeof data.v === "number" ? data.v : null,
  };
}

type FinnhubNewsItem = {
  headline?: string;
  source?: string;
  datetime?: number;
  url?: string;
  image?: string;
  summary?: string;
};

export async function getCompanyNews(symbol: string, days = 14): Promise<NewsItem[]> {
  const ticker = SymbolSchema.parse(symbol);
  const to = new Date();
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const url = buildUrl("company-news", {
    symbol: ticker,
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  });

  const data = await fetchJson<FinnhubNewsItem[]>(url, { next: { revalidate: 30 } });
  return (data ?? [])
    .filter((n) => typeof n.url === "string" && typeof n.headline === "string")
    .slice(0, 20)
    .map((n) => ({
      headline: n.headline ?? "",
      source: n.source ?? "Unknown",
      datetimeUnixSeconds: typeof n.datetime === "number" ? n.datetime : 0,
      url: n.url ?? "",
      image: n.image ?? null,
      summary: n.summary ?? null,
    }));
}

type FinnhubMetricsResponse = {
  metric?: Record<string, number | string | null | undefined>;
};

export async function getBasicMetrics(symbol: string): Promise<BasicMetrics> {
  const ticker = SymbolSchema.parse(symbol);
  const url = buildUrl("stock/metric", { symbol: ticker, metric: "all" });
  const data = await fetchJson<FinnhubMetricsResponse>(url, { next: { revalidate: 30 } });
  const m = data.metric ?? {};

  const num = (key: string): number | null =>
    typeof m[key] === "number" ? (m[key] as number) : null;

  return {
    volume: null,
    week52High: num("52WeekHigh"),
    week52Low: num("52WeekLow"),
    peRatio: num("peNormalizedAnnual"),
    eps: num("epsTTM"),
    dividendYield: num("dividendYieldIndicatedAnnual"),
    beta: num("beta"),
  };
}

type FinnhubRecommendation = {
  period?: string;
  strongBuy?: number;
  buy?: number;
  hold?: number;
  sell?: number;
  strongSell?: number;
};

export async function getRecommendationTrends(
  symbol: string
): Promise<RecommendationTrends[]> {
  const ticker = SymbolSchema.parse(symbol);
  const url = buildUrl("stock/recommendation", { symbol: ticker });
  const data = await fetchJson<FinnhubRecommendation[]>(url, { next: { revalidate: 30 } });

  return (data ?? []).slice(0, 8).map((r) => ({
    period: r.period ?? "",
    strongBuy: typeof r.strongBuy === "number" ? r.strongBuy : null,
    buy: typeof r.buy === "number" ? r.buy : null,
    hold: typeof r.hold === "number" ? r.hold : null,
    sell: typeof r.sell === "number" ? r.sell : null,
    strongSell: typeof r.strongSell === "number" ? r.strongSell : null,
  }));
}

