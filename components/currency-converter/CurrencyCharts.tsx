"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HistoricalRate } from "@/types/currency-converter";

interface CurrencyChartsProps {
  data: {
    '1D': HistoricalRate[];
    '1W': HistoricalRate[];
    '1M': HistoricalRate[];
    '3M': HistoricalRate[];
    '1Y': HistoricalRate[];
    '5Y': HistoricalRate[];
  };
}

export function CurrencyCharts({ data }: CurrencyChartsProps) {
  const [timeframe, setTimeframe] = useState<keyof CurrencyChartsProps["data"]>("1M");

  const chartData = data[timeframe];
  const startRate = chartData[chartData.length - 1]?.rate;
  const endRate = chartData[0]?.rate;
  
  // To color the chart green or red based on start/end comparison
  const isPositive = endRate >= startRate;
  const color = isPositive ? "#10b981" : "#f43f5e"; // emerald-500 or rose-500

  return (
    <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-xl font-bold text-white">Performance Chart</h3>
        <div className="flex bg-zinc-900 rounded-lg p-1">
          {(Object.keys(data) as Array<keyof typeof data>).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                timeframe === tf
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={[...chartData].reverse()} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(val) => {
                const d = new Date(val);
                if (timeframe === '1D') return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
              }}
              stroke="#ffffff40" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              stroke="#ffffff40" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(val) => val.toFixed(4)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b", // bg-zinc-900
                borderColor: "#ffffff10",
                borderRadius: "0.75rem",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ color: "#fff", fontWeight: 500 }}
              labelStyle={{ color: "#a1a1aa", marginBottom: "0.25rem" }} // text-zinc-400
              formatter={(value: any) => [Number(value).toFixed(4), "Rate"]}
              labelFormatter={(label: any) => {
                const d = new Date(label);
                return timeframe === '1D' 
                  ? d.toLocaleString() 
                  : d.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
              }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRate)"
              isAnimationActive={false} // Disable animation for smoother timeframe switching
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
