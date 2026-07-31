"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { PriceBar } from "@/types/stock-research";

type Point = {
  date: string;
  close: number;
};

function toPoints(bars: PriceBar[]): Point[] {
  return bars
    .filter((b) => typeof b.close === "number" && Number.isFinite(b.close))
    .map((b) => ({ date: b.date, close: b.close as number }));
}

export function StockChart({ symbol, bars }: { symbol: string; bars: PriceBar[] }) {
  const data = React.useMemo(() => toPoints(bars).slice(-180), [bars]);

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Price Overview</CardTitle>
        <div className="text-xs text-muted-foreground">{symbol}</div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No historical pricing data available.
          </p>
        ) : (
          <ChartContainer
            config={{
              close: {
                label: "Close",
                color: "oklch(0.70 0.18 162)",
              },
            }}
            className="h-64 w-full"
          >
            <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                minTickGap={32}
                tickFormatter={(v) => String(v).slice(5)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={42}
                tickFormatter={(v) =>
                  typeof v === "number" ? v.toLocaleString() : String(v)
                }
              />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Area
                type="monotone"
                dataKey="close"
                stroke="var(--color-close)"
                fill="var(--color-close)"
                fillOpacity={0.12}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

