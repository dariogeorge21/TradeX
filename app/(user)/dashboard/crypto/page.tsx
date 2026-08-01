import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CryptoSearchBar } from "@/components/crypto/CryptoSearchBar";
import { MarketOverviewStrip } from "@/components/crypto/MarketOverviewStrip";
import { TopMoversTable } from "@/components/crypto/TopMoversTable";
import { Search } from "lucide-react";
import { MotionDiv } from "@/components/ui/motion-wrapper";
import { getCryptoMarketSnapshots } from "@/services/crypto-research";

export const metadata: Metadata = {
  title: "Crypto — TradeX",
  description: "AI-powered crypto research and intelligence.",
};

// Default tickers to query for market overview
const DEFAULT_TICKERS = "X:BTCUSD,X:ETHUSD,X:SOLUSD,X:BNBUSD,X:ADAUSD,X:AVAXUSD,X:DOTUSD,X:LINKUSD,X:DOGEUSD,X:XRPUSD";

export default async function CryptoIndexPage() {
  const snapshots = await getCryptoMarketSnapshots(DEFAULT_TICKERS);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-6xl space-y-8 pb-8"
    >
      {/* Hero Search Section */}
      <Card className="relative overflow-hidden border-2 border-amber-500/20 bg-card/80 backdrop-blur-xl shadow-2xl shadow-amber-500/5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-amber-500/10 via-background to-orange-500/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl opacity-50"
        />

        <CardHeader className="relative text-center pt-10">
          <CardTitle className="text-3xl font-extrabold tracking-tight md:text-4xl text-amber-950 dark:text-amber-50">
            Crypto Markets
          </CardTitle>
          <p className="text-muted-foreground max-w-xl mx-auto mt-2">
            Search any cryptocurrency by symbol to access an institutional-grade dashboard with real-time AI synthesis.
          </p>
        </CardHeader>
        <CardContent className="relative max-w-8xl w-[500px] mx-auto pb-12">
          <div className="relative group flex justify-center">
            <div className="absolute inset-x-0 -inset-y-1 mx-auto max-w-[600px] rounded-xl bg-linear-to-r from-amber-500 to-orange-500 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200" />
            <div className="relative flex items-center w-full max-w-[600px] bg-background rounded-lg shadow-sm border border-foreground/10 ring-offset-background focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2">
              <div className="pl-4 pr-2 text-muted-foreground">
                <Search className="h-5 w-5 text-amber-500/70" />
              </div>
              <div className="flex-1 w-full">
                <CryptoSearchBar
                  className="[&>div>div]:border-0 [&>div>div]:shadow-none [&>div>div]:bg-transparent [&>div>div]:focus-within:ring-0 [&>div>div>input]:text-lg [&>div>div>input]:py-6"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Overview Strip */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Market Overview</h2>
        <MarketOverviewStrip snapshots={snapshots} />
      </div>

      {/* Top Movers Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold tracking-tight">Top Movers</h2>
        <TopMoversTable snapshots={snapshots} />
      </div>
    </MotionDiv>
  );
}
