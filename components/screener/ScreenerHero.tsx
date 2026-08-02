"use client";

import { Search, Sparkles, TrendingUp, BarChart2, Star, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const TRENDING_STRATEGIES = [
  { name: "High Growth", icon: TrendingUp },
  { name: "Undervalued", icon: BarChart2 },
  { name: "Dividend Kings", icon: Star },
  { name: "Momentum", icon: TrendingUp },
];

export function ScreenerHero({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/50 p-8 shadow-2xl backdrop-blur-xl">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 shadow-inner">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered Stock Discovery</span>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          Find your next <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">big opportunity</span>
        </h1>
        <p className="mb-8 text-lg text-neutral-400">
          Screen thousands of stocks using institutional-grade technicals, fundamentals, and real-time AI insights.
        </p>

        {/* Large Search */}
        <div className="relative mx-auto max-w-2xl">
          <div className="group relative flex items-center">
            <Search className="absolute left-4 h-6 w-6 text-neutral-500 transition-colors group-focus-within:text-blue-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies, tickers, or strategies..."
              className="h-16 w-full rounded-2xl border-neutral-800 bg-neutral-900/80 pl-14 pr-24 text-lg text-white placeholder:text-neutral-500 focus-visible:border-blue-500/50 focus-visible:ring-4 focus-visible:ring-blue-500/20"
            />
            <div className="absolute right-4 hidden items-center gap-1 sm:flex">
              <kbd className="inline-flex h-7 items-center gap-1 rounded border border-neutral-800 bg-neutral-950 px-2 font-mono text-[10px] font-medium text-neutral-400">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-400">
          <div className="flex items-center gap-2 mr-4">
            <TrendingUp className="h-4 w-4 text-neutral-500" />
            <span>Trending:</span>
          </div>
          {TRENDING_STRATEGIES.map((strategy) => (
            <Badge 
              key={strategy.name} 
              variant="outline" 
              className="cursor-pointer border-neutral-800 bg-neutral-900/50 py-1.5 text-neutral-300 transition-colors hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
            >
              <strategy.icon className="mr-1.5 h-3.5 w-3.5" />
              {strategy.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
