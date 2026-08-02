'use client';

import { Card, CardContent } from '@/components/ui/card';
import { PortfolioStats as StatsType } from '@/types/portfolio';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, PieChart, Activity } from 'lucide-react';

interface PortfolioStatsProps {
  stats: StatsType | null;
}

export function PortfolioStats({ stats }: PortfolioStatsProps) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Realized Gain',
      value: `$${stats.realizedGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="w-4 h-4 text-muted-foreground" />,
      trend: '+12.5%',
      isPositive: true,
    },
    {
      title: 'Unrealized Gain',
      value: `$${stats.unrealizedGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <TrendingUp className="w-4 h-4 text-muted-foreground" />,
      trend: stats.unrealizedGain >= 0 ? 'Positive' : 'Negative',
      isPositive: stats.unrealizedGain >= 0,
    },
    {
      title: 'Dividend Income',
      value: `$${stats.dividendIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <PieChart className="w-4 h-4 text-muted-foreground" />,
      trend: 'YTD',
      isPositive: true,
    },
    {
      title: 'Total Holdings',
      value: stats.totalHoldings.toString(),
      icon: <Activity className="w-4 h-4 text-muted-foreground" />,
      trend: 'Active',
      isPositive: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:bg-card/80 transition-colors">
          <CardContent className="p-4 md:p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
              <div className="p-1.5 bg-muted rounded-md">{card.icon}</div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-2xl font-bold tracking-tight">{card.value}</span>
              <div className="flex items-center gap-1 mt-1">
                {card.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span className={`text-xs font-medium ${card.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {card.trend}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
