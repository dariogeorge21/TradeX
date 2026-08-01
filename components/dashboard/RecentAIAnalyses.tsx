"use client";

import { motion } from "framer-motion";
import { BrainCircuit, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

const analyses = [
  {
    company: "Tesla Inc. (TSLA)",
    title: "Earnings Preview & Sentiment Analysis",
    summary: "Options market pricing in 8% move. Social sentiment remains highly polarized ahead of margins report.",
    time: "2 hours ago",
    confidence: 88,
    href: "/dashboard/stocks/TSLA"
  },
  {
    company: "Apple Inc. (AAPL)",
    title: "Supply Chain Risk Assessment",
    summary: "Foxconn production normalized. iPhone 16 cycle expectations adjusting downwards slightly.",
    time: "5 hours ago",
    confidence: 76,
    href: "/dashboard/stocks/AAPL"
  }
];

export function RecentAIAnalyses() {
  return (
    <section className="col-span-12 lg:col-span-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <BrainCircuit className="w-5 h-5 text-fuchsia-400" />
        <h2 className="text-lg font-semibold text-white tracking-tight">Recent AI Analyses</h2>
        <Link href="/dashboard/stocks" className="ml-auto text-xs font-medium text-muted-foreground hover:text-white transition-colors">
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-4 h-full">
        {analyses.map((analysis, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="dash-v2-card p-5 hover:bg-white/5 transition-colors group flex flex-col flex-1"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold text-fuchsia-400 mb-1.5 block uppercase tracking-wider">{analysis.company}</span>
                <h3 className="text-base font-semibold text-white leading-tight group-hover:text-fuchsia-100 transition-colors">{analysis.title}</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Confidence</span>
                <span className="text-sm font-bold text-white bg-white/10 px-2.5 py-0.5 rounded border border-white/5 shadow-sm">
                  {analysis.confidence}%
                </span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
              {analysis.summary}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Clock className="w-3.5 h-3.5" /> {analysis.time}
              </span>
              <Link href={analysis.href} className="flex items-center gap-1.5 text-xs font-bold text-fuchsia-400 hover:text-fuchsia-300 transition-colors group/link">
                Read Analysis <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
