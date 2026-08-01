import "server-only";

import { z } from "zod";
import { cache30s } from "@/lib/ttl-cache";
import { fetchJson } from "@/lib/http";
import type { MutualFundBundle, ProviderError, MutualFundData, NewsItem, MutualFundSummary } from "@/types/mutual-funds";
import { getCompanyNews } from "@/services/finnhub";
import { getFallbackMutualFundBundle } from "@/lib/mutual-funds-fallback-data";

const SymbolSchema = z
  .string()
  .trim()
  .min(1)
  .max(32)
  .regex(/^[A-Za-z0-9.\-_]+$/)
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

type TwelveDataListItem = {
  symbol: string;
  name: string;
  country?: string;
  fund_family?: string;
  fund_type?: string;
  currency?: string;
  exchange?: string;
  mic_code?: string;
  performance_rating?: number | null;
  risk_rating?: number | null;
};

type TwelveDataListResponse = {
  result?: {
    count: number;
    list: TwelveDataListItem[];
  };
  status: string;
  message?: string;
};

export async function getMutualFundBundle(symbol: string): Promise<MutualFundBundle> {
  const ticker = SymbolSchema.parse(symbol);
  
  // Using dummy data for testing purposes due to API issues
  return getFallbackMutualFundBundle(ticker);

  const cacheKey = `mutual-fund:${ticker}`;

  return cache30s.getOrSet(cacheKey, 30_000, async () => {
    const asOfIso = new Date().toISOString();
    const providerErrors: ProviderError[] = [];

    // Fetch from the list endpoint filtering by enough records to find our symbol.
    // The endpoint supports pagination. We fetch up to 5000 records at once without filter.
    // TwelveData list endpoint max per page is not documented; default is 50. We iterate pages.
    // Better: use source=docs gives 100. Without source gives 50. Neither may have the symbol.
    // The best available free-tier approach: fetch page by page until we find the symbol.
    // To stay practical, we try up to 5 pages (250 records) and give up gracefully.
    const listUrl = new URL("https://api.twelvedata.com/mutual_funds/list");
    listUrl.searchParams.set("outputsize", "50");
    listUrl.searchParams.set("apikey", getApiKey());

    let fundMeta: TwelveDataListItem | null = null;

    try {
      // First try: scan up to 5 pages (250 items) for the symbol
      let found = false;
      for (let page = 1; page <= 5 && !found; page++) {
        listUrl.searchParams.set("page", String(page));
        const data = await fetchJson<TwelveDataListResponse>(listUrl.toString(), {
          next: { revalidate: 3600 },
        });

        if (data.status === "error") {
          throw new Error(data.message || "Failed to fetch mutual fund list.");
        }

        const list = data.result?.list ?? [];
        const match = list.find((r) => r.symbol?.toUpperCase() === ticker);
        if (match) {
          fundMeta = match;
          found = true;
        }
        // If list returned fewer than 50 items, we've hit the end
        if (list.length < 50) break;
      }
    } catch (e) {
      providerErrors.push(errorFor("twelvedata", e));
    }

    // Build a summary from the list metadata
    let fundData: MutualFundData | null = null;

    if (fundMeta) {
      const summary: MutualFundSummary = {
        symbol: fundMeta.symbol,
        name: fundMeta.name,
        fund_family: fundMeta.fund_family ?? "",
        fund_type: fundMeta.fund_type ?? "",
        currency: fundMeta.currency ?? "",
        share_class_inception_date: "",
        ytd_return: 0,
        expense_ratio_net: 0,
        yield: 0,
        nav: 0,
        min_investment: 0,
        turnover_rate: 0,
        net_assets: 0,
        overview: `${fundMeta.name} is a mutual fund managed by ${fundMeta.fund_family || "an independent fund family"}, listed on the ${fundMeta.exchange ?? "international"} exchange and denominated in ${fundMeta.currency ?? "local currency"}. Detailed prospectus data is available directly from the fund provider.`,
        people: [],
      };

      fundData = {
        summary,
        performance: null,
        risk: null,
        // Build ratings from search list metadata
        ratings: (fundMeta.performance_rating != null || fundMeta.risk_rating != null)
          ? {
              performance_rating: fundMeta.performance_rating ?? 0,
              risk_rating: fundMeta.risk_rating ?? 0,
              return_rating: 0,
            }
          : null,
        composition: null,
        purchase_info: null,
        sustainability: null,
      };
    }

    // Fetch related news using fund family name as a proxy search term
    let news: NewsItem[] = [];
    if (fundMeta?.fund_family) {
      const searchName = fundMeta.fund_family.split(" ")[0];
      try {
        const finnhubNews = await getCompanyNews(searchName.substring(0, 10));
        news = finnhubNews ?? [];
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
