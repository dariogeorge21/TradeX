import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompanyProfile, Quote } from "@/types/stock-research";

function fmt(n: number | null, digits = 2) {
  if (typeof n !== "number") return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export function StockCard({
  symbol,
  profile,
  quote,
}: {
  symbol: string;
  profile: CompanyProfile | null;
  quote: Quote | null;
}) {
  return (
    <Link href={`/dashboard/stocks/${encodeURIComponent(symbol)}`} className="block">
      <Card className="border border-foreground/10 bg-card/60 backdrop-blur transition-colors hover:border-foreground/15">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span className="truncate">{profile?.name ?? symbol}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {symbol}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-end justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {profile?.exchange ?? profile?.country ?? "—"}
          </div>
          <div className="text-right">
            <div className="font-mono text-sm tabular-nums">{fmt(quote?.current ?? null, 4)}</div>
            <div className="text-xs text-muted-foreground">Last</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

