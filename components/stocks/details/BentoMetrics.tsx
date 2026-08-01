import * as React from "react";
import { BasicMetrics } from "@/types/stock-research";

export function BentoMetrics({ metrics, marketCap }: { metrics: BasicMetrics; marketCap: number | null }) {
  const formatNum = (num: number | null, prefix = "", suffix = "") => {
    if (num === null) return "N/A";
    if (num >= 1e12) return `${prefix}${(num / 1e12).toFixed(2)}T${suffix}`;
    if (num >= 1e9) return `${prefix}${(num / 1e9).toFixed(2)}B${suffix}`;
    if (num >= 1e6) return `${prefix}${(num / 1e6).toFixed(2)}M${suffix}`;
    return `${prefix}${num.toLocaleString()}${suffix}`;
  };

  const bentoItems = [
    { label: "Market Cap", value: formatNum(marketCap, "$") },
    { label: "P/E Ratio", value: metrics.peRatio ? metrics.peRatio.toFixed(2) : "N/A" },
    { label: "EPS", value: metrics.eps ? `$${metrics.eps.toFixed(2)}` : "N/A" },
    { label: "Div Yield", value: metrics.dividendYield ? `${metrics.dividendYield.toFixed(2)}%` : "N/A" },
    { label: "Beta", value: metrics.beta ? metrics.beta.toFixed(2) : "N/A" },
    { label: "ROE", value: metrics.roe ? `${(metrics.roe * 100).toFixed(1)}%` : "N/A" },
    { label: "Volume", value: formatNum(metrics.volume) },
    { label: "52W Range", value: metrics.week52Low && metrics.week52High ? `$${metrics.week52Low.toFixed(1)} - $${metrics.week52High.toFixed(1)}` : "N/A" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {bentoItems.map((item, i) => (
        <div key={i} className="p-4 rounded-xl border border-foreground/10 bg-card/40 backdrop-blur-sm flex flex-col justify-center transition-all hover:bg-card/80 hover:border-primary/30">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{item.label}</span>
          <span className="text-lg font-semibold text-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
