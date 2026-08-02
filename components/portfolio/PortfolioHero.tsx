'use client';

import { Card, CardContent } from '@/components/ui/card';
import { PortfolioStats } from '@/types/portfolio';
import { Activity, ShieldCheck, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PortfolioHeroProps {
  stats: PortfolioStats | null;
}

export function PortfolioHero({ stats }: PortfolioHeroProps) {
  if (!stats) return null;

  const isPositiveToday = stats.todayChange >= 0;
  const isPositiveOverall = stats.overallReturn >= 0;

  return (
    <Card className="border-none bg-gradient-to-br from-card to-card/50 shadow-md overflow-hidden relative">
      <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Portfolio Value</h2>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center text-sm md:text-base font-medium px-2 py-1 rounded-md ${
                isPositiveToday ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
              }`}>
                {isPositiveToday ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {isPositiveToday ? '+' : ''}{stats.todayChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                ({isPositiveToday ? '+' : ''}{stats.todayChangePercent.toFixed(2)}%) Today
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Overall Return</span>
                <span className={`font-semibold ${isPositiveOverall ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isPositiveOverall ? '+' : ''}{stats.overallReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                  {' '}({isPositiveOverall ? '+' : ''}{stats.overallReturnPercent.toFixed(2)}%)
                </span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col">
                <span className="text-muted-foreground">Available Cash</span>
                <span className="font-semibold text-foreground">${stats.cashBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-w-[200px] lg:min-w-[280px]">
            <Card className="bg-background/40 backdrop-blur-md border-border/50 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium">Health Score</span>
                    <span className="font-bold text-lg">{stats.portfolioHealthScore}/100</span>
                  </div>
                </div>
                <Progress value={stats.portfolioHealthScore} className="w-16 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-background/40 backdrop-blur-md border-border/50 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium">AI Confidence</span>
                    <span className="font-bold text-lg">{stats.aiConfidenceScore}%</span>
                  </div>
                </div>
                <Progress value={stats.aiConfidenceScore} className="w-16 h-2 [&>div]:bg-purple-500" />
              </CardContent>
            </Card>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
