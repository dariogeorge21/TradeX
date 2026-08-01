"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { TrendingUp, TrendingDown, Activity, Flame } from "lucide-react";

const TABS = [
  { id: "gainers", label: "Gainers", icon: TrendingUp },
  { id: "losers", label: "Losers", icon: TrendingDown },
  { id: "active", label: "Active", icon: Activity },
  { id: "trending", label: "Trending", icon: Flame },
];

const mockData: Record<string, any[]> = {
  gainers: [
    { ticker: "ARM", price: "$142.50", change: "+14.2%" },
    { ticker: "SMCI", price: "$854.20", change: "+11.8%" },
    { ticker: "PLTR", price: "$24.10", change: "+8.5%" },
    { ticker: "COIN", price: "$262.40", change: "+6.1%" },
  ],
  losers: [
    { ticker: "BA", price: "$182.10", change: "-6.4%" },
    { ticker: "SNOW", price: "$164.20", change: "-5.2%" },
    { ticker: "RIVN", price: "$12.40", change: "-4.8%" },
    { ticker: "INTC", price: "$38.20", change: "-3.1%" },
  ],
  active: [
    { ticker: "TSLA", price: "$172.10", change: "-2.4%" },
    { ticker: "NVDA", price: "$892.10", change: "+4.2%" },
    { ticker: "AAPL", price: "$189.43", change: "+1.2%" },
    { ticker: "AMD", price: "$178.50", change: "+2.8%" },
  ],
  trending: [
    { ticker: "RDDT", price: "$48.50", change: "+2.1%" },
    { ticker: "DJT", price: "$44.10", change: "-1.5%" },
    { ticker: "MSTR", price: "$1620.50", change: "+8.4%" },
    { ticker: "HOOD", price: "$19.20", change: "+4.5%" },
  ],
};

export function MarketMovers() {
  const [activeTab, setActiveTab] = useState("gainers");
  
  return (
    <section className="col-span-12 lg:col-span-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <Activity className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white tracking-tight">Market Movers</h2>
      </div>

      <div className="dash-v2-card flex flex-col overflow-hidden h-full">
        <div className="flex overflow-x-auto border-b border-white/5 scrollbar-none">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap outline-none relative ${activeTab === tab.id ? 'text-white' : 'text-muted-foreground hover:text-white/80'}`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-emerald-400' : ''}`} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 flex flex-col gap-2 min-h-[220px] flex-1">
          {mockData[activeTab].map((item, i) => {
            const isPositive = item.change.startsWith("+");
            return (
              <motion.div
                key={item.ticker + activeTab} // force re-render on tab change for animation
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white group-hover:scale-110 transition-transform">
                    {item.ticker[0]}
                  </div>
                  <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">{item.ticker}</span>
                </div>
                <div className="text-right flex items-center gap-4">
                  <span className="font-medium text-white/90">{item.price}</span>
                  <span className={`text-xs font-bold w-16 text-right px-2 py-1 rounded bg-white/5 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {item.change}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
        
        <div className="px-4 pb-4 mt-auto">
          <button className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors border border-white/10">
            View All {TABS.find(t => t.id === activeTab)?.label}
          </button>
        </div>
      </div>
    </section>
  );
}
