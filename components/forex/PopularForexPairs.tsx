"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TrendingDown, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { ForexSnapshotTicker } from "@/types/forex";
import { formatCurrency, formatPercentage, cn } from "@/lib/utils";
import { MotionDiv } from "@/components/ui/motion-wrapper";

function ForexOverviewItem({ snap, index }: { snap: ForexSnapshotTicker; index: number }) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const isPositive = snap.todaysChangePerc >= 0;
  const displayName = snap.ticker.replace("C:", "");

  const handleNavigate = () => {
    startTransition(() => {
      router.push(`/dashboard/forex/${encodeURIComponent(snap.ticker)}`);
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
              <DollarSign className="h-4 w-4" />
            </div>
            <span className="font-semibold">{displayName}</span>
          </div>
          <div
            className={`flex items-center text-xs font-medium ${
              isPositive ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {formatPercentage(Math.abs(snap.todaysChangePerc))}
          </div>
        </div>
        <div className="text-xl font-bold tracking-tight flex items-center justify-between w-full">
          <span>{snap.day.c.toFixed(4)}</span>
          {isPending && <Loader2 className="h-4 w-4 animate-spin text-violet-500" />}
        </div>
      </button>
    </MotionDiv>
  );
}

export function PopularForexPairs({
  snapshots,
}: {
  snapshots: ForexSnapshotTicker[];
}) {
  const displaySnaps = snapshots.slice(0, 10);

  const content = displaySnaps.map((snap, index) => (
    <ForexOverviewItem key={snap.ticker} snap={snap} index={index} />
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
      
      {/* Edge fade mask for premium look */}
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
