import {
  CryptoSnapshotTicker,
  CryptoAggregate,
  IndicatorValue,
  MACDValue,
} from "@/types/crypto";

// ------------------------------------------------------------------
// 1. Seedable pseudo-random number generator (Mulberry32)
//    (ensures reproducible "realistic" data)
// ------------------------------------------------------------------
function mulberry32(a: number) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const RNG = mulberry32(1234567); // fixed seed

// Normal random variate using Box-Muller transform
function randomNormal(mean = 0, std = 1) {
  let u = 0, v = 0;
  while (u === 0) u = RNG();
  while (v === 0) v = RNG();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + std * z;
}

// ------------------------------------------------------------------
// 2. List of cryptocurrencies with realistic base prices & volatility
//    (top 100+ by market cap as of 2025, approximate)
// ------------------------------------------------------------------
interface CryptoMeta {
  symbol: string;
  basePrice: number;     // approximate current USD price
  volatility: number;    // daily standard deviation (fraction)
  volume?: number;       // typical daily volume (USD)
}

const CRYPTO_METAS: CryptoMeta[] = [
  { symbol: "BTC", basePrice: 59250, volatility: 0.025, volume: 25_000_000_000 },
  { symbol: "ETH", basePrice: 2885, volatility: 0.030, volume: 15_000_000_000 },
  { symbol: "USDT", basePrice: 1.00, volatility: 0.001, volume: 50_000_000_000 },
  { symbol: "BNB", basePrice: 608, volatility: 0.035, volume: 2_000_000_000 },
  { symbol: "SOL", basePrice: 151, volatility: 0.045, volume: 3_000_000_000 },
  { symbol: "XRP", basePrice: 0.615, volatility: 0.040, volume: 2_500_000_000 },
  { symbol: "ADA", basePrice: 0.45, volatility: 0.042, volume: 1_500_000_000 },
  { symbol: "DOGE", basePrice: 0.16, volatility: 0.055, volume: 1_800_000_000 },
  { symbol: "AVAX", basePrice: 37.0, volatility: 0.050, volume: 1_200_000_000 },
  { symbol: "DOT", basePrice: 7.0, volatility: 0.048, volume: 800_000_000 },
  { symbol: "LINK", basePrice: 15.0, volatility: 0.045, volume: 700_000_000 },
  { symbol: "MATIC", basePrice: 0.72, volatility: 0.050, volume: 600_000_000 },
  { symbol: "SHIB", basePrice: 0.0000248, volatility: 0.060, volume: 1_000_000_000 },
  { symbol: "LTC", basePrice: 82.0, volatility: 0.038, volume: 500_000_000 },
  { symbol: "UNI", basePrice: 8.1, volatility: 0.050, volume: 400_000_000 },
  { symbol: "ATOM", basePrice: 8.5, volatility: 0.048, volume: 350_000_000 },
  { symbol: "ICP", basePrice: 10.0, volatility: 0.055, volume: 300_000_000 },
  { symbol: "XLM", basePrice: 0.248, volatility: 0.045, volume: 450_000_000 },
  { symbol: "FIL", basePrice: 6.5, volatility: 0.055, volume: 250_000_000 },
  { symbol: "VET", basePrice: 0.032, volatility: 0.060, volume: 300_000_000 },
  { symbol: "TRX", basePrice: 0.15, volatility: 0.040, volume: 600_000_000 },
  { symbol: "EOS", basePrice: 0.80, volatility: 0.050, volume: 200_000_000 },
  { symbol: "AAVE", basePrice: 120, volatility: 0.048, volume: 150_000_000 },
  { symbol: "MKR", basePrice: 1400, volatility: 0.050, volume: 100_000_000 },
  { symbol: "COMP", basePrice: 60, volatility: 0.055, volume: 80_000_000 },
  { symbol: "SNX", basePrice: 3.5, volatility: 0.060, volume: 120_000_000 },
  { symbol: "CRV", basePrice: 0.60, volatility: 0.065, volume: 150_000_000 },
  { symbol: "ALGO", basePrice: 0.18, volatility: 0.055, volume: 200_000_000 },
  { symbol: "NEAR", basePrice: 3.8, volatility: 0.060, volume: 180_000_000 },
  { symbol: "FTM", basePrice: 0.65, volatility: 0.070, volume: 220_000_000 },
  { symbol: "APT", basePrice: 10.5, volatility: 0.060, volume: 120_000_000 },
  { symbol: "ARB", basePrice: 1.20, volatility: 0.058, volume: 150_000_000 },
  { symbol: "OP", basePrice: 2.80, volatility: 0.062, volume: 130_000_000 },
  { symbol: "INJ", basePrice: 22, volatility: 0.065, volume: 100_000_000 },
  { symbol: "RUNE", basePrice: 4.5, volatility: 0.068, volume: 90_000_000 },
  { symbol: "FLOW", basePrice: 0.85, volatility: 0.058, volume: 80_000_000 },
  { symbol: "THETA", basePrice: 1.10, volatility: 0.055, volume: 70_000_000 },
  { symbol: "FET", basePrice: 1.80, volatility: 0.072, volume: 60_000_000 },
  { symbol: "GRT", basePrice: 0.25, volatility: 0.065, volume: 120_000_000 },
  { symbol: "STX", basePrice: 0.75, volatility: 0.068, volume: 100_000_000 },
  { symbol: "HNT", basePrice: 4.0, volatility: 0.070, volume: 40_000_000 },
  { symbol: "CRO", basePrice: 0.12, volatility: 0.050, volume: 150_000_000 },
  { symbol: "QNT", basePrice: 110, volatility: 0.055, volume: 30_000_000 },
  { symbol: "BCH", basePrice: 380, volatility: 0.045, volume: 300_000_000 },
  { symbol: "BSV", basePrice: 50, volatility: 0.055, volume: 80_000_000 },
  { symbol: "XMR", basePrice: 180, volatility: 0.048, volume: 100_000_000 },
  { symbol: "ZEC", basePrice: 30, volatility: 0.060, volume: 50_000_000 },
  { symbol: "DASH", basePrice: 30, volatility: 0.058, volume: 60_000_000 },
  { symbol: "ETC", basePrice: 25, volatility: 0.055, volume: 150_000_000 },
  { symbol: "KSM", basePrice: 35, volatility: 0.065, volume: 40_000_000 },
  { symbol: "YFI", basePrice: 7000, volatility: 0.055, volume: 20_000_000 },
  { symbol: "SUSHI", basePrice: 1.2, volatility: 0.070, volume: 80_000_000 },
  { symbol: "BAL", basePrice: 4.5, volatility: 0.060, volume: 30_000_000 },
  { symbol: "1INCH", basePrice: 0.50, volatility: 0.065, volume: 70_000_000 },
  { symbol: "ENS", basePrice: 20, volatility: 0.062, volume: 40_000_000 },
  { symbol: "LDO", basePrice: 2.0, volatility: 0.068, volume: 60_000_000 },
  { symbol: "RPL", basePrice: 25, volatility: 0.060, volume: 20_000_000 },
  { symbol: "FXS", basePrice: 3.5, volatility: 0.070, volume: 30_000_000 },
  { symbol: "CVX", basePrice: 4.0, volatility: 0.065, volume: 25_000_000 },
  { symbol: "ZIL", basePrice: 0.025, volatility: 0.072, volume: 100_000_000 },
  { symbol: "ANKR", basePrice: 0.035, volatility: 0.068, volume: 80_000_000 },
  { symbol: "ENJ", basePrice: 0.30, volatility: 0.070, volume: 60_000_000 },
  { symbol: "CHZ", basePrice: 0.08, volatility: 0.075, volume: 120_000_000 },
  { symbol: "BAT", basePrice: 0.25, volatility: 0.062, volume: 70_000_000 },
  { symbol: "MANA", basePrice: 0.50, volatility: 0.068, volume: 100_000_000 },
  { symbol: "SAND", basePrice: 0.40, volatility: 0.072, volume: 90_000_000 },
  { symbol: "AXS", basePrice: 7.5, volatility: 0.070, volume: 80_000_000 },
  { symbol: "ILV", basePrice: 80, volatility: 0.075, volume: 20_000_000 },
  { symbol: "SLP", basePrice: 0.003, volatility: 0.080, volume: 50_000_000 },
  { symbol: "SKL", basePrice: 0.04, volatility: 0.075, volume: 40_000_000 },
  { symbol: "CELO", basePrice: 0.70, volatility: 0.065, volume: 30_000_000 },
  { symbol: "AGIX", basePrice: 0.60, volatility: 0.080, volume: 60_000_000 },
  { symbol: "OCEAN", basePrice: 0.55, volatility: 0.072, volume: 50_000_000 },
  { symbol: "FET", basePrice: 1.80, volatility: 0.078, volume: 60_000_000 }, // duplicate? (fetch.ai already listed)
  // more can be added
];

