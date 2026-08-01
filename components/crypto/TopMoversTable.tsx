"use client";

import * as React from "react";
import Link from "next/link";
import { CryptoSnapshotTicker } from "@/types/crypto";
import { formatCurrency, formatPercentage } from "@/lib/utils";

export function TopMoversTable({
  snapshots,
}: {
  snapshots: CryptoSnapshotTicker[];
}) {
  const [tab, setTab] = React.useState<"gainers" | "losers">("gainers");

  // Filter out any zero changes or weird data
  const valid = snapshots.filter((s) => s.todaysChangePerc !== 0);
  
  const gainers = [...valid].sort((a, b) => b.todaysChangePerc - a.todaysChangePerc).slice(0, 10);
  const losers = [...valid].sort((a, b) => a.todaysChangePerc - b.todaysChangePerc).slice(0, 10);

  const data = tab === "gainers" ? gainers : losers;

  return (
    <div className="rounded-xl border border-foreground/10 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
      <div className="flex border-b border-foreground/10">
        <button
          onClick={() => setTab("gainers")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            tab === "gainers"
              ? "bg-emerald-500/10 text-emerald-500 border-b-2 border-emerald-500"
              : "text-muted-foreground hover:bg-muted/50"
          }`}
        >
          Top Gainers
        </button>
        <button
          onClick={() => setTab("losers")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            tab === "losers"
              ? "bg-rose-500/10 text-rose-500 border-b-2 border-rose-500"
              : "text-muted-foreground hover:bg-muted/50"
          }`}
        >
          Top Losers
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-muted/30">
            <tr>
              <th className="px-6 py-3 font-medium">Asset</th>
              <th className="px-6 py-3 font-medium text-right">Price</th>
              <th className="px-6 py-3 font-medium text-right">24h Change</th>
              <th className="px-6 py-3 font-medium text-right hidden sm:table-cell">24h Vol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {data.map((snap) => {
              const displayName = snap.ticker.replace("X:", "").replace("USD", "");
              const isPositive = snap.todaysChangePerc >= 0;

              return (
                <tr key={snap.ticker} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/crypto/${encodeURIComponent(snap.ticker)}`}
                      className="font-medium text-foreground hover:text-amber-500 transition-colors"
                    >
                      {displayName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    {formatCurrency(snap.day.c)}
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-medium ${
                      isPositive ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {formatPercentage(snap.todaysChangePerc)}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground hidden sm:table-cell font-mono text-xs">
                    {(snap.day.v).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
