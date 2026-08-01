"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, Activity, Calendar, Newspaper } from "lucide-react";
import { useState, useEffect } from "react";

const briefData = {
  opportunities: [
    { title: "Tech Sector Rotation", desc: "Capital flowing into mid-cap AI software providers.", confidence: 85 },
    { title: "Undervalued Utilities", desc: "Defensive positioning suggests 5-7% upside in regional utilities.", confidence: 72 },
  ],
  risks: [
    { title: "Inflation Data Reversal", desc: "Unexpected CPI jump could trigger short-term market selloff.", confidence: 64 },
    { title: "Supply Chain Disruptions", desc: "Red Sea shipping delays impacting retail margins.", confidence: 58 },
  ],
  trending: ["Semiconductors", "Cybersecurity", "Clean Energy"],
};

export function AIMarketBrief() {
  const [streamedText, setStreamedText] = useState("");
  const fullText = "Based on overnight futures and current sentiment, the market is poised for a bullish open. Technology and Communication sectors show unusual pre-market volume. Consider hedging downside risk ahead of tomorrow's CPI print.";

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setStreamedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white tracking-tight">AI Market Brief</h2>
        <span className="ml-auto text-[10px] font-medium uppercase tracking-wider bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20">Updated 10m ago</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dash-v2-card p-6 bg-gradient-to-br from-white/[0.03] to-purple-500/[0.02]"
      >
        <p className="text-sm md:text-base text-white/90 leading-relaxed mb-6 min-h-[48px] font-medium">
          {streamedText}
          <span className="inline-block w-1.5 h-4 ml-1 bg-purple-400 animate-blink align-middle" />
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Opportunities */}
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 hover:bg-emerald-500/10 transition-colors">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-4">
              <TrendingUp className="w-4 h-4" /> Opportunities
            </h3>
            <ul className="space-y-4">
              {briefData.opportunities.map((item, i) => (
                <li key={i} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-white font-medium">{item.title}</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">{item.confidence}%</span>
                  </div>
                  <span className="text-xs text-muted-foreground leading-snug">{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 hover:bg-red-500/10 transition-colors">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-red-400 mb-4">
              <AlertTriangle className="w-4 h-4" /> Potential Risks
            </h3>
            <ul className="space-y-4">
              {briefData.risks.map((item, i) => (
                <li key={i} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-white font-medium">{item.title}</span>
                    <span className="text-[10px] text-red-400 font-mono font-bold bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">{item.confidence}%</span>
                  </div>
                  <span className="text-xs text-muted-foreground leading-snug">{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trending Sectors */}
        <div className="mt-5 pt-5 border-t border-white/5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">Trending Sectors:</span>
          {briefData.trending.map(sector => (
            <span key={sector} className="text-xs font-medium bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-white/80 hover:bg-white/10 transition-colors cursor-pointer">
              {sector}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
