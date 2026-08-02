'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Mock data generator for the chart
const generateChartData = (days: number) => {
  const data = [];
  let baseValue = 100000;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk
    baseValue = baseValue + (Math.random() - 0.45) * (baseValue * 0.02);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(baseValue),
      benchmark: Math.round(baseValue * (1 + (Math.random() - 0.5) * 0.05))
    });
  }
  return data;
};

const chartConfig: ChartConfig = {
  value: {
    label: 'Portfolio Value',
    color: 'hsl(var(--primary))',
  },
  benchmark: {
    label: 'S&P 500 (Benchmark)',
    color: 'hsl(var(--muted-foreground))',
  },
};

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '6M', '1Y', '3Y', '5Y', 'MAX'] as const;
type Timeframe = typeof TIMEFRAMES[number];

export function PortfolioChart() {
  const [timeframe, setTimeframe] = React.useState<Timeframe>('1Y');
  
  // Memoize data so it doesn't jump on every render unless timeframe changes
  const chartData = React.useMemo(() => {
    switch (timeframe) {
      case '1D': return generateChartData(1);
      case '1W': return generateChartData(7);
      case '1M': return generateChartData(30);
      case '3M': return generateChartData(90);
      case '6M': return generateChartData(180);
      case '1Y': return generateChartData(365);
      case '3Y': return generateChartData(1095);
      case '5Y': return generateChartData(1825);
      case 'MAX': return generateChartData(2000);
      default: return generateChartData(365);
    }
  }, [timeframe]);

  const latestValue = chartData[chartData.length - 1]?.value || 0;
  const firstValue = chartData[0]?.value || 0;
  const percentChange = ((latestValue - firstValue) / firstValue) * 100;
  const isPositive = percentChange >= 0;

  return (
    <Card className="col-span-full lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-bold">Portfolio Growth</CardTitle>
          <CardDescription>Performance over time vs Benchmark</CardDescription>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">
              ${latestValue.toLocaleString()}
            </span>
            <span className={`text-sm font-medium px-2 py-1 rounded-md ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 bg-muted/50 p-1 rounded-lg">
          {TIMEFRAMES.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={`h-7 px-2 text-xs rounded-md transition-all ${
                timeframe === tf ? 'shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tf}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              tickLine={false} 
              axisLine={false} 
              tickMargin={10} 
              minTickGap={30}
              tickFormatter={(value) => {
                const date = new Date(value);
                if (timeframe === '1D' || timeframe === '1W') {
                  return date.toLocaleDateString('en-US', { weekday: 'short' });
                }
                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
              }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              width={60}
              domain={['auto', 'auto']}
            />
            <ChartTooltip 
              cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 4' }} 
              content={<ChartTooltipContent indicator="dot" />} 
            />
            <Area
              type="monotone"
              dataKey="benchmark"
              stroke="var(--color-benchmark)"
              strokeWidth={2}
              fill="transparent"
              strokeDasharray="4 4"
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#fillValue)"
              activeDot={{ r: 6, fill: "var(--color-value)", stroke: "hsl(var(--background))", strokeWidth: 2 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
