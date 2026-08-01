import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { DetailsHeader } from "@/components/dashboard/DetailsHeader";
import { CompanyProfile } from "@/components/stocks/CompanyProfile";
import { NewsSection } from "@/components/stocks/NewsSection";
import { StockChart } from "@/components/stocks/StockChart";
import { ErrorCard } from "@/components/stocks/ErrorCard";
import { getStockResearchBundle } from "@/services/stock-research";

// New Components
import { BentoMetrics } from "@/components/stocks/details/BentoMetrics";
import { FinancialHealth } from "@/components/stocks/details/FinancialHealth";
import { TechnicalIndicators } from "@/components/stocks/details/TechnicalIndicators";
import { AIAnalysisHub } from "@/components/stocks/details/AIAnalysisHub";
import { InteractiveAssistant } from "@/components/stocks/details/InteractiveAssistant";

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
      <div className="mx-auto w-full max-w-7xl">
        <ErrorCard message="Failed to load market data. Please try again shortly." />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-12">
      <DetailsHeader
        backHref="/dashboard/stocks"
        backLabel="Back to Stocks"
        searchHref="/dashboard/stocks"
        searchLabel="Search another stock"
      />

      <CompanyProfile profile={bundle.profile} fundamentals={bundle.fundamentals} />
      
      {bundle.metrics && (
        <BentoMetrics 
          metrics={bundle.metrics} 
          marketCap={bundle.profile?.marketCapitalization ?? null} 
        />
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Charts, News, AI Hub) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-foreground/10 rounded-2xl p-6 shadow-sm">
            <div className="h-[400px]">
              <StockChart symbol={bundle.symbol} bars={bundle.historicalDaily} />
            </div>
          </div>
          
          {bundle.aiAnalysis && (
            <AIAnalysisHub analysis={bundle.aiAnalysis} />
          )}

          <div className="bg-card border border-foreground/10 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold tracking-tight mb-4">Latest News</h3>
            <NewsSection news={bundle.news} />
          </div>
        </div>

        {/* Right Column (Assistant, Technicals, Health) */}
        <div className="space-y-6">
          <InteractiveAssistant symbol={bundle.symbol} />
          
          <TechnicalIndicators 
            technicals={bundle.technicals} 
            trends={bundle.recommendations} 
          />
          
          {bundle.financialHealth && (
            <FinancialHealth health={bundle.financialHealth} />
          )}
          
          {bundle.providerErrors.length > 0 ? (
            <div className="rounded-2xl border border-foreground/10 bg-card/40 p-4 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">Data Provider Warnings</div>
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
