import * as React from "react";
import { TechnicalIndicators as TechType, RecommendationTrends } from "@/types/stock-research";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TechnicalIndicators({ technicals, trends }: { technicals: TechType | null, trends: RecommendationTrends[] | null }) {
  const currentTrend = trends?.[0] || null;
  const total = currentTrend ? (currentTrend.strongBuy ?? 0) + (currentTrend.buy ?? 0) + (currentTrend.hold ?? 0) + (currentTrend.sell ?? 0) + (currentTrend.strongSell ?? 0) : 0;
  
  const getSignal = (value: number | null, type: 'rsi' | 'macd' | 'sma') => {
    if (value === null) return { text: "Neutral", color: "text-blue-500", bg: "bg-blue-500/10", icon: Minus };
    if (type === 'rsi') {
      if (value > 70) return { text: "Overbought (Sell)", color: "text-red-500", bg: "bg-red-500/10", icon: ArrowDownRight };
      if (value < 30) return { text: "Oversold (Buy)", color: "text-green-500", bg: "bg-green-500/10", icon: ArrowUpRight };
      return { text: "Neutral", color: "text-blue-500", bg: "bg-blue-500/10", icon: Minus };
    }
    if (type === 'macd') {
      if (value > 0) return { text: "Bullish", color: "text-green-500", bg: "bg-green-500/10", icon: ArrowUpRight };
      if (value < 0) return { text: "Bearish", color: "text-red-500", bg: "bg-red-500/10", icon: ArrowDownRight };
      return { text: "Neutral", color: "text-blue-500", bg: "bg-blue-500/10", icon: Minus };
    }
    return { text: "Neutral", color: "text-blue-500", bg: "bg-blue-500/10", icon: Minus };
  };

  const rsiSignal = getSignal(technicals?.rsi14 ?? null, 'rsi');
  const macdSignal = getSignal(technicals?.macd ?? null, 'macd');

  return (
    <div className="space-y-6 bg-card border border-foreground/10 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold tracking-tight">Technical Analysis</h3>
        {currentTrend && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase">Consensus:</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {((currentTrend.strongBuy ?? 0) + (currentTrend.buy ?? 0)) > ((currentTrend.strongSell ?? 0) + (currentTrend.sell ?? 0)) ? "Buy" : "Hold"}
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-muted/50 border border-foreground/5 flex flex-col justify-between">
          <span className="text-sm font-medium text-muted-foreground">RSI (14)</span>
          <div className="mt-2 flex justify-between items-end">
            <span className="text-2xl font-bold">{technicals?.rsi14?.toFixed(2) ?? "N/A"}</span>
            <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${rsiSignal.bg} ${rsiSignal.color}`}>
              <rsiSignal.icon className="h-3 w-3 mr-1" />
              {rsiSignal.text}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-muted/50 border border-foreground/5 flex flex-col justify-between">
          <span className="text-sm font-medium text-muted-foreground">MACD</span>
          <div className="mt-2 flex justify-between items-end">
            <span className="text-2xl font-bold">{technicals?.macd?.toFixed(2) ?? "N/A"}</span>
            <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${macdSignal.bg} ${macdSignal.color}`}>
              <macdSignal.icon className="h-3 w-3 mr-1" />
              {macdSignal.text}
            </div>
          </div>
        </div>
      </div>

      {currentTrend && total > 0 && (
        <div className="pt-2">
          <span className="text-sm font-medium text-muted-foreground block mb-3">Analyst Ratings ({total})</span>
          <div className="flex h-3 w-full rounded-full overflow-hidden">
            <div style={{ width: `${((currentTrend.strongBuy ?? 0) / total) * 100}%` }} className="bg-green-600" title="Strong Buy" />
            <div style={{ width: `${((currentTrend.buy ?? 0) / total) * 100}%` }} className="bg-green-400" title="Buy" />
            <div style={{ width: `${((currentTrend.hold ?? 0) / total) * 100}%` }} className="bg-yellow-400" title="Hold" />
            <div style={{ width: `${((currentTrend.sell ?? 0) / total) * 100}%` }} className="bg-red-400" title="Sell" />
            <div style={{ width: `${((currentTrend.strongSell ?? 0) / total) * 100}%` }} className="bg-red-600" title="Strong Sell" />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-1">
            <span>Buy</span>
            <span>Hold</span>
            <span>Sell</span>
          </div>
        </div>
      )}
    </div>
  );
}
