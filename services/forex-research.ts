import type {
  ForexSnapshotTicker,
  ForexAggregate,
  ForexIndicatorValue,
  ForexMACDValue,
  ForexDetailBundle,
} from "@/types/forex";

import {
  generateForexSnapshot,
  generateForexAggregates,
} from "@/lib/forex-fallback-data";

export async function getForexMarketSnapshots(
  tickers?: string
): Promise<ForexSnapshotTicker[]> {
  const t = tickers ? tickers.split(",").map(t => t.trim().replace("C:", "")) : ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "USDCHF"];
  return t.map(symbol => generateForexSnapshot(symbol));
}

export async function getForexSnapshot(
  ticker: string
): Promise<ForexSnapshotTicker | null> {
  const symbol = ticker.replace("C:", "");
  return generateForexSnapshot(symbol);
}

export async function getForexAggregates(
  ticker: string,
  multiplier: number,
  timespan: string,
  from: string,
  to: string
): Promise<ForexAggregate[]> {
  const symbol = ticker.replace("C:", "");
  return generateForexAggregates(symbol, 30);
}

export async function getForexIndicator<T>(
  type: "rsi" | "macd" | "ema",
  ticker: string,
  params?: Record<string, string>
): Promise<T[]> {
  const symbol = ticker.replace("C:", "");
  const aggregates = generateForexAggregates(symbol, 30);
  
  if (type === "rsi") {
    return aggregates.map(a => ({ timestamp: a.t, value: 50 + (Math.random() * 20 - 10) })) as unknown as T[];
  } else if (type === "macd") {
    return aggregates.map(a => ({ timestamp: a.t, value: Math.random(), signal: Math.random(), histogram: Math.random() })) as unknown as T[];
  } else if (type === "ema") {
    return aggregates.map(a => ({ timestamp: a.t, value: a.c })) as unknown as T[];
  }
  return [];
}

export async function getForexResearchBundle(
  ticker: string // e.g. "C:EURUSD"
): Promise<ForexDetailBundle> {
  const symbol = ticker.replace("C:", "");
  
  const snapshot = generateForexSnapshot(symbol);
  const aggregates = generateForexAggregates(symbol, 30);
  
  const rsi = aggregates.map(a => ({ timestamp: a.t, value: 50 + (Math.random() * 20 - 10) }));
  const macd = aggregates.map(a => ({ timestamp: a.t, value: Math.random(), signal: Math.random(), histogram: Math.random() }));
  const ema = aggregates.map(a => ({ timestamp: a.t, value: a.c }));

  return {
    symbol: ticker,
    asOfIso: new Date().toISOString(),
    snapshot,
    aggregates,
    rsi,
    macd,
    ema,
    providerErrors: [],
  };
}
