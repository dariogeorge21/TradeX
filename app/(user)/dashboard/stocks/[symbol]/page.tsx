import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { DetailsHeader } from "@/components/dashboard/DetailsHeader";
import { CompanyProfile } from "@/components/stocks/CompanyProfile";
import { MarketMetrics } from "@/components/stocks/MarketMetrics";
import { NewsSection } from "@/components/stocks/NewsSection";
import { AISummaryCard } from "@/components/stocks/AISummaryCard";
import { StockChart } from "@/components/stocks/StockChart";
import { ErrorCard } from "@/components/stocks/ErrorCard";
import { TechnicalOverview } from "@/components/stocks/TechnicalOverview";
import { PerformanceMetrics } from "@/components/stocks/PerformanceMetrics";
import { getStockResearchBundle } from "@/services/stock-research";

const ParamsSchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1)
    .max(16)
    .regex(/^[A-Za-z0-9.\-]+$/)
    .transform((s) => s.toUpperCase()),
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}): Promise<Metadata> {
  const p = await params;
  const parsed = ParamsSchema.safeParse(p);
  const symbol = parsed.success ? parsed.data.symbol : "Stock";
  return {
    title: `${symbol} — Stocks — TradeX`,
    description: `AI-powered research dashboard for ${symbol}.`,
  };
}

export default async function StockDetailsPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const p = await params;
  const parsed = ParamsSchema.safeParse(p);
  if (!parsed.success) notFound();

  let bundle;
  try {
    bundle = await getStockResearchBundle(parsed.data.symbol);
  } catch {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <ErrorCard message="Failed to load market data. Please try again shortly." />
      </div>
    );
  }

  return (
    <div className="mx-auto  w-full max-w-6xl space-y-4">
      <DetailsHeader
        backHref="/dashboard/stocks"
        backLabel="Back to Stocks"
        searchHref="/dashboard/stocks"
        searchLabel="Check another stock"
      />

      <CompanyProfile profile={bundle.profile} fundamentals={bundle.fundamentals} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <MarketMetrics quote={bundle.quote} metrics={bundle.metrics} />
          <PerformanceMetrics bars={bundle.historicalDaily} />
          <StockChart symbol={bundle.symbol} bars={bundle.historicalDaily} />
          <NewsSection news={bundle.news} />
        </div>
        <div className="space-y-4">
          <AISummaryCard symbol={bundle.symbol} />
          <TechnicalOverview
            technicals={bundle.technicals}
            recommendations={bundle.recommendations}
          />
          {bundle.providerErrors.length > 0 ? (
            <div className="rounded-2xl border border-foreground/10 bg-card/40 p-4 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">Data availability</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {bundle.providerErrors.slice(0, 6).map((e, idx) => (
                  <li key={`${e.provider}-${idx}`}>
                    {e.provider}: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
