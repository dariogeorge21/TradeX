'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Home, Car, GraduationCap, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockGoals = [
  { id: '1', title: 'Retirement Fund', target: 1000000, current: 245000, icon: 'target', color: 'bg-emerald-500' },
  { id: '2', title: 'House Down Payment', target: 120000, current: 85000, icon: 'home', color: 'bg-blue-500' },
];

export function GoalsCard() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'home': return <Home className="w-4 h-4" />;
      case 'car': return <Car className="w-4 h-4" />;
      case 'education': return <GraduationCap className="w-4 h-4" />;
      case 'travel': return <Plane className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Financial Goals</CardTitle>
          <CardDescription>Track your progress</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-xs">Add Goal</Button>
      </CardHeader>
      <CardContent className="flex-1 space-y-6 mt-2">
        {mockGoals.map((goal) => {
          const percentage = Math.min(100, (goal.current / goal.target) * 100);
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${goal.color}/10 text-${goal.color.replace('bg-', '')}`}>
                    {getIcon(goal.icon)}
                  </div>
                  <span className="font-medium text-sm">{goal.title}</span>
                </div>
                <span className="text-sm font-semibold">{percentage.toFixed(0)}%</span>
              </div>
              <Progress value={percentage} className={`h-2 [&>div]:${goal.color}`} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${goal.current.toLocaleString()} saved</span>
                <span>Goal: ${goal.target.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
