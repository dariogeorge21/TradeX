import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "@/components/stocks/SearchBar";

export const metadata: Metadata = {
  title: "Stocks — TradeX",
  description: "AI-powered stock research and company intelligence.",
};

export default function StocksIndexPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <Card className="relative overflow-hidden border border-foreground/10 bg-card/60 backdrop-blur">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-blue-500/10"
        />
        <CardHeader className="relative">
          <CardTitle>Stock Research</CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-3">
          <SearchBar />
          <p className="text-sm text-muted-foreground">
            Search any listed company by ticker or name to open an institutional-grade dashboard with AI synthesis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

