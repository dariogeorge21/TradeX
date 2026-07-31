import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MutualFundRisk } from "@/types/mutual-funds";

function fmt(n: number | null, digits = 2) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export function FundRiskPanel({
  risk,
}: {
  risk: MutualFundRisk | null;
}) {
  if (!risk) {
    return null;
  }

  // We usually look at the 3-year volatility measures if available, otherwise just grab the first one
  const vol = risk.volatility_measures?.find(v => v.period === "3_year") || risk.volatility_measures?.[0];
  const val = risk.valuation_metrics;

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Risk & Valuation</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        
        {vol && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Volatility Measures ({vol.period.replace("_", " ").capitalize() || "Latest"})</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">Alpha</div>
                <div className="mt-1 font-mono text-sm tabular-nums">{fmt(vol.alpha)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Cat: {fmt(vol.alpha_category)}</div>
              </div>
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">Beta</div>
                <div className="mt-1 font-mono text-sm tabular-nums">{fmt(vol.beta)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Cat: {fmt(vol.beta_category)}</div>
              </div>
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                <div className="mt-1 font-mono text-sm tabular-nums">{fmt(vol.sharpe_ratio)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Cat: {fmt(vol.sharpe_ratio_category)}</div>
              </div>
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">Std Dev</div>
                <div className="mt-1 font-mono text-sm tabular-nums">{fmt(vol.std)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Cat: {fmt(vol.std_category)}</div>
              </div>
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">R-Squared</div>
                <div className="mt-1 font-mono text-sm tabular-nums">{fmt(vol.r_squared)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Cat: {fmt(vol.r_squared_category)}</div>
              </div>
            </div>
          </div>
        )}

        {val && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Valuation Metrics</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">P/E Ratio</div>
                <div className="mt-1 font-mono text-sm tabular-nums">{fmt(val.price_to_earnings)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Cat: {fmt(val.price_to_earnings_category)}</div>
              </div>
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">P/B Ratio</div>
                <div className="mt-1 font-mono text-sm tabular-nums">{fmt(val.price_to_book)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Cat: {fmt(val.price_to_book_category)}</div>
              </div>
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">P/S Ratio</div>
                <div className="mt-1 font-mono text-sm tabular-nums">{fmt(val.price_to_sales)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Cat: {fmt(val.price_to_sales_category)}</div>
              </div>
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">P/CF Ratio</div>
                <div className="mt-1 font-mono text-sm tabular-nums">{fmt(val.price_to_cashflow)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Cat: {fmt(val.price_to_cashflow_category)}</div>
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}

// Quick helper to capitalize the period string
declare global {
  interface String {
    capitalize(): string;
  }
}
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
