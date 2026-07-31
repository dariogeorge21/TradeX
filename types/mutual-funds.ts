export type MutualFundSymbol = string;

export type MutualFundSummary = {
  symbol: string;
  name: string;
  fund_family: string;
  fund_type: string;
  currency: string;
  share_class_inception_date: string;
  ytd_return: number;
  expense_ratio_net: number;
  yield: number;
  nav: number;
  min_investment: number;
  turnover_rate: number;
  net_assets: number;
  overview: string;
  people: Array<{ name: string; tenure_since: string }>;
};

export type TrailingReturn = {
  period: string;
  share_class_return: number;
  category_return: number;
  rank_in_category: number;
};

export type AnnualTotalReturn = {
  year: number;
  share_class_return: number;
  category_return: number;
};

export type QuarterlyTotalReturn = {
  year: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
};

export type LoadAdjustedReturn = {
  period: string;
  return: number;
};

export type MutualFundPerformance = {
  trailing_returns: TrailingReturn[];
  annual_total_returns: AnnualTotalReturn[];
  quarterly_total_returns: QuarterlyTotalReturn[];
  load_adjusted_return: LoadAdjustedReturn[];
};

export type VolatilityMeasure = {
  period: string;
  alpha: number;
  alpha_category: number;
  beta: number;
  beta_category: number;
  mean_annual_return: number;
  mean_annual_return_category: number;
  r_squared: number;
  r_squared_category: number;
  std: number;
  std_category: number;
  sharpe_ratio: number;
  sharpe_ratio_category: number;
  treynor_ratio: number;
  treynor_ratio_category: number;
};

export type ValuationMetrics = {
  price_to_earnings: number;
  price_to_earnings_category: number;
  price_to_book: number;
  price_to_book_category: number;
  price_to_sales: number;
  price_to_sales_category: number;
  price_to_cashflow: number;
  price_to_cashflow_category: number;
  median_market_capitalization: number;
  median_market_capitalization_category: number;
  "3_year_earnings_growth": number;
  "3_year_earnings_growths_category": number;
};

export type MutualFundRisk = {
  volatility_measures: VolatilityMeasure[];
  valuation_metrics: ValuationMetrics | null;
};

export type MutualFundRatings = {
  performance_rating: number;
  risk_rating: number;
  return_rating: number;
};

export type AssetAllocation = {
  cash: number;
  stocks: number;
  preferred_stocks: number;
  convertables: number;
  bonds: number;
  others: number;
};

export type TopHolding = {
  symbol: string;
  name: string;
  exchange: string;
  mic_code: string;
  weight: number;
};

export type BondBreakdown = {
  average_maturity: { fund: number; category: number };
  average_duration: { fund: number; category: number };
  credit_quality: Array<{ grade: string; weight: number }>;
};

export type MutualFundComposition = {
  major_market_sectors: Array<{ sector: string; weight: number }>;
  asset_allocation: AssetAllocation | null;
  top_holdings: TopHolding[];
  bond_breakdown: BondBreakdown | null;
};

export type PurchaseInfo = {
  expenses: { expense_ratio_gross: number; expense_ratio_net: number };
  minimums: {
    initial_investment: number;
    additional_investment: number;
    initial_ira_investment: number;
    additional_ira_investment: number;
  };
  pricing: { nav: number; "12_month_low": number; "12_month_high": number; last_month: number };
  brokerages: any[];
};

export type MutualFundSustainability = {
  score: number;
  corporate_esg_pillars: { environmental: number; social: number; governance: number };
  sustainable_investment: boolean;
  corporate_aum: number;
};

export type MutualFundData = {
  summary: MutualFundSummary | null;
  performance: MutualFundPerformance | null;
  risk: MutualFundRisk | null;
  ratings: MutualFundRatings | null;
  composition: MutualFundComposition | null;
  purchase_info: PurchaseInfo | null;
  sustainability: MutualFundSustainability | null;
};

export type MutualFundSearchResult = {
  symbol: MutualFundSymbol;
  name: string;
  country: string;
  currency: string;
  fund_family: string;
  fund_type: string;
  performance_rating: number;
  risk_rating: number;
  exchange: string;
  mic_code: string;
};

export type ProviderError = {
  provider: "twelvedata" | "finnhub";
  message: string;
};

export type NewsItem = {
  headline: string;
  source: string;
  datetimeUnixSeconds: number;
  url: string;
  image: string | null;
  summary: string | null;
};

export type MutualFundBundle = {
  symbol: MutualFundSymbol;
  asOfIso: string;
  data: MutualFundData | null;
  news: NewsItem[];
  providerErrors: ProviderError[];
};
