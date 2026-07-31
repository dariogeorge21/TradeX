"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RiskLevel = "Low" | "Medium" | "High";
type Horizon = "Short" | "Medium" | "Long";

function extract(md: string): { risk: RiskLevel | null; horizon: Horizon | null } {
  const riskMatch = md.match(/Risk Level\s*[:\-]\s*(Low|Medium|High)/i);
  const horizonMatch = md.match(/Investment Horizon\s*[:\-]\s*(Short|Medium|Long)/i);
  return {
    risk: riskMatch ? (riskMatch[1] as RiskLevel) : null,
    horizon: horizonMatch ? (horizonMatch[1] as Horizon) : null,
  };
}

export function InvestmentRiskCard({ markdown }: { markdown: string }) {
  const { risk, horizon } = React.useMemo(() => extract(markdown), [markdown]);

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Investment Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
          <div className="text-xs text-muted-foreground">Risk Level</div>
          <div className="mt-1 text-sm font-medium">{risk ?? "—"}</div>
        </div>
        <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
          <div className="text-xs text-muted-foreground">Horizon</div>
          <div className="mt-1 text-sm font-medium">{horizon ?? "—"}</div>
        </div>
      </CardContent>
    </Card>
  );
}

