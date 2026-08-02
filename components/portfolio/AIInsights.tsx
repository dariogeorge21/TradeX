'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AIInsights as AIInsightsType } from '@/types/portfolio';
import { Sparkles, BrainCircuit, AlertTriangle, Lightbulb, Target } from 'lucide-react';

interface AIInsightsProps {
  insights: AIInsightsType | null;
}

export function AIInsights({ insights }: AIInsightsProps) {
  if (!insights) return null;

  return (
    <Card className="col-span-full border-border/50 bg-gradient-to-br from-card to-purple-500/5 backdrop-blur-sm shadow-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <CardTitle className="text-xl">AI Portfolio Insights</CardTitle>
            <CardDescription>Powered by TradeX Intelligence</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Today's Summary */}
        <div className="col-span-full lg:col-span-3">
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex gap-4">
            <BrainCircuit className="w-8 h-8 text-purple-500 shrink-0" />
            <div>
              <h3 className="font-semibold text-purple-200 mb-1">Market Context</h3>
              <p className="text-purple-100/80 leading-relaxed text-sm md:text-base">
                {insights.todaySummary}
              </p>
            </div>
          </div>
        </div>

        {/* Strengths & Diversification */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-500">
              <Target className="w-5 h-5" />
              <h4 className="font-semibold text-foreground">Strengths</h4>
            </div>
            <ul className="space-y-2">
              {insights.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 rounded-lg bg-card border border-border/50">
            <h4 className="font-semibold text-sm mb-2">Diversification Analysis</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{insights.diversificationAnalysis}</p>
          </div>
        </div>

        {/* Risks & Weaknesses */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-rose-500">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-semibold text-foreground">Risks & Weaknesses</h4>
            </div>
            <ul className="space-y-2">
              {insights.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-card border border-border/50 flex flex-col gap-2">
            <h4 className="font-semibold text-sm">Actionable Risks</h4>
            <div className="flex flex-wrap gap-2">
              {insights.potentialRisks.map((risk, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-rose-500/10 text-rose-500 rounded-md border border-rose-500/20">
                  {risk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunities & Rebalancing */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-500">
              <Lightbulb className="w-5 h-5" />
              <h4 className="font-semibold text-foreground">Opportunities</h4>
            </div>
            <ul className="space-y-2">
              {insights.potentialOpportunities.map((opp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  {opp}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-semibold text-sm mb-2 text-primary">Suggested Rebalancing</h4>
            <ul className="space-y-2">
              {insights.suggestedRebalancing.map((rec, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
