"use client";

import { motion } from "framer-motion";
import { Newspaper, Clock, Zap, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const newsItems = [
  {
    headline: "Federal Reserve signals potential rate cuts later this year despite sticky inflation",
    source: "Bloomberg",
    readTime: "4 min read",
    impact: "High",
    summary: "Powell indicated that while recent inflation data has been higher than expected, the broader disinflationary trend remains intact. Markets are now pricing in 2 rate cuts for the year.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop"
  },
  {
    headline: "Tech giants report record cloud revenue as AI infrastructure spending accelerates",
    source: "Financial Times",
    readTime: "6 min read",
    impact: "Medium",
    summary: "Cloud service providers saw a 22% YoY increase in revenue, driven primarily by generative AI workloads and enterprise modernization initiatives.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
  }
];

export function TrendingNews() {
  return (
    <section className="col-span-12 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <Newspaper className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-semibold text-white tracking-tight">Trending Market News</h2>
        <Link href="/dashboard/news" className="ml-auto text-xs font-medium text-muted-foreground hover:text-white transition-colors">
          View All News
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {newsItems.map((news, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="dash-v2-card flex flex-col sm:flex-row overflow-hidden group cursor-pointer"
          >
            <div className="sm:w-1/3 h-48 sm:h-auto relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent sm:bg-gradient-to-r z-10" />
              {/* Using native img for external unoptimized domains for mockup purposes */}
              <img 
                src={news.image} 
                alt={news.headline} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 z-20 flex gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-1 rounded text-white shadow-sm">
                  {news.source}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-base font-semibold text-white leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
                  {news.headline}
                </h3>
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" /> {news.readTime}
                </span>
                <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${news.impact === 'High' ? 'text-red-400 bg-red-500/10 border border-red-500/20' : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'}`}>
                  <Zap className="w-3 h-3" /> Impact: {news.impact}
                </span>
              </div>
              
              <div className="mt-auto bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">AI Summary</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed line-clamp-2">
                  {news.summary}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
