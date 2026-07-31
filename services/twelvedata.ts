import "server-only";

import { z } from "zod";
import { fetchJson } from "@/lib/http";
import type { PriceBar, TechnicalIndicators } from "@/types/stock-research";

const SymbolSchema = z
  .string()
  .trim()
  .min(1)
  .max(16)
  .regex(/^[A-Za-z0-9.\-]+$/)
  .transform((s) => s.toUpperCase());

function getApiKey() {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) throw new Error("TWELVE_DATA_API_KEY not configured.");
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

type TwelveTimeSeriesValue = {
  datetime: string;
  open?: string;
  high?: string;
  low?: string;
  close?: string;
  volume?: string;
};

type TwelveTimeSeriesResponse = {
  values?: TwelveTimeSeriesValue[];
};

export async function getDailyTimeSeries(
  symbol: string,
  outputSize = 260
): Promise<PriceBar[]> {
  const ticker = SymbolSchema.parse(symbol);
  const url = new URL("https://api.twelvedata.com/time_series");
  url.searchParams.set("symbol", ticker);
  url.searchParams.set("interval", "1day");
  url.searchParams.set("outputsize", String(outputSize));
  url.searchParams.set("apikey", getApiKey());

  const data = await fetchJson<TwelveTimeSeriesResponse>(url.toString(), {
    next: { revalidate: 30 },
  });

  const values = (data.values ?? []).slice().reverse();
  return values.map((v) => ({
    date: v.datetime,
    open: num(v.open),
    high: num(v.high),
    low: num(v.low),
    close: num(v.close),
    volume: num(v.volume),
  }));
}

type TwelveRsiResponse = {
  values?: Array<{ rsi?: string; datetime?: string }>;
};

type TwelveMacdResponse = {
  values?: Array<{ macd?: string; macd_signal?: string; datetime?: string }>;
};

type TwelveSmaResponse = {
  values?: Array<{ sma?: string; datetime?: string }>;
};

async function getRsi14(symbol: string): Promise<number | null> {
  const ticker = SymbolSchema.parse(symbol);
  const url = new URL("https://api.twelvedata.com/rsi");
  url.searchParams.set("symbol", ticker);
  url.searchParams.set("interval", "1day");
  url.searchParams.set("time_period", "14");
  url.searchParams.set("apikey", getApiKey());

  const data = await fetchJson<TwelveRsiResponse>(url.toString(), {
    next: { revalidate: 30 },
  });

  return num(data.values?.[0]?.rsi);
}

async function getMacd(symbol: string): Promise<{ macd: number | null; signal: number | null }> {
  const ticker = SymbolSchema.parse(symbol);
  const url = new URL("https://api.twelvedata.com/macd");
  url.searchParams.set("symbol", ticker);
  url.searchParams.set("interval", "1day");
  url.searchParams.set("apikey", getApiKey());

  const data = await fetchJson<TwelveMacdResponse>(url.toString(), {
    next: { revalidate: 30 },
  });

  return {
    macd: num(data.values?.[0]?.macd),
    signal: num(data.values?.[0]?.macd_signal),
  };
}

async function getSma(symbol: string, period: number): Promise<number | null> {
  const ticker = SymbolSchema.parse(symbol);
  const url = new URL("https://api.twelvedata.com/sma");
  url.searchParams.set("symbol", ticker);
  url.searchParams.set("interval", "1day");
  url.searchParams.set("time_period", String(period));
  url.searchParams.set("apikey", getApiKey());

  const data = await fetchJson<TwelveSmaResponse>(url.toString(), {
    next: { revalidate: 30 },
  });

  return num(data.values?.[0]?.sma);
}

export async function getTechnicals(symbol: string): Promise<TechnicalIndicators> {
  const [rsi14, macd, sma50, sma200] = await Promise.all([
    getRsi14(symbol),
    getMacd(symbol),
    getSma(symbol, 50),
    getSma(symbol, 200),
  ]);

  return {
    rsi14,
    macd: macd.macd,
    macdSignal: macd.signal,
    sma50,
    sma200,
  };
}