// Ensure unique symbols (remove duplicates)
const uniqueMetas = CRYPTO_METAS.filter(
  (meta, index, self) => index === self.findIndex((m) => m.symbol === meta.symbol)
);

// ------------------------------------------------------------------
// 3. Generate historical aggregates for one symbol
// ------------------------------------------------------------------
function generateAggregatesForSymbol(
  meta: CryptoMeta,
  days = 365,
  drift = 0.0002 // slight upward drift per day
): CryptoAggregate[] {
  const { basePrice, volatility } = meta;
  const prices: number[] = [basePrice];
  for (let i = 1; i <= days; i++) {
    const dailyReturn = drift + randomNormal(0, volatility);
    const nextPrice = prices[i - 1] * Math.exp(dailyReturn);
    prices.push(Math.max(nextPrice, 0.000001)); // prevent zero
  }

  const aggregates: CryptoAggregate[] = [];
  const now = Date.now();
  for (let i = days; i >= 1; i--) {
    const open = prices[i - 1];
    const close = prices[i];
    const high = Math.max(open, close) * (1 + Math.abs(randomNormal(0, volatility * 0.4)));
    const low = Math.min(open, close) * (1 - Math.abs(randomNormal(0, volatility * 0.4)));
    const volume = (meta.volume || 1_000_000) * (0.5 + RNG() * 1.5);
    const vw = (open + high + low + close) / 4;
    aggregates.push({
      t: now - (i - 1) * 24 * 60 * 60 * 1000,
      o: open,
      h: high,
      l: low,
      c: close,
      v: Math.floor(volume),
      vw,
      n: Math.floor(volume / (vw || 1) * 0.01 + 100),
    });
  }
  return aggregates;
}

