"use client";

import { WatchlistItem } from "@/types/watchlist";
import { motion } from "framer-motion";
import { BrainCircuit, MoreVertical, TrendingDown, TrendingUp, X } from "lucide-react";
import Link from "next/link";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WatchlistCardProps {
  item: WatchlistItem;
  onRemove: (symbol: string) => void;
  index: number;
}

export function WatchlistCard({ item, onRemove, index }: WatchlistCardProps) {
  const isPositive = (item.changePercent ?? 0) >= 0;
  
  // Format sparkline data for recharts
  const sparklineData = item.sparkline?.map((val, i) => ({ val, index: i })) || [];
  
  // Determine link based on asset type
  const href = item.assetType === 'crypto' 
    ? `/dashboard/crypto/${item.symbol.toLowerCase()}` 
    : item.assetType === 'forex'
    ? `/dashboard/forex/${item.symbol.toLowerCase()}`
    : `/dashboard/stocks/${item.symbol.toLowerCase()}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group bg-slate-900/40 border border-white/10 rounded-2xl p-5 hover:bg-slate-800/60 hover:border-white/20 transition-all shadow-xl hover:shadow-2xl relative overflow-hidden"
    >
      {/* Background glow effect based on performance */}
      <div className={cn(
        "absolute -inset-20 opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 rounded-full",
        isPositive ? "bg-emerald-500" : "bg-rose-500"
      )} />

      <div className="relative z-10 flex justify-between items-start mb-4">
        <Link href={href} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
            {/* Fallback avatar if no real logo */}
            <span className="text-sm font-bold text-white">{item.symbol.substring(0, 2)}</span>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg tracking-tight leading-none">{item.symbol}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[120px] truncate" title={item.name}>{item.name || item.assetType}</p>
          </div>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
            <DropdownMenuItem asChild>
              <Link href={href}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Compare (Coming Soon)</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem 
              onClick={() => onRemove(item.symbol)}
              className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
            >
              <X className="w-4 h-4 mr-2" />
              Remove from Watchlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative z-10 flex items-end justify-between mb-4">
        <div>
          <p className="text-2xl font-bold text-white tabular-nums">
            ${item.price?.toFixed(2) || "—"}
          </p>
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium mt-1",
            isPositive ? "text-emerald-400" : "text-rose-400"
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {item.change != null ? (item.change > 0 ? "+" : "") + item.change.toFixed(2) : "—"} 
            ({item.changePercent != null ? (item.changePercent > 0 ? "+" : "") + item.changePercent.toFixed(2) : "—"}%)
          </div>
        </div>

        {/* Miniature Sparkline */}
        {sparklineData.length > 0 && (
          <div className="h-12 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Line
                  type="monotone"
                  dataKey="val"
                  stroke={isPositive ? "#10b981" : "#f43f5e"}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <BrainCircuit className={cn(
            "w-4 h-4",
            item.aiSentiment === 'Bullish' ? "text-emerald-400" :
            item.aiSentiment === 'Bearish' ? "text-rose-400" : "text-slate-400"
          )} />
          <span className="text-xs font-medium text-slate-300">{item.aiSentiment || 'Neutral'}</span>
        </div>
        
        {item.aiScore && (
          <div className="text-xs font-medium px-2 py-1 bg-white/5 rounded-md text-slate-300">
            Score: <span className="text-white">{item.aiScore}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
