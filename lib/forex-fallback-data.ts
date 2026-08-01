import {
  ForexSnapshotTicker,
  ForexAggregate,
  ForexIndicatorValue,
  ForexMACDValue,
} from "@/types/forex";

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
const RNG = mulberry32(9876543); // fixed seed for forex

// Normal random variate using Box-Muller transform
function randomNormal(mean = 0, std = 1) {
  let u = 0, v = 0;
  while (u === 0) u = RNG();
  while (v === 0) v = RNG();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + std * z;
}

// ------------------------------------------------------------------
// 2. List of Forex pairs with realistic base prices & volatility
// ------------------------------------------------------------------
interface ForexMeta {
  symbol: string;
  basePrice: number;     
  volatility: number;    
  volume?: number;       
}

const FOREX_METAS: ForexMeta[] = [
  { symbol: "EURUSD", basePrice: 1.0850, volatility: 0.005, volume: 1_500_000_000 },
  { symbol: "GBPUSD", basePrice: 1.2650, volatility: 0.006, volume: 1_200_000_000 },
  { symbol: "USDJPY", basePrice: 151.50, volatility: 0.008, volume: 1_400_000_000 },
  { symbol: "AUDUSD", basePrice: 0.6550, volatility: 0.007, volume: 900_000_000 },
  { symbol: "USDCAD", basePrice: 1.3550, volatility: 0.005, volume: 800_000_000 },
  { symbol: "USDCHF", basePrice: 0.9050, volatility: 0.006, volume: 600_000_000 },
  { symbol: "NZDUSD", basePrice: 0.6050, volatility: 0.007, volume: 500_000_000 },
  { symbol: "EURGBP", basePrice: 0.8550, volatility: 0.004, volume: 600_000_000 },
  { symbol: "EURJPY", basePrice: 164.50, volatility: 0.008, volume: 700_000_000 },
  { symbol: "GBPJPY", basePrice: 191.50, volatility: 0.009, volume: 650_000_000 },
  { symbol: "AUDJPY", basePrice: 99.50, volatility: 0.008, volume: 550_000_000 },
  { symbol: "EURCHF", basePrice: 0.9850, volatility: 0.003, volume: 400_000_000 },
  { symbol: "EURAUD", basePrice: 1.6550, volatility: 0.006, volume: 300_000_000 },
  { symbol: "GBPAUD", basePrice: 1.9350, volatility: 0.007, volume: 250_000_000 },
  { symbol: "CADJPY", basePrice: 111.50, volatility: 0.008, volume: 200_000_000 },
];

export function getForexMeta(symbol: string): ForexMeta {
  const cleanSymbol = symbol.replace("C:", "").toUpperCase();
  const meta = FOREX_METAS.find((m) => m.symbol === cleanSymbol);
  if (meta) return meta;
  return {
    symbol: cleanSymbol,
    basePrice: 1.0 + RNG(),
    volatility: 0.005,
    volume: 100_000_000
  };
}

// ------------------------------------------------------------------
// 3. Generators for data
// ------------------------------------------------------------------

export function generateForexAggregates(
  symbol: string,
  days: number = 30
): ForexAggregate[] {
  const meta = getForexMeta(symbol);
  const aggregates: ForexAggregate[] = [];
  const now = Date.now();

  let currentPrice = meta.basePrice;
  for (let i = days; i >= 0; i--) {
    const isToday = i === 0;
    const t = now - i * 24 * 60 * 60 * 1000;
    const dailyReturn = randomNormal(0, meta.volatility);
    
    const o = currentPrice;
    const c = o * (1 + dailyReturn);
    const range = Math.abs(c - o) + (meta.basePrice * meta.volatility * Math.abs(randomNormal()));
    const h = Math.max(o, c) + range * 0.3;
    const l = Math.min(o, c) - range * 0.3;
    
    const v = (meta.volume || 100_000_000) * (1 + randomNormal(0, 0.2)) / meta.basePrice;
    const vw = (o + h + l + c) / 4;
    const n = Math.floor(v / (1000 * (1 + RNG())));

    aggregates.push({ t, o, h, l, c, v, vw, n });
    currentPrice = c;
  }
  return aggregates;
}

export function generateForexSnapshot(symbol: string): ForexSnapshotTicker {
  const meta = getForexMeta(symbol);
  const now = Date.now();
  
  const dailyReturn = randomNormal(0.0005, meta.volatility);
  const prevClose = meta.basePrice / (1 + dailyReturn);
  
  const h = Math.max(meta.basePrice, prevClose) * (1 + Math.abs(randomNormal(0, meta.volatility/2)));
  const l = Math.min(meta.basePrice, prevClose) * (1 - Math.abs(randomNormal(0, meta.volatility/2)));
  const v = (meta.volume || 1_000_000_000) / meta.basePrice;

  return {
    ticker: "C:" + meta.symbol,
    todaysChange: meta.basePrice - prevClose,
    todaysChangePerc: dailyReturn * 100,
    updated: now,
    day: {
      o: prevClose,
      h,
      l,
      c: meta.basePrice,
      v,
      vw: (prevClose + h + l + meta.basePrice) / 4,
    },
    min: {
      o: meta.basePrice * 0.9999,
      h: meta.basePrice * 1.0001,
      l: meta.basePrice * 0.9998,
      c: meta.basePrice,
      v: v / (24 * 60),
      vw: meta.basePrice,
    },
    prevDay: {
      o: prevClose * (1 - randomNormal(0, meta.volatility)),
      h: prevClose * 1.005,
      l: prevClose * 0.995,
      c: prevClose,
      v: v * 0.9,
      vw: prevClose,
    },
    lastQuote: {
      a: meta.basePrice * 1.0001,
      b: meta.basePrice * 0.9999,
      x: 1,
      t: now,
    },
  };
}

export function searchForexTickers(query: string) {
  const upperQuery = query.toUpperCase();
  return FOREX_METAS
    .filter((m) => m.symbol.includes(upperQuery))
    .map((m) => ({
      ticker: "C:" + m.symbol,
      name: m.symbol.slice(0,3) + "/" + m.symbol.slice(3,6),
      market: "forex",
      locale: "global",
      active: true,
      currency_symbol: m.symbol.slice(3,6)
    }));
}
