import type { Metadata } from "next";
import { getPopularIndicators, getAllIndicators } from "@/services/indicators-research";
import { IndicatorsPageClient } from "@/components/indicators/IndicatorsPageClient";

export const metadata: Metadata = {
  title: "Market Indicators — TradeX",
  description:
    "Explore AI-powered technical and macroeconomic market indicators. Real-time signals, trend analysis, and institutional-grade intelligence.",
};

export default async function IndicatorsIndexPage() {
  const [snapshots, allIndicators] = await Promise.all([
    getPopularIndicators(),
    getAllIndicators(),
  ]);

  return <IndicatorsPageClient snapshots={snapshots} allIndicators={allIndicators} />;
}
