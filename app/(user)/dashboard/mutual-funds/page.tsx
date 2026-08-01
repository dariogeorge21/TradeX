import type { Metadata } from "next";
import { MutualFundsHero } from "@/components/mutual-funds/MutualFundsHero";
import { FundGrid } from "@/components/mutual-funds/FundGrid";
import { MotionDiv } from "@/components/ui/motion-wrapper";
import { INDIAN_MUTUAL_FUND_TEST_DATA } from "@/lib/mutual-funds-fallback-data";

export const metadata: Metadata = {
  title: "Mutual Funds — TradeX",
  description: "AI-powered mutual fund research and intelligence.",
};

// Map fallback data to FundCardProps
const mappedFunds = INDIAN_MUTUAL_FUND_TEST_DATA.slice(0, 8).map((f) => ({
  fundCode: f.isin,
  name: f.name,
  amc: f.name.split(" ")[0] + " Mutual Fund", // Mock AMC
  category: f.category,
  nav: f.nav,
  returns1Y: (Math.random() * 40) - 10, // Mock 1Y Return (-10% to 30%)
  returns3Y: (Math.random() * 30) + 10, // Mock 3Y Return (10% to 40%)
  expenseRatio: f.expenseRatio,
  riskLevel: f.risk,
  rating: f.rating,
  minSip: 500,
  aum: f.aumCrore,
}));

export default function MutualFundsIndexPage() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-7xl space-y-12 pb-12"
    >
      <MutualFundsHero />

      <section className="px-2 space-y-12 mt-8">
        <FundGrid 
          title="Trending Mutual Funds" 
          description="Most searched and viewed funds by TradeX investors today."
          funds={mappedFunds.slice(0, 4)} 
        />
        
        <FundGrid 
          title="Top Performing Equity Funds" 
          description="Consistent high-growth funds with proven track records."
          funds={mappedFunds.slice(4, 8)} 
        />
      </section>
    </MotionDiv>
  );
}
