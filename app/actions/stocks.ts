"use server";

import { getCompanyProfile, getQuote } from "@/services/finnhub";
import type { CompanyProfile, Quote } from "@/types/stock-research";

export type PopularStockData = {
  symbol: string;
  profile: CompanyProfile | null;
  quote: Quote | null;
};

export async function fetchPopularStocksData(symbols: string[]): Promise<PopularStockData[]> {
  const results = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const [profile, { quote }] = await Promise.all([
          getCompanyProfile(symbol),
          getQuote(symbol),
        ]);
        return { symbol, profile, quote };
      } catch (e) {
        // Fallback for individual failures so it doesn't break the whole list
        return { symbol, profile: null, quote: null };
      }
    })
  );
  return results;
}
