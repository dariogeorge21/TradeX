import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BasicMetrics, Quote } from "@/types/stock-research";

function fmt(n: number | null, opts?: Intl.NumberFormatOptions) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, opts);
}

export function MarketMetrics({
  quote,
  metrics,
}: {
  quote: Quote | null;
  metrics: BasicMetrics | null;
}) {
  const items: Array<{ label: string; value: string }> = [
    { label: "Current Price", value: fmt(quote?.current ?? null, { maximumFractionDigits: 4 }) },
    { label: "Previous Close", value: fmt(quote?.previousClose ?? null, { maximumFractionDigits: 4 }) },
    { label: "Open", value: fmt(quote?.open ?? null, { maximumFractionDigits: 4 }) },
    { label: "High", value: fmt(quote?.high ?? null, { maximumFractionDigits: 4 }) },
    { label: "Low", value: fmt(quote?.low ?? null, { maximumFractionDigits: 4 }) },
    { label: "Volume", value: fmt(metrics?.volume ?? null, { maximumFractionDigits: 0 }) },
    { label: "52 Week High", value: fmt(metrics?.week52High ?? null, { maximumFractionDigits: 4 }) },
    { label: "52 Week Low", value: fmt(metrics?.week52Low ?? null, { maximumFractionDigits: 4 }) },
    { label: "P/E Ratio", value: fmt(metrics?.peRatio ?? null, { maximumFractionDigits: 2 }) },
    { label: "EPS (TTM)", value: fmt(metrics?.eps ?? null, { maximumFractionDigits: 4 }) },
    {
      label: "Dividend Yield",
      value:
        typeof metrics?.dividendYield === "number"
          ? `${fmt(metrics.dividendYield * 100, { maximumFractionDigits: 2 })}%`
          : "—",
    },
    { label: "Beta", value: fmt(metrics?.beta ?? null, { maximumFractionDigits: 2 }) },
  ];

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Market Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.label}
              className="rounded-xl border border-foreground/10 bg-background/40 p-3"
            >
              <div className="text-xs text-muted-foreground">{it.label}</div>
              <div className="mt-1 font-mono text-sm tabular-nums">{it.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

