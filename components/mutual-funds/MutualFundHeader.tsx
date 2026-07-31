import { Building2, Calendar, DollarSign, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MutualFundSummary } from "@/types/mutual-funds";

export function MutualFundHeader({ summary }: { summary: MutualFundSummary | null }) {
  if (!summary) return null;

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="min-w-0">
          <CardTitle className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="truncate">{summary.name}</span>
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 text-xs font-medium">
              {summary.symbol}
            </span>
            <span className="rounded-full bg-blue-500/20 text-blue-300 px-2.5 py-0.5 text-xs font-medium">
              {summary.fund_type}
            </span>
          </CardTitle>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="size-4" aria-hidden="true" />
              {summary.fund_family || "—"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <DollarSign className="size-4" aria-hidden="true" />
              {summary.currency || "—"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4" aria-hidden="true" />
              Inception: {summary.share_class_inception_date || "—"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {summary.overview || "Overview is unavailable for this fund."}
        </p>

        {summary.people && summary.people.length > 0 && (
          <div className="mt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Fund Managers</h4>
            <div className="flex flex-wrap gap-2">
              {summary.people.map((person, idx) => (
                <div key={idx} className="flex items-center gap-1.5 rounded-lg border border-foreground/10 bg-background/50 px-3 py-1.5 text-sm">
                  <Wallet className="size-3.5 text-muted-foreground" />
                  <span>{person.name}</span>
                  <span className="text-xs text-muted-foreground ml-1">(Since {person.tenure_since})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
