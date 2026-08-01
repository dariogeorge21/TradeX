"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Star,
  GitCompare,
  ExternalLink,
  Zap,
  Loader2,
  Minus,
} from "lucide-react";
import { IndicatorSnapshot } from "@/types/market-indicators";
import { getIndicatorMeta } from "@/lib/indicators-fallback-data";
import { cn } from "@/lib/utils";
import { MotionDiv } from "@/components/ui/motion-wrapper";

// Category icon mapping
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Momentum: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/20" },
  Trend: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/20" },
  Volatility: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/20" },
  Volume: { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/20" },
  Market: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/20" },
  Sentiment: { bg: "bg-pink-500/15", text: "text-pink-400", border: "border-pink-500/20" },
  default: { bg: "bg-violet-500/15", text: "text-violet-400", border: "border-violet-500/20" },
};

const SIGNAL_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  "Strong Buy": { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400" },
  Buy: { bg: "bg-emerald-500/10", text: "text-emerald-500", dot: "bg-emerald-500" },
  Neutral: { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-400" },
  Sell: { bg: "bg-rose-500/10", text: "text-rose-500", dot: "bg-rose-500" },
  "Strong Sell": { bg: "bg-rose-500/15", text: "text-rose-400", dot: "bg-rose-400" },
};

interface IndicatorCardProps {
  snap: IndicatorSnapshot;
  index: number;
  isFavorited?: boolean;
  onFavorite?: (id: string) => void;
  onCompare?: (id: string) => void;
}

export function IndicatorCard({ snap, index, isFavorited, onFavorite, onCompare }: IndicatorCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [isHovered, setIsHovered] = React.useState(false);

  const meta = getIndicatorMeta(snap.id);
  const displayName = meta ? meta.shortName : snap.id.toUpperCase();
  const fullName = meta ? meta.name : snap.id;
  const description = meta?.description ?? "Market indicator tracking price and volume dynamics.";
  const category = meta?.category ?? "Other";
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.default;
  const signalStyle = SIGNAL_STYLES[snap.signal] ?? SIGNAL_STYLES.Neutral;

  const isPositive = snap.trend === "Bullish";
  const isNegative = snap.trend === "Bearish";
  const diff = snap.currentValue - snap.previousValue;
  const diffPct = snap.previousValue !== 0 ? ((diff / Math.abs(snap.previousValue)) * 100) : 0;

  const lastUpdated = new Date(snap.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleNavigate = () => {
    startTransition(() => {
      router.push(`/dashboard/indicators/${encodeURIComponent(snap.id)}`);
    });
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "group relative flex flex-col rounded-2xl border bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300",
          isHovered
            ? "border-violet-500/40 shadow-xl shadow-violet-500/10 -translate-y-0.5"
            : "border-white/8 shadow-sm hover:border-white/15"
        )}
      >
        {/* Gradient overlay on hover */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent pointer-events-none transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Loading overlay */}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-10 rounded-2xl">
            <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
          </div>
        )}

        <div className="relative p-5 flex flex-col gap-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold shrink-0 border", colors.bg, colors.text, colors.border)}>
                {displayName.slice(0, 2)}
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">{displayName}</p>
                <p className="text-xs text-muted-foreground leading-tight truncate max-w-[120px]">{fullName}</p>
              </div>
            </div>

            {/* Signal badge */}
            <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0", signalStyle.bg, signalStyle.text)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", signalStyle.dot)} />
              {snap.signal}
            </div>
          </div>

          {/* Value & trend */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-black tracking-tight">{snap.currentValue.toFixed(2)}</p>
              <div className={cn("flex items-center gap-1 text-xs font-semibold mt-0.5",
                isPositive ? "text-emerald-400" : isNegative ? "text-rose-400" : "text-slate-400"
              )}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : isNegative ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                <span>{diff >= 0 ? "+" : ""}{diff.toFixed(2)} ({diffPct >= 0 ? "+" : ""}{diffPct.toFixed(1)}%)</span>
              </div>
            </div>

            {/* Trend direction pill */}
            <div className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              isPositive ? "bg-emerald-500/10 text-emerald-400" :
              isNegative ? "bg-rose-500/10 text-rose-400" :
              "bg-slate-500/10 text-slate-400"
            )}>
              {snap.trend}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>

          {/* AI confidence bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <Zap className="h-3 w-3 text-violet-400" />
                AI Confidence
              </span>
              <span className="font-semibold text-violet-400">{snap.confidenceScore}%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700"
                style={{ width: `${snap.confidenceScore}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
              <Activity className="h-3 w-3" />
              Updated {lastUpdated}
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-1">
              {onFavorite && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onFavorite(snap.id); }}
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-150",
                    isFavorited
                      ? "text-amber-400 bg-amber-500/10"
                      : "text-muted-foreground/40 hover:text-amber-400 hover:bg-amber-500/10"
                  )}
                  title="Favorite"
                >
                  <Star className={cn("h-3.5 w-3.5", isFavorited && "fill-current")} />
                </button>
              )}
              {onCompare && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onCompare(snap.id); }}
                  className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-150"
                  title="Compare"
                >
                  <GitCompare className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={handleNavigate}
                className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-150"
                title="View Details"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
}

// Loading skeleton
export function IndicatorCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/8 bg-card/40 p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-16 rounded bg-white/10" />
            <div className="h-3 w-28 rounded bg-white/5" />
          </div>
        </div>
        <div className="h-6 w-20 rounded-full bg-white/10" />
      </div>
      <div className="space-y-1">
        <div className="h-7 w-24 rounded bg-white/10" />
        <div className="h-3 w-16 rounded bg-white/5" />
      </div>
      <div className="space-y-1">
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-3/4 rounded bg-white/5" />
      </div>
      <div className="h-1 w-full rounded-full bg-white/10" />
      <div className="flex justify-between">
        <div className="h-3 w-24 rounded bg-white/5" />
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-6 w-6 rounded-lg bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
