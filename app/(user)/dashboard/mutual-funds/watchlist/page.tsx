import type { Metadata } from "next";
import { getMutualFundWatchlist } from "@/app/actions/mutual-funds-watchlist";
import { FundGrid } from "@/components/mutual-funds/FundGrid";
import { DetailsHeader } from "@/components/dashboard/DetailsHeader";
import { MotionDiv } from "@/components/ui/motion-wrapper";
import { ErrorCard } from "@/components/stocks/ErrorCard";

export const metadata: Metadata = {
  title: "Mutual Funds Watchlist — TradeX",
  description: "Track your favorite mutual funds.",
};

export default async function MutualFundWatchlistPage() {
  const { success, data: watchlistItems, error } = await getMutualFundWatchlist();

  if (!success) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <ErrorCard
          message={error || "Failed to load watchlist"}
          backHref="/dashboard/mutual-funds"
          backLabel="Back to Mutual Funds"
        />
      </div>
    );
  }

  // Convert Watchlist Items to FundCardProps structure
  // In a real app, you would fetch real-time data for these saved funds
  const funds = watchlistItems?.map(item => ({
    fundCode: item.fund_code,
    name: item.fund_name,
    amc: item.amc || "Unknown AMC",
    category: item.category || "Equity",
    // Providing placeholder values for display purposes since we don't fetch real-time stats in this basic version
    nav: 100, 
    returns1Y: 15.5,
    returns3Y: 18.2,
    expenseRatio: 0.5,
    riskLevel: "High",
  })) || [];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-12">
      <DetailsHeader
        backHref="/dashboard/mutual-funds"
        backLabel="Back to Mutual Funds"
        searchHref="/dashboard/mutual-funds"
        searchLabel="Search more funds"
      />

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-foreground/10 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Mutual Funds Watchlist
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and analyze your saved mutual funds.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
             <div className="bg-card/40 border border-foreground/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                Total Saved: <span className="text-foreground ml-1">{funds.length}</span>
             </div>
          </div>
        </div>
      </MotionDiv>

      {funds.length > 0 ? (
        <FundGrid funds={funds} />
      ) : (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-foreground/20 bg-card/20 backdrop-blur-sm"
        >
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Your Watchlist is Empty</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Start saving mutual funds you want to track by clicking the bookmark icon on any fund's detail page.
          </p>
          <a href="/dashboard/mutual-funds" className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-6 py-2">
            Explore Mutual Funds
          </a>
        </MotionDiv>
      )}
    </div>
  );
}
