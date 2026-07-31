import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MutualFundComposition } from "@/types/mutual-funds";

function pct(n: number | null) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  return `${(n * 100).toFixed(2)}%`;
}

export function FundCompositionPanel({
  composition,
}: {
  composition: MutualFundComposition | null;
}) {
  if (!composition) {
    return null;
  }

  const { major_market_sectors, asset_allocation, top_holdings } = composition;

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Portfolio Composition</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        
        <div className="space-y-6">
          {/* Asset Allocation */}
          {asset_allocation && (
            <div>
              <h4 className="text-sm font-semibold mb-3">Asset Allocation</h4>
              <div className="space-y-2">
                {Object.entries(asset_allocation).map(([key, val]) => {
                  if (typeof val !== 'number' || val <= 0) return null;
                  return (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{key.replace("_", " ")}</span>
                      <span className="font-mono">{pct(val)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sectors */}
          {major_market_sectors && major_market_sectors.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3">Top Sectors</h4>
              <div className="space-y-2">
                {major_market_sectors.slice(0, 5).map((sec, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{sec.sector}</span>
                    <span className="font-mono">{pct(sec.weight)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Holdings */}
        {top_holdings && top_holdings.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Top Holdings</h4>
            <div className="space-y-3">
              {top_holdings.slice(0, 10).map((h, i) => (
                <div key={i} className="flex flex-col gap-1 rounded-lg border border-foreground/5 bg-background/30 p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate max-w-[75%]">{h.name}</span>
                    <span className="text-sm font-mono text-emerald-400">{pct(h.weight)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {h.symbol} • {h.exchange}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
