"use client";

import { IndicatorSnapshot } from "@/types/market-indicators";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function IndicatorSignalAnalysis({ snapshot }: { snapshot: IndicatorSnapshot }) {
  const { strengthScore, signal, confidenceScore } = snapshot;

  const isBuy = signal === "Buy" || signal === "Strong Buy";
  const isSell = signal === "Sell" || signal === "Strong Sell";
  
  const colorClass = isBuy ? "text-emerald-500" : isSell ? "text-rose-500" : "text-slate-500";
  const bgClass = isBuy ? "bg-emerald-500" : isSell ? "bg-rose-500" : "bg-slate-500";

  return (
    <Card className="h-full border-foreground/10 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gauge className="h-5 w-5 text-muted-foreground" />
          Signal Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-muted-foreground">Signal Strength</span>
            <span className={cn("text-2xl font-bold", colorClass)}>{strengthScore}%</span>
          </div>
          <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
            <div 
                className={cn("h-full transition-all duration-1000 ease-out rounded-full", bgClass)} 
                style={{ width: `${strengthScore}%` }} 
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-muted-foreground">AI Confidence</span>
            <span className="text-xl font-bold">{confidenceScore}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
                className="h-full bg-blue-500 transition-all duration-1000 ease-out rounded-full" 
                style={{ width: `${confidenceScore}%` }} 
            />
          </div>
        </div>
        
        <div className="rounded-lg bg-card/50 border p-4 mt-6">
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Current Stance</div>
            <div className="flex items-center justify-between">
                <span className={cn("text-xl font-black uppercase tracking-tight", colorClass)}>
                    {signal}
                </span>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-50" />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
