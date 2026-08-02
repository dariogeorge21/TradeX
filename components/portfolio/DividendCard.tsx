'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DividendCard() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Dividend Income</CardTitle>
          <CardDescription>Yield & Projections</CardDescription>
        </div>
        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
          <PieChart className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between mt-2">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Expected Annual</p>
              <span className="text-3xl font-bold tracking-tight">$3,450.00</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Portfolio Yield</p>
              <span className="text-xl font-semibold text-emerald-500">3.45%</span>
            </div>
          </div>
          
          <div className="h-px w-full bg-border/50" />
          
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              Upcoming Payouts
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">MSFT</span>
                <span className="text-muted-foreground">Aug 15</span>
                <span className="font-semibold text-emerald-500">+$68.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">JNJ</span>
                <span className="text-muted-foreground">Sep 01</span>
                <span className="font-semibold text-emerald-500">+$124.50</span>
              </div>
            </div>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-6">View Dividend Calendar</Button>
      </CardContent>
    </Card>
  );
}
