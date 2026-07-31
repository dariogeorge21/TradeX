"use server";

import { getMutualFundBundle } from "@/services/mutual-fund-research";
import type { MutualFundSummary } from "@/types/mutual-funds";

export type PopularMutualFundData = {
  symbol: string;
  summary: MutualFundSummary | null;
  performance_rating: number | null;
  risk_rating: number | null;
};

export async function fetchPopularMutualFundsData(symbols: string[]): Promise<PopularMutualFundData[]> {
  const results = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const bundle = await getMutualFundBundle(symbol);
        return {
          symbol,
          summary: bundle.data?.summary ?? null,
          performance_rating: bundle.data?.ratings?.performance_rating ?? null,
          risk_rating: bundle.data?.ratings?.risk_rating ?? null,
        };
      } catch (e) {
        // Fallback for individual failures so it doesn't break the whole list
        return { symbol, summary: null, performance_rating: null, risk_rating: null };
      }
    })
  );
  return results;
}

export type TrendingMutualFund = { symbol: string; name: string };

export async function getTrendingMutualFunds(): Promise<TrendingMutualFund[]> {
  const { cache10m } = await import("@/lib/ttl-cache");

  return cache10m.getOrSet("trending-mutual-funds", 600_000, async () => {
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
              "You are a financial AI. Provide exactly 12 trending or famous mutual funds in JSON format as an array of objects. Each object must have a 'symbol' and a 'name' property. Use real data. Do not add any extra text or markdown wrapping outside the JSON array.",
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch trending mutual funds from Groq.");
    }

    const data = await res.json();
    const content = data.choices[0]?.message?.content?.trim() ?? "[]";

    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as TrendingMutualFund[];
      }
      throw new Error("Invalid format");
    } catch {
      // Fallback if AI fails to return valid JSON
      return [
        { symbol: "FXAIX", name: "Fidelity 500 Index Fund" },
        { symbol: "VTSAX", name: "Vanguard Total Stock Market Index Fund" },
        { symbol: "VFIAX", name: "Vanguard 500 Index Fund" },
        { symbol: "PRASX", name: "T. Rowe Price Spectrum Conservative Allocation" },
        { symbol: "FCNTX", name: "Fidelity Contrafund" },
        { symbol: "VWENX", name: "Vanguard Wellington Fund" }, 
        { symbol: "AGTHX", name: "The Growth Fund of America" },
        { symbol: "VADAX", name: "Invesco Discovery Mid Cap Growth" },
        { symbol: "TRBCX", name: "T. Rowe Price Blue Chip Growth" },
        { symbol: "FDGRX", name: "Fidelity Growth Company" },
        { symbol: "SWPPX", name: "Schwab S&P 500 Index Fund" },
        { symbol: "VINIX", name: "Vanguard Institutional Index Fund" }
      ];
    }
  });
}

