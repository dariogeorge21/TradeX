"use client";

import React, { useState, useEffect } from "react";
import { generateLiveRate, ALL_CURRENCIES } from "@/services/currency-converter-data";
import { motion } from "framer-motion";
import { ExchangeRate } from "@/types/currency-converter";

export function CurrencyHeatmap() {
  const [heatmapData, setHeatmapData] = useState<ExchangeRate[]>([]);
  
  useEffect(() => {
    const majors = ALL_CURRENCIES.filter(c => c.type === "Major" && c.code !== "USD");
    
    const fetchHeatmap = () => {
      const data = majors.map(c => generateLiveRate("USD", c.code));
      setHeatmapData(data);
    };

    fetchHeatmap();
    const interval = setInterval(fetchHeatmap, 10000);
    return () => clearInterval(interval);
  }, []);

  if (heatmapData.length === 0) {
    return <div className="h-48 flex items-center justify-center text-zinc-500">Loading Heatmap...</div>;
  }

  return (
    <div className="bg-zinc-950 border border-white/5 rounded-2xl p-4 sm:p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Strength vs USD</h3>
      
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {heatmapData.map((rate, i) => {
          const isPositive = rate.changePercent >= 0;
          // Determine color intensity based on absolute change percent
          const intensity = Math.min(Math.abs(rate.changePercent) * 2, 1); // 0 to 1
          
          let bgColor = "bg-zinc-900";
          if (isPositive) {
            bgColor = `bg-emerald-500/${Math.max(10, Math.floor(intensity * 40))}`;
          } else {
            bgColor = `bg-rose-500/${Math.max(10, Math.floor(intensity * 40))}`;
          }

          return (
            <motion.div
              key={rate.pair}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`${bgColor} border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-colors hover:border-white/20`}
            >
              <span className="text-xs text-zinc-400 font-medium mb-1">{rate.targetCurrency}</span>
              <span className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? '+' : ''}{rate.changePercent.toFixed(2)}%
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
