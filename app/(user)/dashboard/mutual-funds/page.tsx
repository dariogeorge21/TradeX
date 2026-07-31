import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MutualFundSearchBar } from "@/components/mutual-funds/MutualFundSearchBar";

export const metadata: Metadata = {
  title: "Mutual Funds — TradeX",
  description: "AI-powered mutual fund research and intelligence.",
};

export default function MutualFundsIndexPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <Card className="relative overflow-hidden border border-foreground/10 bg-card/60 backdrop-blur">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-blue-500/10"
        />
        <CardHeader className="relative">
          <CardTitle>Mutual Fund Research</CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-3">
          <MutualFundSearchBar />
          <p className="text-sm text-muted-foreground">
            Search any mutual fund by symbol or name to access an institutional-grade dashboard with AI synthesis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
