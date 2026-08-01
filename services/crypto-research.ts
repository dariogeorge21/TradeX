import type {
  CryptoSnapshotTicker,
  CryptoAggregate,
  IndicatorValue,
  MACDValue,
  CryptoDetailBundle,
} from "@/types/crypto";

import {
  FALLBACK_CRYPTO_MARKET_SNAPSHOTS,
  FALLBACK_AGGREGATES_MAP,
  FALLBACK_RSI_MAP,
  FALLBACK_MACD_MAP,
  FALLBACK_EMA_MAP
} from "@/lib/crypto-fallback-data";

export async function getCryptoMarketSnapshots(
  tickers?: string
): Promise<CryptoSnapshotTicker[]> {
  // If specific tickers are requested, filter them. Otherwise, return all.
  if (tickers) {
    const requestedTickers = tickers.split(",").map(t => t.trim());
    return FALLBACK_CRYPTO_MARKET_SNAPSHOTS.filter(s => requestedTickers.includes(s.ticker));
  }
  return FALLBACK_CRYPTO_MARKET_SNAPSHOTS;
}

export async function getCryptoSnapshot(
  ticker: string
): Promise<CryptoSnapshotTicker | null> {
  const snapshot = FALLBACK_CRYPTO_MARKET_SNAPSHOTS.find(s => s.ticker === ticker);
  return snapshot || null;
}

export async function getCryptoAggregates(
  ticker: string,
  multiplier: number,
  timespan: string,
  from: string,
  to: string
): Promise<CryptoAggregate[]> {
  const symbol = ticker.replace("X:", "").replace("USD", "");
  return FALLBACK_AGGREGATES_MAP[symbol] || FALLBACK_AGGREGATES_MAP["BTC"];
}

export async function getCryptoIndicator<T>(
  type: "rsi" | "macd" | "ema",
  ticker: string,
  params?: Record<string, string>
): Promise<T[]> {
  const symbol = ticker.replace("X:", "").replace("USD", "");

  switch (type) {
    case "rsi":
      return (FALLBACK_RSI_MAP[symbol] || FALLBACK_RSI_MAP["BTC"]) as unknown as T[];
    case "macd":
      return (FALLBACK_MACD_MAP[symbol] || FALLBACK_MACD_MAP["BTC"]) as unknown as T[];
    case "ema":
      return (FALLBACK_EMA_MAP[symbol] || FALLBACK_EMA_MAP["BTC"]) as unknown as T[];
    default:
      return [];
  }
}

export async function getCryptoResearchBundle(
  ticker: string // e.g. "X:BTCUSD"
): Promise<CryptoDetailBundle> {
  const symbol = ticker.replace("X:", "").replace("USD", "");
  
  let snapshot = FALLBACK_CRYPTO_MARKET_SNAPSHOTS.find(s => s.ticker === ticker);
  
  if (!snapshot) {
    // If not found in dummy data, fallback to the first one but update the ticker
    // This allows searching for any ticker to still show *something* in dummy mode
    snapshot = { ...FALLBACK_CRYPTO_MARKET_SNAPSHOTS[0], ticker };
  }

  const aggregates = FALLBACK_AGGREGATES_MAP[symbol] || FALLBACK_AGGREGATES_MAP["BTC"];
  const rsi = FALLBACK_RSI_MAP[symbol] || FALLBACK_RSI_MAP["BTC"];
  const macd = FALLBACK_MACD_MAP[symbol] || FALLBACK_MACD_MAP["BTC"];
  const ema = FALLBACK_EMA_MAP[symbol] || FALLBACK_EMA_MAP["BTC"];

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
