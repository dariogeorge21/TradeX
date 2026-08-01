import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";

// V2 Components
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MarketOverviewCards } from "@/components/dashboard/MarketOverviewCards";
import { AIMarketBrief } from "@/components/dashboard/AIMarketBrief";
import { DashboardWatchlist } from "@/components/dashboard/DashboardWatchlist";
import { PortfolioSnapshot } from "@/components/dashboard/PortfolioSnapshot";
import { MarketMovers } from "@/components/dashboard/MarketMovers";
import { RecentAIAnalyses } from "@/components/dashboard/RecentAIAnalyses";
import { EconomicCalendar } from "@/components/dashboard/EconomicCalendar";
import { TrendingNews } from "@/components/dashboard/TrendingNews";
import { MarketHeatmap } from "@/components/dashboard/MarketHeatmap";

export const metadata: Metadata = {
  title: "Dashboard — TradeX",
  description: "Your TradeX market intelligence dashboard.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "Trader";

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 pb-24 overflow-x-hidden">
      <DashboardHero displayName={displayName} />
      
      <MarketOverviewCards />
      <QuickActions />

      {/* Main Grid */}
      <div className="dash-v2-grid">
        <AIMarketBrief />
        <DashboardWatchlist />
        
        <PortfolioSnapshot />
        <MarketMovers />

        <MarketHeatmap />
        
        <RecentAIAnalyses />
        <EconomicCalendar />
        
        <TrendingNews />
      </div>
    </div>
  );
}
