"use client";

import { motion } from "framer-motion";
import { Search, TrendingUp, Sparkles, PieChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MutualFundSearchBar } from "./MutualFundSearchBar";

export function MutualFundsHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/10 bg-card/40 backdrop-blur-3xl shadow-2xl shadow-emerald-500/5 pt-16 pb-20 px-4 sm:px-6 lg:px-8 mt-4">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-background to-blue-500/5" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-[100px] opacity-60" />
      <div className="pointer-events-none absolute top-40 -left-40 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px] opacity-40" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-foreground/10 bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-md mb-2"
        >
          <Sparkles className="h-4 w-4 mr-2 text-emerald-500" />
          AI-Powered Mutual Fund Intelligence
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground"
        >
          Build Your Wealth with
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600 mt-2 pb-2">
            Institutional Precision
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-xl mx-auto"
        >
          Discover top-performing funds, analyze portfolios with AI, and track your long-term investments in one seamless dashboard.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-2xl mt-4 relative group"
        >
          <div className="absolute inset-x-0 -inset-y-1 mx-auto max-w-full rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200" />
          <div className="relative flex items-center w-full bg-background rounded-xl shadow-lg border border-foreground/10 ring-offset-background focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 overflow-hidden">
            <div className="pl-4 pr-2 text-muted-foreground">
              <Search className="h-5 w-5 text-emerald-500/70" />
            </div>
            <div className="flex-1 w-full">
              <MutualFundSearchBar 
                className="[&>div>div]:border-0 [&>div>div]:shadow-none [&>div>div]:bg-transparent [&>div>div]:focus-within:ring-0 [&>div>div>input]:text-lg [&>div>div>input]:py-6" 
                placeholder="Search mutual funds (e.g., VTSAX, Parag Parikh)..." 
              />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-6"
        >
          <span className="text-sm text-muted-foreground mr-2 font-medium">Trending Categories:</span>
          {[
            { label: "Large Cap", icon: TrendingUp },
            { label: "ELSS (Tax Saving)", icon: Sparkles },
            { label: "Index Funds", icon: PieChart },
          ].map((tag) => (
            <div 
              key={tag.label} 
              className="flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-foreground/5 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border border-foreground/10 cursor-pointer"
            >
              <tag.icon className="w-3 h-3 mr-1.5" />
              {tag.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
