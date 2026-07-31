import "server-only";

import { z } from "zod";
import { fetchJson } from "@/lib/http";
import type { Fundamentals, PriceBar } from "@/types/stock-research";

const SymbolSchema = z
  .string()
  .trim()
  .min(1)
  .max(16)
  .regex(/^[A-Za-z0-9.\-]+$/)
  .transform((s) => s.toUpperCase());

function getApiKey() {
  const apiKey = process.env.TIINGO_API_KEY;
  if (!apiKey) throw new Error("TIINGO_API_KEY not configured.");
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

type TiingoDailyMeta = {
  ticker?: string;
  name?: string;
  description?: string;
  exchangeCode?: string;
  startDate?: string;
  endDate?: string;
};

export async function getFundamentals(symbol: string): Promise<Fundamentals> {
  const ticker = SymbolSchema.parse(symbol);
  const url = new URL(`https://api.tiingo.com/tiingo/daily/${encodeURIComponent(ticker)}`);
  url.searchParams.set("token", getApiKey());

  const data = await fetchJson<TiingoDailyMeta>(url.toString(), {
    next: { revalidate: 30 },
  });

  return {
    description: data.description ?? null,
  };
}

type TiingoPrice = {
  date: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
};

export async function getDailyPrices(
  symbol: string,
  days = 260
): Promise<PriceBar[]> {
  const ticker = SymbolSchema.parse(symbol);
  const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const url = new URL(
    `https://api.tiingo.com/tiingo/daily/${encodeURIComponent(ticker)}/prices`
  );
  url.searchParams.set("startDate", start);
  url.searchParams.set("resampleFreq", "daily");
  url.searchParams.set("token", getApiKey());

  const data = await fetchJson<TiingoPrice[]>(url.toString(), {
    next: { revalidate: 30 },
  });

  return (data ?? []).map((p) => ({
    date: p.date.slice(0, 10),
    open: num(p.open),
    high: num(p.high),
    low: num(p.low),
    close: num(p.close),
    volume: num(p.volume),
  }));
}

