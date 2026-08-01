"use client";

import * as React from "react";
import Link from "next/navigation";
import { useRouter } from "next/navigation";
import { TrendingUp, TrendingDown, Star, BarChart2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface PremiumStockCardProps {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  marketCap?: string;
  sector?: string;
  volume?: string;
  aiSentiment?: "Bullish" | "Bearish" | "Neutral";
  sparklineData?: { value: number }[];
}

export function PremiumStockCard({
  symbol,
  name,
  price,
  changePercent,
  marketCap,
  sector,
  volume,
  aiSentiment = "Neutral",
  sparklineData = Array.from({ length: 20 }, () => ({ value: Math.random() * 100 + 50 })),
}: PremiumStockCardProps) {
  const router = useRouter();
  const isPositive = changePercent >= 0;
  
  const sentimentConfig = {
    Bullish: { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
    Bearish: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    Neutral: { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  };

  const handleCardClick = () => {
    router.push(`/dashboard/stocks/${symbol}`);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="min-w-[320px] max-w-[320px] snap-center cursor-pointer group relative rounded-2xl border border-foreground/10 bg-card p-5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all overflow-hidden flex flex-col justify-between"
    >
      {/* Background Gradient */}
      <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-30 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
            {symbol}
            {aiSentiment === "Bullish" && <Badge variant="outline" className={`${sentimentConfig.Bullish.bg} ${sentimentConfig.Bullish.color} ${sentimentConfig.Bullish.border} border text-[10px] py-0 px-1.5 h-5`}>AI Bullish</Badge>}
            {aiSentiment === "Bearish" && <Badge variant="outline" className={`${sentimentConfig.Bearish.bg} ${sentimentConfig.Bearish.color} ${sentimentConfig.Bearish.border} border text-[10px] py-0 px-1.5 h-5`}>AI Bearish</Badge>}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{name}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-semibold text-lg">${price.toFixed(2)}</span>
          <span className={`text-sm font-medium flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="h-16 w-full my-4 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? "#22c55e" : "#ef4444"} 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics Footer */}
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2 relative z-10">
        {marketCap && (
          <div className="flex flex-col">
            <span className="opacity-70">Market Cap</span>
            <span className="font-medium text-foreground">{marketCap}</span>
          </div>
        )}
        {sector && (
          <div className="flex flex-col">
            <span className="opacity-70">Sector</span>
            <span className="font-medium text-foreground truncate">{sector}</span>
          </div>
        )}
      </div>

      {/* Quick Actions (Hover) */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-card via-card to-transparent translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 flex justify-between gap-2">
        <Button variant="secondary" size="sm" className="w-full" onClick={handleActionClick}>
          <Star className="w-4 h-4 mr-2" />
          Watch
        </Button>
        <Button size="sm" className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground" onClick={handleActionClick}>
          Research
        </Button>
      </div>
    </motion.div>
  );
}
