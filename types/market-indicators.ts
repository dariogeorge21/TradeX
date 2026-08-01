export type IndicatorType = "oscillator" | "trend" | "volatility" | "volume" | "breadth" | "sentiment" | "other";

export type SignalType = "Buy" | "Sell" | "Neutral" | "Strong Buy" | "Strong Sell";

export type TrendDirection = "Bullish" | "Bearish" | "Neutral" | "Sideways";

export interface MarketIndicator {
  id: string;
  name: string;
  shortName: string;
  type: IndicatorType;
  description: string;
  popular: boolean;
  category: string;
}

export interface IndicatorDataPoint {
  timestamp: number; // Unix epoch
  value: number;
  signal?: number; // e.g. MACD signal line
  histogram?: number; // e.g. MACD histogram
  upperBand?: number; // e.g. Bollinger Bands
  lowerBand?: number;
  sma?: number;
}

export interface IndicatorSnapshot {
  id: string;
  currentValue: number;
  previousValue: number;
  trend: TrendDirection;
  signal: SignalType;
  strengthScore: number; // 0-100
  confidenceScore: number; // 0-100
  updatedAt: number;
  timeframe: string;
  volatilityMetric: number;
}

export interface IndicatorResearchBundle {
  indicator: MarketIndicator;
  snapshot: IndicatorSnapshot;
  historicalData: IndicatorDataPoint[];
  relatedIndicators: string[];
}
