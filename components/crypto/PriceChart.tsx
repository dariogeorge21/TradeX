"use client";

import * as React from "react";
import { CryptoAggregate } from "@/types/crypto";
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

export function PriceChart({ aggregates }: { aggregates: CryptoAggregate[] }) {
  const [timeframe, setTimeframe] = React.useState<"7D" | "30D" | "90D">("30D");

  const data = React.useMemo(() => {
    let days = 30;
    if (timeframe === "7D") days = 7;
    if (timeframe === "90D") days = 90;
    
    // The data is sorted ascending by date (oldest to newest)
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

  // Calculate if the trend for the selected timeframe is positive
  const firstPrice = data[0]?.price ?? 0;
  const lastPrice = data[data.length - 1]?.price ?? 0;
  const isPositive = lastPrice >= firstPrice;

  // Amber accent for crypto, or we can use green/red based on trend. 
  // Let's stick to the amber branding for the line, it looks premium.
  const strokeColor = "#f59e0b"; // amber-500
  const fillColor = "#f59e0b";

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
              tickFormatter={(val) => {
                if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
                if (val >= 1) return `$${val.toFixed(2)}`;
                return `$${val.toFixed(4)}`;
              }}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              width={60}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-foreground/10 bg-background p-3 shadow-lg">
                      <div className="mb-2 font-medium">{data.date}</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Close:</span>
                          <span className="font-mono font-medium">{formatCurrency(data.price)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Open:</span>
                          <span className="font-mono">{formatCurrency(data.open)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">High:</span>
                          <span className="font-mono">{formatCurrency(data.high)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Low:</span>
                          <span className="font-mono">{formatCurrency(data.low)}</span>
                        </div>
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
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
