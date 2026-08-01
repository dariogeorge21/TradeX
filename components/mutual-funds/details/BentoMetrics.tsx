"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, DollarSign, Percent, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ElementType;
  delay?: number;
  className?: string;
  highlight?: boolean;
}

function MetricCard({ label, value, trend, icon: Icon, delay = 0, className, highlight }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={cn("h-full", className)}
    >
      <Card className={cn(
        "h-full overflow-hidden border-foreground/10 transition-colors",
        highlight ? "bg-emerald-500/5 border-emerald-500/20" : "bg-card/40 backdrop-blur-sm"
      )}>
        <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
            <Icon className={cn("h-4 w-4", highlight ? "text-emerald-500" : "text-muted-foreground")} />
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {value}
            </div>
            {trend && (
              <div className={cn(
                "flex items-center text-sm font-medium",
                trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
              )}>
                {trend === "up" ? <TrendingUp className="h-4 w-4 mr-1" /> : trend === "down" ? <TrendingDown className="h-4 w-4 mr-1" /> : null}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function BentoMetrics({
  nav,
  ytdReturn,
  expenseRatio,
  aum,
  riskLevel,
  turnoverRate
}: {
  nav?: number;
  ytdReturn?: number;
  expenseRatio?: number;
  aum?: number;
  riskLevel?: number | string;
  turnoverRate?: number;
}) {
  const formatCurrency = (v?: number) => v != null ? `₹${v.toLocaleString("en-IN")}` : "—";
  const formatPercent = (v?: number) => v != null ? `${v.toFixed(2)}%` : "—";
  const formatLargeCurrency = (v?: number) => {
    if (v == null) return "—";
    if (v >= 1000) return `₹${(v / 1000).toFixed(2)}k Cr`;
    return `₹${v} Cr`;
  };

  const getTrend = (v?: number) => {
    if (v == null) return "neutral";
    return v > 0 ? "up" : v < 0 ? "down" : "neutral";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
      <MetricCard 
        label="Net Asset Value" 
        value={formatCurrency(nav)} 
        icon={DollarSign}
        className="col-span-2"
        highlight
      />
      <MetricCard 
        label="YTD Return" 
        value={formatPercent(ytdReturn)} 
        trend={getTrend(ytdReturn)}
        icon={Activity}
        delay={0.1}
        className="col-span-2 md:col-span-2 xl:col-span-1"
      />
      <MetricCard 
        label="Expense Ratio" 
        value={formatPercent(expenseRatio)} 
        icon={Percent}
        delay={0.2}
        className="col-span-2 md:col-span-2 xl:col-span-1"
      />
      <MetricCard 
        label="Fund Size (AUM)" 
        value={formatLargeCurrency(aum)} 
        icon={DollarSign}
        delay={0.3}
        className="col-span-2 md:col-span-2 xl:col-span-1"
      />
      <MetricCard 
        label="Risk/Turnover" 
        value={String(riskLevel || turnoverRate || "—")} 
        icon={AlertTriangle}
        delay={0.4}
        className="col-span-2 md:col-span-2 xl:col-span-1"
      />
    </div>
  );
}
