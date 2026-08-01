import { ForexSnapshotTicker } from "@/types/forex";
import { ArrowUpToLine, ArrowDownToLine, Activity, BarChart2, Coins } from "lucide-react";

export function ForexOHLCMetricsGrid({ snapshot }: { snapshot: ForexSnapshotTicker }) {
  const metrics = [
    { label: "Open", value: snapshot.day.o.toFixed(5), icon: Activity },
    { label: "High", value: snapshot.day.h.toFixed(5), icon: ArrowUpToLine },
    { label: "Low", value: snapshot.day.l.toFixed(5), icon: ArrowDownToLine },
    { label: "Close", value: snapshot.day.c.toFixed(5), icon: Activity },
    { label: "Volume (24h)", value: snapshot.day.v.toLocaleString(undefined, { maximumFractionDigits: 0 }), icon: BarChart2 },
    { label: "VWAP", value: snapshot.day.vw.toFixed(5), icon: Coins },
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
