import type { Metadata } from "next";
import { AdvancedSearch } from "@/components/stocks/AdvancedSearch";
import { StocksDiscoveryHub } from "@/components/stocks/StocksDiscoveryHub";
import { Globe, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Stocks — TradeX",
  description: "AI-powered stock research and company intelligence.",
};

export default function StocksIndexPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-12 pb-12">
      {/* Hero Command Center */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-primary/10 bg-card/40 backdrop-blur-3xl shadow-2xl shadow-primary/5 pt-16 pb-20 px-4 sm:px-6 lg:px-8 mt-4">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-500/5" />
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-[100px] opacity-60" />
        <div className="pointer-events-none absolute top-40 -left-40 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px] opacity-40" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-foreground/10 bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-md mb-2">
            <Globe className="h-4 w-4 mr-2 text-primary" />
            Global Markets Live
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Discover Your Next
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 mt-2">
              Investment Opportunity
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Access institutional-grade data, AI-driven insights, and real-time market sentiment for thousands of global equities.
          </p>

          <div className="w-full mt-4">
            <AdvancedSearch />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-sm text-muted-foreground mr-2">Trending:</span>
            {["AAPL", "NVDA", "TSLA", "MSFT", "AMD"].map((ticker) => (
              <a 
                key={ticker} 
                href={`/dashboard/stocks/${ticker}`}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 hover:text-primary transition-colors border border-foreground/10"
              >
                {ticker}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Hub */}
      <section className="px-2">
        <StocksDiscoveryHub />
      </section>
    </div>
  );
}

