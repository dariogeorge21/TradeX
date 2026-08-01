"use client";

import { MarketIndicator, IndicatorSnapshot } from "@/types/market-indicators";
import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { MotionDiv } from "@/components/ui/motion-wrapper";

interface IndicatorDetailsHeaderProps {
  indicator: MarketIndicator;
  snapshot: IndicatorSnapshot;
}

export function IndicatorDetailsHeader({ indicator, snapshot }: IndicatorDetailsHeaderProps) {
  const isPositive = snapshot.trend === "Bullish";
  const isNegative = snapshot.trend === "Bearish";

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
      <div className="space-y-4">
        <MotionDiv
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-muted-foreground"
        >
          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-500 dark:text-violet-400">
            {indicator.category}
          </span>
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500 dark:text-blue-400">
            {indicator.type.toUpperCase()}
          </span>
        </MotionDiv>
        <MotionDiv initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl flex items-center gap-4">
            {indicator.name}
            <span className="text-muted-foreground font-medium text-2xl">({indicator.shortName})</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            {indicator.description}
          </p>
        </MotionDiv>
      </div>

      <MotionDiv
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-start md:items-end gap-2"
      >
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-black tracking-tighter">
            {snapshot.currentValue.toFixed(2)}
          </span>
          <div
            className={cn(
              "flex items-center text-lg font-bold",
              isPositive ? "text-emerald-500" : isNegative ? "text-rose-500" : "text-slate-500"
            )}
          >
            {isPositive ? <TrendingUp className="mr-1 h-5 w-5" /> : isNegative ? <TrendingDown className="mr-1 h-5 w-5" /> : null}
            <span className="text-sm ml-1 text-muted-foreground font-medium">Trend</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
               <Zap className="h-4 w-4 text-amber-500" />
               Signal: <span className={cn(
                  "font-bold",
                  (snapshot.signal === "Strong Buy" || snapshot.signal === "Buy") ? "text-emerald-500" :
                  (snapshot.signal === "Strong Sell" || snapshot.signal === "Sell") ? "text-rose-500" : "text-slate-500"
               )}>{snapshot.signal}</span>
            </div>
            <div className="flex items-center gap-1.5">
               <Activity className="h-4 w-4 text-blue-500" />
               Strength: <span className="text-foreground">{snapshot.strengthScore}/100</span>
            </div>
        </div>
      </MotionDiv>
    </div>
  );
}
