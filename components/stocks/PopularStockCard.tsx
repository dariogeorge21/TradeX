"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompanyProfile, Quote } from "@/types/stock-research";

function fmt(n: number | null, digits = 2) {
  if (typeof n !== "number") return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export function PopularStockCard({
  symbol,
  profile,
  quote,
}: {
  symbol: string;
  profile: CompanyProfile | null;
  quote: Quote | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isPositive = quote?.current && quote?.previousClose && quote.current >= quote.previousClose;
  const changeColor = isPositive ? "text-emerald-500" : "text-rose-500";
  
  const handleCardClick = () => {
    startTransition(() => {
      router.push(`/dashboard/stocks/${encodeURIComponent(symbol)}`);
    });
  };

  return (
    <Card 
      onClick={handleCardClick}
      className={`group relative overflow-hidden border border-foreground/10 bg-card/40 backdrop-blur transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${isPending ? 'pointer-events-none' : ''}`}
    >
      {/* Loading overlay */}
      {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-xs transition-all">
          <Loader2 className="h-8 w-8 animate-spin text-primary drop-shadow-md" />
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="group-hover:underline underline-offset-4 decoration-primary transition-all">
              <h3 className="line-clamp-1 font-bold text-lg text-foreground">{profile?.name ?? symbol}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {symbol}
              </span>
              {profile?.website && (
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors relative z-10"
                >
                  <ExternalLink className="h-3 w-3" />
                  Website
                </a>
              )}
            </div>
          </div>
          {profile?.logo && (
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-foreground/10 bg-white">
              <img src={profile.logo} alt={`${symbol} logo`} className="h-full w-full object-contain p-1" />
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0 flex items-end justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {profile?.exchange ?? "—"}
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-semibold tracking-tight tabular-nums">
            ${fmt(quote?.current ?? null, 2)}
          </div>
          {quote?.current && quote?.previousClose ? (
            <div className={`flex items-center justify-end gap-1 text-xs font-medium ${changeColor}`}>
              {isPositive ? "+" : ""}{fmt(((quote.current - quote.previousClose) / quote.previousClose) * 100, 2)}%
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">Last</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
