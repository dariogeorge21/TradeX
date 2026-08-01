import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailsHeader } from "@/components/dashboard/DetailsHeader";
import { CryptoHeader } from "@/components/crypto/CryptoHeader";
import { PriceChart } from "@/components/crypto/PriceChart";
import { OHLCMetricsGrid } from "@/components/crypto/OHLCMetricsGrid";
import { TechnicalIndicatorsPanel } from "@/components/crypto/TechnicalIndicatorsPanel";
import { CryptoAISummaryCard } from "@/components/crypto/CryptoAISummaryCard";
import { ErrorCard } from "@/components/stocks/ErrorCard";
import { MotionDiv } from "@/components/ui/motion-wrapper";
import { getCryptoResearchBundle } from "@/services/crypto-research";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>;
}): Promise<Metadata> {
  const p = await params;
  const decodedTicker = decodeURIComponent(p.ticker);
  const displayName = decodedTicker.replace("X:", "").replace("USD", "");
  return {
    title: `${displayName} — Crypto — TradeX`,
    description: `AI-powered research dashboard for ${displayName}.`,
  };
}

export default async function CryptoDetailsPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const p = await params;
  const ticker = decodeURIComponent(p.ticker);

  const bundle = await getCryptoResearchBundle(ticker);

  if (!bundle.snapshot) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <ErrorCard
          message={`No data found for "${ticker}". The coin might not exist or isn't supported.`}
          backHref="/dashboard/crypto"
          backLabel="Back to Crypto Markets"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 pb-8">
      <DetailsHeader
        backHref="/dashboard/crypto"
        backLabel="Back to Crypto Markets"
        searchHref="/dashboard/crypto"
        searchLabel="Check another coin"
      />

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CryptoHeader snapshot={bundle.snapshot} />
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
            <PriceChart aggregates={bundle.aggregates} />
          </MotionDiv>
          
          <MotionDiv variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <h2 className="text-xl font-bold tracking-tight mb-4">Technical Indicators</h2>
            <TechnicalIndicatorsPanel rsi={bundle.rsi} macd={bundle.macd} ema={bundle.ema} />
          </MotionDiv>
        </div>

        <div className="space-y-4 flex flex-col gap-4">
          <MotionDiv variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <CryptoAISummaryCard ticker={ticker} meta={bundle.snapshot} />
          </MotionDiv>
          
          <MotionDiv variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <h2 className="text-xl font-bold tracking-tight mb-4">Today's Trading</h2>
            <OHLCMetricsGrid snapshot={bundle.snapshot} />
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
