import { Star, ShieldAlert, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MutualFundRatings } from "@/types/mutual-funds";

function RatingStars({ rating, max = 5 }: { rating: number | null; max?: number }) {
  if (typeof rating !== "number") return <span className="text-muted-foreground text-sm">—</span>;
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < rating ? "fill-yellow-500 text-yellow-500" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  );
}

export function FundRatingsCard({ ratings }: { ratings: MutualFundRatings | null }) {
  if (!ratings) return null;

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Morningstar Ratings</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between rounded-xl border border-foreground/10 bg-background/40 p-3">
          <div className="flex items-center gap-2">
            <Star className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">Performance</span>
          </div>
          <RatingStars rating={ratings.performance_rating} />
        </div>
        
        <div className="flex items-center justify-between rounded-xl border border-foreground/10 bg-background/40 p-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">Risk</span>
          </div>
          <RatingStars rating={ratings.risk_rating} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-foreground/10 bg-background/40 p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">Return</span>
          </div>
          <RatingStars rating={ratings.return_rating} />
        </div>
      </CardContent>
    </Card>
  );
}
