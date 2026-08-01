import type { StockSymbol } from "@/types/stocks";

export type ProviderError = {
  provider: "finnhub" | "twelvedata" | "tiingo" | "massive";
  message: string;
};

export type CompanyProfile = {
  name: string | null;
  ticker: StockSymbol;
  industry: string | null;
  country: string | null;
  exchange: string | null;
  ipo: string | null;
  website: string | null;
  logo: string | null;
  marketCapitalization: number | null;
  sharesOutstanding: number | null;
};

export type Fundamentals = {
  description: string | null;
};

export type Quote = {
  asOfUnixSeconds: number | null;
  current: number | null;
  previousClose: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
};

export type BasicMetrics = {
  volume: number | null;
  week52High: number | null;
  week52Low: number | null;
  peRatio: number | null;
  eps: number | null;
  dividendYield: number | null;
  beta: number | null;
  roe: number | null;
  profitMargin: number | null;
  revenue: number | null;
};

export type RecommendationTrends = {
  period: string;
  strongBuy: number | null;
  buy: number | null;
  hold: number | null;
  sell: number | null;
  strongSell: number | null;
};

export type NewsItem = {
  headline: string;
  source: string;
  datetimeUnixSeconds: number;
  url: string;
  image: string | null;
  summary: string | null;
};

export type PriceBar = {
  date: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
};

export type TechnicalIndicators = {
  rsi14: number | null;
  macd: number | null;
  macdSignal: number | null;
  sma50: number | null;
  sma200: number | null;
};

export type AIAnalysis = {
  sentiment: "Bullish" | "Bearish" | "Neutral";
  confidenceScore: number;
  bullCase: string[];
  bearCase: string[];
  risks: string[];
  catalysts: string[];
};

export type FinancialHealth = {
  revenueGrowth: number | null;
  debtToEquity: number | null;
  freeCashFlow: number | null;
  grossMargin: number | null;
  operatingMargin: number | null;
};

export type StockResearchBundle = {
  symbol: StockSymbol;
  asOfIso: string;
  profile: CompanyProfile | null;
  fundamentals: Fundamentals | null;
  quote: Quote | null;
  metrics: BasicMetrics | null;
  recommendations: RecommendationTrends[] | null;
  news: NewsItem[];
  historicalDaily: PriceBar[];
  technicals: TechnicalIndicators | null;
  aiAnalysis: AIAnalysis | null;
  financialHealth: FinancialHealth | null;
  providerErrors: ProviderError[];
};
