import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { DetailsHeader } from "@/components/dashboard/DetailsHeader";
import { MutualFundHeader } from "@/components/mutual-funds/MutualFundHeader";
import { FundSummaryMetrics } from "@/components/mutual-funds/FundSummaryMetrics";
import { FundRatingsCard } from "@/components/mutual-funds/FundRatingsCard";
import { FundAISummaryCard } from "@/components/mutual-funds/FundAISummaryCard";
import { FundNewsSection } from "@/components/mutual-funds/FundNewsSection";
import { ErrorCard } from "@/components/stocks/ErrorCard";
import type {
  MutualFundSummary,
  MutualFundData,
  MutualFundBundle,
} from "@/types/mutual-funds";

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

  // Build the bundle from URL search params that the search bar encoded.
  // This avoids a re-fetch from TwelveData's paginated list on every page load.
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

  // If no metadata in URL params (e.g. direct URL access), try the service
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
      <div className="mx-auto w-full max-w-6xl">
        <ErrorCard
          message={`No data found for "${ticker}". Please search again from the Mutual Funds page.`}
          backHref="/dashboard/mutual-funds"
          backLabel="Back to Mutual Funds"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <DetailsHeader
        backHref="/dashboard/mutual-funds"
        backLabel="Back to Mutual Funds"
        searchHref="/dashboard/mutual-funds"
        searchLabel="Check another mutual fund"
      />

      <MutualFundHeader summary={bundle.data.summary} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <FundSummaryMetrics summary={bundle.data.summary} />
          <FundNewsSection news={bundle.news} />
        </div>
        <div className="space-y-4">
          <FundAISummaryCard symbol={ticker} meta={bundle.data.summary} />
          {bundle.data.ratings && (
            <FundRatingsCard ratings={bundle.data.ratings} />
          )}

          {/* Metadata summary panel */}
          <div className="rounded-2xl border border-foreground/10 bg-card/40 p-4 text-sm space-y-2">
            <div className="font-semibold text-foreground">Fund Details</div>
            {[
              { label: "Symbol", value: ticker },
              { label: "Exchange", value: sp.exchange },
              { label: "Country", value: sp.country },
              { label: "Currency", value: sp.currency },
            ]
              .filter((r) => r.value)
              .map((r) => (
                <div key={r.label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="font-mono">{r.value}</span>
                </div>
              ))}
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
