"use client";

import { WatchlistItem } from "@/types/watchlist";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BrainCircuit, TrendingDown, TrendingUp, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface WatchlistTableProps {
  items: WatchlistItem[];
  onRemove: (symbol: string) => void;
}

export function WatchlistTable({ items, onRemove }: WatchlistTableProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-900/80 hover:bg-slate-900/80 border-b border-white/10">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-slate-400 font-medium h-12">Symbol</TableHead>
            <TableHead className="text-slate-400 font-medium text-right">Price</TableHead>
            <TableHead className="text-slate-400 font-medium text-right">24h Change</TableHead>
            <TableHead className="text-slate-400 font-medium hidden md:table-cell text-right">Market Cap</TableHead>
            <TableHead className="text-slate-400 font-medium hidden lg:table-cell text-center">AI Sentiment</TableHead>
            <TableHead className="text-right w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            const isPositive = (item.changePercent ?? 0) >= 0;
            const href = item.assetType === 'crypto' 
              ? `/dashboard/crypto/${item.symbol.toLowerCase()}` 
              : item.assetType === 'forex'
              ? `/dashboard/forex/${item.symbol.toLowerCase()}`
              : `/dashboard/stocks/${item.symbol.toLowerCase()}`;

            return (
              <TableRow 
                key={item.id} 
                className="hover:bg-white/5 border-b border-white/5 transition-colors group"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-white">{item.symbol.substring(0, 2)}</span>
                    </div>
                    <div>
                      <Link href={href} className="font-bold text-white hover:text-indigo-400 transition-colors flex items-center gap-1">
                        {item.symbol}
                      </Link>
                      <p className="text-xs text-slate-500 truncate max-w-[150px]">{item.name || item.assetType}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-white font-medium">
                  ${item.price?.toFixed(2) || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className={cn(
                    "inline-flex items-center gap-1 font-medium px-2 py-1 rounded-md text-sm",
                    isPositive ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
                  )}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {item.changePercent != null ? (item.changePercent > 0 ? "+" : "") + item.changePercent.toFixed(2) + "%" : "—"}
                  </div>
                </TableCell>
                <TableCell className="text-right hidden md:table-cell text-slate-300">
                  {item.marketCap ? `$${(item.marketCap / 1e9).toFixed(2)}B` : "—"}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <BrainCircuit className={cn(
                      "w-4 h-4",
                      item.aiSentiment === 'Bullish' ? "text-emerald-400" :
                      item.aiSentiment === 'Bearish' ? "text-rose-400" : "text-slate-400"
                    )} />
                    <span className="text-sm font-medium text-slate-300">{item.aiSentiment || 'Neutral'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" asChild>
                      <Link href={href}><ExternalLink className="w-4 h-4" /></Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onRemove(item.symbol)}
                      className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
