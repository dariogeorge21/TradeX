'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';

const mockPerformanceData = [
  { month: 'Jan', return: 2.5 },
  { month: 'Feb', return: -1.2 },
  { month: 'Mar', return: 3.4 },
  { month: 'Apr', return: 1.1 },
  { month: 'May', return: -2.5 },
  { month: 'Jun', return: 4.2 },
  { month: 'Jul', return: 5.1 },
  { month: 'Aug', return: -0.8 },
  { month: 'Sep', return: -3.2 },
  { month: 'Oct', return: 2.1 },
  { month: 'Nov', return: 3.8 },
  { month: 'Dec', return: 1.5 },
];

const chartConfig: ChartConfig = {
  return: {
    label: 'Monthly Return %',
  }
};

export function PerformanceChart() {
  return (
    <Card className="col-span-full border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
      <CardHeader>
        <CardTitle>Monthly Returns</CardTitle>
        <CardDescription>Trailing 12 Months Performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={mockPerformanceData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              dataKey="month" 
              tickLine={false} 
              axisLine={false} 
              tickMargin={10} 
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}%`}
              width={40}
            />
            <ChartTooltip 
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} 
              content={<ChartTooltipContent hideIndicator />} 
            />
            <Bar dataKey="return" radius={[4, 4, 0, 0]}>
              {mockPerformanceData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.return >= 0 ? 'hsl(var(--chart-2))' : 'hsl(var(--destructive))'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
