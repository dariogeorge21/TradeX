import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MutualFundPerformance } from "@/types/mutual-funds";

function pct(n: number | null) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  const p = (n * 100).toFixed(2);
  return n > 0 ? `+${p}%` : `${p}%`;
}

function getColorClass(n: number | null) {
  if (typeof n !== "number") return "";
  return n > 0 ? "text-emerald-400" : n < 0 ? "text-red-400" : "";
}

export function FundPerformanceTable({
  performance,
}: {
  performance: MutualFundPerformance | null;
}) {
  if (!performance) {
    return (
      <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Performance data not available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Performance & Returns</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        
        {/* Trailing Returns */}
        {performance.trailing_returns && performance.trailing_returns.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Trailing Returns</h4>
            <div className="overflow-x-auto rounded-lg border border-foreground/10">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2 text-muted-foreground">Period</th>
                    <th className="px-4 py-2 text-right text-muted-foreground">Fund Return</th>
                    <th className="px-4 py-2 text-right text-muted-foreground">Category Return</th>
                    <th className="px-4 py-2 text-right text-muted-foreground">Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                  {performance.trailing_returns.map((r, i) => (
                    <tr key={i} className="hover:bg-muted/20">
                      <td className="px-4 py-2 font-medium capitalize">{r.period.replace("_", " ")}</td>
                      <td className={`px-4 py-2 text-right font-mono ${getColorClass(r.share_class_return)}`}>
                        {pct(r.share_class_return)}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-muted-foreground">
                        {pct(r.category_return)}
                      </td>
                      <td className="px-4 py-2 text-right font-mono">{r.rank_in_category ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Annual Returns */}
        {performance.annual_total_returns && performance.annual_total_returns.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Annual Total Returns</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {performance.annual_total_returns.slice(0, 6).map((r, i) => (
                <div key={i} className="rounded-xl border border-foreground/10 bg-background/40 p-3 text-center">
                  <div className="text-xs text-muted-foreground font-medium">{r.year}</div>
                  <div className={`mt-1 font-mono text-sm ${getColorClass(r.share_class_return)}`}>
                    {pct(r.share_class_return)}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">Cat: {pct(r.category_return)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
