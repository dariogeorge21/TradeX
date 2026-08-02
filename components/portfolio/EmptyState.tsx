'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-4">
          <TrendingUp className="w-12 h-12 text-primary" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Your AI-Powered Portfolio Awaits
        </h2>
        
        <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
          Track your investments, monitor performance, and receive personalized AI insights to help you build wealth intelligently.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 pb-10 text-left">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <TrendingUp className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-medium mb-2">Track Performance</h3>
              <p className="text-sm text-muted-foreground">Monitor real-time gains, losses, and overall portfolio growth in one place.</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <Sparkles className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-medium mb-2">AI Insights</h3>
              <p className="text-sm text-muted-foreground">Get actionable intelligence on diversification, risks, and rebalancing opportunities.</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mb-3" />
              <h3 className="font-medium mb-2">Risk Analysis</h3>
              <p className="text-sm text-muted-foreground">Understand your exposure and optimize your asset allocation securely.</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="gap-2 h-12 px-8 text-base shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
            Add First Holding
          </Button>
          <Button size="lg" variant="outline" className="gap-2 h-12 px-8 text-base">
            <Upload className="w-5 h-5" />
            Import Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
}
