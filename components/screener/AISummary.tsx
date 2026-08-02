"use client";

import { useEffect, useState } from "react";
import { generateAISummary } from "@/app/actions/screener";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AISummaryProps {
  filters: Record<string, any>;
  resultCount: number;
}

export function AISummary({ filters, resultCount }: AISummaryProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      const res = await generateAISummary(filters, resultCount);
      if (res.success) {
        setData(res.data);
      }
      setLoading(false);
    };
    
    // Only fetch if we have some filters or results
    const timer = setTimeout(() => fetchSummary(), 800);
    return () => clearTimeout(timer);
  }, [filters, resultCount]);

  if (loading) {
    return (
      <div className="rounded-xl border border-blue-900/30 bg-blue-950/10 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
          <h3 className="font-semibold text-blue-100">AI Analyst Processing...</h3>
        </div>
        <Skeleton className="h-4 w-full bg-blue-900/20 mb-2" />
        <Skeleton className="h-4 w-5/6 bg-blue-900/20" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-xl border border-blue-900/50 bg-gradient-to-br from-blue-950/30 to-indigo-950/20 p-5 shadow-lg relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-500/20 border border-blue-500/30">
              <Sparkles className="h-4 w-4 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white">AI Market Intelligence</h3>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Confidence:</span>
              <span className="font-bold text-emerald-400">{data.confidenceScore}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Sentiment:</span>
              <span className={`font-medium ${data.marketSentiment === 'Bullish' ? 'text-emerald-400' : 'text-neutral-300'}`}>
                {data.marketSentiment}
              </span>
            </div>
          </div>
        </div>

        <p className="text-blue-100/80 leading-relaxed mb-5 text-sm md:text-base">
          {data.summary}
        </p>

        {data.topPicks?.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-blue-900/40">
            <div className="flex items-center gap-1.5 text-sm text-blue-300">
              <Lightbulb className="h-4 w-4" />
              <span className="font-medium">Top AI Picks:</span>
            </div>
            {data.topPicks.map((pick: string) => (
              <span key={pick} className="px-2.5 py-1 text-xs font-bold text-white bg-blue-600/30 border border-blue-500/40 rounded-md">
                {pick}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
