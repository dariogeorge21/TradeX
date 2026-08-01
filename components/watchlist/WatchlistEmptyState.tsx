"use client";

import { motion } from "framer-motion";
import { Search, TrendingUp, LineChart, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function WatchlistEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-48 h-48 mb-8"
      >
        <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-pulse" />
        <div className="absolute inset-4 bg-indigo-500/20 rounded-full blur-xl" />
        <div className="relative h-full w-full flex items-center justify-center bg-slate-900 border border-white/10 rounded-full shadow-2xl">
          <Eye className="w-20 h-20 text-indigo-400" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 bg-emerald-500/20 p-3 rounded-full backdrop-blur-sm border border-emerald-500/30">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
        </div>
        <div className="absolute -bottom-2 -left-2 bg-blue-500/20 p-3 rounded-full backdrop-blur-sm border border-blue-500/30">
          <LineChart className="w-6 h-6 text-blue-400" />
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-2xl md:text-3xl font-bold text-white mb-4"
      >
        Your Watchlist is Empty
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-slate-400 max-w-md mx-auto mb-8 text-lg"
      >
        Start building your personalized portfolio tracker. Discover high-potential stocks, crypto, and more to monitor their performance.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8">
          <Link href="/dashboard/stocks">
            <Search className="w-5 h-5 mr-2" />
            Explore Stocks
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
          <Link href="/dashboard/crypto">
            Explore Crypto
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
