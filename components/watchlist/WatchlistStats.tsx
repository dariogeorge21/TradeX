"use client";

import { WatchlistStats as StatsType } from "@/types/watchlist";
import { motion } from "framer-motion";
import { Activity, ArrowDownRight, ArrowUpRight, BrainCircuit, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface WatchlistStatsProps {
  stats: StatsType;
}

export function WatchlistStats({ stats }: WatchlistStatsProps) {
  const cards = [
    {
      title: "Total Stocks",
      value: stats.totalStocks,
      icon: Hash,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Today's Winners",
      value: stats.todayWinners,
      icon: ArrowUpRight,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Today's Losers",
      value: stats.todayLosers,
      icon: ArrowDownRight,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    {
      title: "Avg Daily Change",
      value: `${stats.averageDailyChange > 0 ? "+" : ""}${stats.averageDailyChange.toFixed(2)}%`,
      icon: Activity,
      color: stats.averageDailyChange >= 0 ? "text-emerald-400" : "text-rose-400",
      bg: stats.averageDailyChange >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10",
      border: stats.averageDailyChange >= 0 ? "border-emerald-500/20" : "border-rose-500/20",
    },
    {
      title: "AI Watch Score",
      value: stats.aiWatchScore.toFixed(0),
      icon: BrainCircuit,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className={cn(
            "p-6 rounded-2xl border bg-white/5 backdrop-blur-sm relative overflow-hidden group",
            card.border
          )}
        >
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <card.icon className={cn("w-24 h-24", card.color)} />
          </div>
          
          <div className="relative z-10">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", card.bg)}>
              <card.icon className={cn("w-5 h-5", card.color)} />
            </div>
            
            <p className="text-sm font-medium text-slate-400 mb-1">{card.title}</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{card.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
