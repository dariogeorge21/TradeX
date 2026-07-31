import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PurchaseInfo } from "@/types/mutual-funds";

function fmtCurr(n: number | null) {
  if (typeof n !== "number") return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function pct(n: number | null) {
  if (typeof n !== "number") return "—";
  return `${(n * 100).toFixed(2)}%`;
}

export function FundPurchaseInfoCard({
  purchaseInfo,
}: {
  purchaseInfo: PurchaseInfo | null;
}) {
  if (!purchaseInfo) return null;

  const { expenses, minimums, pricing } = purchaseInfo;

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Purchase Info</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        
        {/* Expenses */}
        {expenses && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Expenses</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">Net Ratio</div>
                <div className="mt-1 font-mono text-sm">{pct(expenses.expense_ratio_net)}</div>
              </div>
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">Gross Ratio</div>
                <div className="mt-1 font-mono text-sm">{pct(expenses.expense_ratio_gross)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Minimums */}
        {minimums && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Minimum Investment</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">Initial</div>
                <div className="mt-1 font-mono text-sm">{fmtCurr(minimums.initial_investment)}</div>
              </div>
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">Additional</div>
                <div className="mt-1 font-mono text-sm">{fmtCurr(minimums.additional_investment)}</div>
              </div>
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">Initial IRA</div>
                <div className="mt-1 font-mono text-sm">{fmtCurr(minimums.initial_ira_investment)}</div>
              </div>
              <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">Addtl IRA</div>
                <div className="mt-1 font-mono text-sm">{fmtCurr(minimums.additional_ira_investment)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing */}
        {pricing && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Pricing</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border border-foreground/5 bg-background/40 p-2">
                <div className="text-[10px] text-muted-foreground">NAV</div>
                <div className="mt-1 font-mono text-sm">{fmtCurr(pricing.nav)}</div>
              </div>
              <div className="rounded-lg border border-foreground/5 bg-background/40 p-2">
                <div className="text-[10px] text-muted-foreground">52W Low</div>
                <div className="mt-1 font-mono text-sm">{fmtCurr(pricing["12_month_low"])}</div>
              </div>
              <div className="rounded-lg border border-foreground/5 bg-background/40 p-2">
                <div className="text-[10px] text-muted-foreground">52W High</div>
                <div className="mt-1 font-mono text-sm">{fmtCurr(pricing["12_month_high"])}</div>
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
