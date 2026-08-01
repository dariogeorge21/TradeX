"use client";

import { motion } from "framer-motion";
import { Eye, TrendingUp, TrendingDown, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const watchlistData = [
  { 
    ticker: "AAPL", 
    name: "Apple Inc.", 
    price: "$189.43", 
    change: "+1.2%", 
    isPositive: true,
    sentiment: "Bullish",
    newsCount: 14,
    badge: "Buy",
    color: "blue"
  },
  { 
    ticker: "TSLA", 
    name: "Tesla Inc.", 
    price: "$172.10", 
    change: "-2.4%", 
    isPositive: false,
    sentiment: "Bearish",
    newsCount: 32,
    badge: "Sell",
    color: "red"
  },
  { 
    ticker: "MSFT", 
    name: "Microsoft", 
    price: "$412.50", 
    change: "+0.8%", 
    isPositive: true,
    sentiment: "Neutral",
    newsCount: 8,
    badge: "Hold",
    color: "emerald"
  }
];

function generateMiniSparkline(isPositive: boolean, seed: number) {
  const points = [];
  let currentY = isPositive ? 20 : 5;
  for (let i = 0; i <= 30; i += 5) {
    points.push(`${i},${currentY}`);
    const randomShift = (Math.sin(seed + i) * 3);
    currentY += randomShift - (isPositive ? 1.5 : -1.5);
    currentY = Math.max(2, Math.min(28, currentY));
  }
  return `M ${points.join(" L ")}`;
}

export function DashboardWatchlist() {
  const sparklines = useMemo(() => {
    return watchlistData.map((m, i) => generateMiniSparkline(m.isPositive, i * 20));
  }, []);

  return (
    <section className="col-span-12 lg:col-span-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <Eye className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-semibold text-white tracking-tight">Watchlist</h2>
        <Link href="/dashboard/stocks" className="ml-auto text-xs font-medium text-muted-foreground hover:text-white transition-colors">
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {watchlistData.map((item, i) => (
          <motion.div
            key={item.ticker}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="dash-v2-card p-4 hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-${item.color}-500/20 border border-${item.color}-500/30 flex items-center justify-center font-bold text-sm text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                  {item.ticker[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{item.ticker}</h3>
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white">{item.price}</div>
                <div className={`text-xs font-semibold ${item.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.change}
                </div>
              </div>
            </div>

            <div className="h-6 w-full my-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 30 30" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <path 
                  d={sparklines[i]} 
                  fill="none" 
                  stroke={item.isPositive ? "#10b981" : "#ef4444"} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border 
                  ${item.badge === 'Buy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    item.badge === 'Sell' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                  {item.badge}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="w-3 h-3" /> {item.newsCount}
                </span>
              </div>
              
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                AI: <span className={item.sentiment === 'Bullish' ? 'text-emerald-400' : item.sentiment === 'Bearish' ? 'text-red-400' : 'text-blue-400'}>{item.sentiment}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
