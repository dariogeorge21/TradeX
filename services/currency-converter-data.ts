import {
  Currency,
  CurrencyDetail,
  CurrencyPairDetail,
  ExchangeRate,
  HistoricalRate,
} from "@/types/currency-converter";

// ---------------------------------------------------------------------------
// 1. Currencies List
// ---------------------------------------------------------------------------
export const ALL_CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", country: "United States", symbol: "$", flag: "🇺🇸", type: "Major" },
  { code: "EUR", name: "Euro", country: "Eurozone", symbol: "€", flag: "🇪🇺", type: "Major" },
  { code: "GBP", name: "British Pound", country: "United Kingdom", symbol: "£", flag: "🇬🇧", type: "Major" },
  { code: "JPY", name: "Japanese Yen", country: "Japan", symbol: "¥", flag: "🇯🇵", type: "Major" },
  { code: "CHF", name: "Swiss Franc", country: "Switzerland", symbol: "CHF", flag: "🇨🇭", type: "Major" },
  { code: "AUD", name: "Australian Dollar", country: "Australia", symbol: "A$", flag: "🇦🇺", type: "Major" },
  { code: "CAD", name: "Canadian Dollar", country: "Canada", symbol: "C$", flag: "🇨🇦", type: "Major" },
  { code: "NZD", name: "New Zealand Dollar", country: "New Zealand", symbol: "NZ$", flag: "🇳🇿", type: "Major" },
  { code: "CNY", name: "Chinese Yuan", country: "China", symbol: "¥", flag: "🇨🇳", type: "Minor" },
  { code: "INR", name: "Indian Rupee", country: "India", symbol: "₹", flag: "🇮🇳", type: "Minor" },
  { code: "SGD", name: "Singapore Dollar", country: "Singapore", symbol: "S$", flag: "🇸🇬", type: "Minor" },
  { code: "HKD", name: "Hong Kong Dollar", country: "Hong Kong", symbol: "HK$", flag: "🇭🇰", type: "Minor" },
  { code: "AED", name: "UAE Dirham", country: "United Arab Emirates", symbol: "د.إ", flag: "🇦🇪", type: "Minor" },
  { code: "SAR", name: "Saudi Riyal", country: "Saudi Arabia", symbol: "﷼", flag: "🇸🇦", type: "Minor" },
  { code: "ZAR", name: "South African Rand", country: "South Africa", symbol: "R", flag: "🇿🇦", type: "Minor" },
  { code: "BRL", name: "Brazilian Real", country: "Brazil", symbol: "R$", flag: "🇧🇷", type: "Minor" },
  { code: "MXN", name: "Mexican Peso", country: "Mexico", symbol: "$", flag: "🇲🇽", type: "Minor" },
  { code: "TRY", name: "Turkish Lira", country: "Turkey", symbol: "₺", flag: "🇹🇷", type: "Exotic" },
  { code: "RUB", name: "Russian Ruble", country: "Russia", symbol: "₽", flag: "🇷🇺", type: "Exotic" },
  { code: "KRW", name: "South Korean Won", country: "South Korea", symbol: "₩", flag: "🇰🇷", type: "Minor" },
];

// Helper to get currency by code
export const getCurrencyByCode = (code: string): Currency | undefined => {
  return ALL_CURRENCIES.find((c) => c.code === code.toUpperCase());
};

// ---------------------------------------------------------------------------
// 2. Base Exchange Rates (against USD for simplicity)
// ---------------------------------------------------------------------------
const BASE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 151.45,
  CHF: 0.90,
  AUD: 1.53,
  CAD: 1.36,
  NZD: 1.67,
  CNY: 7.23,
  INR: 83.45,
  SGD: 1.35,
  HKD: 7.82,
  AED: 3.67,
  SAR: 3.75,
  ZAR: 18.95,
  BRL: 5.05,
  MXN: 16.55,
  TRY: 32.10,
  RUB: 92.50,
  KRW: 1350.50,
};

