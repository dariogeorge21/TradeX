"use client";

import { motion } from "framer-motion";
import { Wallet, PieChart, ShieldAlert, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

const portfolioStats = {
  totalValue: "$124,532.80",
  todayPL: "+$1,240.50 (1.01%)",
  isPositive: true,
  bestPerformer: { ticker: "NVDA", change: "+4.2%" },
  worstPerformer: { ticker: "TSLA", change: "-2.4%" },
  diversification: "High (12 Sectors)",
  riskScore: "Moderate (64/100)"
};

export function PortfolioSnapshot() {
  return (
    <section className="col-span-12 lg:col-span-8 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <Wallet className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white tracking-tight">Portfolio Snapshot</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Value Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="dash-v2-card p-6 flex flex-col justify-between bg-gradient-to-br from-blue-500/10 to-transparent group"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Total Value</span>
            <Activity className="w-5 h-5 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">{portfolioStats.totalValue}</div>
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded border ${portfolioStats.isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {portfolioStats.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {portfolioStats.todayPL}
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="dash-v2-card p-4 flex flex-col justify-between hover:bg-white/5 transition-colors group cursor-default"
          >
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 group-hover:text-emerald-400/70 transition-colors">Best Performer</span>
            <div className="flex items-end justify-between">
              <span className="font-bold text-white text-lg">{portfolioStats.bestPerformer.ticker}</span>
              <span className="text-sm font-bold text-emerald-400">{portfolioStats.bestPerformer.change}</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="dash-v2-card p-4 flex flex-col justify-between hover:bg-white/5 transition-colors group cursor-default"
          >
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 group-hover:text-red-400/70 transition-colors">Worst Performer</span>
            <div className="flex items-end justify-between">
              <span className="font-bold text-white text-lg">{portfolioStats.worstPerformer.ticker}</span>
              <span className="text-sm font-bold text-red-400">{portfolioStats.worstPerformer.change}</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="dash-v2-card p-4 flex flex-col justify-between hover:bg-white/5 transition-colors group cursor-default"
          >
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 group-hover:text-blue-400/70 transition-colors">
              <PieChart className="w-3.5 h-3.5" /> Diversification
            </span>
            <span className="font-bold text-white text-sm">{portfolioStats.diversification}</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="dash-v2-card p-4 flex flex-col justify-between hover:bg-white/5 transition-colors group cursor-default"
          >
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 group-hover:text-amber-400/70 transition-colors">
              <ShieldAlert className="w-3.5 h-3.5" /> Risk Score
            </span>
            <span className="font-bold text-white text-sm">{portfolioStats.riskScore}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
