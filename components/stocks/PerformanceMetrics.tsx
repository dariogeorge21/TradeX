import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PriceBar } from "@/types/stock-research";

function latestClose(bars: PriceBar[]): number | null {
  for (let i = bars.length - 1; i >= 0; i -= 1) {
    const c = bars[i]?.close;
    if (typeof c === "number" && Number.isFinite(c)) return c;
  }
  return null;
}

function closeAtOrBefore(bars: PriceBar[], daysBack: number): number | null {
  const target = Date.now() - daysBack * 24 * 60 * 60 * 1000;
  for (let i = bars.length - 1; i >= 0; i -= 1) {
    const dt = Date.parse(bars[i]?.date ?? "");
    const c = bars[i]?.close;
    if (!Number.isFinite(dt)) continue;
    if (dt <= target && typeof c === "number" && Number.isFinite(c)) return c;
  }
  return null;
}

function pctChange(current: number | null, past: number | null): string {
  if (typeof current !== "number" || typeof past !== "number" || past === 0) return "—";
  const pct = ((current - past) / past) * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function PerformanceMetrics({ bars }: { bars: PriceBar[] }) {
  const current = latestClose(bars);
  const oneMonth = closeAtOrBefore(bars, 30);
  const threeMonth = closeAtOrBefore(bars, 90);
  const sixMonth = closeAtOrBefore(bars, 180);
  const oneYear = closeAtOrBefore(bars, 365);

  const items = [
    { label: "1M", value: pctChange(current, oneMonth) },
    { label: "3M", value: pctChange(current, threeMonth) },
    { label: "6M", value: pctChange(current, sixMonth) },
    { label: "1Y", value: pctChange(current, oneYear) },
  ];

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Performance</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-4 gap-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-xl border border-foreground/10 bg-background/40 p-3 text-center">
            <div className="text-xs text-muted-foreground">{it.label}</div>
            <div className="mt-1 font-mono text-sm tabular-nums">{it.value}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

