import type { Metadata } from "next";
import { DetailsHeader } from "@/components/dashboard/DetailsHeader";
import { ForexHeader } from "@/components/forex/ForexHeader";
import { ForexPriceChart } from "@/components/forex/ForexPriceChart";
import { ForexOHLCMetricsGrid } from "@/components/forex/ForexOHLCMetricsGrid";
import { ForexTechnicalIndicatorsPanel } from "@/components/forex/ForexTechnicalIndicatorsPanel";
import { ForexAISummaryCard } from "@/components/forex/ForexAISummaryCard";
import { ErrorCard } from "@/components/stocks/ErrorCard";
import { MotionDiv } from "@/components/ui/motion-wrapper";
import { getForexResearchBundle } from "@/services/forex-research";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}): Promise<Metadata> {
  const p = await params;
  const decodedSymbol = decodeURIComponent(p.symbol);
  const displayName = decodedSymbol.replace("C:", "");
  return {
    title: `${displayName} — Forex — TradeX`,
    description: `AI-powered research dashboard for ${displayName}.`,
  };
}

export default async function ForexDetailsPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const p = await params;
  const symbol = decodeURIComponent(p.symbol);

  const bundle = await getForexResearchBundle(symbol);

  if (!bundle.snapshot) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <ErrorCard
          message={`No data found for "${symbol}". The pair might not exist or isn't supported.`}
          backHref="/dashboard/forex"
          backLabel="Back to Forex Markets"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 pb-8">
      <DetailsHeader
        backHref="/dashboard/forex"
        backLabel="Back to Forex Markets"
        searchHref="/dashboard/forex"
        searchLabel="Check another pair"
      />

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ForexHeader snapshot={bundle.snapshot} />
      </MotionDiv>

      <MotionDiv 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
        className="grid gap-4 lg:grid-cols-3 mt-4"
      >
        <div className="space-y-4 lg:col-span-2 flex flex-col gap-4">
          <MotionDiv variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <ForexPriceChart aggregates={bundle.aggregates} />
          </MotionDiv>
          
          <MotionDiv variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <h2 className="text-xl font-bold tracking-tight mb-4">Technical Indicators</h2>
            <ForexTechnicalIndicatorsPanel rsi={bundle.rsi} macd={bundle.macd} ema={bundle.ema} />
          </MotionDiv>
        </div>

        <div className="space-y-4 flex flex-col gap-4">
          <MotionDiv variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <ForexAISummaryCard ticker={symbol} meta={bundle.snapshot} />
          </MotionDiv>
          
          <MotionDiv variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <h2 className="text-xl font-bold tracking-tight mb-4">Today's Trading</h2>
            <ForexOHLCMetricsGrid snapshot={bundle.snapshot} />
          </MotionDiv>

          {bundle.providerErrors.length > 0 && (
            <MotionDiv variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
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
            </MotionDiv>
          )}
        </div>
      </MotionDiv>
    </div>
  );
}
