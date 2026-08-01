export type CurrencyType = "Major" | "Minor" | "Exotic";

export interface Currency {
  code: string; // e.g., USD
  name: string; // e.g., US Dollar
  country: string; // e.g., United States
  symbol: string; // e.g., $
  flag: string; // e.g., 🇺🇸
  type: CurrencyType;
}

export interface ExchangeRate {
  baseCurrency: string;
  targetCurrency: string;
  pair: string; // e.g., EUR/USD
  rate: number;
  change: number; // absolute change
  changePercent: number; // percentage change
  dailyHigh: number;
  dailyLow: number;
  lastUpdated: string; // ISO string
}

export interface HistoricalRate {
  timestamp: string; // ISO string
  rate: number;
}

export interface CurrencyPairDetail {
  pair: string;
  baseCurrency: Currency;
  targetCurrency: Currency;
  currentRate: ExchangeRate;
  historicalData: {
    '1D': HistoricalRate[];
    '1W': HistoricalRate[];
    '1M': HistoricalRate[];
    '3M': HistoricalRate[];
    '1Y': HistoricalRate[];
    '5Y': HistoricalRate[];
  };
  marketSentiment: "Bullish" | "Bearish" | "Neutral";
  aiSummary: string;
  volatility: string; // e.g., "High", "Low"
  strengthIndex: number; // 0-100
}

export interface CurrencyDetail extends Currency {
  centralBank: string;
  inflationRate: number;
  majorTradingPartners: string[];
  economicHighlights: string[];
  aiOutlook: string;
  frequentlyTradedPairs: string[];
}
