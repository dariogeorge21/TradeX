import { cn } from "@/lib/utils";

export type Recommendation =
  | "Strong Buy"
  | "Buy"
  | "Hold"
  | "Sell"
  | "Strong Sell";

const COLORS: Record<Recommendation, string> = {
  "Strong Buy": "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20",
  Buy: "bg-emerald-500/10 text-emerald-200 ring-emerald-500/15",
  Hold: "bg-amber-500/10 text-amber-200 ring-amber-500/15",
  Sell: "bg-rose-500/10 text-rose-200 ring-rose-500/15",
  "Strong Sell": "bg-rose-500/15 text-rose-300 ring-rose-500/20",
};

export function RecommendationBadge({
  recommendation,
  confidenceScore,
  className,
}: {
  recommendation: Recommendation;
  confidenceScore: number | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1",
        COLORS[recommendation],
        className
      )}
    >
      <span>{recommendation}</span>
      {typeof confidenceScore === "number" && (
        <span className="font-mono tabular-nums opacity-90">
          {Math.max(0, Math.min(100, Math.round(confidenceScore)))}/100
        </span>
      )}
    </div>
  );
}

