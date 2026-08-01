"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";

interface WatchlistHeroProps {
  totalItems: number;
}

export function WatchlistHero({ totalItems }: WatchlistHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-8 text-white border border-white/10 shadow-2xl">
      <div className="absolute top-0 right-0 p-12 opacity-10">
        <Star className="w-64 h-64 text-white" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="bg-indigo-500/20 p-2 rounded-xl backdrop-blur-md">
              <Star className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              My Watchlist
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-400 text-lg max-w-xl"
          >
            Monitor your favorite assets, track AI sentiment, and never miss a market opportunity.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md"
        >
          <div>
            <p className="text-sm text-slate-400 font-medium mb-1">Tracked Assets</p>
            <p className="text-3xl font-bold text-white flex items-center gap-2">
              {totalItems}
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
