import { Card, CardContent } from '@/components/ui/card';
import { PortfolioHolding } from '@/types/portfolio';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HoldingCardProps {
  holding: PortfolioHolding;
}

export function HoldingCard({ holding }: HoldingCardProps) {
  const isPositiveOverall = (holding.overall_return || 0) >= 0;

  return (
    <Card className="hover:bg-accent/50 transition-colors border-border/50">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
            {holding.ticker.substring(0, 2)}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{holding.ticker}</span>
            <span className="text-xs text-muted-foreground truncate w-24 md:w-auto">{holding.company_name}</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-medium">${holding.market_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <div className={`flex items-center gap-1 text-xs ${isPositiveOverall ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositiveOverall ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{isPositiveOverall ? '+' : ''}{holding.overall_return_percent?.toFixed(2)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
