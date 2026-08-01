import { CryptoSnapshotTicker } from "@/types/crypto";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpToLine, ArrowDownToLine, Activity, BarChart2, Coins } from "lucide-react";

export function OHLCMetricsGrid({ snapshot }: { snapshot: CryptoSnapshotTicker }) {
  const metrics = [
    { label: "Open", value: formatCurrency(snapshot.day.o), icon: Activity },
    { label: "High", value: formatCurrency(snapshot.day.h), icon: ArrowUpToLine },
    { label: "Low", value: formatCurrency(snapshot.day.l), icon: ArrowDownToLine },
    { label: "Close", value: formatCurrency(snapshot.day.c), icon: Activity },
    { label: "Volume (24h)", value: snapshot.day.v.toLocaleString(undefined, { maximumFractionDigits: 0 }), icon: BarChart2 },
    { label: "VWAP", value: formatCurrency(snapshot.day.vw), icon: Coins },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-xl border border-foreground/10 bg-card/60 p-4 shadow-sm backdrop-blur-md"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <metric.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{metric.label}</span>
          </div>
          <div className="text-xl font-bold">{metric.value}</div>
        </div>
      ))}
    </div>
  );
}
