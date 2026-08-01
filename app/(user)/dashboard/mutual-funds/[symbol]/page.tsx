import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { DetailsHeader } from "@/components/dashboard/DetailsHeader";
import { MutualFundHeader } from "@/components/mutual-funds/MutualFundHeader";
import { FundNewsSection } from "@/components/mutual-funds/FundNewsSection";
import { ErrorCard } from "@/components/stocks/ErrorCard";
import { MotionDiv } from "@/components/ui/motion-wrapper";
import type { MutualFundSummary, MutualFundData, MutualFundBundle } from "@/types/mutual-funds";

// New Components
import { BentoMetrics } from "@/components/mutual-funds/details/BentoMetrics";
import { PortfolioComposition } from "@/components/mutual-funds/details/PortfolioComposition";
import { AIAnalysisHub } from "@/components/mutual-funds/details/AIAnalysisHub";
import { MutualFundWatchlistButton } from "@/components/mutual-funds/watchlist/MutualFundWatchlistButton";

const ParamsSchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .regex(/^[A-Za-z0-9.\-_]+$/)
    .transform((s) => s.toUpperCase()),
});

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<Record<string, string>>;
}): Promise<Metadata> {
  const p = await params;
  const sp = await searchParams;
  const parsed = ParamsSchema.safeParse(p);
  const symbol = parsed.success ? parsed.data.symbol : "Fund";
  const name = sp.name ?? symbol;
  return {
    title: `${name} — Mutual Funds — TradeX`,
    description: `AI-powered research dashboard for ${name}.`,
  };
}

export default async function MutualFundDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const p = await params;
  const sp = await searchParams;

  const parsed = ParamsSchema.safeParse(p);
  if (!parsed.success) notFound();

  const ticker = parsed.data.symbol;

  let bundle: MutualFundBundle | null = null;

  if (sp.name) {
    const summary: MutualFundSummary = {
      symbol: ticker,
      name: sp.name,
      fund_family: sp.fund_family ?? "",
      fund_type: sp.fund_type ?? "",
      currency: sp.currency ?? "",
      share_class_inception_date: "",
      ytd_return: 0,
      expense_ratio_net: 0,
      yield: 0,
      nav: 0,
      min_investment: 0,
      turnover_rate: 0,
      net_assets: 0,
      overview: `${sp.name} is a mutual fund${sp.fund_family ? ` managed by ${sp.fund_family}` : ""}${sp.exchange ? `, listed on the ${sp.exchange} exchange` : ""}${sp.currency ? ` and denominated in ${sp.currency}` : ""}. Explore the AI summary below for a deeper analysis.`,
      people: [],
    };

    const perfRating = sp.performance_rating ? parseFloat(sp.performance_rating) : null;
    const riskRating = sp.risk_rating ? parseFloat(sp.risk_rating) : null;

    const data: MutualFundData = {
      summary,
      performance: null,
      risk: null,
      ratings:
        perfRating != null || riskRating != null
          ? {
              performance_rating: perfRating ?? 0,
              risk_rating: riskRating ?? 0,
              return_rating: 0,
            }
          : null,
      composition: null,
      purchase_info: null,
      sustainability: null,
    };

    bundle = {
      symbol: ticker,
      asOfIso: new Date().toISOString(),
      data,
      news: [],
      providerErrors: [],
    };
  }

  // If no metadata in URL params, try the service
  if (!bundle) {
    try {
      const { getMutualFundBundle } = await import("@/services/mutual-fund-research");
      bundle = await getMutualFundBundle(ticker);
    } catch {
      // service failed — render a minimal page with just the symbol
    }
  }

  // If we still have nothing at all, show error
  if (!bundle || !bundle.data?.summary) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <ErrorCard
          message={`No data found for "${ticker}". Please search again from the Mutual Funds page.`}
          backHref="/dashboard/mutual-funds"
          backLabel="Back to Mutual Funds"
        />
      </div>
    );
  }

  const { summary, composition, risk } = bundle.data;
  
  // Create mock AI analysis based on the data
  const mockAnalysis = {
    summary: summary.overview || "This fund aims to provide long-term capital growth by investing in equity instruments.",
    strengths: [
      "Consistent track record in large-cap equities",
      `Low expense ratio of ${summary.expense_ratio_net}%`,
      "High liquidity and AUM"
    ],
    weaknesses: [
      "Susceptible to market volatility",
      "Lower dividend yield compared to value funds"
    ],
    suitableInvestors: [
      "Long-term investors (5+ years)",
      "High risk tolerance profiles"
    ]
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-12">
      <DetailsHeader
        backHref="/dashboard/mutual-funds"
        backLabel="Back to Mutual Funds"
        searchHref="/dashboard/mutual-funds"
        searchLabel="Check another mutual fund"
        action={
          <MutualFundWatchlistButton 
            fund={{
              fund_code: ticker,
              fund_name: summary.name,
              amc: summary.fund_family,
              category: summary.fund_type,
            }}
            showText={true} 
          />
        }
      />

      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <MutualFundHeader summary={summary} />
      </MotionDiv>
      
      <BentoMetrics 
        nav={summary.nav}
        ytdReturn={summary.ytd_return}
        expenseRatio={summary.expense_ratio_net}
        aum={summary.net_assets ? summary.net_assets / 10000000 : undefined} // Mock conversion to Cr
        riskLevel={bundle.data.ratings?.risk_rating || 3}
        turnoverRate={summary.turnover_rate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Charts, Composition, AI Hub) */}
        <div className="lg:col-span-2 space-y-6">
          {composition && (
            <PortfolioComposition 
              topHoldings={composition.top_holdings?.map(h => ({ symbol: h.symbol, name: h.name, weight: h.weight }))}
              sectors={composition.major_market_sectors}
              assetAllocation={composition.asset_allocation as any}
            />
          )}
          
          <AIAnalysisHub analysis={mockAnalysis} />
        </div>

        {/* Right Column (News, Additional Info) */}
        <div className="space-y-6">
          <div className="bg-card border border-foreground/10 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold tracking-tight mb-4">Latest Fund News</h3>
            <FundNewsSection news={bundle.news} />
          </div>
          
          {bundle.providerErrors.length > 0 && (
            <div className="rounded-2xl border border-foreground/10 bg-card/40 p-4 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">Data availability</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {bundle.providerErrors.slice(0, 4).map((e, idx) => (
                  <li key={`${e.provider}-${idx}`}>
                    {e.provider}: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
