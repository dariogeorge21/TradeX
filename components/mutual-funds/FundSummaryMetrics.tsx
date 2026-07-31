import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MutualFundSummary } from "@/types/mutual-funds";

function fmt(n: number | null, opts?: Intl.NumberFormatOptions) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, opts);
}

function pct(n: number | null) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  return `${(n * 100).toFixed(2)}%`;
}

export function FundSummaryMetrics({
  summary,
}: {
  summary: MutualFundSummary | null;
}) {
  const items = [
    { label: "Net Asset Value (NAV)", value: fmt(summary?.nav ?? null, { style: "currency", currency: summary?.currency || "USD" }) },
    { label: "YTD Return", value: pct(summary?.ytd_return ?? null) },
    { label: "Expense Ratio (Net)", value: pct(summary?.expense_ratio_net ?? null) },
    { label: "Yield", value: pct(summary?.yield ?? null) },
    { label: "Net Assets", value: fmt(summary?.net_assets ?? null, { style: "currency", currency: summary?.currency || "USD", notation: "compact" }) },
    { label: "Turnover Rate", value: pct(summary?.turnover_rate ?? null) },
    { label: "Min Investment", value: fmt(summary?.min_investment ?? null, { style: "currency", currency: summary?.currency || "USD" }) },
  ];

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Key Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.label}
              className="rounded-xl border border-foreground/10 bg-background/40 p-3"
            >
              <div className="text-xs text-muted-foreground">{it.label}</div>
              <div className="mt-1 font-mono text-sm tabular-nums font-semibold">{it.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
