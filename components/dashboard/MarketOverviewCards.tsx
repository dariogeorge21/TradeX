"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useMemo } from "react";

// Helper to generate a random sparkline path for mockup
function generateSparkline(isPositive: boolean, seed: number) {
  // Use a pseudo-random approach based on seed so it doesn't jump on re-renders
  const points = [];
  let currentY = isPositive ? 80 : 20; // start low if positive, start high if negative
  
  for (let i = 0; i <= 100; i += 10) {
    points.push(`${i},${currentY}`);
    const randomShift = (Math.sin(seed + i) * 15);
    currentY += randomShift - (isPositive ? 8 : -8);
    currentY = Math.max(10, Math.min(90, currentY));
  }
  return `M ${points.join(" L ")}`;
}

const markets = [
  { name: "S&P 500", value: "5,123.69", change: "+1.2%", isPositive: true },
  { name: "NASDAQ", value: "16,274.94", change: "+1.5%", isPositive: true },
  { name: "Dow Jones", value: "39,087.38", change: "+0.8%", isPositive: true },
  { name: "NIFTY 50", value: "22,336.40", change: "-0.4%", isPositive: false },
  { name: "BANK NIFTY", value: "47,286.90", change: "-0.6%", isPositive: false },
  { name: "Bitcoin", value: "$68,432.10", change: "+3.2%", isPositive: true },
  { name: "Ethereum", value: "$3,412.50", change: "+2.1%", isPositive: true },
  { name: "Gold", value: "$2,083.40", change: "+0.5%", isPositive: true },
  { name: "Oil (WTI)", value: "$79.97", change: "-1.2%", isPositive: false },
];

export function MarketOverviewCards() {
  const sparklines = useMemo(() => {
    return markets.map((m, i) => generateSparkline(m.isPositive, i * 10));
  }, []);

  return (
    <section className="mb-8" aria-label="Market Overview">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">Market Overview</h2>
      <div className="relative overflow-hidden pb-4 -mt-2 px-1">
        <motion.div 
          className="flex w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {[0, 1].map((setIndex) => (
            <div key={setIndex} className="flex gap-4 pr-4">
              {markets.map((market, i) => (
                <motion.div
                  key={`${market.name}-${setIndex}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="dash-v2-card shrink-0 p-4 w-[200px] flex flex-col justify-between group cursor-default"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{market.name}</span>
                    {market.isPositive ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500/70 group-hover:text-emerald-400 transition-colors" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500/70 group-hover:text-red-400 transition-colors" />
                    )}
                  </div>
                  
                  <div className="h-10 w-full mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                      <path 
                        d={sparklines[i]} 
                        fill="none" 
                        stroke={market.isPositive ? "#10b981" : "#ef4444"} 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-white tracking-tight">{market.value}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${market.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {market.change}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