// ---------------------------------------------------------------------------
// 3. Simulated Live Exchange Rates
// ---------------------------------------------------------------------------
export const generateLiveRate = (baseCode: string, targetCode: string): ExchangeRate => {
  const baseRateToUsd = BASE_RATES[baseCode] || 1;
  const targetRateToUsd = BASE_RATES[targetCode] || 1;
  
  // Rate: How much of TargetCurrency do you get for 1 BaseCurrency?
  // e.g. EUR to USD: target (1) / base (0.92) = 1.086
  const rate = targetRateToUsd / baseRateToUsd;
  
  // Add slight random fluctuation for realism (-0.5% to +0.5%)
  const fluctuation = rate * (Math.random() * 0.01 - 0.005);
  const currentRate = rate + fluctuation;
  
  const changePercent = (fluctuation / rate) * 100;

  return {
    baseCurrency: baseCode,
    targetCurrency: targetCode,
    pair: `${baseCode}/${targetCode}`,
    rate: currentRate,
    change: fluctuation,
    changePercent: changePercent,
    dailyHigh: currentRate * (1 + Math.random() * 0.005), // slightly higher
    dailyLow: currentRate * (1 - Math.random() * 0.005),  // slightly lower
    lastUpdated: new Date().toISOString(),
  };
};

export const getPopularPairs = (): ExchangeRate[] => {
  const pairs = [
    ["EUR", "USD"], ["GBP", "USD"], ["USD", "JPY"], ["USD", "CHF"],
    ["AUD", "USD"], ["USD", "CAD"], ["NZD", "USD"], ["EUR", "GBP"],
    ["EUR", "JPY"], ["GBP", "JPY"], ["USD", "INR"], ["USD", "CNY"],
    ["USD", "SGD"], ["EUR", "INR"]
  ];
  return pairs.map(([b, t]) => generateLiveRate(b, t));
};

// ---------------------------------------------------------------------------
// 4. Historical Data Generator
// ---------------------------------------------------------------------------
const generateHistory = (points: number, startRate: number, volatility: number): HistoricalRate[] => {
  const history: HistoricalRate[] = [];
  let currentRate = startRate;
  const now = new Date();
  
  for (let i = points; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    // Add random walk
    currentRate = currentRate * (1 + (Math.random() - 0.5) * volatility);
    history.push({
      timestamp: d.toISOString().split("T")[0],
      rate: currentRate
    });
  }
  return history;
};

// ---------------------------------------------------------------------------
// 5. Full Detail Fetchers
// ---------------------------------------------------------------------------
export const getCurrencyDetail = (code: string): CurrencyDetail | null => {
  const currency = getCurrencyByCode(code);
  if (!currency) return null;

  // Mock extended details
  return {
    ...currency,
    centralBank: `${currency.country} Central Bank`,
    inflationRate: 2.5 + (Math.random() * 3), // 2.5% - 5.5% dummy
    majorTradingPartners: ["United States", "China", "European Union"],
    economicHighlights: [
      `${currency.name} shows resilience amid global inflation.`,
      "Interest rate decisions expected later this quarter.",
      "Export volumes indicate steady economic recovery."
    ],
    aiOutlook: `The near-term outlook for ${code} remains cautiously optimistic. Factors such as monetary policy adjustments and global trade dynamics will likely dictate its movement. Support levels hold steady.`,
    frequentlyTradedPairs: [`${code}/USD`, `EUR/${code}`, `${code}/JPY`].filter(p => !p.includes("USD/USD") && !p.includes("EUR/EUR")),
  };
};

export const getCurrencyPairDetail = (base: string, target: string): CurrencyPairDetail | null => {
  const baseCurrency = getCurrencyByCode(base);
  const targetCurrency = getCurrencyByCode(target);
  if (!baseCurrency || !targetCurrency) return null;

  const currentRate = generateLiveRate(base, target);
  
  return {
    pair: `${base}/${target}`,
    baseCurrency,
    targetCurrency,
    currentRate,
    historicalData: {
      '1D': generateHistory(24, currentRate.rate, 0.001), // hourly-ish, pretending points=24 is 1D
      '1W': generateHistory(7, currentRate.rate, 0.003),
      '1M': generateHistory(30, currentRate.rate, 0.005),
      '3M': generateHistory(90, currentRate.rate, 0.008),
      '1Y': generateHistory(365, currentRate.rate, 0.01),
      '5Y': generateHistory(1825, currentRate.rate, 0.015),
    },
    marketSentiment: Math.random() > 0.5 ? "Bullish" : (Math.random() > 0.5 ? "Bearish" : "Neutral"),
    aiSummary: `The ${base}/${target} pair has experienced moderate volatility recently. Traders are watching key macroeconomic indicators from ${baseCurrency.country} and ${targetCurrency.country}.`,
    volatility: Math.random() > 0.5 ? "High" : "Low",
    strengthIndex: Math.floor(Math.random() * 40) + 40, // 40-80
  };
};
