import * as React from "react";
import { FinancialHealth as HealthType } from "@/types/stock-research";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function FinancialHealth({ health }: { health: HealthType }) {
  const getStatusColor = (val: number | null, isInverse = false) => {
    if (val === null) return "bg-gray-500";
    if (isInverse) {
      if (val < 0.5) return "bg-green-500";
      if (val < 1.0) return "bg-yellow-500";
      return "bg-red-500";
    } else {
      if (val > 0.2) return "bg-green-500";
      if (val > 0) return "bg-yellow-500";
      return "bg-red-500";
    }
  };

  const getStatusIcon = (val: number | null, isInverse = false) => {
    if (val === null) return null;
    const isGood = isInverse ? val < 0.5 : val > 0.2;
    return isGood ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const metrics = [
    { label: "Revenue Growth", value: health.revenueGrowth, format: (v: number) => `${(v * 100).toFixed(1)}%`, max: 0.5 },
    { label: "Debt to Equity", value: health.debtToEquity, format: (v: number) => v.toFixed(2), max: 2, inverse: true },
    { label: "Gross Margin", value: health.grossMargin, format: (v: number) => `${(v * 100).toFixed(1)}%`, max: 1 },
    { label: "Operating Margin", value: health.operatingMargin, format: (v: number) => `${(v * 100).toFixed(1)}%`, max: 0.5 },
  ];

  return (
    <div className="space-y-6 bg-card border border-foreground/10 rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-bold tracking-tight">Financial Health</h3>
      <div className="space-y-5">
        {metrics.map((m, i) => {
          const percentage = m.value ? Math.min((m.value / m.max) * 100, 100) : 0;
          return (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium flex items-center gap-2">
                  {m.label}
                  {getStatusIcon(m.value, m.inverse)}
                </span>
                <span className="font-bold">{m.value !== null ? m.format(m.value) : "N/A"}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${getStatusColor(m.value, m.inverse)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
