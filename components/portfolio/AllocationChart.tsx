'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const mockAllocationData = [
  { name: 'Technology', value: 45000, color: 'hsl(var(--chart-1))' },
  { name: 'Financials', value: 25000, color: 'hsl(var(--chart-2))' },
  { name: 'Healthcare', value: 15000, color: 'hsl(var(--chart-3))' },
  { name: 'Consumer', value: 10000, color: 'hsl(var(--chart-4))' },
  { name: 'Energy', value: 5000, color: 'hsl(var(--chart-5))' },
];

const chartConfig: ChartConfig = {
  value: {
    label: 'Allocation',
  },
  Technology: { color: 'hsl(var(--chart-1))', label: 'Technology' },
  Financials: { color: 'hsl(var(--chart-2))', label: 'Financials' },
  Healthcare: { color: 'hsl(var(--chart-3))', label: 'Healthcare' },
  Consumer: { color: 'hsl(var(--chart-4))', label: 'Consumer' },
  Energy: { color: 'hsl(var(--chart-5))', label: 'Energy' },
};

export function AllocationChart() {
  const total = mockAllocationData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="col-span-full lg:col-span-1 border-border/50 bg-card/50 backdrop-blur-sm shadow-sm flex flex-col">
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>By Sector</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <ChartContainer config={chartConfig} className="h-[250px] w-full mx-auto aspect-square">
          <PieChart>
            <ChartTooltip 
              cursor={false}
              content={<ChartTooltipContent hideLabel />} 
            />
            <Pie
              data={mockAllocationData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              stroke="none"
            >
              {mockAllocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="mt-4 space-y-3">
          {mockAllocationData.map((item) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">${item.value.toLocaleString()}</span>
                  <span className="font-mono">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
