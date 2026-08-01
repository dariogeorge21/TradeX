import {
  MarketIndicator,
  IndicatorSnapshot,
  IndicatorDataPoint,
  SignalType,
  TrendDirection
} from "@/types/market-indicators";

// Seedable PRNG
function mulberry32(a: number) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const RNG = mulberry32(11223344);

function randomNormal(mean = 0, std = 1) {
  let u = 0, v = 0;
  while (u === 0) u = RNG();
  while (v === 0) v = RNG();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + std * z;
}

export const MARKET_INDICATORS: MarketIndicator[] = [
  { id: "rsi", name: "Relative Strength Index", shortName: "RSI", type: "oscillator", category: "Momentum", popular: true, description: "Measures the speed and change of price movements." },
  { id: "macd", name: "Moving Average Convergence Divergence", shortName: "MACD", type: "trend", category: "Trend", popular: true, description: "Trend-following momentum indicator that shows the relationship between two moving averages of a security’s price." },
  { id: "bbands", name: "Bollinger Bands", shortName: "BB", type: "volatility", category: "Volatility", popular: true, description: "Characterizes the prices and volatility over time of a financial instrument." },
  { id: "sma", name: "Simple Moving Average", shortName: "SMA", type: "trend", category: "Trend", popular: true, description: "Calculates the average of a selected range of prices, usually closing prices, by the number of periods in that range." },
  { id: "ema", name: "Exponential Moving Average", shortName: "EMA", type: "trend", category: "Trend", popular: true, description: "Places a greater weight and significance on the most recent data points." },
  { id: "vwap", name: "Volume Weighted Average Price", shortName: "VWAP", type: "volume", category: "Volume", popular: true, description: "The ratio of the value traded to total volume traded over a particular time horizon." },
  { id: "atr", name: "Average True Range", shortName: "ATR", type: "volatility", category: "Volatility", popular: false, description: "Measures market volatility by decomposing the entire range of an asset price for that period." },
  { id: "adx", name: "Average Directional Index", shortName: "ADX", type: "trend", category: "Trend", popular: false, description: "Used to quantify trend strength." },
  { id: "stoch", name: "Stochastic Oscillator", shortName: "Stoch", type: "oscillator", category: "Momentum", popular: false, description: "A momentum indicator comparing a particular closing price of a security to a range of its prices over a certain period of time." },
  { id: "obv", name: "On-Balance Volume", shortName: "OBV", type: "volume", category: "Volume", popular: false, description: "Uses volume flow to predict changes in stock price." },
  { id: "cci", name: "Commodity Channel Index", shortName: "CCI", type: "oscillator", category: "Momentum", popular: false, description: "Measures a security’s variation from its statistical mean." },
  { id: "ichimoku", name: "Ichimoku Cloud", shortName: "Ichimoku", type: "trend", category: "Trend", popular: false, description: "Shows support and resistance, and momentum and trend direction." },
  { id: "vix", name: "Volatility Index", shortName: "VIX", type: "volatility", category: "Market", popular: true, description: "Real-time market index representing the market's expectations for volatility over the coming 30 days." },
  { id: "fgindex", name: "Fear & Greed Index", shortName: "F&G", type: "sentiment", category: "Sentiment", popular: true, description: "Measures what emotion is driving the market." },
];

export function getIndicatorMeta(id: string): MarketIndicator | undefined {
  return MARKET_INDICATORS.find(ind => ind.id.toLowerCase() === id.toLowerCase());
}

export function generateIndicatorData(id: string, days: number = 90): IndicatorDataPoint[] {
  const meta = getIndicatorMeta(id);
  const data: IndicatorDataPoint[] = [];
  const now = Date.now();
  
  if (!meta) return [];

  let baseVal = 50;
  if (meta.id === "rsi") baseVal = 50;
  else if (meta.id === "macd") baseVal = 0;
  else if (meta.id === "vix") baseVal = 20;
  else if (meta.id === "fgindex") baseVal = 50;
  else if (meta.type === "volatility") baseVal = 2;
  else baseVal = 100;

  let currentVal = baseVal;
  let signalVal = baseVal;
  
  for (let i = days; i >= 0; i--) {
    const t = now - i * 24 * 60 * 60 * 1000;
    
    // Random walk with mean reversion for oscillators
    if (meta.type === "oscillator" || meta.type === "sentiment") {
       currentVal += randomNormal(0, 5);
       if (currentVal > 100) currentVal = 100 - RNG() * 5;
       if (currentVal < 0) currentVal = RNG() * 5;
    } else {
       currentVal += randomNormal(0, meta.id === 'macd' ? 1 : 2);
    }
    
    signalVal = signalVal * 0.8 + currentVal * 0.2; // Smooth signal

    let point: IndicatorDataPoint = {
      timestamp: t,
      value: Number(currentVal.toFixed(2))
    };

    if (meta.id === "macd") {
      point.signal = Number(signalVal.toFixed(2));
      point.histogram = Number((currentVal - signalVal).toFixed(2));
    }
    
    if (meta.id === "bbands") {
      point.sma = Number(currentVal.toFixed(2));
      point.upperBand = Number((currentVal + 5).toFixed(2));
      point.lowerBand = Number((currentVal - 5).toFixed(2));
    }

    data.push(point);
  }

  return data;
}

export function generateIndicatorSnapshot(id: string): IndicatorSnapshot | null {
  const meta = getIndicatorMeta(id);
  if (!meta) return null;

  const data = generateIndicatorData(id, 2);
  if (data.length < 2) return null;

  const current = data[data.length - 1];
  const prev = data[data.length - 2];
  
  const diff = current.value - prev.value;
  let trend: TrendDirection = diff > 0 ? "Bullish" : (diff < 0 ? "Bearish" : "Neutral");
  
  let signal: SignalType = "Neutral";
  if (meta.type === "oscillator") {
    if (current.value < 30) signal = "Buy";
    else if (current.value > 70) signal = "Sell";
  } else if (meta.id === "macd") {
     if (current.histogram && current.histogram > 0 && prev.histogram && prev.histogram <= 0) signal = "Buy";
     else if (current.histogram && current.histogram < 0 && prev.histogram && prev.histogram >= 0) signal = "Sell";
  } else {
     if (diff > 2) signal = "Strong Buy";
     else if (diff > 0.5) signal = "Buy";
     else if (diff < -2) signal = "Strong Sell";
     else if (diff < -0.5) signal = "Sell";
  }

  return {
    id: meta.id,
    currentValue: current.value,
    previousValue: prev.value,
    trend,
    signal,
    strengthScore: Math.floor(RNG() * 100),
    confidenceScore: 60 + Math.floor(RNG() * 40),
    updatedAt: Date.now(),
    timeframe: "1D",
    volatilityMetric: Number((RNG() * 10).toFixed(2))
  };
}
