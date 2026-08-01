import * as React from "react";
import { AIAnalysis as AIAnalysisType } from "@/types/stock-research";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AIAnalysisHub({ analysis }: { analysis: AIAnalysisType }) {
  const isBullish = analysis.sentiment === "Bullish";
  const isBearish = analysis.sentiment === "Bearish";

  return (
    <div className="space-y-6 bg-card border border-primary/20 rounded-2xl p-6 shadow-lg shadow-primary/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Brain className="w-48 h-48" />
      </div>
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI Synthesis
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Real-time analysis powered by TradeX AI.</p>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant="outline" className={`text-sm px-3 py-1 ${isBullish ? 'bg-green-500/10 text-green-500 border-green-500/30' : isBearish ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-blue-500/10 text-blue-500 border-blue-500/30'}`}>
            {analysis.sentiment}
          </Badge>
          <span className="text-xs text-muted-foreground mt-1 text-right">
            Confidence: <span className="font-semibold text-foreground">{analysis.confidenceScore}/100</span>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 relative z-10 mt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-500 font-semibold border-b border-foreground/5 pb-2">
            <TrendingUp className="h-5 w-5" />
            Bull Case
          </div>
          <ul className="space-y-3">
            {analysis.bullCase.map((point, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-red-500 font-semibold border-b border-foreground/5 pb-2">
            <TrendingDown className="h-5 w-5" />
            Bear Case
          </div>
          <ul className="space-y-3">
            {analysis.bearCase.map((point, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 relative z-10 pt-4 border-t border-foreground/5 mt-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-yellow-500 font-semibold">
            <AlertTriangle className="h-4 w-4" />
            Key Risks
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.risks.map((risk, i) => (
              <Badge key={i} variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20">{risk}</Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-500 font-semibold">
            <Lightbulb className="h-4 w-4" />
            Catalysts
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.catalysts.map((cat, i) => (
              <Badge key={i} variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20">{cat}</Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
