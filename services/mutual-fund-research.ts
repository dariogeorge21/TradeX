import "server-only";

import { z } from "zod";
import { cache30s } from "@/lib/ttl-cache";
import { fetchJson } from "@/lib/http";
import type { MutualFundBundle, ProviderError, MutualFundData, NewsItem } from "@/types/mutual-funds";
import { getCompanyNews } from "@/services/finnhub";

const SymbolSchema = z
  .string()
  .trim()
  .min(1)
  .max(32)
  .regex(/^[A-Za-z0-9.\-]+$/)
  .transform((s) => s.toUpperCase());

function errorFor(provider: ProviderError["provider"], e: unknown): ProviderError {
  return {
    provider,
    message: e instanceof Error ? e.message : "Request failed.",
  };
}

function getApiKey() {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) throw new Error("TWELVE_DATA_API_KEY not configured.");
  return apiKey;
}

type TwelveDataMutualFundResponse = {
  mutual_fund?: MutualFundData;
  status: string;
  message?: string;
};

export async function getMutualFundBundle(symbol: string): Promise<MutualFundBundle> {
  const ticker = SymbolSchema.parse(symbol);
  const cacheKey = `mutual-fund:${ticker}`;

  return cache30s.getOrSet(cacheKey, 30_000, async () => {
    const asOfIso = new Date().toISOString();
    const providerErrors: ProviderError[] = [];

    const url = new URL("https://api.twelvedata.com/mutual_funds/world");
    url.searchParams.set("symbol", ticker);
    url.searchParams.set("apikey", getApiKey());

    let fundData: MutualFundData | null = null;
    let news: NewsItem[] = [];

    try {
      const data = await fetchJson<TwelveDataMutualFundResponse>(url.toString(), {
        next: { revalidate: 30 },
      });
      if (data.status === "error") {
        throw new Error(data.message || "Failed to fetch mutual fund data.");
      }
      fundData = data.mutual_fund ?? null;
    } catch (e) {
      providerErrors.push(errorFor("twelvedata", e));
    }

    // Try fetching some related news based on the fund family or name
    if (fundData && fundData.summary) {
      const searchName = fundData.summary.fund_family || fundData.summary.name.split(" ")[0];
      try {
        // We'll use finnhub news for the fund family as a proxy
        const finnhubNews = await getCompanyNews(searchName.substring(0, 10)); // just taking first part of family to get something
        news = finnhubNews || [];
      } catch (e) {
        providerErrors.push(errorFor("finnhub", e));
      }
    }

    return {
      symbol: ticker,
      asOfIso,
      data: fundData,
      news,
      providerErrors,
    };
  });
}
