import { Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MutualFundSustainability } from "@/types/mutual-funds";

export function FundSustainabilityCard({
  sustainability,
}: {
  sustainability: MutualFundSustainability | null;
}) {
  if (!sustainability) return null;

  const { score, corporate_esg_pillars, sustainable_investment } = sustainability;

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="size-5 text-emerald-500" />
          Sustainability & ESG
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <span className="text-sm font-medium">Overall ESG Score</span>
          <span className="font-mono text-xl font-bold text-emerald-500">{score ?? "—"}</span>
        </div>

        {corporate_esg_pillars && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground">ESG Pillars</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border border-foreground/5 bg-background/40 p-2">
                <div className="text-[10px] text-muted-foreground">Environmental</div>
                <div className="mt-1 font-mono text-sm">{corporate_esg_pillars.environmental ?? "—"}</div>
              </div>
              <div className="rounded-lg border border-foreground/5 bg-background/40 p-2">
                <div className="text-[10px] text-muted-foreground">Social</div>
                <div className="mt-1 font-mono text-sm">{corporate_esg_pillars.social ?? "—"}</div>
              </div>
              <div className="rounded-lg border border-foreground/5 bg-background/40 p-2">
                <div className="text-[10px] text-muted-foreground">Governance</div>
                <div className="mt-1 font-mono text-sm">{corporate_esg_pillars.governance ?? "—"}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-2 text-sm text-muted-foreground flex items-center justify-between">
          <span>Sustainable Investment Flag</span>
          <span className={`font-medium ${sustainable_investment ? "text-emerald-400" : ""}`}>
            {sustainable_investment ? "Yes" : "No"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
