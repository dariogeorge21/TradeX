import type { MutualFundBundle } from "@/types/mutual-funds";

export const DUMMY_MUTUAL_FUNDS: Record<string, MutualFundBundle> = {
  "VFIAX": {
    symbol: "VFIAX",
    asOfIso: new Date().toISOString(),
    data: {
      summary: {
        symbol: "VFIAX",
        name: "Vanguard 500 Index Fund Admiral Shares",
        fund_family: "Vanguard",
        fund_type: "Large Blend",
        currency: "USD",
        share_class_inception_date: "2000-11-13",
        ytd_return: 15.2,
        expense_ratio_net: 0.04,
        yield: 1.45,
        nav: 450.21,
        min_investment: 3000,
        turnover_rate: 2.0,
        net_assets: 1200000000000,
        overview: "Vanguard 500 Index Fund Admiral Shares (VFIAX) tracks the S&P 500 Index, offering broad exposure to the largest U.S. companies. It is known for its low expense ratio and high liquidity.",
        people: [
          { name: "Michelle Louie", tenure_since: "2017-12-22" },
          { name: "Nick Birkett", tenure_since: "2023-08-01" }
        ],
      },
      performance: {
        trailing_returns: [
          { period: "1 Year", share_class_return: 22.4, category_return: 20.1, rank_in_category: 25 },
          { period: "3 Year", share_class_return: 10.5, category_return: 9.8, rank_in_category: 30 },
          { period: "5 Year", share_class_return: 15.2, category_return: 14.0, rank_in_category: 20 },
        ],
        annual_total_returns: [
          { year: 2023, share_class_return: 26.2, category_return: 24.5 },
          { year: 2022, share_class_return: -18.1, category_return: -19.0 },
          { year: 2021, share_class_return: 28.7, category_return: 26.0 },
        ],
        quarterly_total_returns: [],
        load_adjusted_return: [],
      },
      risk: {
        volatility_measures: [
          {
            period: "3 Year",
            alpha: 0.01,
            alpha_category: -0.5,
            beta: 1.0,
            beta_category: 1.05,
            mean_annual_return: 10.5,
            mean_annual_return_category: 9.8,
            r_squared: 100,
            r_squared_category: 98,
            std: 15.2,
            std_category: 16.0,
            sharpe_ratio: 0.65,
            sharpe_ratio_category: 0.6,
            treynor_ratio: 9.5,
            treynor_ratio_category: 8.9,
          }
        ],
        valuation_metrics: {
          price_to_earnings: 24.5,
          price_to_earnings_category: 23.0,
          price_to_book: 4.2,
          price_to_book_category: 3.9,
          price_to_sales: 2.8,
          price_to_sales_category: 2.5,
          price_to_cashflow: 15.0,
          price_to_cashflow_category: 14.5,
          median_market_capitalization: 200000,
          median_market_capitalization_category: 180000,
          "3_year_earnings_growth": 12.5,
          "3_year_earnings_growths_category": 11.0,
        }
      },
      ratings: {
        performance_rating: 4,
        risk_rating: 3,
        return_rating: 4,
      },
      composition: {
        major_market_sectors: [
          { sector: "Technology", weight: 30.5 },
          { sector: "Financial Services", weight: 12.8 },
          { sector: "Healthcare", weight: 12.5 },
          { sector: "Consumer Cyclical", weight: 10.2 },
        ],
        asset_allocation: {
          cash: 0.5,
          stocks: 99.5,
          preferred_stocks: 0,
          convertables: 0,
          bonds: 0,
          others: 0,
        },
        top_holdings: [
          { symbol: "AAPL", name: "Apple Inc", exchange: "NASDAQ", mic_code: "XNAS", weight: 7.1 },
          { symbol: "MSFT", name: "Microsoft Corp", exchange: "NASDAQ", mic_code: "XNAS", weight: 6.8 },
          { symbol: "AMZN", name: "Amazon.com Inc", exchange: "NASDAQ", mic_code: "XNAS", weight: 3.4 },
          { symbol: "NVDA", name: "NVIDIA Corp", exchange: "NASDAQ", mic_code: "XNAS", weight: 3.1 },
          { symbol: "GOOGL", name: "Alphabet Inc Class A", exchange: "NASDAQ", mic_code: "XNAS", weight: 2.1 },
        ],
        bond_breakdown: null,
      },
      purchase_info: {
        expenses: { expense_ratio_gross: 0.04, expense_ratio_net: 0.04 },
        minimums: {
          initial_investment: 3000,
          additional_investment: 1,
          initial_ira_investment: 3000,
          additional_ira_investment: 1,
        },
        pricing: { nav: 450.21, "12_month_low": 380.50, "12_month_high": 465.10, last_month: 440.00 },
        brokerages: [],
      },
      sustainability: {
        score: 65,
        corporate_esg_pillars: { environmental: 20, social: 25, governance: 20 },
        sustainable_investment: false,
        corporate_aum: 1200000000000,
      }
    },
    news: [
      {
        headline: "Vanguard 500 Index Fund Continues to Dominate Flows",
        source: "Financial News",
        datetimeUnixSeconds: Math.floor(Date.now() / 1000) - 86400,
        url: "#1",
        image: null,
        summary: "Investors continue to pour money into VFIAX as large-cap stocks rally."
      },
      {
        headline: "Understanding the Tax Efficiency of Index Funds",
        source: "Investment Weekly",
        datetimeUnixSeconds: Math.floor(Date.now() / 1000) - 172800,
        url: "#2",
        image: null,
        summary: "VFIAX remains one of the most tax-efficient options for taxable accounts."
      }
    ],
    providerErrors: [],
  },
  "FXAIX": {
    symbol: "FXAIX",
    asOfIso: new Date().toISOString(),
    data: {
      summary: {
        symbol: "FXAIX",
        name: "Fidelity 500 Index Fund",
        fund_family: "Fidelity Investments",
        fund_type: "Large Blend",
        currency: "USD",
        share_class_inception_date: "2011-05-04",
        ytd_return: 15.3,
        expense_ratio_net: 0.015,
        yield: 1.48,
        nav: 175.45,
        min_investment: 0,
        turnover_rate: 2.0,
        net_assets: 500000000000,
        overview: "Fidelity 500 Index Fund (FXAIX) seeks to provide investment results that correspond to the total return of the S&P 500 Index. It is noted for its exceptionally low expense ratio.",
        people: [
          { name: "Louis Bottari", tenure_since: "2009-01-01" },
          { name: "Payal Kapoor", tenure_since: "2013-11-20" }
        ],
      },
      performance: null,
      risk: null,
      ratings: {
        performance_rating: 4,
        risk_rating: 3,
        return_rating: 4,
      },
      composition: null,
      purchase_info: null,
      sustainability: null,
    },
    news: [],
    providerErrors: [],
  }
};

