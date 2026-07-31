import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecommendationTrends, TechnicalIndicators } from "@/types/stock-research";

function fmt(n: number | null, digits = 2) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function latestRecommendation(recs: RecommendationTrends[] | null) {
  if (!recs || recs.length === 0) return null;
  return recs[0];
}

export function TechnicalOverview({
  technicals,
  recommendations,
}: {
  technicals: TechnicalIndicators | null;
  recommendations: RecommendationTrends[] | null;
}) {
  const latest = latestRecommendation(recommendations);

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Technical Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
            <div className="text-xs text-muted-foreground">RSI (14)</div>
            <div className="mt-1 font-mono text-sm tabular-nums">
              {fmt(technicals?.rsi14 ?? null, 2)}
            </div>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
            <div className="text-xs text-muted-foreground">MACD / Signal</div>
            <div className="mt-1 font-mono text-sm tabular-nums">
              {fmt(technicals?.macd ?? null, 3)} / {fmt(technicals?.macdSignal ?? null, 3)}
            </div>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
            <div className="text-xs text-muted-foreground">SMA (50)</div>
            <div className="mt-1 font-mono text-sm tabular-nums">
              {fmt(technicals?.sma50 ?? null, 4)}
            </div>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
            <div className="text-xs text-muted-foreground">SMA (200)</div>
            <div className="mt-1 font-mono text-sm tabular-nums">
              {fmt(technicals?.sma200 ?? null, 4)}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-background/40 p-3">
          <div className="text-xs text-muted-foreground">Analyst Recommendation Trend (Latest)</div>
          {latest ? (
            <div className="mt-2 grid grid-cols-5 gap-2 text-center text-xs">
              <div>
                <div className="font-mono tabular-nums">{latest.strongBuy ?? "—"}</div>
                <div className="text-muted-foreground">Strong Buy</div>
              </div>
              <div>
                <div className="font-mono tabular-nums">{latest.buy ?? "—"}</div>
                <div className="text-muted-foreground">Buy</div>
              </div>
              <div>
                <div className="font-mono tabular-nums">{latest.hold ?? "—"}</div>
                <div className="text-muted-foreground">Hold</div>
              </div>
              <div>
                <div className="font-mono tabular-nums">{latest.sell ?? "—"}</div>
                <div className="text-muted-foreground">Sell</div>
              </div>
              <div>
                <div className="font-mono tabular-nums">{latest.strongSell ?? "—"}</div>
                <div className="text-muted-foreground">Strong Sell</div>
              </div>
            </div>
          ) : (
            <div className="mt-2 text-sm text-muted-foreground">
              Analyst trend data unavailable.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