// ------------------------------------------------------------------
// 4. Generate snapshot from the latest aggregate
// ------------------------------------------------------------------
function generateSnapshotFromAggregates(
  symbol: string,
  aggregates: CryptoAggregate[]
): CryptoSnapshotTicker {
  const latest = aggregates[aggregates.length - 1];
  const prev = aggregates[aggregates.length - 2] || latest;
  const dayChange = latest.c - aggregates[0].o;
  const dayChangePerc = (dayChange / aggregates[0].o) * 100;
  const now = Date.now();

  // Generate a "minute" data point based on the daily candle
  const minOpen = latest.o + (latest.c - latest.o) * (0.4 + RNG() * 0.2);
  const minClose = latest.c + (latest.c - latest.o) * (0.1 - RNG() * 0.2);
  const minHigh = Math.max(minOpen, minClose) * (1 + Math.abs(randomNormal(0, 0.002)));
  const minLow = Math.min(minOpen, minClose) * (1 - Math.abs(randomNormal(0, 0.002)));
  const minVol = latest.v * 0.001 * (0.5 + RNG() * 1.0);

  return {
    ticker: `X:${symbol}USD`,
    todaysChange: dayChange,
    todaysChangePerc: dayChangePerc,
    updated: now,
    day: {
      o: aggregates[0].o,
      h: Math.max(...aggregates.map(a => a.h)),
      l: Math.min(...aggregates.map(a => a.l)),
      c: latest.c,
      v: aggregates.reduce((sum, a) => sum + a.v, 0),
      vw: aggregates.reduce((sum, a) => sum + a.v * a.vw, 0) / aggregates.reduce((sum, a) => sum + a.v, 0) || 0,
    },
    min: {
      o: minOpen,
      h: minHigh,
      l: minLow,
      c: minClose,
      v: minVol,
      vw: (minOpen + minHigh + minLow + minClose) / 4,
    },
    prevDay: {
      o: aggregates[aggregates.length - 2]?.o || 0,
      h: aggregates[aggregates.length - 2]?.h || 0,
      l: aggregates[aggregates.length - 2]?.l || 0,
      c: aggregates[aggregates.length - 2]?.c || 0,
      v: aggregates[aggregates.length - 2]?.v || 0,
      vw: aggregates[aggregates.length - 2]?.vw || 0,
    },
    lastTrade: {
      p: latest.c,
      s: latest.v / (latest.c || 1) * 0.01,
      t: now,
    },
  };
}

