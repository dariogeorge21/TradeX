"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

interface Holding {
  symbol: string;
  name: string;
  weight: number;
}

interface Sector {
  sector: string;
  weight: number;
}

interface PortfolioCompositionProps {
  topHoldings?: Holding[];
  sectors?: Sector[];
  assetAllocation?: {
    cash: number;
    stocks: number;
    bonds: number;
    others: number;
  };
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#6b7280", "#14b8a6", "#f97316"];

export function PortfolioComposition({ topHoldings, sectors, assetAllocation }: PortfolioCompositionProps) {
  const assetData = assetAllocation
    ? [
        { name: "Stocks", value: assetAllocation.stocks },
        { name: "Bonds", value: assetAllocation.bonds },
        { name: "Cash", value: assetAllocation.cash },
        { name: "Others", value: assetAllocation.others },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Holdings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="h-full bg-card/50 backdrop-blur-sm border-foreground/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Top Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            {topHoldings && topHoldings.length > 0 ? (
              <div className="space-y-4">
                {topHoldings.slice(0, 5).map((holding, i) => (
                  <div key={holding.symbol || i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{holding.name}</p>
                      <p className="text-xs text-muted-foreground">{holding.symbol}</p>
                    </div>
                    <div className="font-mono text-sm font-semibold">{holding.weight.toFixed(2)}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground flex h-40 items-center justify-center">
                Holdings data not available.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Asset Allocation / Sectors */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="h-full bg-card/50 backdrop-blur-sm border-foreground/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] w-full">
            {assetData.length > 0 || (sectors && sectors.length > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetData.length > 0 ? assetData : sectors}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey={assetData.length > 0 ? "value" : "weight"}
                    nameKey={assetData.length > 0 ? "name" : "sector"}
                    stroke="none"
                  >
                    {(assetData.length > 0 ? assetData : sectors || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => `${Number(value).toFixed(2)}%`}
                    contentStyle={{ borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "hsl(var(--card))" }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-muted-foreground flex h-full items-center justify-center">
                Allocation data not available.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
