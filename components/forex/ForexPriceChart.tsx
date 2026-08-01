"use client";

import * as React from "react";
import { ForexAggregate } from "@/types/forex";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function ForexPriceChart({ aggregates }: { aggregates: ForexAggregate[] }) {
  const [timeframe, setTimeframe] = React.useState<"7D" | "30D" | "90D">("30D");

  const data = React.useMemo(() => {
    let days = 30;
    if (timeframe === "7D") days = 7;
    if (timeframe === "90D") days = 90;
    
    const sliced = aggregates.slice(-days);
    
    return sliced.map((agg) => ({
      date: new Date(agg.t).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      price: agg.c,
      open: agg.o,
      high: agg.h,
      low: agg.l,
    }));
  }, [aggregates, timeframe]);

  if (!aggregates || aggregates.length === 0) {
    return (
      <div className="h-[400px] w-full rounded-xl border border-foreground/10 bg-card/60 flex items-center justify-center text-muted-foreground">
        No price history available.
      </div>
    );
  }

  const strokeColor = "#8b5cf6"; // violet-500
  const fillColor = "#8b5cf6";

  return (
    <div className="rounded-xl border border-foreground/10 bg-card/60 p-4 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Price History</h3>
        <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
          {(["7D", "30D", "90D"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeframe === tf
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={fillColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.2} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              dy={10}
              minTickGap={30}
            />
            <YAxis
              domain={["auto", "auto"]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => val.toFixed(4)}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              dx={-10}
              width={60}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-foreground/10 bg-card/90 p-3 shadow-xl backdrop-blur-md">
                      <div className="mb-2 font-medium text-muted-foreground text-xs">{d.date}</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold">{d.price.toFixed(4)}</span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div className="text-muted-foreground">Open:</div>
                        <div className="text-right font-medium">{d.open.toFixed(4)}</div>
                        <div className="text-muted-foreground">High:</div>
                        <div className="text-right font-medium text-emerald-500">{d.high.toFixed(4)}</div>
                        <div className="text-muted-foreground">Low:</div>
                        <div className="text-right font-medium text-rose-500">{d.low.toFixed(4)}</div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
