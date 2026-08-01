import { CryptoSnapshotTicker } from "@/types/crypto";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingDown, TrendingUp, RefreshCw } from "lucide-react";

export function CryptoHeader({ snapshot }: { snapshot: CryptoSnapshotTicker }) {
  const isPositive = snapshot.todaysChangePerc >= 0;
  const displayName = snapshot.ticker.replace("X:", "").replace("USD", "");

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 rounded-2xl border border-foreground/10 bg-card/60 p-6 shadow-sm backdrop-blur-md">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
          <span className="text-sm font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
            {snapshot.ticker}
          </span>
        </div>
        <div className="flex items-baseline gap-4">
          <span className="text-4xl font-extrabold tracking-tighter">
            {formatCurrency(snapshot.day.c)}
          </span>
          <span
            className={`flex items-center text-lg font-medium ${
              isPositive ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="mr-1 h-5 w-5" />
            ) : (
              <TrendingDown className="mr-1 h-5 w-5" />
            )}
            {formatPercentage(Math.abs(snapshot.todaysChangePerc))}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <RefreshCw className="h-4 w-4" />
        <span>Last updated: {new Date(snapshot.updated).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
