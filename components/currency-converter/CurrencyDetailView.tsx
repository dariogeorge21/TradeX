"use client";

import React from "react";
import { CurrencyDetail } from "@/types/currency-converter";
import { Sparkles, Landmark, TrendingUp, Globe, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface CurrencyDetailViewProps {
  currency: CurrencyDetail;
}

export function CurrencyDetailView({ currency }: CurrencyDetailViewProps) {
  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-zinc-900 border-2 border-emerald-500/20 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              {currency.flag}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-bold text-white tracking-tight">{currency.code}</h1>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  {currency.type}
                </span>
              </div>
              <p className="text-xl text-zinc-400">{currency.name}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">
                <Globe className="h-4 w-4" />
                {currency.country}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
            <div className="text-right">
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Symbol</p>
              <p className="text-3xl font-light text-white">{currency.symbol}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Central Bank", value: currency.centralBank, icon: Landmark, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Inflation Rate", value: `${currency.inflationRate.toFixed(1)}%`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Trading Partners", value: currency.majorTradingPartners.length, icon: Globe, color: "text-purple-400", bg: "bg-purple-400/10" },
          { label: "Market Status", value: "Active", icon: Activity, color: "text-amber-400", bg: "bg-amber-400/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-950 border border-white/5 rounded-2xl p-5 flex items-start gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-zinc-500 mb-1">{stat.label}</p>
              <p className="text-lg font-semibold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Outlook & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AI Outlook */}
        <div className="lg:col-span-2 bg-gradient-to-br from-zinc-950 to-zinc-900 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Sparkles className="h-24 w-24 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            AI Market Outlook
          </h3>
          <p className="text-zinc-300 leading-relaxed relative z-10">
            {currency.aiOutlook}
          </p>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-zinc-500 mb-3 uppercase tracking-wider">Economic Highlights</h4>
            <ul className="space-y-2">
              {currency.economicHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Top Trading Partners</h3>
            <div className="flex flex-wrap gap-2">
              {currency.majorTradingPartners.map(partner => (
                <span key={partner} className="px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg text-sm text-zinc-300">
                  {partner}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Frequent Pairs</h3>
            <div className="flex flex-col gap-2">
              {currency.frequentlyTradedPairs.map(pair => (
                <div key={pair} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-white/5 hover:border-emerald-500/30 transition-colors cursor-default">
                  <span className="font-medium text-zinc-200">{pair}</span>
                  <Activity className="h-4 w-4 text-zinc-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
