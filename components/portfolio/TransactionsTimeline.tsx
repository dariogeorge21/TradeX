'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowDownLeft, ArrowUpRight, Coins, Gift, RefreshCw, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockTransactions = [
  { id: '1', date: '2026-08-01', type: 'buy', ticker: 'AAPL', qty: 10, price: 185.20, total: 1852.00 },
  { id: '2', date: '2026-07-28', type: 'dividend', ticker: 'MSFT', qty: 50, price: 0.68, total: 34.00 },
  { id: '3', date: '2026-07-15', type: 'sell', ticker: 'TSLA', qty: 5, price: 245.10, total: 1225.50 },
  { id: '4', date: '2026-06-30', type: 'buy', ticker: 'NVDA', qty: 20, price: 450.00, total: 9000.00 },
];

export function TransactionsTimeline() {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy': return <ArrowDownLeft className="w-4 h-4 text-emerald-500" />;
      case 'sell': return <ArrowUpRight className="w-4 h-4 text-rose-500" />;
      case 'dividend': return <Coins className="w-4 h-4 text-amber-500" />;
      case 'bonus': return <Gift className="w-4 h-4 text-purple-500" />;
      case 'split': return <RefreshCw className="w-4 h-4 text-blue-500" />;
      default: return <Briefcase className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'buy': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'sell': return 'bg-rose-500/10 border-rose-500/20';
      case 'dividend': return 'bg-amber-500/10 border-amber-500/20';
      default: return 'bg-muted border-border';
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest transactions</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-xs">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full border ${getTransactionColor(tx.type)}`}>
                  {getTransactionIcon(tx.type)}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} {tx.ticker}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`font-medium text-sm ${tx.type === 'buy' ? 'text-foreground' : tx.type === 'sell' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {tx.type === 'buy' ? '-' : '+'}${tx.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tx.qty} @ ${tx.price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
