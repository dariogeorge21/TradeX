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

export type TrendingStock = string;

export async function getTrendingStocks(): Promise<TrendingStock[]> {
  const { cache10m } = await import("@/lib/ttl-cache");

  return cache10m.getOrSet("trending-stocks", 600_000, async () => {
    const { getGroqApiKey, GROQ_FAST_MODEL } = await import("@/lib/groq");

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getGroqApiKey()}`,
      },
      body: JSON.stringify({
        model: GROQ_FAST_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a financial AI. Provide exactly 30 trending or famous stock symbols in JSON format as a simple array of strings (e.g. [\"AAPL\", \"MSFT\"]). Use real data. Do not add any extra text or markdown wrapping outside the JSON array.",
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch trending stocks from Groq.");
    }

    const data = await res.json();
    const content = data.choices[0]?.message?.content?.trim() ?? "[]";

    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as TrendingStock[];
      }
      throw new Error("Invalid format");
    } catch {
      // Fallback if AI fails to return valid JSON
      return [
        "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "TSM",
        "AVGO", "V", "WMT", "JPM", "UNH", "MA", "LLY", "JNJ", "PG", "HD",
        "ORCL", "CVX", "MRK", "KO", "PEP", "BAC", "COST", "MCD", "CRM",
        "ADBE", "CSCO", "NFLX"
      ];
    }
  });
}

