"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Gauge,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { IndicatorSnapshot } from "@/types/market-indicators";
import { getIndicatorMeta } from "@/lib/indicators-fallback-data";
import { cn } from "@/lib/utils";
import { MotionDiv } from "@/components/ui/motion-wrapper";

interface MarketSnapshotProps {
  snapshots: IndicatorSnapshot[];
}

function getSentimentLabel(score: number): { label: string; color: string } {
  if (score >= 75) return { label: "Extreme Greed", color: "text-red-400" };
  if (score >= 55) return { label: "Greed", color: "text-orange-400" };
  if (score >= 45) return { label: "Neutral", color: "text-slate-400" };
  if (score >= 25) return { label: "Fear", color: "text-blue-400" };
  return { label: "Extreme Fear", color: "text-indigo-400" };
}

function getVIXLabel(value: number): { label: string; color: string } {
  if (value >= 30) return { label: "High Volatility", color: "text-red-400" };
  if (value >= 20) return { label: "Elevated", color: "text-amber-400" };
  return { label: "Low", color: "text-emerald-400" };
}

export function MarketSnapshot({ snapshots }: MarketSnapshotProps) {
  const router = useRouter();

  const fgSnap = snapshots.find((s) => s.id === "fgindex");
  const vixSnap = snapshots.find((s) => s.id === "vix");
  const rsiSnap = snapshots.find((s) => s.id === "rsi");

  // Derive overall sentiment from signals
  const bullCount = snapshots.filter((s) => s.signal === "Buy" || s.signal === "Strong Buy").length;
  const bearCount = snapshots.filter((s) => s.signal === "Sell" || s.signal === "Strong Sell").length;
  const total = snapshots.length || 1;
  const sentimentPct = Math.round((bullCount / total) * 100);

  const overallSignal =
    bullCount > bearCount * 1.5 ? "Bullish" :
    bearCount > bullCount * 1.5 ? "Bearish" : "Mixed";

  const fgValue = fgSnap ? Math.round(fgSnap.currentValue) : 62;
  const fgSentiment = getSentimentLabel(fgValue);
  const vixValue = vixSnap ? vixSnap.currentValue : 18.4;
  const vixLabel = getVIXLabel(vixValue);

  const metrics = [
    {
      id: "fgindex",
      icon: <Gauge className="h-4 w-4" />,
      label: "Fear & Greed",
      value: fgValue.toString(),
      sub: fgSentiment.label,
      color: fgSentiment.color,
      barColor: "from-indigo-500 to-red-500",
      barPct: fgValue,
    },
    {
      id: "vix",
      icon: <Activity className="h-4 w-4" />,
      label: "VIX",
      value: vixValue.toFixed(1),
      sub: vixLabel.label,
      color: vixLabel.color,
      barColor: vixValue >= 30 ? "from-amber-500 to-red-500" : "from-emerald-500 to-amber-500",
      barPct: Math.min((vixValue / 50) * 100, 100),
    },
    {
      id: "rsi",
      icon: <BarChart3 className="h-4 w-4" />,
      label: "Market RSI",
      value: rsiSnap ? rsiSnap.currentValue.toFixed(1) : "54.2",
      sub: (rsiSnap?.currentValue ?? 54) > 70 ? "Overbought" : (rsiSnap?.currentValue ?? 54) < 30 ? "Oversold" : "Neutral Zone",
      color: (rsiSnap?.currentValue ?? 54) > 70 ? "text-red-400" : (rsiSnap?.currentValue ?? 54) < 30 ? "text-blue-400" : "text-slate-400",
      barColor: "from-blue-500 to-violet-500",
      barPct: rsiSnap ? rsiSnap.currentValue : 54,
    },
    {
      id: "breadth",
      icon: <TrendingUp className="h-4 w-4" />,
      label: "Market Breadth",
      value: `${sentimentPct}%`,
      sub: `${bullCount} Bullish · ${bearCount} Bearish`,
      color: sentimentPct > 50 ? "text-emerald-400" : "text-rose-400",
      barColor: sentimentPct > 50 ? "from-emerald-500 to-teal-500" : "from-rose-500 to-red-500",
      barPct: sentimentPct,
    },
  ];

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border border-white/8 bg-card/40 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15">
            <Activity className="h-3.5 w-3.5 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-bold">Market Snapshot</p>
            <p className="text-[11px] text-muted-foreground">Live indicators overview</p>
          </div>
        </div>

        {/* Overall AI signal */}
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border",
          overallSignal === "Bullish" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
          overallSignal === "Bearish" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
          "bg-slate-500/10 text-slate-400 border-slate-500/20"
        )}>
          {overallSignal === "Bullish" ? <TrendingUp className="h-3 w-3" /> :
           overallSignal === "Bearish" ? <TrendingDown className="h-3 w-3" /> :
           <Activity className="h-3 w-3" />}
          AI: {overallSignal}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-white/5">
        {metrics.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => router.push(`/dashboard/indicators/${m.id}`)}
            className="flex flex-col gap-3 p-4 hover:bg-white/3 transition-colors group text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-violet-400/70">{m.icon}</span>
                <span className="text-[11px] font-semibold uppercase tracking-wide">{m.label}</span>
              </div>
              <ArrowRight className="h-3 w-3 text-muted-foreground/20 group-hover:text-muted-foreground/60 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight">{m.value}</p>
              <p className={cn("text-[11px] font-semibold mt-0.5", m.color)}>{m.sub}</p>
            </div>
            <div className="h-1 w-full rounded-full bg-white/5">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", m.barColor)}
                style={{ width: `${m.barPct}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </MotionDiv>
  );
}
