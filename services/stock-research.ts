import "server-only";

import { z } from "zod";
import { cache30s } from "@/lib/ttl-cache";
import type { StockResearchBundle, ProviderError } from "@/types/stock-research";
import {
  getCompanyProfile,
  getQuote,
  getCompanyNews,
  getBasicMetrics,
  getRecommendationTrends,
} from "@/services/finnhub";
import { getDailyTimeSeries, getTechnicals } from "@/services/twelvedata";
import { getFundamentals, getDailyPrices } from "@/services/tiingo";
import { getDailyAggregates, getMarketNews } from "@/services/massive";

const SymbolSchema = z
  .string()
  .trim()
  .min(1)
  .max(16)
  .regex(/^[A-Za-z0-9.\-]+$/)
  .transform((s) => s.toUpperCase());

function errorFor(provider: ProviderError["provider"], e: unknown): ProviderError {
  return {
    provider,
    message: e instanceof Error ? e.message : "Request failed.",
  };
}

export async function getStockResearchBundle(
  symbol: string
): Promise<StockResearchBundle> {
  const ticker = SymbolSchema.parse(symbol);
  const cacheKey = `stock-research:${ticker}`;

  return cache30s.getOrSet(cacheKey, 30_000, async () => {
    const asOfIso = new Date().toISOString();
    const providerErrors: ProviderError[] = [];

    const [
      profile,
      quoteWithVol,
      finnhubMetrics,
      recommendations,
      finnhubNews,
      twelveSeries,
      twelveTechnicals,
      tiingoFundamentals,
      tiingoPrices,
      massiveAggs,
      massiveNews,
    ] = await Promise.allSettled([
      getCompanyProfile(ticker),
      getQuote(ticker),
      getBasicMetrics(ticker),
      getRecommendationTrends(ticker),
      getCompanyNews(ticker),
      getDailyTimeSeries(ticker),
      getTechnicals(ticker),
      getFundamentals(ticker),
      getDailyPrices(ticker),
      getDailyAggregates(ticker),
      getMarketNews(ticker),
    ]);

    const profileValue =
      profile.status === "fulfilled" ? profile.value : (providerErrors.push(errorFor("finnhub", profile.reason)), null);

    const quoteValue =
      quoteWithVol.status === "fulfilled"
        ? quoteWithVol.value
        : (providerErrors.push(errorFor("finnhub", quoteWithVol.reason)), null);

    const metricsValue =
      finnhubMetrics.status === "fulfilled"
        ? finnhubMetrics.value
        : (providerErrors.push(errorFor("finnhub", finnhubMetrics.reason)), null);

    const recommendationsValue =
      recommendations.status === "fulfilled"
        ? recommendations.value
        : (providerErrors.push(errorFor("finnhub", recommendations.reason)), null);

    const finnhubNewsValue =
      finnhubNews.status === "fulfilled"
        ? finnhubNews.value
        : (providerErrors.push(errorFor("finnhub", finnhubNews.reason)), []);

    const seriesValue =
      twelveSeries.status === "fulfilled"
        ? twelveSeries.value
        : (providerErrors.push(errorFor("twelvedata", twelveSeries.reason)), []);

    const technicalsValue =
      twelveTechnicals.status === "fulfilled"
        ? twelveTechnicals.value
        : (providerErrors.push(errorFor("twelvedata", twelveTechnicals.reason)), null);

    const fundamentalsValue =
      tiingoFundamentals.status === "fulfilled"
        ? tiingoFundamentals.value
        : (providerErrors.push(errorFor("tiingo", tiingoFundamentals.reason)), null);

    const tiingoPricesValue =
      tiingoPrices.status === "fulfilled"
        ? tiingoPrices.value
        : (providerErrors.push(errorFor("tiingo", tiingoPrices.reason)), []);

    const massiveAggsValue =
      massiveAggs.status === "fulfilled"
        ? massiveAggs.value
        : (providerErrors.push(errorFor("massive", massiveAggs.reason)), []);

    const massiveNewsValue =
      massiveNews.status === "fulfilled"
        ? massiveNews.value
        : (providerErrors.push(errorFor("massive", massiveNews.reason)), []);

    const historicalDaily =
      seriesValue.length > 0 ? seriesValue : massiveAggsValue.length > 0 ? massiveAggsValue : tiingoPricesValue;

    const newsByUrl = new Map<string, (typeof finnhubNewsValue)[number]>();
    for (const n of [...massiveNewsValue, ...finnhubNewsValue]) {
      if (!n.url) continue;
      if (!newsByUrl.has(n.url)) newsByUrl.set(n.url, n);
    }
    const news = Array.from(newsByUrl.values())
      .filter((n) => n.datetimeUnixSeconds > 0)
      .sort((a, b) => b.datetimeUnixSeconds - a.datetimeUnixSeconds)
      .slice(0, 20);

    const mergedMetrics =
      metricsValue !== null
        ? {
            ...metricsValue,
            volume: quoteValue?.volume ?? metricsValue.volume,
          }
        : null;

    return {
      symbol: ticker,
      asOfIso,
      profile: profileValue,
      fundamentals: fundamentalsValue,
      quote: quoteValue?.quote ?? null,
      metrics: mergedMetrics,
      recommendations: recommendationsValue,
      news,
      historicalDaily,
      technicals: technicalsValue,
      providerErrors,
    };
  });
}