// ------------------------------------------------------------------
// 5. Generate RSI, MACD, EMA from aggregates
// ------------------------------------------------------------------
function computeRSI(aggregates: CryptoAggregate[], period = 14): IndicatorValue[] {
  const closes = aggregates.map(a => a.c);
  const changes = closes.map((c, i) => i === 0 ? 0 : c - closes[i - 1]);
  const gains = changes.map(c => c > 0 ? c : 0);
  const losses = changes.map(c => c < 0 ? -c : 0);

  const avgGain: number[] = [];
  const avgLoss: number[] = [];
  let sumGain = 0, sumLoss = 0;
  for (let i = 0; i < aggregates.length; i++) {
    if (i < period) {
      sumGain += gains[i];
      sumLoss += losses[i];
      if (i === period - 1) {
        avgGain[i] = sumGain / period;
        avgLoss[i] = sumLoss / period;
      } else {
        avgGain[i] = 0;
        avgLoss[i] = 0;
      }
    } else {
      avgGain[i] = (avgGain[i - 1] * (period - 1) + gains[i]) / period;
      avgLoss[i] = (avgLoss[i - 1] * (period - 1) + losses[i]) / period;
    }
  }

  return aggregates.map((a, i) => {
    const rs = avgLoss[i] === 0 ? 100 : avgGain[i] / avgLoss[i];
    const rsi = avgLoss[i] === 0 ? 100 : 100 - (100 / (1 + rs));
    return {
      timestamp: a.t,
      value: Math.min(100, Math.max(0, isNaN(rsi) ? 50 : rsi)),
    };
  });
}

function computeMACD(aggregates: CryptoAggregate[]): MACDValue[] {
  const closes = aggregates.map(a => a.c);
  const ema12: number[] = [];
  const ema26: number[] = [];
  let ema12Prev = closes[0];
  let ema26Prev = closes[0];

  for (let i = 0; i < closes.length; i++) {
    if (i === 0) {
      ema12[i] = closes[i];
      ema26[i] = closes[i];
    } else {
      ema12[i] = closes[i] * (2 / 13) + ema12Prev * (11 / 13);
      ema26[i] = closes[i] * (2 / 27) + ema26Prev * (25 / 27);
      ema12Prev = ema12[i];
      ema26Prev = ema26[i];
    }
  }

  return aggregates.map((a, i) => {
    const value = ema12[i] - ema26[i];
    const signal = i < 9 ? value : ema12[i] - ema26[i] * (2 / 10) + (i > 0 ? 0 : 0);
    return {
      timestamp: a.t,
      value,
      signal: i < 9 ? value : value * (2 / 10) + (i > 0 ? signal : 0),
      histogram: value - signal,
    };
  });
}

