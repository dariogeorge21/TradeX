"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { IndicatorDataPoint, MarketIndicator } from "@/types/market-indicators";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "next-themes";

interface IndicatorChartProps {
  indicator: MarketIndicator;
  data: IndicatorDataPoint[];
}

export function IndicatorChart({ indicator, data }: IndicatorChartProps) {
  const { theme } = useTheme();
  
  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      date: format(new Date(d.timestamp), "MMM dd"),
    }));
  }, [data]);

  const strokeColor = theme === "dark" ? "#8b5cf6" : "#7c3aed"; // violet-500/600
  const secondaryColor = theme === "dark" ? "#f59e0b" : "#d97706"; // amber-500/600
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const textColor = theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";

  return (
    <Card className="col-span-1 lg:col-span-2 border-foreground/10 bg-card/60 backdrop-blur-xl shadow-lg">
      <CardHeader>
        <CardTitle>Historical Performance</CardTitle>
        <CardDescription>Daily timeframe analysis for {indicator.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {indicator.id === "macd" ? (
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="date" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => v.toFixed(2)} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="histogram" fill="#10b981" />
                <Line type="monotone" dataKey="value" stroke={strokeColor} strokeWidth={2} dot={false} name="MACD Line" />
                <Line type="monotone" dataKey="signal" stroke={secondaryColor} strokeWidth={2} dot={false} name="Signal Line" />
              </ComposedChart>
            ) : indicator.id === "bbands" ? (
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="date" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line type="monotone" dataKey="upperBand" stroke={textColor} strokeWidth={1} dot={false} strokeDasharray="5 5" name="Upper Band" />
                <Line type="monotone" dataKey="sma" stroke={secondaryColor} strokeWidth={2} dot={false} name="SMA" />
                <Line type="monotone" dataKey="lowerBand" stroke={textColor} strokeWidth={1} dot={false} strokeDasharray="5 5" name="Lower Band" />
                <Line type="monotone" dataKey="value" stroke={strokeColor} strokeWidth={2} dot={false} name="Price" />
              </ComposedChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="date" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                    stroke={textColor} 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={indicator.type === "oscillator" || indicator.type === "sentiment" ? [0, 100] : ['auto', 'auto']} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line type="monotone" dataKey="value" stroke={strokeColor} strokeWidth={2} dot={false} name={indicator.shortName} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
