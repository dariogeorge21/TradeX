import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getMutualFundBundle } from "@/services/mutual-fund-research";
import { MutualFundHeader } from "@/components/mutual-funds/MutualFundHeader";
import { FundSummaryMetrics } from "@/components/mutual-funds/FundSummaryMetrics";
import { FundPerformanceTable } from "@/components/mutual-funds/FundPerformanceTable";
import { FundRiskPanel } from "@/components/mutual-funds/FundRiskPanel";
import { FundCompositionPanel } from "@/components/mutual-funds/FundCompositionPanel";
import { FundRatingsCard } from "@/components/mutual-funds/FundRatingsCard";
import { FundSustainabilityCard } from "@/components/mutual-funds/FundSustainabilityCard";
import { FundPurchaseInfoCard } from "@/components/mutual-funds/FundPurchaseInfoCard";
import { FundAISummaryCard } from "@/components/mutual-funds/FundAISummaryCard";
import { FundNewsSection } from "@/components/mutual-funds/FundNewsSection";
import { ErrorCard } from "@/components/stocks/ErrorCard";

const ParamsSchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1)
    .max(32)
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
  const symbol = parsed.success ? parsed.data.symbol : "Fund";
  return {
    title: `${symbol} — Mutual Funds — TradeX`,
    description: `AI-powered research dashboard for ${symbol}.`,
  };
}

export default async function MutualFundDetailsPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const p = await params;
  const parsed = ParamsSchema.safeParse(p);
  if (!parsed.success) notFound();

  let bundle;
  try {
    bundle = await getMutualFundBundle(parsed.data.symbol);
  } catch {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <ErrorCard message="Failed to load mutual fund data. Please try again shortly." />
      </div>
    );
  }

  // If we fetched successfully but there's absolutely no fund data (e.g., symbol not found in mutual funds endpoint)
  if (!bundle.data || !bundle.data.summary) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <ErrorCard message="Mutual fund data not found for this symbol." />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <MutualFundHeader summary={bundle.data.summary} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <FundSummaryMetrics summary={bundle.data.summary} />
          <FundPerformanceTable performance={bundle.data.performance} />
          <FundRiskPanel risk={bundle.data.risk} />
          <FundCompositionPanel composition={bundle.data.composition} />
          <FundNewsSection news={bundle.news} />
        </div>
        <div className="space-y-4">
          <FundAISummaryCard symbol={bundle.symbol} />
          <FundRatingsCard ratings={bundle.data.ratings} />
          <FundPurchaseInfoCard purchaseInfo={bundle.data.purchase_info} />
          <FundSustainabilityCard sustainability={bundle.data.sustainability} />
          
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
