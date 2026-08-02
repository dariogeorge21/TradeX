export type AssetType = 'stock' | 'crypto' | 'forex' | 'mutual_fund';
export type TransactionType = 'buy' | 'sell' | 'dividend' | 'bonus' | 'split' | 'ipo';

export interface PortfolioHolding {
  id: string;
  user_id: string;
  ticker: string;
  company_name: string;
  quantity: number;
  average_buy_price: number;
  current_price: number;
  market_value: number;
  asset_type: AssetType;
  exchange: string | null;
  currency: string;
  sector: string | null;
  created_at: string;
  updated_at: string;
  
  // Hydrated fields
  today_change?: number;
  today_change_percent?: number;
  overall_return?: number;
  overall_return_percent?: number;
  allocation_percent?: number;
  logo_url?: string;
  ai_rating?: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  risk_level?: 'Low' | 'Medium' | 'High';
}

export interface PortfolioTransaction {
  id: string;
  portfolio_id: string;
  transaction_type: TransactionType;
  quantity: number;
  price: number;
  fees: number;
  notes: string | null;
  created_at: string;
}

export interface PortfolioGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioStats {
  totalValue: number;
  todayChange: number;
  todayChangePercent: number;
  overallReturn: number;
  overallReturnPercent: number;
  realizedGain: number;
  unrealizedGain: number;
  dividendIncome: number;
  cashBalance: number;
  totalHoldings: number;
  averageReturn: number;
  bestPerformer: PortfolioHolding | null;
  worstPerformer: PortfolioHolding | null;
  portfolioHealthScore: number;
  aiConfidenceScore: number;
}

export interface AIInsights {
  portfolioHealth: string;
  strengths: string[];
  weaknesses: string[];
  riskAssessment: string;
  diversificationAnalysis: string;
  sectorConcentration: string;
  potentialOpportunities: string[];
  potentialRisks: string[];
  suggestedRebalancing: string[];
  overvaluedHoldings: string[];
  undervaluedHoldings: string[];
  longTermOutlook: string;
  confidenceScore: number;
  todaySummary: string;
}

export interface PerformanceDataPoint {
  date: string;
  value: number;
  benchmarkValue?: number; // e.g. SP500, NIFTY
}

export interface SectorAllocation {
  sector: string;
  percentage: number;
  value: number;
}
