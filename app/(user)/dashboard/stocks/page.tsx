import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "@/components/stocks/SearchBar";
import { PopularStocks } from "@/components/stocks/PopularStocks";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Stocks — TradeX",
  description: "AI-powered stock research and company intelligence.",
};

export default function StocksIndexPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-8">
      {/* Hero Search Section */}
      <Card className="relative overflow-hidden border-2 border-primary/20 bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-background to-blue-500/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl opacity-50"
        />

        <CardHeader className="relative text-center pt-10">
          <CardTitle className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Find Your Next Investment
          </CardTitle>
          <p className="text-muted-foreground max-w-xl mx-auto mt-2">
            Search any listed company by ticker or name to open an institutional-grade dashboard with real-time AI synthesis.
          </p>
        </CardHeader>
        <CardContent className="relative max-w-8xl mx-auto pb-12">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-primary to-blue-500 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200" />
            <div className="relative flex items-center w-[600px]  bg-background rounded-lg shadow-sm border border-foreground/10 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <div className="pl-4 pr-2 text-muted-foreground">
                <Search className="h-5 w-5" />
              </div>
              <div className="flex-1 w-full">
                <SearchBar className="[&>div>div]:border-0 [&>div>div]:shadow-none [&>div>div]:bg-transparent [&>div>div]:focus-within:ring-0 [&>div>div>input]:text-lg [&>div>div>input]:py-6" placeholder="Search stocks (e.g., AAPL, Tesla)…" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Stocks Section */}
      <PopularStocks />
    </div>
  );
}