function computeEMA(aggregates: CryptoAggregate[], period = 20): IndicatorValue[] {
  const closes = aggregates.map(a => a.c);
  const multiplier = 2 / (period + 1);
  const ema: number[] = [];
  let emaPrev = closes[0];
  for (let i = 0; i < closes.length; i++) {
    if (i === 0) {
      ema[i] = closes[i];
    } else {
      ema[i] = closes[i] * multiplier + emaPrev * (1 - multiplier);
      emaPrev = ema[i];
    }
  }
  return aggregates.map((a, i) => ({
    timestamp: a.t,
    value: ema[i],
  }));
}

// ------------------------------------------------------------------
// 6. Generate all data
// ------------------------------------------------------------------
const now = Date.now();

// Generate aggregates for each symbol
const allAggregatesMap: Record<string, CryptoAggregate[]> = {};
const allSnapshots: CryptoSnapshotTicker[] = [];

uniqueMetas.forEach((meta) => {
  const agg = generateAggregatesForSymbol(meta, 365);
  allAggregatesMap[meta.symbol] = agg;
  const snapshot = generateSnapshotFromAggregates(meta.symbol, agg);
  allSnapshots.push(snapshot);
});

// Generate indicators for each symbol (based on aggregates)
const allRSIMap: Record<string, IndicatorValue[]> = {};
const allMACDMap: Record<string, MACDValue[]> = {};
const allEMAMap: Record<string, IndicatorValue[]> = {};

Object.keys(allAggregatesMap).forEach((symbol) => {
  const agg = allAggregatesMap[symbol];
  allRSIMap[symbol] = computeRSI(agg);
  allMACDMap[symbol] = computeMACD(agg);
  allEMAMap[symbol] = computeEMA(agg);
});

// ------------------------------------------------------------------
// 7. Exports
// ------------------------------------------------------------------

// Original fallback snapshots (now extended with all symbols)
export const FALLBACK_CRYPTO_MARKET_SNAPSHOTS: CryptoSnapshotTicker[] = allSnapshots;

// Historical aggregates by symbol
export const FALLBACK_AGGREGATES_MAP: Record<string, CryptoAggregate[]> = allAggregatesMap;

// Indicators by symbol
export const FALLBACK_RSI_MAP: Record<string, IndicatorValue[]> = allRSIMap;
export const FALLBACK_MACD_MAP: Record<string, MACDValue[]> = allMACDMap;
export const FALLBACK_EMA_MAP: Record<string, IndicatorValue[]> = allEMAMap;

// ------------------------------------------------------------------
// 8. Legacy generator functions (kept for backward compatibility)
//    (now use the generated data for consistency)
// ------------------------------------------------------------------
export function generateFallbackAggregates(basePrice: number = 50000): CryptoAggregate[] {
  // Return BTC aggregates as default
  return allAggregatesMap["BTC"] || [];
}

export function generateFallbackIndicator<T>(generator: (t: number) => T): T[] {
  // Not used in new approach, kept for compatibility
  const result: T[] = [];
  const nowMs = Date.now();
  for (let i = 90; i >= 0; i--) {
    result.push(generator(nowMs - i * 24 * 60 * 60 * 1000));
  }
  return result;
}

export function generateFallbackRSI(): IndicatorValue[] {
  return allRSIMap["BTC"] || [];
}

export function generateFallbackMACD(): MACDValue[] {
  return allMACDMap["BTC"] || [];
}

export function generateFallbackEMA(basePrice: number = 50000): IndicatorValue[] {
  return allEMAMap["BTC"] || [];
}