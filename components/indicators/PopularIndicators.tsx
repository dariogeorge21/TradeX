"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Activity, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { IndicatorSnapshot } from "@/types/market-indicators";
import { cn } from "@/lib/utils";
import { MotionDiv } from "@/components/ui/motion-wrapper";
import { getIndicatorMeta } from "@/lib/indicators-fallback-data";

function IndicatorOverviewItem({ snap, index }: { snap: IndicatorSnapshot; index: number }) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const meta = getIndicatorMeta(snap.id);
  const isPositive = snap.trend === "Bullish";
  const displayName = meta ? meta.shortName : snap.id.toUpperCase();

  const handleNavigate = () => {
    startTransition(() => {
      router.push(`/dashboard/indicators/${encodeURIComponent(snap.id)}`);
    });
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <button
        onClick={handleNavigate}
        disabled={isPending}
        className={cn(
          "group relative flex flex-col justify-between w-48 rounded-xl border border-foreground/10 bg-card/60 p-4 shadow-sm backdrop-blur-md transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-lg hover:border-violet-500/30 hover:bg-card/80 text-left",
          isPending && "opacity-70 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between mb-3 w-full">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-violet-500/20 p-1.5 text-violet-500 transition-transform group-hover:scale-110">
              <Activity className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm">{displayName}</span>
          </div>
          <div
            className={cn("flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              snap.signal === "Strong Buy" || snap.signal === "Buy" ? "bg-emerald-500/10 text-emerald-500" :
              snap.signal === "Strong Sell" || snap.signal === "Sell" ? "bg-rose-500/10 text-rose-500" :
              "bg-slate-500/10 text-slate-500"
            )}
          >
            {snap.signal}
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
            <div className="text-xl font-bold tracking-tight">
            {snap.currentValue.toFixed(2)}
            </div>
            <div
            className={`flex items-center text-xs font-medium ${
              isPositive ? "text-emerald-500" : snap.trend === "Bearish" ? "text-rose-500" : "text-slate-500"
            }`}
            >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : snap.trend === "Bearish" ? (
              <TrendingDown className="h-3 w-3" />
            ) : null}
            </div>
        </div>
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-xl backdrop-blur-sm">
             <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
          </div>
        )}
      </button>
    </MotionDiv>
  );
}

export function PopularIndicators({
  snapshots,
}: {
  snapshots: IndicatorSnapshot[];
}) {
  const displaySnaps = snapshots.slice(0, 10);

  const content = displaySnaps.map((snap, index) => (
    <IndicatorOverviewItem key={snap.id} snap={snap} index={index} />
  ));

  return (
    <div className="w-full overflow-hidden pb-6 pt-2">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="relative w-full [mask-image:_linear-gradient(to_right,transparent_0,_black_60px,_black_calc(100%-60px),transparent_100%)]">
        <div className="flex w-max animate-marquee">
          <div className="flex gap-4 pr-4">
            {content}
          </div>
          <div className="flex gap-4 pr-4">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
