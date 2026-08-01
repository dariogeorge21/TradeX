import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { getIndicatorResearchBundle } from "@/services/indicators-research";
import { IndicatorDetailsHeader } from "@/components/indicators/IndicatorDetailsHeader";
import { IndicatorChart } from "@/components/indicators/IndicatorChart";
import { IndicatorSignalAnalysis } from "@/components/indicators/IndicatorSignalAnalysis";
import { IndicatorAISummaryCard } from "@/components/indicators/IndicatorAISummaryCard";
import { MotionDiv } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id).toLowerCase();
  
  return {
    title: `${decodedId.toUpperCase()} Analysis — TradeX`,
    description: `Technical analysis and insights for ${decodedId.toUpperCase()}.`,
  };
}

export default async function IndicatorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id).toLowerCase();
  const bundle = await getIndicatorResearchBundle(decodedId);

  if (!bundle) {
    notFound();
  }

  const { indicator, snapshot, historicalData } = bundle;

  return (
    <div className="mx-auto w-full max-w-7xl pb-16 space-y-8">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/indicators"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Indicators
        </Link>
        <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
           <RefreshCw className="h-3 w-3" />
           Refresh Data
        </Button>
      </div>

      <IndicatorDetailsHeader indicator={indicator} snapshot={snapshot} />

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Chart & Summary */}
        <div className="lg:col-span-2 space-y-6">
          <IndicatorChart indicator={indicator} data={historicalData} />
          <IndicatorAISummaryCard indicatorId={indicator.id} />
        </div>

        {/* Right Column: Signal Analysis & Stats */}
        <div className="space-y-6">
          <IndicatorSignalAnalysis snapshot={snapshot} />
          
          <div className="rounded-xl border border-foreground/10 bg-card/60 p-6 shadow-sm backdrop-blur-md">
            <h3 className="font-bold text-lg mb-4">Key Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="font-medium">{indicator.category}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                <span className="text-sm text-muted-foreground">Timeframe</span>
                <span className="font-medium">{snapshot.timeframe}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                <span className="text-sm text-muted-foreground">Previous Value</span>
                <span className="font-medium">{snapshot.previousValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                <span className="text-sm text-muted-foreground">Volatility Metric</span>
                <span className="font-medium">{snapshot.volatilityMetric}</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="font-medium text-xs">{new Date(snapshot.updatedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