export function getFallbackMutualFundBundle(symbol: string): MutualFundBundle {
  const upperSymbol = symbol.toUpperCase();
  if (DUMMY_MUTUAL_FUNDS[upperSymbol]) {
    return DUMMY_MUTUAL_FUNDS[upperSymbol];
  }

  // Return a generic fallback for any other symbol
  return {
    symbol: upperSymbol,
    asOfIso: new Date().toISOString(),
    data: {
      summary: {
        symbol: upperSymbol,
        name: `${upperSymbol} Fund`,
        fund_family: "Generic Mutual Funds",
        fund_type: "Diversified",
        currency: "USD",
        share_class_inception_date: "2015-01-01",
        ytd_return: 8.5,
        expense_ratio_net: 0.5,
        yield: 1.2,
        nav: 100.00,
        min_investment: 1000,
        turnover_rate: 15.0,
        net_assets: 50000000,
        overview: `The ${upperSymbol} Fund is a diversified mutual fund aiming for steady growth. (This is dummy data for testing purposes.)`,
        people: [],
      },
      performance: null,
      risk: null,
      ratings: {
        performance_rating: 3,
        risk_rating: 3,
        return_rating: 3,
      },
      composition: null,
      purchase_info: null,
      sustainability: null,
    },
    news: [
      {
        headline: `Latest updates on ${upperSymbol}`,
        source: "Dummy News",
        datetimeUnixSeconds: Math.floor(Date.now() / 1000) - 43200,
        url: `#fallback-${upperSymbol}`,
        image: null,
        summary: `Market trends affect ${upperSymbol} performance. Analysts weigh in.`
      }
    ],
    providerErrors: [],
  };
}


// Additional Indian mutual fund benchmark dataset
const INDIAN_MUTUAL_FUND_NAMES = [
  "Parag Parikh Flexi Cap Fund",
  "HDFC Flexi Cap Fund",
  "ICICI Prudential Bluechip Fund",
  "SBI Contra Fund",
  "Nippon India Small Cap Fund",
  "Axis Bluechip Fund",
  "Mirae Asset Large Cap Fund",
  "Kotak Emerging Equity Fund",
  "Quant Small Cap Fund",
  "DSP Midcap Fund",
  "Canara Robeco Bluechip Equity Fund",
  "UTI Nifty 50 Index Fund",
  "Aditya Birla Sun Life Frontline Equity Fund",
  "Franklin India Prima Fund",
  "Tata Digital India Fund",
  "Edelweiss Mid Cap Fund",
  "Bandhan Small Cap Fund",
  "Motilal Oswal Midcap Fund",
  "HSBC Value Fund",
  "Mahindra Manulife Multicap Fund",
  "LIC MF Large Cap Fund",
  "PGIM India Flexi Cap Fund",
  "Invesco India Contra Fund",
  "WhiteOak Capital Flexi Cap Fund",
  "JM Flexicap Fund",
  "Sundaram Mid Cap Fund",
  "Bank of India Small Cap Fund",
  "Quantum Long Term Equity Value Fund",
  "Helios Flexi Cap Fund",
  "Union Flexi Cap Fund",
  "TrustMF Large & Mid Cap Fund",
  "Samco Flexi Cap Fund",
  "NJ Flexi Cap Fund",
  "360 ONE Focused Equity Fund",
  "Bajaj Finserv Flexi Cap Fund",
  "Groww Nifty Total Market Index Fund",
  "Zerodha ELSS Tax Saver Fund",
];

export const INDIAN_MUTUAL_FUND_TEST_DATA = Array.from({ length: 500 }, (_, i) => ({
  id: `IND-MF-${i + 1}`,
  name: INDIAN_MUTUAL_FUND_NAMES[i % INDIAN_MUTUAL_FUND_NAMES.length],
  amfiCode: 100000 + i,
  category: ["Large Cap", "Mid Cap", "Small Cap", "Flexi Cap", "ELSS", "Index Fund"][i % 6],
  risk: ["Low", "Moderate", "High", "Very High"][i % 4],
  benchmark: ["Nifty 50 TRI", "BSE 500 TRI", "Nifty Midcap 150 TRI", "Nifty Smallcap 250 TRI"][i % 4],
  plan: i % 2 === 0 ? "Direct" : "Regular",
  option: i % 3 === 0 ? "Growth" : "IDCW",
  nav: Number((10 + (i * 0.73) % 350).toFixed(2)),
  aumCrore: 100 + (i * 57),
  expenseRatio: Number((0.2 + (i % 30) * 0.05).toFixed(2)),
  rating: (i % 5) + 1,
  launchYear: 2000 + (i % 26),
  isin: `INF${String(100000000 + i).padStart(9, '0')}`,
}));