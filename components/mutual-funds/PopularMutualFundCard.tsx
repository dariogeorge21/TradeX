"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { MutualFundSummary } from "@/types/mutual-funds";

function fmt(n: number | null, digits = 2) {
  if (typeof n !== "number") return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export function PopularMutualFundCard({
  symbol,
  name,
  summary,
  performance_rating,
  risk_rating,
}: {
  symbol: string;
  name?: string;
  summary: MutualFundSummary | null;
  performance_rating: number | null;
  risk_rating: number | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCardClick = () => {
    startTransition(() => {
      router.push(`/dashboard/mutual-funds/${encodeURIComponent(symbol)}`);
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        onClick={handleCardClick}
        className={`group relative overflow-hidden border border-foreground/10 bg-card/40 backdrop-blur transition-all duration-300 cursor-pointer hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 ${isPending ? 'pointer-events-none' : ''} h-[140px] flex flex-col justify-between`}
      >
        {/* Loading overlay */}
        {isPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-xs transition-all">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500 drop-shadow-md" />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
        <CardHeader className="pb-3 pt-5 px-5">
          <CardTitle className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="group-hover:underline underline-offset-4 decoration-emerald-500 transition-all">
                <h3 className="line-clamp-1 font-bold text-lg text-foreground">{name ?? summary?.name ?? symbol}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {symbol}
                </span>
                {summary?.fund_family && (
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {summary.fund_family}
                  </span>
                )}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-0 flex items-end justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {summary?.fund_type ?? summary?.currency ?? "—"}
          </div>
          <div className="text-right flex items-center gap-3">
            {performance_rating !== null && performance_rating > 0 && (
               <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                 {performance_rating} <Star className="h-3 w-3 fill-amber-500" />
               </div>
            )}
            <div className="font-mono text-lg font-semibold tracking-tight tabular-nums">
              {summary?.ytd_return ? `${fmt(summary.ytd_return, 2)}%` : "—"}
              <span className="text-xs text-muted-foreground ml-1 font-sans font-normal">YTD</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
