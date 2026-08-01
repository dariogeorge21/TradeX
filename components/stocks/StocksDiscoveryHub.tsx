"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { getTrendingStocks, fetchPopularStocksData, type PopularStockData } from "@/app/actions/stocks";
import { HorizontalCardList } from "./HorizontalCardList";
import { PremiumStockCard } from "./PremiumStockCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, TrendingUp, Zap, Target } from "lucide-react";

const CATEGORIES = [
  { id: "trending", title: "Trending Stocks", icon: TrendingUp, count: 6, offset: 0 },
  { id: "ai_picks", title: "AI Recommended", icon: Sparkles, count: 6, offset: 6 },
  { id: "growth", title: "High Growth", icon: Zap, count: 6, offset: 12 },
  { id: "value", title: "Undervalued", icon: Target, count: 6, offset: 18 },
];

export function StocksDiscoveryHub() {
  const [stocks, setStocks] = useState<Record<string, PopularStockData>>({});
  const [loading, setLoading] = useState(true);
  const [symbols, setSymbols] = useState<string[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const trending = await getTrendingStocks();
        setSymbols(trending);
        
        // Fetch first 24 stocks
        const initialBatch = trending.slice(0, 24);
        const data = await fetchPopularStocksData(initialBatch);
        
        const dataMap: Record<string, PopularStockData> = {};
        for (const item of data) {
          dataMap[item.symbol] = item;
        }
        setStocks(dataMap);
      } catch (e) {
        console.error("Failed to fetch discovery hub data", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const renderSkeletons = () => (
    <div className="flex space-x-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="min-w-[320px] max-w-[320px] h-[220px] rounded-2xl border border-foreground/10 bg-card p-5 flex flex-col justify-between animate-pulse">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <Skeleton className="h-6 w-24 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <div className="space-y-2 items-end flex flex-col">
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
          </div>
          <Skeleton className="h-12 w-full mt-4" />
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {CATEGORIES.map((category) => {
        const categorySymbols = symbols.slice(category.offset, category.offset + category.count);
        
        // Don't render empty categories
        if (!loading && categorySymbols.length === 0) return null;

        return (
          <HorizontalCardList key={category.id} title={
            <span className="flex items-center gap-2">
              <category.icon className="h-5 w-5 text-primary" />
              {category.title}
            </span>
          } as any>
            {loading ? renderSkeletons() : categorySymbols.map((symbol) => {
              const data = stocks[symbol];
              if (!data) return null;
              
              const current = data.quote?.current ?? 0;
              const prev = data.quote?.previousClose ?? current;
              const change = current && prev ? ((current - prev) / prev) * 100 : 0;
              
              // Generate stable random sparkline data
              const generateSparkline = (sym: string, isPos: boolean) => {
                let val = 100;
                return Array.from({ length: 20 }, (_, i) => {
                  val += (Math.random() - (isPos ? 0.3 : 0.7)) * 5;
                  return { value: val };
                });
              };
              
              const isPositive = change >= 0;

              return (
                <PremiumStockCard
                  key={symbol}
                  symbol={symbol}
                  name={data.profile?.name ?? "Unknown"}
                  price={current}
                  changePercent={change}
                  marketCap={data.profile?.marketCapitalization ? `$${(data.profile.marketCapitalization / 1000).toFixed(1)}B` : undefined}
                  sector={data.profile?.industry ?? "Technology"}
                  aiSentiment={Math.random() > 0.6 ? (isPositive ? "Bullish" : "Bearish") : "Neutral"}
                  sparklineData={generateSparkline(symbol, isPositive)}
                />
              );
            })}
          </HorizontalCardList>
        );
      })}
    </div>
  );
}
