"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsGridProps {
  data: any[];
}

export function ResultsGrid({ data }: ResultsGridProps) {
  
  const formatCurrency = (val: number) => {
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((stock) => (
        <Card key={stock.id} className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 hover:bg-neutral-900/80 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-800/80 text-sm font-bold text-neutral-300 shadow-inner group-hover:bg-neutral-800 transition-colors">
                {stock.ticker.substring(0, 2)}
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-white text-lg">{stock.ticker}</h3>
                <span className="text-xs text-neutral-500 truncate max-w-[100px]" title={stock.name}>{stock.name}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="font-semibold text-white">${stock.price.toFixed(2)}</span>
              <div className={`text-xs font-medium flex items-center gap-1 ${stock.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(stock.change)}%
              </div>
            </div>
          </div>
          
          <div className="h-[40px] w-full mb-4 flex items-center justify-center text-neutral-700">
            {/* Mock Sparkline */}
            <Activity className="w-full h-8 opacity-20" />
          </div>
          
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs mb-4">
            <div className="flex flex-col">
              <span className="text-neutral-500">Mkt Cap</span>
              <span className="text-neutral-300 font-medium">{formatCurrency(stock.marketCap)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-500">P/E</span>
              <span className="text-neutral-300 font-medium">{stock.pe.toFixed(1)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-500">AI Score</span>
              <span className="text-blue-400 font-bold">{stock.aiScore} / 100</span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-500">Signal</span>
              <span className={stock.signal.includes('Buy') ? 'text-emerald-400 font-medium' : stock.signal.includes('Sell') ? 'text-red-400 font-medium' : 'text-yellow-400 font-medium'}>
                {stock.signal}
              </span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-neutral-800/50 flex gap-2">
            <Button variant="secondary" className="flex-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 h-8 text-xs">
              Analyze
            </Button>
            <Button variant="outline" className="flex-1 border-neutral-700 hover:bg-neutral-800 text-neutral-300 h-8 text-xs">
              Watch
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
